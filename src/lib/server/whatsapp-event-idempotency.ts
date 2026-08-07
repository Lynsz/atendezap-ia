import "server-only";

import type { ParsedWhatsAppEvent } from "@/lib/server/parse-whatsapp-webhook";
import { getSupabaseAdmin } from "@/lib/supabase/server";

function eventKey(event: ParsedWhatsAppEvent) {
  return event.kind === "inbound_message"
    ? `inbound:${event.phoneNumberId}:${event.messageId}`
    : `status:${event.phoneNumberId}:${event.statusId}`;
}

export async function hasProcessedWhatsAppEvent(event: ParsedWhatsAppEvent) {
  const { data, error } = await getSupabaseAdmin()
    .from("whatsapp_webhook_events")
    .select("processing_status")
    .eq("event_key", eventKey(event))
    .maybeSingle();
  if (error) throw error;
  return data?.processing_status === "processed" || data?.processing_status === "ignored_duplicate";
}

export async function markWhatsAppEventReceived(event: ParsedWhatsAppEvent) {
  const supabase = getSupabaseAdmin();
  const key = eventKey(event);
  const now = new Date().toISOString();
  const { data: existing, error: lookupError } = await supabase
    .from("whatsapp_webhook_events")
    .select("id,processing_status,attempts,duplicate_count")
    .eq("event_key", key)
    .maybeSingle();
  if (lookupError) throw lookupError;

  if (existing) {
    if (existing.processing_status === "failed" && existing.attempts < 3) {
      const { data: reacquired, error } = await supabase
        .from("whatsapp_webhook_events")
        .update({ processing_status: "received", error_type: null, attempts: existing.attempts + 1, updated_at: now })
        .eq("id", existing.id)
        .eq("processing_status", "failed")
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (reacquired) return { acquired: true, eventId: existing.id, retry: true };
    }
    await supabase
      .from("whatsapp_webhook_events")
      .update({
        processing_status: existing.processing_status === "failed" ? "failed" : "ignored_duplicate",
        duplicate_count: existing.duplicate_count ? existing.duplicate_count + 1 : 1,
        last_duplicate_at: now,
        updated_at: now
      })
      .eq("id", existing.id);
    return { acquired: false, eventId: existing.id, retry: false };
  }

  const { data: connection } = await supabase.from("whatsapp_connections").select("id,user_id").eq("phone_number_id", event.phoneNumberId).maybeSingle();
  const row = {
    event_key: key,
    event_type: event.kind,
    phone_number_id: event.phoneNumberId,
    message_id: event.messageId,
    status_id: event.kind === "message_status" ? event.statusId : null,
    connection_id: connection?.id || null,
    user_id: connection?.user_id || null,
    processing_status: "received"
  };
  const { data, error } = await supabase.from("whatsapp_webhook_events").insert(row).select("id").single();
  if (!error && data) return { acquired: true, eventId: data.id, retry: false };
  if ((error as { code?: string } | null)?.code !== "23505") throw error;

  const { data: duplicate, error: duplicateError } = await supabase
    .from("whatsapp_webhook_events")
    .select("id")
    .eq("event_key", key)
    .single();
  if (duplicateError) throw duplicateError;
  await supabase
    .from("whatsapp_webhook_events")
    .update({ processing_status: "ignored_duplicate", last_duplicate_at: now, updated_at: now })
    .eq("id", duplicate.id);
  return { acquired: false, eventId: duplicate.id, retry: false };
}

export async function markWhatsAppEventProcessed(eventId: string) {
  const now = new Date().toISOString();
  const { error } = await getSupabaseAdmin()
    .from("whatsapp_webhook_events")
    .update({ processing_status: "processed", processed_at: now, error_type: null, updated_at: now })
    .eq("id", eventId);
  if (error) throw error;
}

export async function markWhatsAppEventFailed(eventId: string, errorType: string) {
  const { error } = await getSupabaseAdmin()
    .from("whatsapp_webhook_events")
    .update({ processing_status: "failed", error_type: errorType.slice(0, 80), updated_at: new Date().toISOString() })
    .eq("id", eventId);
  if (error) throw error;
}
