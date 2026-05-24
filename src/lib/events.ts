import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function logEvent(eventName: string, metadata?: Record<string, unknown>) {
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from("events").insert({
      event_name: eventName,
      metadata: metadata || {}
    });
  } catch (error) {
    console.error("Falha ao registrar evento:", eventName, error instanceof Error ? error.message : "unknown");
  }
}
