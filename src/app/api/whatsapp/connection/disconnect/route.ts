import { trackServerAppEvent } from "@/lib/analytics/server";
import { requireUser } from "@/lib/auth/server";
import { AppError, errorResponse } from "@/lib/errors";
import { enforceRateLimit } from "@/lib/rate-limit";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import { writeWhatsAppConnectionEvent } from "@/lib/server/whatsapp-connection-events";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    await enforceRateLimit({ request, route: "api:whatsapp-connection-disconnect", identifier: user.id, limit: 5, windowMs: 10 * 60_000 });
    const supabase = getSupabaseAdmin();
    const { data: connection, error } = await supabase.from("whatsapp_connections").select("id").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(1).maybeSingle();
    if (error) throw error;
    if (!connection) throw new AppError("Nenhuma integração WhatsApp foi encontrada.", 404);
    const now = new Date().toISOString();
    const { error: updateError } = await supabase.from("whatsapp_connections").update({ connection_status: "disconnected", status: "inactive", access_token_encrypted: null, disconnected_at: now, last_error_type: null, updated_at: now }).eq("id", connection.id).eq("user_id", user.id);
    if (updateError) throw updateError;
    await Promise.all([
      writeWhatsAppConnectionEvent({ userId: user.id, connectionId: connection.id, eventType: "connection_disconnected", status: "disconnected" }),
      writeWhatsAppAudit({ userId: user.id, connectionId: connection.id, action: "connection_disconnected", status: "disconnected" }),
      trackServerAppEvent({ user_id: user.id, event_name: "whatsapp_connection_disconnected", page: "/dashboard/whatsapp/configuracao", source: "dashboard", metadata: { status: "disconnected", connection_source: "embedded_signup" } })
    ]);
    return Response.json({ message: "Integração WhatsApp desconectada. Novas mensagens não serão enviadas por essa conexão." });
  } catch (error) {
    return errorResponse(error);
  }
}
