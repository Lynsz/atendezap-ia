import { trackServerAppEvent } from "@/lib/analytics/server";
import { requireUser } from "@/lib/auth/server";
import { AppError, errorResponse } from "@/lib/errors";
import { createEmbeddedSignupState, getEmbeddedSignupPublicConfig } from "@/lib/server/meta-embedded-signup";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import { writeWhatsAppConnectionEvent } from "@/lib/server/whatsapp-connection-events";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const publicConfig = getEmbeddedSignupPublicConfig();
    if (!publicConfig.enabled) throw new AppError("A reautorização pela Meta ainda não está configurada.", 503);
    const supabase = getSupabaseAdmin();
    const { data: connection, error } = await supabase.from("whatsapp_connections").select("id").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(1).maybeSingle();
    if (error) throw error;
    if (!connection) throw new AppError("Nenhuma integração WhatsApp foi encontrada.", 404);
    await supabase.from("whatsapp_connections").update({ connection_status: "needs_reauth", status: "error", last_error_type: "reauthorization_requested", updated_at: new Date().toISOString() }).eq("id", connection.id).eq("user_id", user.id);
    await Promise.all([
      writeWhatsAppConnectionEvent({ userId: user.id, connectionId: connection.id, eventType: "connection_reauth_required", status: "needs_reauth" }),
      writeWhatsAppAudit({ userId: user.id, connectionId: connection.id, action: "connection_reauth_required", status: "needs_reauth" }),
      trackServerAppEvent({ user_id: user.id, event_name: "whatsapp_connection_reauth_required", page: "/dashboard/whatsapp/configuracao", source: "dashboard", metadata: { status: "needs_reauth", connection_source: "embedded_signup" } })
    ]);
    return Response.json({ ...publicConfig, state: createEmbeddedSignupState(user.id) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
