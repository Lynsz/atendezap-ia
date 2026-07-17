import { z } from "zod";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { requireUser } from "@/lib/auth/server";
import { AppError, errorResponse } from "@/lib/errors";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { sendWhatsAppTextMessage } from "@/lib/server/whatsapp";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const sendSchema = z.object({
  text: z.string().trim().min(1).max(4096),
  confirmSend: z.literal(true),
  idempotencyKey: z.string().uuid(),
  suggestedReplyId: z.string().uuid().optional()
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  let pendingId: string | null = null;
  try {
    assertRequestSize(request, 16_384);
    const user = await requireUser(request);
    const { id } = await context.params;
    z.string().uuid().parse(id);
    const input = sendSchema.parse(await request.json());
    await enforceRateLimit({ request, route: "api:whatsapp-send:user", identifier: user.id, limit: 20, windowMs: 60_000 });

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
      supabase.from("whatsapp_connections").select("id,status").eq("id", conversation.connection_id).eq("user_id", user.id).single()
    ]);
    if (contactError || connectionError) throw contactError || connectionError;
    if (connection.status !== "active") throw new AppError("A conexão com WhatsApp não está ativa.", 409);
    if (contact.opt_in_status === "opted_out") throw new AppError("Este contato não autorizou novas mensagens.", 403);

    const windowOpen = Boolean(conversation.customer_service_window_until && new Date(conversation.customer_service_window_until).getTime() > Date.now());
    if (!windowOpen) {
      await trackServerAppEvent({
        user_id: user.id,
        event_name: "whatsapp_reply_blocked_window_closed",
        page: "/dashboard/whatsapp",
        source: "dashboard",
        metadata: { status: "blocked", window_open: false }
      });
      throw new AppError("A janela de atendimento de 24 horas terminou. Para enviar nova mensagem, será necessário usar um template aprovado do WhatsApp.", 403);
    }

    const { data: existing } = await supabase
      .from("whatsapp_messages")
      .select("id,status")
      .eq("idempotency_key", input.idempotencyKey)
      .eq("user_id", user.id)
      .maybeSingle();
    if (existing) return Response.json({ message: existing, duplicate: true }, { status: 200 });

    const { data: pending, error: pendingError } = await supabase
      .from("whatsapp_messages")
      .insert({
        user_id: user.id,
        conversation_id: id,
        contact_id: contact.id,
        whatsapp_message_id: `client:${input.idempotencyKey}`,
        idempotency_key: input.idempotencyKey,
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

    const sent = await sendWhatsAppTextMessage({ to: contact.phone_number, text: input.text });
    const now = new Date().toISOString();
    const { data: message, error: updateError } = await supabase
      .from("whatsapp_messages")
      .update({ whatsapp_message_id: sent.messageId, status: "sent", provider_created_at: now })
      .eq("id", pending.id)
      .eq("user_id", user.id)
      .select("id,direction,message_type,text,status,provider_created_at,created_at")
      .single();
    if (updateError || !message) throw updateError || new Error("sent_message_not_saved");

    await supabase.from("whatsapp_conversations").update({ status: "open", last_outbound_at: now, updated_at: now }).eq("id", id).eq("user_id", user.id);
    if (input.suggestedReplyId) {
      await supabase
        .from("whatsapp_suggested_replies")
        .update({ suggested_text: input.text, status: "sent", updated_at: now })
        .eq("id", input.suggestedReplyId)
        .eq("conversation_id", id)
        .eq("user_id", user.id);
    }
    await trackServerAppEvent({
      user_id: user.id,
      event_name: "whatsapp_reply_sent",
      page: "/dashboard/whatsapp",
      source: "dashboard",
      metadata: { status: "sent", message_type: "text", window_open: true }
    });
    return Response.json({ message }, { status: 201 });
  } catch (error) {
    if (pendingId) {
      await getSupabaseAdmin().from("whatsapp_messages").update({ status: "failed" }).eq("id", pendingId);
    }
    return errorResponse(error);
  }
}
