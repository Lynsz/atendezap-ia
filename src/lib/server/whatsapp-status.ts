import "server-only";

import { trackServerAppEvent } from "@/lib/analytics/server";
import type { ParsedWhatsAppStatus } from "@/lib/server/parse-whatsapp-webhook";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const statusRank: Record<ParsedWhatsAppStatus["status"], number> = { sent: 1, delivered: 2, read: 3, failed: 4 };

export async function persistWhatsAppStatus(event: ParsedWhatsAppStatus) {
  const supabase = getSupabaseAdmin();
  const { data: message, error } = await supabase
    .from("whatsapp_messages")
    .select("id,user_id,conversation_id,status")
    .eq("whatsapp_message_id", event.messageId)
    .eq("direction", "outbound")
    .maybeSingle();
  if (error) throw error;
  if (!message) return { persisted: false, reason: "message_not_found" } as const;

  const currentRank = statusRank[message.status as ParsedWhatsAppStatus["status"]] || 0;
  const nextRank = statusRank[event.status];
  if (event.status !== "failed" && currentRank >= nextRank) return { persisted: false, reason: "stale_status" } as const;

  const errorType = event.status === "failed" ? "provider_delivery_failed" : null;
  const { error: updateError } = await supabase
    .from("whatsapp_messages")
    .update({ status: event.status, provider_status_updated_at: event.statusAt, provider_error_type: errorType })
    .eq("id", message.id);
  if (updateError) throw updateError;

  await Promise.all([
    writeWhatsAppAudit({
      userId: message.user_id,
      action: "message_status_updated",
      status: event.status,
      errorType,
      conversationId: message.conversation_id,
      messageId: message.id
    }),
    event.status === "failed"
      ? trackServerAppEvent({
          user_id: message.user_id,
          event_name: "whatsapp_message_status_failed",
          page: "/api/whatsapp/webhook",
          source: "whatsapp_cloud_api",
          metadata: { status: "failed", error_type: errorType }
        })
      : Promise.resolve()
  ]);
  return { persisted: true } as const;
}
