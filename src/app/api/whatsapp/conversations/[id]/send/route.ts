import { z } from "zod";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { requireUser } from "@/lib/auth/server";
import { AppError, errorResponse } from "@/lib/errors";
import { assertRequestSize } from "@/lib/rate-limit";
import { sendWhatsAppTextMessage } from "@/lib/server/whatsapp";
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

const sendSchema = z
  .object({
    text: z.string().trim().min(1).max(4096),
    confirmSend: z.literal(true),
    idempotencyKey: z.string().uuid().optional(),
    clientRequestId: z.string().uuid().optional(),
    suggestedReplyId: z.string().uuid().optional()
  })
  .refine((input) => Boolean(input.clientRequestId || input.idempotencyKey), { message: "Identificador do envio ausente." });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  let pendingId: string | null = null;
  let attemptId: string | null = null;
  let auditContext: { userId?: string; conversationId?: string } = {};
  try {
    assertRequestSize(request, 16_384);
    const user = await requireUser(request);
    const { id } = await context.params;
    z.string().uuid().parse(id);
    const input = sendSchema.parse(await request.json());
    const requestKey = input.clientRequestId || input.idempotencyKey!;
    auditContext = { userId: user.id, conversationId: id };
    await enforceWhatsAppSendLimits({ request, userId: user.id, conversationId: id, messageType: "text" });

    const supabase = getSupabaseAdmin();
    const { data: conversation, error: conversationError } = await supabase
      .from("whatsapp_conversations")
      .select("id,contact_id,connection_id,customer_service_window_until")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (conversationError) throw conversationError;
    if (!conversation) throw new AppError("Conversa não encontrada.", 404);

    const [{ data: contact, error: contactError }, { data: connection, error: connectionError }] = await Promise.all([
      supabase.from("whatsapp_contacts").select("id,phone_number,opt_in_status").eq("id", conversation.contact_id).eq("user_id", user.id).single(),
      supabase.from("whatsapp_connections").select("id,status,connection_status").eq("id", conversation.connection_id).eq("user_id", user.id).single()
    ]);
    if (contactError || connectionError) throw contactError || connectionError;
    if (connection.connection_status !== "connected" && connection.status !== "active") throw new WhatsAppSendError("Sua integração WhatsApp precisa ser conectada ou reautorizada antes de enviar mensagens.", 409, "connection_inactive");
    if (contact.opt_in_status === "opted_out") throw new WhatsAppSendError("Este contato não autorizou novas mensagens.", 403, "contact_opted_out");

    const windowOpen = Boolean(conversation.customer_service_window_until && new Date(conversation.customer_service_window_until).getTime() > Date.now());
    if (!windowOpen) {
      await trackServerAppEvent({
        user_id: user.id,
        event_name: "whatsapp_reply_blocked_window_closed",
        page: "/dashboard/whatsapp",
        source: "dashboard",
        metadata: { status: "blocked", window_open: false }
      });
      throw new WhatsAppSendError("A janela de atendimento de 24 horas terminou. Use um template aprovado.", 403, "service_window_closed");
    }

    if (input.suggestedReplyId) {
      const { data: suggestion, error: suggestionError } = await supabase
        .from("whatsapp_suggested_replies")
        .select("id,status")
        .eq("id", input.suggestedReplyId)
        .eq("conversation_id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (suggestionError) throw suggestionError;
      if (!suggestion) throw new WhatsAppSendError("A sugestão selecionada não foi encontrada.", 404, "suggestion_not_found");
      if (suggestion.status === "sent") throw new WhatsAppSendError("Esta sugestão já foi enviada.", 409, "suggestion_already_sent");
    }

    const attempt = await createWhatsAppSendAttempt({
      userId: user.id,
      conversationId: id,
      connectionId: connection.id,
      requestKey,
      fingerprint: createWhatsAppContentFingerprint(input.text),
      messageType: "text",
      suggestedReplyId: input.suggestedReplyId
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
        whatsapp_message_id: `client:${requestKey}`,
        idempotency_key: requestKey,
        direction: "outbound",
        message_type: "text",
        text: input.text,
        status: "pending",
        sent_by: user.id
      })
      .select("id")
      .single();
    if (pendingError || !pending) throw pendingError || new Error("pending_message_not_saved");
    pendingId = pending.id;

    const sentResult = await sendWithControlledRetry(() => sendWhatsAppTextMessage({ connectionId: connection.id, to: contact.phone_number, text: input.text }));
    const now = new Date().toISOString();
    const { data: message, error: updateError } = await supabase
      .from("whatsapp_messages")
      .update({ whatsapp_message_id: sentResult.value.messageId, status: "sent", provider_created_at: now, provider_status_updated_at: now })
      .eq("id", pending.id)
      .eq("user_id", user.id)
      .select("id,direction,message_type,text,status,provider_created_at,created_at")
      .single();
    if (updateError || !message) throw updateError || new Error("sent_message_not_saved");
    await updateWhatsAppSendAttempt({ attemptId: attemptId!, status: "sent", whatsappMessageId: sentResult.value.messageId, attempts: sentResult.attempts });
    await supabase.from("whatsapp_conversations").update({ status: "open", last_outbound_at: now, updated_at: now }).eq("id", id).eq("user_id", user.id);
    if (input.suggestedReplyId) {
      await supabase.from("whatsapp_suggested_replies").update({ suggested_text: input.text, status: "sent", updated_at: now }).eq("id", input.suggestedReplyId).eq("conversation_id", id).eq("user_id", user.id);
    }
    await Promise.all([
      writeWhatsAppAudit({ userId: user.id, connectionId: connection.id, action: "reply_sent", status: "sent", conversationId: id, messageId: message.id }),
      trackServerAppEvent({
        user_id: user.id,
        event_name: "whatsapp_reply_sent",
        page: "/dashboard/whatsapp",
        source: "dashboard",
        metadata: { status: "sent", message_type: "text", window_open: true, attempts: sentResult.attempts }
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
    const providerError = error instanceof WhatsAppProviderError ? error : null;
    const attempts = typeof (error as { attempts?: unknown })?.attempts === "number" ? (error as { attempts: number }).attempts : 1;
    if (pendingId) await getSupabaseAdmin().from("whatsapp_messages").update({ status: "failed", provider_error_type: providerError?.errorType || "send_failed" }).eq("id", pendingId);
    if (attemptId) {
      await updateWhatsAppSendAttempt({
        attemptId,
        status: "failed",
        errorType: providerError?.errorType || (error instanceof WhatsAppSendError ? error.errorType : "send_failed"),
        retryable: providerError?.retryable || false,
        attempts
      });
    }
    await writeWhatsAppAudit({
      userId: auditContext.userId,
      action: "reply_send_failed",
      status: "failed",
      errorType: providerError?.errorType || (error instanceof WhatsAppSendError ? error.errorType : "send_failed"),
      conversationId: auditContext.conversationId
    });
    const sendError = error instanceof WhatsAppSendError ? error : null;
    if (providerError || sendError?.errorType === "rate_limit" || sendError?.errorType === "recent_duplicate") {
      await trackServerAppEvent({
        user_id: auditContext.userId,
        event_name:
          sendError?.errorType === "rate_limit"
            ? "whatsapp_rate_limit_blocked"
            : sendError?.errorType === "recent_duplicate"
              ? "whatsapp_send_duplicate_blocked"
              : providerError?.retryable
                ? "whatsapp_retry_exhausted"
                : "whatsapp_send_failed_permanent",
        page: "/dashboard/whatsapp",
        source: "dashboard",
        metadata: { error_type: providerError?.errorType || sendError?.errorType || "send_failed", retryable: providerError?.retryable || sendError?.retryable || false, attempts }
      });
    }
    return errorResponse(error);
  }
}
