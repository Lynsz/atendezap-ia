import { z } from "zod";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { requireUser } from "@/lib/auth/server";
import { AppError, errorResponse } from "@/lib/errors";
import { assertRequestSize } from "@/lib/rate-limit";
import { sendWhatsAppDocumentMessage, sendWhatsAppImageMessage } from "@/lib/server/whatsapp";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import { WhatsAppProviderError, WhatsAppSendError } from "@/lib/server/whatsapp-errors";
import {
  isWhatsAppMediaUploadEnabled,
  readStoredWhatsAppMediaFile,
  uploadMediaToWhatsApp,
  validateWhatsAppMediaBytes,
  validateWhatsAppMediaSize,
  validateWhatsAppMediaType
} from "@/lib/server/whatsapp-media";
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
  mediaType: z.enum(["image", "document"]),
  storageMediaId: z.string().uuid().optional(),
  uploadId: z.string().uuid().optional(),
  caption: z.string().trim().max(1024).optional().default(""),
  confirmSend: z.literal(true),
  clientRequestId: z.string().uuid()
}).refine((input) => Boolean(input.storageMediaId || input.uploadId), { message: "Identificador da mídia ausente." });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  let pendingId: string | null = null;
  let attemptId: string | null = null;
  let userId: string | undefined;
  let conversationId: string | undefined;
  let mediaRecordId: string | undefined;
  try {
    if (!isWhatsAppMediaUploadEnabled()) throw new AppError("O envio de mídias está desativado neste ambiente.", 503);
    assertRequestSize(request, 16_384);
    const user = await requireUser(request);
    userId = user.id;
    const { id } = await context.params;
    conversationId = z.string().uuid().parse(id);
    const input = schema.parse(await request.json());
    mediaRecordId = input.storageMediaId || input.uploadId!;
    await enforceWhatsAppSendLimits({ request, userId: user.id, conversationId: id, messageType: "media" });
    const supabase = getSupabaseAdmin();
    const { data: conversation, error: conversationError } = await supabase
      .from("whatsapp_conversations")
      .select("id,contact_id,connection_id,customer_service_window_until")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (conversationError) throw conversationError;
    if (!conversation) throw new AppError("Conversa não encontrada.", 404);
    const [{ data: contact, error: contactError }, { data: connection, error: connectionError }, { data: media, error: mediaError }] = await Promise.all([
      supabase.from("whatsapp_contacts").select("id,phone_number,opt_in_status").eq("id", conversation.contact_id).eq("user_id", user.id).single(),
      supabase.from("whatsapp_connections").select("id,status,connection_status").eq("id", conversation.connection_id).eq("user_id", user.id).single(),
      supabase.from("whatsapp_media").select("id,direction,media_type,mime_type,file_size,original_filename,storage_bucket,storage_path,download_status,scanned_status").eq("id", mediaRecordId).eq("conversation_id", id).eq("user_id", user.id).maybeSingle()
    ]);
    if (contactError || connectionError || mediaError) throw contactError || connectionError || mediaError;
    if (!media) throw new WhatsAppSendError("Mídia não encontrada.", 404, "media_not_found");
    if (media.direction !== "outbound" || media.media_type !== input.mediaType) throw new WhatsAppSendError("A mídia selecionada não pode ser enviada.", 409, "media_owner_or_type_mismatch");
    if (media.download_status !== "downloaded" || !media.storage_bucket || !media.storage_path || !media.mime_type) throw new WhatsAppSendError("O arquivo ainda não está pronto para envio.", 409, "media_not_ready");
    if (["suspicious", "blocked"].includes(media.scanned_status)) throw new WhatsAppSendError("Este arquivo foi bloqueado por segurança.", 403, "media_blocked");
    if (connection.connection_status !== "connected" && connection.status !== "active") throw new WhatsAppSendError("Sua integração WhatsApp precisa ser conectada ou reautorizada antes de enviar mensagens.", 409, "connection_inactive");
    if (contact.opt_in_status === "opted_out") throw new WhatsAppSendError("Este contato não autorizou novas mensagens.", 403, "contact_opted_out");
    const windowOpen = Boolean(conversation.customer_service_window_until && new Date(conversation.customer_service_window_until).getTime() > Date.now());
    if (!windowOpen) throw new WhatsAppSendError("A janela de atendimento de 24 horas terminou. Mídia livre não pode ser enviada.", 403, "service_window_closed");
    validateWhatsAppMediaType({ mediaType: media.media_type, mimeType: media.mime_type, filename: media.original_filename });
    validateWhatsAppMediaSize(Number(media.file_size));

    const attempt = await createWhatsAppSendAttempt({
      userId: user.id,
      conversationId: id,
      connectionId: connection.id,
      requestKey: input.clientRequestId,
      fingerprint: createWhatsAppContentFingerprint(`${media.id}:${input.caption}`),
      messageType: "media",
      mediaId: media.id
    });
    if (!attempt.acquired) return Response.json({ attempt: attempt.attempt, duplicate: true });
    attemptId = attempt.attempt.id;
    await writeWhatsAppAudit({ userId: user.id, action: "media_send_attempted", status: "attempted", conversationId: id, mediaId: media.id });
    await trackServerAppEvent({ user_id: user.id, event_name: "whatsapp_media_send_attempted", page: "/dashboard/whatsapp", source: "dashboard", metadata: { media_type: media.media_type, mime_group: media.mime_type.split("/")[0], status: "attempted", window_open: true } });

    const { data: pending, error: pendingError } = await supabase.from("whatsapp_messages").insert({
      user_id: user.id,
      connection_id: connection.id,
      conversation_id: id,
      contact_id: contact.id,
      whatsapp_message_id: `client:${input.clientRequestId}`,
      idempotency_key: input.clientRequestId,
      direction: "outbound",
      message_type: media.media_type,
      text: input.caption || null,
      status: "pending",
      sent_by: user.id
    }).select("id").single();
    if (pendingError || !pending) throw pendingError || new Error("pending_media_message_not_saved");
    pendingId = pending.id;
    const buffer = await readStoredWhatsAppMediaFile({ bucket: media.storage_bucket, path: media.storage_path });
    validateWhatsAppMediaBytes(buffer, media.mime_type);
    const uploaded = await uploadMediaToWhatsApp({ connectionId: connection.id, fileBuffer: buffer, mimeType: media.mime_type, filename: media.original_filename || (media.media_type === "image" ? "imagem" : "documento") });
    const sentResult = await sendWithControlledRetry(() =>
      media.media_type === "image"
        ? sendWhatsAppImageMessage({ connectionId: connection.id, to: contact.phone_number, mediaId: uploaded.mediaId, caption: input.caption })
        : sendWhatsAppDocumentMessage({ connectionId: connection.id, to: contact.phone_number, mediaId: uploaded.mediaId, caption: input.caption, filename: media.original_filename })
    );
    const now = new Date().toISOString();
    const { data: message, error: updateError } = await supabase.from("whatsapp_messages").update({ whatsapp_message_id: sentResult.value.messageId, status: "sent", provider_created_at: now, provider_status_updated_at: now }).eq("id", pending.id).eq("user_id", user.id).select("id,direction,message_type,text,status,provider_created_at,created_at").single();
    if (updateError || !message) throw updateError || new Error("sent_media_message_not_saved");
    await Promise.all([
      updateWhatsAppSendAttempt({ attemptId: attemptId!, status: "sent", whatsappMessageId: sentResult.value.messageId, attempts: sentResult.attempts }),
      supabase.from("whatsapp_media").update({ message_id: message.id, whatsapp_media_id: uploaded.mediaId, updated_at: now }).eq("id", media.id).eq("user_id", user.id),
      supabase.from("whatsapp_conversations").update({ status: "open", last_outbound_at: now, updated_at: now }).eq("id", id).eq("user_id", user.id),
      writeWhatsAppAudit({ userId: user.id, connectionId: connection.id, action: "media_sent", status: "sent", conversationId: id, messageId: message.id, mediaId: media.id }),
      trackServerAppEvent({ user_id: user.id, event_name: "whatsapp_media_sent", page: "/dashboard/whatsapp", source: "dashboard", metadata: { media_type: media.media_type, mime_group: media.mime_type.split("/")[0], status: "sent", window_open: true, attempts: sentResult.attempts } })
    ]);
    return Response.json({ message }, { status: 201 });
  } catch (error) {
    const known = error instanceof WhatsAppProviderError || error instanceof WhatsAppSendError ? error : null;
    const attempts = typeof (error as { attempts?: unknown })?.attempts === "number" ? (error as { attempts: number }).attempts : 1;
    if (pendingId) await getSupabaseAdmin().from("whatsapp_messages").update({ status: "failed", provider_error_type: known?.errorType || "media_send_failed" }).eq("id", pendingId);
    if (attemptId) await updateWhatsAppSendAttempt({ attemptId, status: "failed", errorType: known?.errorType || "media_send_failed", retryable: known?.retryable || false, attempts });
    await Promise.all([
      writeWhatsAppAudit({ userId, action: "media_send_failed", status: "failed", errorType: known?.errorType || "media_send_failed", conversationId, mediaId: mediaRecordId }),
      userId ? trackServerAppEvent({ user_id: userId, event_name: "whatsapp_media_send_failed", page: "/dashboard/whatsapp", source: "dashboard", metadata: { status: "failed", error_type: known?.errorType || "media_send_failed" } }) : Promise.resolve()
    ]);
    return errorResponse(error);
  }
}
