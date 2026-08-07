import { errorResponse } from "@/lib/errors";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { readServerEnv } from "@/lib/server/env";
import { requireInternalJob } from "@/lib/server/internal-job-auth";
import { debugMetaToken } from "@/lib/server/meta-embedded-signup";
import { decryptSecret } from "@/lib/server/secure-token-store";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import { writeWhatsAppConnectionEvent } from "@/lib/server/whatsapp-connection-events";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    requireInternalJob(request);
    if (!/^(1|true)$/i.test(readServerEnv("WHATSAPP_CONNECTION_HEALTHCHECK_ENABLED"))) {
      return Response.json({ error: "O healthcheck de conexões WhatsApp está desativado." }, { status: 503 });
    }
    const requested = Number(new URL(request.url).searchParams.get("limit"));
    const limit = Number.isInteger(requested) && requested > 0 ? Math.min(requested, 20) : 10;
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("whatsapp_connections").select("id,user_id,access_token_encrypted").eq("connection_source", "embedded_signup").eq("connection_status", "connected").order("last_healthcheck_at", { ascending: true, nullsFirst: true }).limit(limit);
    if (error) throw error;
    const results: Array<{ id: string; status: string }> = [];
    for (const connection of data || []) {
      try {
        if (!connection.access_token_encrypted) throw new Error("missing_encrypted_token");
        await debugMetaToken(decryptSecret(connection.access_token_encrypted));
        const now = new Date().toISOString();
        await supabase.from("whatsapp_connections").update({ last_healthcheck_at: now, last_error_type: null, updated_at: now }).eq("id", connection.id);
        await Promise.all([
          writeWhatsAppConnectionEvent({ userId: connection.user_id, connectionId: connection.id, eventType: "healthcheck_ok", status: "connected" }),
          writeWhatsAppAudit({ userId: connection.user_id, connectionId: connection.id, action: "connection_healthcheck_ok", status: "connected" })
        ]);
        results.push({ id: connection.id, status: "connected" });
      } catch {
        const now = new Date().toISOString();
        await supabase.from("whatsapp_connections").update({ connection_status: "needs_reauth", status: "error", last_healthcheck_at: now, last_error_type: "token_invalid_or_expired", updated_at: now }).eq("id", connection.id);
        await Promise.all([
          writeWhatsAppConnectionEvent({ userId: connection.user_id, connectionId: connection.id, eventType: "healthcheck_failed", status: "needs_reauth", errorType: "token_invalid_or_expired" }),
          writeWhatsAppAudit({ userId: connection.user_id, connectionId: connection.id, action: "connection_healthcheck_failed", status: "needs_reauth", errorType: "token_invalid_or_expired" }),
          trackServerAppEvent({ user_id: connection.user_id, event_name: "whatsapp_connection_healthcheck_failed", page: "/api/internal/whatsapp/connection-healthcheck", source: "internal_job", metadata: { status: "needs_reauth", error_type: "token_invalid_or_expired", connection_source: "embedded_signup" } })
        ]);
        results.push({ id: connection.id, status: "needs_reauth" });
      }
    }
    return Response.json({ processed: results.length, results });
  } catch (error) {
    return errorResponse(error);
  }
}
