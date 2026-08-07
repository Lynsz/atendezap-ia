import { requireUser } from "@/lib/auth/server";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { errorResponse } from "@/lib/errors";
import { createEmbeddedSignupState, getEmbeddedSignupPublicConfig } from "@/lib/server/meta-embedded-signup";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import { writeWhatsAppConnectionEvent } from "@/lib/server/whatsapp-connection-events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    const config = getEmbeddedSignupPublicConfig();
    if (config.enabled) {
      await Promise.all([
        writeWhatsAppConnectionEvent({ userId: user.id, eventType: "signup_started", status: "started" }),
        writeWhatsAppAudit({ userId: user.id, action: "embedded_signup_started", status: "started" }),
        trackServerAppEvent({ user_id: user.id, event_name: "whatsapp_embedded_signup_started", page: "/dashboard/whatsapp/onboarding", source: "embedded_signup", metadata: { status: "started", connection_source: "embedded_signup" } })
      ]);
    }
    return Response.json({
      ...config,
      state: config.enabled ? createEmbeddedSignupState(user.id) : null
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
