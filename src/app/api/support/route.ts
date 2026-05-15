import { NextRequest } from "next/server";
import { AppError, errorResponse } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { supportSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request.headers);
    if (!checkRateLimit(`support:${ip}`, 5, 10 * 60_000)) {
      throw new AppError("Muitas mensagens enviadas. Aguarde alguns minutos.", 429);
    }

    const body = supportSchema.parse(await request.json());
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("support_requests").insert({
      email: body.email,
      message: body.message,
      metadata: { ip }
    });

    if (error) throw new AppError("Não foi possível salvar sua solicitação.", 500);
    await logEvent("support_request_created", { email_domain: body.email.split("@")[1], ip });
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
