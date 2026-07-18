import { z } from "zod";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { requireUser } from "@/lib/auth/server";
import { AppError, errorResponse } from "@/lib/errors";
import { assertRequestSize } from "@/lib/rate-limit";
import { sendWhatsAppTemplateMessage } from "@/lib/server/whatsapp";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import { WhatsAppProviderError, WhatsAppSendError } from "@/lib/server/whatsapp-errors";
import {
  createWhatsAppContentFingerprint,
  createWhatsAppSendAttempt,
  enforceWhatsAppSendLimits,
  sendWithControlledRetry,
  updateWhatsAppSendAttempt
} from "@/lib/server/whatsapp-send-safety";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const schema = z.object({
  templateId: z.string().uuid(),
  variables: z.array(z.string().trim().min(1).max(200)).max(20).default([]),
  confirmSend: z.literal(true),
  clientRequestId: z.string().uuid()
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  let attemptId: string | null = null;
  let pendingId: string | null = null;
  let userId: string | undefined;
  let conversationId: string | undefined;
  try {
    assertRequestSize(request, 16_384);
    const user = await requireUser(request);
    userId = user.id;
    const { id } = await context.params;
    conversationId = z.string().uuid().parse(id);
    const input = schema.parse(await request.json());
    await enforceWhatsAppSendLimits({ request, userId: user.id, conversationId: id, messageType: "template" });
    const supabase = getSupabaseAdmin();

    const { data: conversation, error: conversationError } = await supabase
      .from("whatsapp_conversations")
      .select("id,contact_id,connection_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (conversationError) throw conversationError;
    if (!conversation) throw new AppError("Conversa não encontrada.", 404);

    const [{ data: contact, error: contactError }, { data: connection, error: connectionError }, { data: template, error: templateError }] = await Promise.all([
      supabase.from("whatsapp_contacts").select("id,phone_number,opt_in_status").eq("id", conversation.contact_id).eq("user_id", user.id).single(),
      supabase.from("whatsapp_connections").select("id,status").eq("id", conversation.connection_id).eq("user_id", user.id).single(),
      supabase.from("whatsapp_templates").select("id,connection_id,name,language,status,variables_count").eq("id", input.templateId).eq("user_id", user.id).maybeSingle()
    ]);
    if (contactError || connectionError || templateError) throw contactError || connectionError || templateError;
    if (!template) throw new WhatsAppSendError("Template não encontrado.", 404, "template_not_found");
    if (template.connection_id !== connection.id) throw new WhatsAppSendError("O template pertence a outra conexão.", 409, "template_connection_mismatch");
    if (connection.status !== "active") throw new WhatsAppSendError("A conexão com WhatsApp não está ativa.", 409, "connection_inactive");
    if (contact.opt_in_status !== "opted_in") throw new WhatsAppSendError("Este contato ainda não possui opt-in para mensagens iniciadas pela empresa.", 403, "contact_opt_in_required");
    if (template.status !== "approved") {
      await trackServerAppEvent({
        user_id: user.id,
        event_name: "whatsapp_template_not_approved",
        page: "/dashboard/whatsapp",
        source: "dashboard",
        metadata: { status: "blocked", template_status: template.status }
      });
      throw new WhatsAppSendError("Somente templates aprovados pela Meta podem ser enviados.", 409, "template_not_approved");
    }
    if (input.variables.length !== template.variables_count) {
      throw new WhatsAppSendError("Preencha exatamente as variáveis exigidas pelo template.", 400, "template_variables_invalid");
    }

    const attempt = await createWhatsAppSendAttempt({
      userId: user.id,
      conversationId: id,
      requestKey: input.clientRequestId,
      fingerprint: createWhatsAppContentFingerprint(`${template.id}:${JSON.stringify(input.variables)}`),
      messageType: "template",
      templateId: template.id
    });
    if (!attempt.acquired) return Response.json({ attempt: attempt.attempt, duplicate: true }, { status: 200 });
    attemptId = attempt.attempt.id;

    const { data: pending, error: pendingError } = await supabase
      .from("whatsapp_messages")
      .insert({
        user_id: user.id,
        conversation_id: id,
        contact_id: contact.id,
        whatsapp_message_id: `client:${input.clientRequestId}`,
        idempotency_key: input.clientRequestId,
        direction: "outbound",
        message_type: "template",
        text: null,
        status: "pending",
        sent_by: user.id
      })
      .select("id")
      .single();
    if (pendingError || !pending) throw pendingError || new Error("pending_template_not_saved");
    pendingId = pending.id;

    const sentResult = await sendWithControlledRetry(() =>
      sendWhatsAppTemplateMessage({ to: contact.phone_number, name: template.name, language: template.language, variables: input.variables })
    );
    const now = new Date().toISOString();
    const { data: message, error: updateError } = await supabase
      .from("whatsapp_messages")
      .update({ whatsapp_message_id: sentResult.value.messageId, status: "sent", provider_created_at: now, provider_status_updated_at: now })
      .eq("id", pending.id)
      .eq("user_id", user.id)
      .select("id,direction,message_type,status,provider_created_at,created_at")
      .single();
    if (updateError || !message) throw updateError || new Error("sent_template_not_saved");
    await updateWhatsAppSendAttempt({ attemptId: attemptId!, status: "sent", whatsappMessageId: sentResult.value.messageId, attempts: sentResult.attempts });
    await supabase.from("whatsapp_conversations").update({ status: "open", last_outbound_at: now, updated_at: now }).eq("id", id).eq("user_id", user.id);
    await Promise.all([
      writeWhatsAppAudit({ userId: user.id, action: "template_sent", status: "sent", conversationId: id, messageId: message.id, templateId: template.id }),
      trackServerAppEvent({
        user_id: user.id,
        event_name: "whatsapp_template_sent",
        page: "/dashboard/whatsapp",
        source: "dashboard",
        metadata: { status: "sent", message_type: "template", template_status: "approved", attempts: sentResult.attempts }
      }),
      sentResult.attempts > 1
        ? trackServerAppEvent({
            user_id: user.id,
            event_name: "whatsapp_retry_scheduled",
            page: "/dashboard/whatsapp",
            source: "dashboard",
            metadata: { status: "recovered", retryable: true, attempts: sentResult.attempts }
          })
        : Promise.resolve()
    ]);
    return Response.json({ message }, { status: 201 });
  } catch (error) {
    const known = error instanceof WhatsAppProviderError || error instanceof WhatsAppSendError ? error : null;
    const attempts = typeof (error as { attempts?: unknown })?.attempts === "number" ? (error as { attempts: number }).attempts : 1;
    if (pendingId) await getSupabaseAdmin().from("whatsapp_messages").update({ status: "failed", provider_error_type: known?.errorType || "template_send_failed" }).eq("id", pendingId);
    if (attemptId) await updateWhatsAppSendAttempt({ attemptId, status: "failed", errorType: known?.errorType || "template_send_failed", retryable: known?.retryable || false, attempts });
    await writeWhatsAppAudit({ userId, action: "template_send_failed", status: "failed", errorType: known?.errorType || "template_send_failed", conversationId });
    if (known) {
      await trackServerAppEvent({
        user_id: userId,
        event_name:
          known instanceof WhatsAppSendError && known.errorType === "rate_limit"
            ? "whatsapp_rate_limit_blocked"
            : known instanceof WhatsAppSendError && known.errorType === "recent_duplicate"
              ? "whatsapp_send_duplicate_blocked"
              : known instanceof WhatsAppProviderError && known.retryable
                ? "whatsapp_retry_exhausted"
                : "whatsapp_send_failed_permanent",
        page: "/dashboard/whatsapp",
        source: "dashboard",
        metadata: { error_type: known.errorType, retryable: known.retryable, attempts }
      });
    }
    return errorResponse(error);
  }
}
