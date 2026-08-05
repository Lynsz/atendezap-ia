import { trackServerAppEvent } from "@/lib/analytics/server";
import { AppError, errorResponse } from "@/lib/errors";
import { requireInternalJob } from "@/lib/server/internal-job-auth";
import { getWhatsAppServerConfig } from "@/lib/server/whatsapp";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import {
  getTemplateSyncCountRange,
  requireWhatsAppTemplateSyncEnabled,
  syncMetaTemplatesForConnection,
  templateSyncHasErrors,
  type TemplateSyncSummary
} from "@/lib/server/whatsapp-templates-meta";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function addSummary(target: TemplateSyncSummary, source: TemplateSyncSummary) {
  target.found += source.found;
  target.created += source.created;
  target.updated += source.updated;
  target.statusChanged += source.statusChanged;
  for (const sourceError of source.errors) {
    const existing = target.errors.find((error) => error.type === sourceError.type);
    if (existing) existing.count += sourceError.count;
    else target.errors.push({ ...sourceError });
  }
}

export async function POST(request: Request) {
  try {
    requireInternalJob(request);
    requireWhatsAppTemplateSyncEnabled();
    const config = getWhatsAppServerConfig();
    const { data: connections, error } = await getSupabaseAdmin()
      .from("whatsapp_connections")
      .select("id,user_id")
      .eq("business_account_id", config.businessAccountId)
      .eq("status", "active")
      .limit(10);
    if (error) throw error;
    if (!connections?.length) throw new AppError("Nenhuma conexão ativa está disponível para sincronização.", 409);
    const total: TemplateSyncSummary = { found: 0, created: 0, updated: 0, statusChanged: 0, errors: [] };
    for (const connection of connections) {
      await Promise.all([
        writeWhatsAppAudit({ userId: connection.user_id, action: "template_sync_started", status: "started" }),
        trackServerAppEvent({ user_id: connection.user_id, event_name: "whatsapp_template_sync_started", page: "/api/internal/whatsapp/sync-templates", source: "internal_job", metadata: { source: "internal_job" } })
      ]);
      try {
        const summary = await syncMetaTemplatesForConnection(connection.user_id, connection.id);
        addSummary(total, summary);
        if (templateSyncHasErrors(summary)) {
          throw new AppError("A sincronização da conexão terminou com falhas.", 503);
        }
        await Promise.all([
          writeWhatsAppAudit({ userId: connection.user_id, action: "template_sync_completed", status: "completed" }),
          trackServerAppEvent({ user_id: connection.user_id, event_name: "whatsapp_template_sync_completed", page: "/api/internal/whatsapp/sync-templates", source: "internal_job", metadata: { sync_count_range: getTemplateSyncCountRange(summary.found), source: "internal_job" } })
        ]);
      } catch {
        total.errors.push({ type: "connection_sync_failed", count: 1 });
        await Promise.all([
          writeWhatsAppAudit({ userId: connection.user_id, action: "template_sync_failed", status: "failed", errorType: "connection_sync_failed" }),
          trackServerAppEvent({ user_id: connection.user_id, event_name: "whatsapp_template_sync_failed", page: "/api/internal/whatsapp/sync-templates", source: "internal_job", metadata: { error_type: "connection_sync_failed", source: "internal_job" } })
        ]);
      }
    }
    return Response.json({ summary: total });
  } catch (error) {
    return errorResponse(error);
  }
}
