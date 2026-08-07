import { z } from "zod";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { requireUser } from "@/lib/auth/server";
import { AppError, errorResponse } from "@/lib/errors";
import { assertRequestSize } from "@/lib/rate-limit";
import { sendWhatsAppTemplateMessage } from "@/lib/server/whatsapp";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import { WhatsAppProviderError, WhatsAppSendError } from "@/lib/server/whatsapp-errors";
import { isWhatsAppTemplateSyncEnabled } from "@/lib/server/whatsapp-templates-meta";
import {
  createWhatsAppContentFingerprint,
  createWhatsAppSendAttempt,
  enforceWhatsAppSendLimits,
  sendWithControlledRetry,
  updateWhatsAppSendAttempt
} from "@/lib/server/whatsapp-send-safety";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { parseStoredVariablesSchema, validateTemplateVariableValues, type WhatsAppTemplateVariable } from "@/lib/whatsapp/template-validation";

export const runtime = "nodejs";

const schema = z.object({
  templateId: z.string().uuid(),
  variables: z.array(z.unknown()).max(20).default([]),
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
      supabase.from("whatsapp_connections").select("id,status,connection_status").eq("id", conversation.connection_id).eq("user_id", user.id).single(),
      supabase.from("whatsapp_templates").select("id,connection_id,provider_template_id,meta_template_id,meta_template_name,name,language,category,status,remote_status,local_status,variables_schema,variables_count").eq("id", input.templateId).eq("user_id", user.id).maybeSingle()
    ]);
    if (contactError || connectionError || templateError) throw contactError || connectionError || templateError;
    if (!template) throw new WhatsAppSendError("Template não encontrado.", 404, "template_not_found");
    if (template.connection_id !== connection.id) throw new WhatsAppSendError("O template pertence a outra conexão.", 409, "template_connection_mismatch");
    if (connection.connection_status !== "connected" && connection.status !== "active") throw new WhatsAppSendError("Sua integração WhatsApp precisa ser conectada ou reautorizada antes de enviar mensagens.", 409, "connection_inactive");
    if (contact.opt_in_status !== "opted_in") throw new WhatsAppSendError("Este contato ainda não possui opt-in para mensagens iniciadas pela empresa.", 403, "contact_opt_in_required");
    const syncEnabled = isWhatsAppTemplateSyncEnabled();
    const hasRemoteIdentity = Boolean(template.meta_template_id || template.provider_template_id);
    const remoteApproved = template.remote_status === "approved" || (!syncEnabled && !template.remote_status && template.status === "approved");
    const localAllowed = !["draft", "hidden", "unsupported", "disabled"].includes(template.local_status || "active");
    if (!remoteApproved || !localAllowed || (syncEnabled && !hasRemoteIdentity)) {
      const blockedStatus = template.remote_status || template.local_status || template.status || "unknown";
      await Promise.all([
        writeWhatsAppAudit({ userId: user.id, action: "template_send_blocked_status", status: "blocked", errorType: "template_status_blocked", conversationId: id, templateId: template.id }),
        trackServerAppEvent({
          user_id: user.id,
          event_name: "whatsapp_template_send_blocked_status",
          page: "/dashboard/whatsapp",
          source: "dashboard",
          metadata: { template_status: blockedStatus, template_category: template.category || "unknown", language: template.language, source: "send" }
        })
      ]);
      throw new WhatsAppSendError("Templates pendentes, rejeitados, desativados ou sem sincronização válida não podem ser enviados.", 409, "template_status_blocked");
    }
    let variablesSchema = parseStoredVariablesSchema(template.variables_schema);
    if (!syncEnabled && variablesSchema.length === 0 && template.variables_count > 0) {
      variablesSchema = Array.from({ length: template.variables_count }, (_, index): WhatsAppTemplateVariable => ({
        key: `body.${index + 1}`,
        component: "body",
        position: index + 1,
        name: `variavel_${index + 1}`,
        type: "text"
      }));
    }
    if (variablesSchema.length !== template.variables_count) {
      throw new WhatsAppSendError("Sincronize novamente este template antes do envio.", 409, "template_variables_schema_invalid");
    }
    let variables: string[];
    try {
      variables = validateTemplateVariableValues(variablesSchema, input.variables);
    } catch {
      throw new WhatsAppSendError("Revise as variáveis obrigatórias do template. HTML, scripts e valores muito longos são bloqueados.", 400, "template_variables_invalid");
    }

    const attempt = await createWhatsAppSendAttempt({
      userId: user.id,
      conversationId: id,
      connectionId: connection.id,
      requestKey: input.clientRequestId,
      fingerprint: createWhatsAppContentFingerprint(`${template.id}:${JSON.stringify(variables)}`),
      messageType: "template",
      templateId: template.id
    });
    if (!attempt.acquired) return Response.json({ attempt: attempt.attempt, duplicate: true }, { status: 200 });
    attemptId = attempt.attempt.id;

    const { data: pending, error: pendingError } = await supabase
      .from("whatsapp_messages")
      .insert({
        user_id: user.id,
        connection_id: connection.id,
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
      sendWhatsAppTemplateMessage({ connectionId: connection.id, to: contact.phone_number, name: template.meta_template_name || template.name, language: template.language, variables, variablesSchema })
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
      writeWhatsAppAudit({ userId: user.id, connectionId: connection.id, action: "template_sent", status: "sent", conversationId: id, messageId: message.id, templateId: template.id }),
      trackServerAppEvent({
        user_id: user.id,
        event_name: "whatsapp_template_sent",
        page: "/dashboard/whatsapp",
        source: "dashboard",
        metadata: { status: "sent", message_type: "template", template_status: "approved", template_category: template.category || "unknown", language: template.language, variable_count: variables.length, attempts: sentResult.attempts }
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
    const statusAlreadyAudited = known instanceof WhatsAppSendError && known.errorType === "template_status_blocked";
    if (!statusAlreadyAudited) {
      await writeWhatsAppAudit({ userId, action: "template_send_failed", status: "failed", errorType: known?.errorType || "template_send_failed", conversationId });
    }
    if (known && !statusAlreadyAudited) {
      await trackServerAppEvent({
        user_id: userId,
        event_name:
          known instanceof WhatsAppSendError && known.errorType === "rate_limit"
            ? "whatsapp_rate_limit_blocked"
            : known instanceof WhatsAppSendError && known.errorType === "recent_duplicate"
              ? "whatsapp_send_duplicate_blocked"
              : known instanceof WhatsAppSendError && known.errorType.startsWith("template_variables")
                ? "whatsapp_template_variable_validation_failed"
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
