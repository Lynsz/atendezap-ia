import "server-only";

import { serverLog } from "@/lib/logger";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type WhatsAppConnectionEventType =
  | "signup_started"
  | "signup_completed"
  | "token_exchanged"
  | "phone_number_linked"
  | "connection_verified"
  | "connection_failed"
  | "connection_disconnected"
  | "connection_reauth_required"
  | "healthcheck_failed"
  | "healthcheck_ok"
  | "connection_used_for_send";

export async function writeWhatsAppConnectionEvent(input: {
  userId: string;
  connectionId?: string | null;
  eventType: WhatsAppConnectionEventType;
  status: string;
  errorType?: string | null;
}) {
  const { error } = await getSupabaseAdmin().from("whatsapp_connection_events").insert({
    user_id: input.userId,
    connection_id: input.connectionId || null,
    event_type: input.eventType,
    status: input.status.slice(0, 40),
    error_type: input.errorType?.slice(0, 80) || null
  });
  if (error) {
    serverLog({
      level: "warn",
      event: "whatsapp_connection_event_write_failed",
      route: "src/lib/server/whatsapp-connection-events",
      metadata: { event_type: input.eventType, error_type: "connection_event_insert_failed" }
    });
  }
}
