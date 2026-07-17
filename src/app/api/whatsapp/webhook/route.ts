import { trackServerAppEvent } from "@/lib/analytics/server";
import { errorResponse } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { parseWhatsAppWebhook } from "@/lib/server/parse-whatsapp-webhook";
import { getWhatsAppWebhookConfig } from "@/lib/server/whatsapp";
import { persistWhatsAppInbound } from "@/lib/server/whatsapp-inbound";
import { verifyWhatsAppWebhookSignature } from "@/lib/server/whatsapp-webhook-signature";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { verifyToken } = getWhatsAppWebhookConfig();
    const url = new URL(request.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode !== "subscribe" || token !== verifyToken || !challenge) {
      serverLog({ level: "warn", event: "whatsapp_webhook_verification_rejected", route: "/api/whatsapp/webhook", status: 403 });
      return Response.json({ error: "Verificação do webhook recusada." }, { status: 403 });
    }

    await trackServerAppEvent({
      event_name: "whatsapp_webhook_verified",
      page: "/api/whatsapp/webhook",
      source: "whatsapp_cloud_api",
      metadata: { status: "verified" }
    });
    return new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { appSecret } = getWhatsAppWebhookConfig();
    const rawBody = await request.text();
    const signature = verifyWhatsAppWebhookSignature(rawBody, request.headers.get("x-hub-signature-256"), appSecret);
    if (!signature.valid) {
      serverLog({ level: "warn", event: "whatsapp_webhook_signature_rejected", route: "/api/whatsapp/webhook", status: 401 });
      return Response.json({ error: "Assinatura do webhook inválida." }, { status: 401 });
    }

    let payload: unknown;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return Response.json({ error: "Payload inválido." }, { status: 400 });
    }

    const messages = parseWhatsAppWebhook(payload);
    await Promise.all(messages.map((message) => persistWhatsAppInbound(message)));
    serverLog({
      event: "whatsapp_webhook_processed",
      route: "/api/whatsapp/webhook",
      status: 200,
      metadata: { message_count: messages.length, signature_required: signature.required }
    });
    return Response.json({ received: true }, { status: 200 });
  } catch (error) {
    await trackServerAppEvent({
      event_name: "whatsapp_integration_error",
      page: "/api/whatsapp/webhook",
      source: "whatsapp_cloud_api",
      metadata: { error_type: "webhook_processing" }
    });
    serverLog({ level: "error", event: "whatsapp_webhook_failed", route: "/api/whatsapp/webhook", error });
    return errorResponse(error);
  }
}
