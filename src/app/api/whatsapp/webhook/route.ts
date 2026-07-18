import { trackServerAppEvent } from "@/lib/analytics/server";
import { errorResponse } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { parseWhatsAppWebhookEvents, type ParsedWhatsAppEvent } from "@/lib/server/parse-whatsapp-webhook";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import {
  markWhatsAppEventFailed,
  markWhatsAppEventProcessed,
  markWhatsAppEventReceived
} from "@/lib/server/whatsapp-event-idempotency";
import { getWhatsAppWebhookConfig } from "@/lib/server/whatsapp";
import { persistWhatsAppInbound } from "@/lib/server/whatsapp-inbound";
import { persistWhatsAppStatus } from "@/lib/server/whatsapp-status";
import { verifyWhatsAppWebhookSignature } from "@/lib/server/whatsapp-webhook-signature";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function processEvent(event: ParsedWhatsAppEvent) {
  const registration = await markWhatsAppEventReceived(event);
  if (!registration.acquired) {
    await trackServerAppEvent({
      event_name: "whatsapp_webhook_duplicate_ignored",
      page: "/api/whatsapp/webhook",
      source: "whatsapp_cloud_api",
      metadata: { status: "ignored_duplicate", event_type: event.kind }
    });
    await writeWhatsAppAudit({ action: "webhook_duplicate_ignored", status: "ignored_duplicate" });
    return { duplicate: true };
  }

  try {
    if (event.kind === "inbound_message") {
      const result = await persistWhatsAppInbound(event);
      await writeWhatsAppAudit({
        userId: result.userId,
        action: "inbound_message_processed",
        status: result.persisted ? "processed" : "ignored",
        conversationId: result.conversationId,
        messageId: result.messageId
      });
    } else {
      await persistWhatsAppStatus(event);
    }
    await markWhatsAppEventProcessed(registration.eventId);
    return { duplicate: false };
  } catch (error) {
    await markWhatsAppEventFailed(registration.eventId, "webhook_event_processing");
    throw error;
  }
}

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
    if (rawBody.length > 524_288) return Response.json({ error: "Payload muito grande." }, { status: 413 });
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

    const events = parseWhatsAppWebhookEvents(payload).slice(0, 500);
    const results = [];
    for (const event of events) results.push(await processEvent(event));
    serverLog({
      event: "whatsapp_webhook_processed",
      route: "/api/whatsapp/webhook",
      status: 200,
      metadata: {
        event_count: events.length,
        duplicate_count: results.filter((result) => result.duplicate).length,
        signature_required: signature.required
      }
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
