import { sanitizeLogMetadata, serverLog } from "@/lib/logger";

export async function logEvent(eventName: string, metadata?: Record<string, unknown>) {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase/server");
    const supabase = getSupabaseAdmin();
    await supabase.from("events").insert({
      event_name: eventName,
      metadata: sanitizeLogMetadata(metadata) || {}
    });
  } catch (error) {
    serverLog({
      level: "warn",
      event: "internal_event_log_failed",
      route: "src/lib/events",
      error,
      metadata: { event_name: eventName }
    });
  }
}
