import { NextRequest } from "next/server";
import { AppError, errorResponse } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, clientIp, enforceRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { supportSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    assertRequestSize(request, 12_288);
    const ip = clientIp(request.headers);
    await enforceRateLimit({
      request,
      route: "api:support",
      limit: 5,
      windowMs: 10 * 60_000,
      message: "Muitas mensagens enviadas. Aguarde alguns minutos."
    });

    const body = supportSchema.parse(await request.json());
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("support_requests").insert({
      email: body.email,
      message: body.message,
      metadata: { ip }
    });

    if (error) throw new AppError("Nao foi possivel salvar sua solicitacao.", 500);
    await logEvent("support_request_created", { email_domain: body.email.split("@")[1], ip });
    serverLog({ event: "support_request_created", route: "/api/support", status: "ok", metadata: { ip, email_domain: body.email.split("@")[1] } });
    return Response.json({ ok: true });
  } catch (error) {
    serverLog({ level: "warn", event: "support_request_failed", route: "/api/support", error });
    return errorResponse(error);
  }
}
