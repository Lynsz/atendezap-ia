import "server-only";

import { serverLog } from "@/lib/logger";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type AuditInput = {
  userId?: string | null;
  action: string;
  status: string;
  errorType?: string | null;
  conversationId?: string | null;
  messageId?: string | null;
  templateId?: string | null;
};

export async function writeWhatsAppAudit(input: AuditInput) {
  const { error } = await getSupabaseAdmin().from("whatsapp_audit_log").insert({
    user_id: input.userId || null,
    action: input.action.slice(0, 80),
    status: input.status.slice(0, 40),
    error_type: input.errorType?.slice(0, 80) || null,
    conversation_id: input.conversationId || null,
    message_id: input.messageId || null,
    template_id: input.templateId || null
  });
  if (error) {
    serverLog({
      level: "warn",
      event: "whatsapp_audit_write_failed",
      route: "src/lib/server/whatsapp-audit",
      metadata: { error_type: "audit_insert_failed", action: input.action.slice(0, 80) }
    });
  }
}
