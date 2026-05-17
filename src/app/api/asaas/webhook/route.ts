import { AppError, errorResponse } from "@/lib/errors";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { addOneMonthIso, mapAsaasEventToSubscriptionStatus, type AsaasWebhookPayload } from "@/services/asaas";

export const runtime = "nodejs";

function validateAsaasWebhookToken(request: Request) {
  const expected = process.env.ASAAS_WEBHOOK_TOKEN?.trim();
  if (!expected) {
    throw new AppError("Webhook Asaas não configurado.", 500);
  }

  const received = request.headers.get("asaas-access-token") || request.headers.get("asaas_access_token");
  if (received !== expected) {
    throw new AppError("Webhook Asaas não autorizado.", 401);
  }
}

function resolvePeriodStart(payload: AsaasWebhookPayload) {
  const payment = payload.payment;
  return new Date(payment?.confirmedDate || payment?.paymentDate || payment?.clientPaymentDate || payment?.dueDate || Date.now());
}

export async function POST(request: Request) {
  try {
    validateAsaasWebhookToken(request);

    const payload = (await request.json()) as AsaasWebhookPayload;
    const eventId = payload.id;
    const eventName = payload.event;
    const payment = payload.payment;

    if (!eventId || !eventName) {
      throw new AppError("Evento Asaas inválido.", 400);
    }

    const supabase = getSupabaseAdmin();
    const { error: insertEventError } = await supabase.from("asaas_webhook_events").insert({
      provider_event_id: eventId,
      event_type: eventName,
      provider_payment_id: payment?.id || null,
      provider_subscription_id: payment?.subscription || null,
      payload,
      processed_at: new Date().toISOString()
    });

    if (insertEventError) {
      if (insertEventError.code === "23505") {
        return Response.json({ ok: true, duplicate: true });
      }

      throw new AppError("Não foi possível registrar o webhook Asaas.", 500);
    }

    const status = mapAsaasEventToSubscriptionStatus(eventName, payment?.status);
    const periodStart = resolvePeriodStart(payload);
    const activeStatus = status === "active";

    if (payment?.subscription) {
      const updatePayload = {
        status,
        provider: "asaas",
        provider_payment_id: payment.id || null,
        last_payment_status: payment.status || eventName,
        current_period_start: activeStatus ? periodStart.toISOString() : undefined,
        current_period_end: activeStatus ? addOneMonthIso(periodStart) : undefined,
        first_month_offer_used_at: activeStatus ? new Date().toISOString() : undefined,
        metadata: {
          last_asaas_event: eventName,
          last_asaas_payment_id: payment.id || null,
          last_asaas_payment_status: payment.status || null,
          last_asaas_event_id: eventId
        }
      };

      const { error: updateError } = await supabase
        .from("subscriptions")
        .update(updatePayload)
        .eq("provider", "asaas")
        .eq("provider_subscription_id", payment.subscription);

      if (updateError) {
        throw new AppError("Não foi possível atualizar a assinatura pelo webhook Asaas.", 500);
      }
    }

    return Response.json({ ok: true, event: eventName, status });
  } catch (error) {
    return errorResponse(error);
  }
}

export function GET() {
  return Response.json({ error: "Método não permitido. Use POST." }, { status: 405 });
}
