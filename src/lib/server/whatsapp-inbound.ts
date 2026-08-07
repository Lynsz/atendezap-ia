import "server-only";

import { trackServerAppEvent } from "@/lib/analytics/server";
import { serverLog } from "@/lib/logger";
import type { ParsedWhatsAppInbound } from "@/lib/server/parse-whatsapp-webhook";
import { getSupabaseAdmin } from "@/lib/supabase/server";

function addHours(date: string, hours: number) {
  return new Date(new Date(date).getTime() + hours * 60 * 60 * 1000).toISOString();
}

export async function persistWhatsAppInbound(message: ParsedWhatsAppInbound) {
  const supabase = getSupabaseAdmin();
  const { data: connection, error: connectionError } = await supabase
    .from("whatsapp_connections")
    .select("id,user_id,status,connection_status,business_account_id,whatsapp_business_account_id")
    .eq("phone_number_id", message.phoneNumberId)
    .maybeSingle();

  if (connectionError) throw connectionError;
  const wabaMatches = connection && (connection.whatsapp_business_account_id || connection.business_account_id) === message.businessAccountId;
  if (!connection || !wabaMatches || (connection.connection_status !== "connected" && connection.status !== "active")) {
    serverLog({
      level: "warn",
      event: "whatsapp_inbound_connection_not_active",
      route: "src/lib/server/whatsapp-inbound",
      metadata: { error_type: connection ? "connection_inactive" : "connection_not_found", message_type: message.messageType }
    });
    return { persisted: false, duplicate: false, userId: null, connectionId: null, messageId: null, conversationId: null, mediaId: null };
  }

  if (message.displayPhoneNumber) {
    await supabase
      .from("whatsapp_connections")
      .update({ display_phone_number: message.displayPhoneNumber, updated_at: new Date().toISOString() })
      .eq("id", connection.id);
  }

  const now = new Date().toISOString();
  const { data: contact, error: contactError } = await supabase
    .from("whatsapp_contacts")
    .upsert(
      {
        user_id: connection.user_id,
        connection_id: connection.id,
        whatsapp_user_id: message.whatsappUserId,
        phone_number: message.whatsappUserId,
        display_name: message.contactName,
        last_message_at: message.receivedAt,
        updated_at: now
      },
      { onConflict: "user_id,whatsapp_user_id" }
    )
    .select("id")
    .single();
  if (contactError) throw contactError;

  const { data: conversation, error: conversationError } = await supabase
    .from("whatsapp_conversations")
    .upsert(
      {
        user_id: connection.user_id,
        connection_id: connection.id,
        contact_id: contact.id,
        status: "pending",
        last_inbound_at: message.receivedAt,
        customer_service_window_until: addHours(message.receivedAt, 24),
        updated_at: now
      },
      { onConflict: "user_id,contact_id" }
    )
    .select("id")
    .single();
  if (conversationError) throw conversationError;

  const { data: inserted, error: messageError } = await supabase
    .from("whatsapp_messages")
    .upsert(
      {
        user_id: connection.user_id,
        connection_id: connection.id,
        conversation_id: conversation.id,
        contact_id: contact.id,
        whatsapp_message_id: message.messageId,
        direction: "inbound",
        message_type: message.messageType,
        text: message.text,
        status: message.messageType === "unsupported" ? "unsupported" : "received",
        provider_created_at: message.receivedAt
      },
      { onConflict: "whatsapp_message_id", ignoreDuplicates: true }
    )
    .select("id")
    .maybeSingle();
  if (messageError) throw messageError;

  let insertedMediaId: string | null = null;
  if (inserted && message.media) {
    const { data: insertedMedia, error: mediaError } = await supabase.from("whatsapp_media").insert({
      user_id: connection.user_id,
      connection_id: connection.id,
      conversation_id: conversation.id,
      message_id: inserted.id,
      contact_id: contact.id,
      direction: "inbound",
      whatsapp_media_id: message.media.whatsappMediaId,
      media_type: message.media.mediaType,
      mime_type: message.media.mimeType,
      sha256: message.media.sha256,
      original_filename: message.media.filename,
      download_status: "pending",
      scanned_status: "not_scanned"
    }).select("id").single();
    if (mediaError && (mediaError as { code?: string }).code !== "23505") throw mediaError;
    insertedMediaId = insertedMedia?.id || null;
  }

  if (inserted) {
    await Promise.all([
      trackServerAppEvent({
        user_id: connection.user_id,
        event_name: "whatsapp_inbound_received",
        page: "/api/whatsapp/webhook",
        source: "whatsapp_cloud_api",
        metadata: { message_type: message.messageType, status: "received" }
      }),
      message.media
        ? trackServerAppEvent({
            user_id: connection.user_id,
            event_name: "whatsapp_media_inbound_received",
            page: "/api/whatsapp/webhook",
            source: "whatsapp_cloud_api",
            metadata: { media_type: message.media.mediaType, mime_group: message.media.mimeType?.split("/")[0] || "unknown", status: "pending" }
          })
        : Promise.resolve()
    ]);
  }

  return {
    persisted: Boolean(inserted),
    duplicate: !inserted,
    userId: connection.user_id,
    connectionId: connection.id,
    messageId: inserted?.id || null,
    conversationId: conversation.id,
    mediaId: insertedMediaId
  };
}
