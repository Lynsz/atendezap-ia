import { NextRequest } from "next/server";
import { AppError, errorResponse } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";

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
    assertRequestSize(request, 64_000);
    await enforceRateLimit({ request, route: "api:kiwify-webhook", limit: 60, windowMs: 60_000 });
    const secretValidated = validateWebhookSecret(request);
    const payload = await parseWebhookJson(request);

    await logEvent("kiwify_webhook_received", {
      mode: "acquisition_funnel",
      acquisition_source: "kiwify",
      funnel_source: "ebook",
      funnel_event: "kiwify_product_purchase",
      secret_validated: secretValidated,
      event: typeof payload.event === "string" ? payload.event : null,
      status: typeof payload.status === "string" ? payload.status : null
    });
    serverLog({ event: "kiwify_webhook_received", route: "/api/kiwify/webhook", status: "ok", metadata: { secret_validated: secretValidated } });

    return Response.json({
      ok: true,
      mode: "acquisition_funnel",
      acquisition_source: "kiwify",
      funnel_source: "ebook",
      message: "Webhook Kiwify recebido como evento de aquisição. A assinatura recorrente do SaaS deve ser liberada pelo webhook da Stripe."
    });
  } catch (error) {
    serverLog({ level: "warn", event: "kiwify_webhook_failed", route: "/api/kiwify/webhook", error });
    return errorResponse(error);
  }
}

export function GET() {
  return Response.json({ error: "Método não permitido. Use POST." }, { status: 405 });
}
