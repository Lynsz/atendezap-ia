import "server-only";

import { sanitizeAppEvent, type SafeAppEventInput } from "@/lib/analytics/track-event";
import { serverLog } from "@/lib/logger";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function trackServerAppEvent(input: SafeAppEventInput & { user_id?: string | null }) {
  const event = sanitizeAppEvent(input);
  if (!event) return;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("app_events").insert({
      user_id: input.user_id || null,
      event_name: event.event_name,
      page: event.page,
      source: event.source,
      plan: event.plan,
      business_type: event.business_type,
      metadata: event.metadata
    });

    if (error) {
      serverLog({ level: "warn", event: "server_app_event_insert_failed", route: "src/lib/analytics/server", error, metadata: { event_name: event.event_name } });
    }
  } catch (error) {
    serverLog({ level: "warn", event: "server_app_event_failed", route: "src/lib/analytics/server", error, metadata: { event_name: input.event_name } });
  }
}
