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
    .select("id,user_id,status")
    .eq("phone_number_id", message.phoneNumberId)
    .eq("business_account_id", message.businessAccountId)
    .maybeSingle();

  if (connectionError) throw connectionError;
  if (!connection || connection.status !== "active") {
    serverLog({
      level: "warn",
      event: "whatsapp_inbound_connection_not_active",
      route: "src/lib/server/whatsapp-inbound",
      metadata: { error_type: connection ? "connection_inactive" : "connection_not_found", message_type: message.messageType }
    });
    return { persisted: false, duplicate: false };
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
        conversation_id: conversation.id,
        contact_id: contact.id,
        whatsapp_message_id: message.messageId,
        direction: "inbound",
        message_type: message.messageType,
        text: message.text,
        status: message.messageType === "text" ? "received" : "unsupported",
        provider_created_at: message.receivedAt
      },
      { onConflict: "whatsapp_message_id", ignoreDuplicates: true }
    )
    .select("id")
    .maybeSingle();
  if (messageError) throw messageError;

  if (inserted) {
    await trackServerAppEvent({
      user_id: connection.user_id,
      event_name: "whatsapp_inbound_received",
      page: "/api/whatsapp/webhook",
      source: "whatsapp_cloud_api",
      metadata: { message_type: message.messageType, status: "received" }
    });
  }

  return { persisted: Boolean(inserted), duplicate: !inserted };
}
