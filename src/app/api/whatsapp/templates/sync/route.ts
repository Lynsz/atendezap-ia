import { trackServerAppEvent } from "@/lib/analytics/server";
import { requireUser } from "@/lib/auth/server";
import { AppError, errorResponse } from "@/lib/errors";
import { enforceRateLimit } from "@/lib/rate-limit";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import {
  getTemplateSyncCountRange,
  requireWhatsAppTemplateSyncEnabled,
  syncMetaTemplatesForConnection,
  templateSyncHasErrors
} from "@/lib/server/whatsapp-templates-meta";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let userId: string | undefined;
  try {
    const user = await requireUser(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:whatsapp-template-sync", identifier: user.id, limit: 3, windowMs: 10 * 60_000 });
    requireWhatsAppTemplateSyncEnabled();
    const { data: connection, error } = await getSupabaseAdmin()
      .from("whatsapp_connections")
      .select("id")
      .eq("user_id", user.id)
      .eq("connection_status", "connected")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!connection) throw new AppError("A conexão do WhatsApp precisa ser revisada antes da sincronização.", 409);
    await Promise.all([
      writeWhatsAppAudit({ userId: user.id, action: "template_sync_started", status: "started" }),
      trackServerAppEvent({ user_id: user.id, event_name: "whatsapp_template_sync_started", page: "/dashboard/whatsapp/templates", source: "dashboard", metadata: { source: "manual" } })
    ]);
    const summary = await syncMetaTemplatesForConnection(user.id, connection.id);
    if (templateSyncHasErrors(summary)) {
      throw new AppError("A sincronização de templates terminou com falhas.", 503);
    }
    await Promise.all([
      writeWhatsAppAudit({ userId: user.id, action: "template_sync_completed", status: "completed" }),
      trackServerAppEvent({ user_id: user.id, event_name: "whatsapp_template_sync_completed", page: "/dashboard/whatsapp/templates", source: "dashboard", metadata: { sync_count_range: getTemplateSyncCountRange(summary.found), source: "manual" } })
    ]);
    return Response.json({ message: "Templates sincronizados com a Meta.", summary });
  } catch (error) {
    if (userId) {
      await Promise.all([
        writeWhatsAppAudit({ userId, action: "template_sync_failed", status: "failed", errorType: "template_sync_failed" }),
        trackServerAppEvent({ user_id: userId, event_name: "whatsapp_template_sync_failed", page: "/dashboard/whatsapp/templates", source: "dashboard", metadata: { error_type: "template_sync_failed", source: "manual" } })
      ]);
    }
    if (error instanceof AppError && [401, 403, 429].includes(error.status)) return errorResponse(error);
    return Response.json({ error: "Não foi possível sincronizar os templates agora. Verifique a configuração do WhatsApp." }, { status: 503 });
  }
}
