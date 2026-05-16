import { NextRequest } from "next/server";
import { AppError, errorResponse } from "@/lib/errors";
import { logEvent } from "@/lib/events";

export const runtime = "nodejs";

function validateWebhookSecret(request: NextRequest) {
  const expected = process.env.KIWIFY_WEBHOOK_SECRET;
  if (!expected) return false;

  const received =
    request.headers.get("x-kiwify-webhook-secret") ||
    request.headers.get("x-webhook-secret") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (received !== expected) {
    throw new AppError("Webhook não autorizado.", 401);
  }

  return true;
}

async function parseWebhookJson(request: NextRequest) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    throw new AppError("JSON inválido no webhook da Kiwify.", 400);
  }
}

export async function POST(request: NextRequest) {
  try {
    const secretValidated = validateWebhookSecret(request);
    const payload = await parseWebhookJson(request);

    await logEvent("kiwify_webhook_received", {
      mode: "saas_placeholder",
      secret_validated: secretValidated,
      event: typeof payload.event === "string" ? payload.event : null,
      status: typeof payload.status === "string" ? payload.status : null
    });

    return Response.json({
      ok: true,
      mode: "manual_subscription_release",
      message: "Webhook recebido. A liberação automática de assinatura SaaS ainda não está ativa; atualize subscriptions manualmente no Supabase após confirmar o pagamento."
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export function GET() {
  return Response.json({ error: "Método não permitido. Use POST." }, { status: 405 });
}
