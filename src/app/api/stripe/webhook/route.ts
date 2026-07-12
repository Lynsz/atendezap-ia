import Stripe from "stripe";
import { getSaasPlan } from "@/config/plans";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { AppError, errorResponse } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getSaasPlanByStripePriceId, getStripe, getStripeWebhookSecret, mapStripeSubscriptionStatus, unixToIso } from "@/services/stripe";

export const runtime = "nodejs";

type StripeSubscriptionWithPeriod = Stripe.Subscription & {
  current_period_start?: number;
  current_period_end?: number;
};

function getSubscriptionPriceId(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.price.id || null;
}

function getStringId(value: string | { id: string } | null | undefined) {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

async function findStoredUserId(subscription: Stripe.Subscription) {
  const supabase = getSupabaseAdmin();
  const customerId = getStringId(subscription.customer);

  const { data: bySubscription } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("provider", "stripe")
    .eq("provider_subscription_id", subscription.id)
    .limit(1)
    .maybeSingle();

  if (bySubscription?.user_id) return bySubscription.user_id as string;

  if (!customerId) return null;

  const { data: byProviderCustomer } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("provider", "stripe")
    .eq("provider_customer_id", customerId)
    .limit(1)
    .maybeSingle();

  if (byProviderCustomer?.user_id) return byProviderCustomer.user_id as string;

  const { data: byStripeCustomer } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("provider", "stripe")
    .eq("stripe_customer_id", customerId)
    .limit(1)
    .maybeSingle();

  return byStripeCustomer?.user_id ? (byStripeCustomer.user_id as string) : null;
}

async function markEventProcessed(event: Stripe.Event) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("stripe_webhook_events").insert({
    provider_event_id: event.id,
    event_type: event.type,
    payload: {
      id: event.id,
      type: event.type,
      created: event.created,
      livemode: event.livemode
    },
    processed_at: new Date().toISOString()
  });

  if (error) {
    if (error.code === "23505") return false;
    throw new AppError("Não foi possível registrar o webhook Stripe.", 500);
  }

  return true;
}

async function updateSubscriptionFromStripe(
  subscription: Stripe.Subscription,
  eventId: string,
  lastPaymentStatus?: string | null,
  userIdFallback?: string | null
) {
  const supabase = getSupabaseAdmin();
  const periodSubscription = subscription as StripeSubscriptionWithPeriod;
  const priceId = getSubscriptionPriceId(subscription);
  const plan = getSaasPlan(subscription.metadata.plan_id || subscription.metadata.plan) || getSaasPlanByStripePriceId(priceId);
  const userId = subscription.metadata.user_id || userIdFallback || (await findStoredUserId(subscription));

  if (!userId || !plan) {
    serverLog({
      level: "warn",
      event: "stripe_webhook_subscription_unmapped",
      route: "/api/stripe/webhook",
      metadata: {
        subscription_id: subscription.id,
        event_id: eventId,
        has_price_id: Boolean(priceId)
      }
    });
    return;
  }

  const internalStatus = mapStripeSubscriptionStatus(subscription.status);
  const firstMonthOfferApplied = subscription.metadata.first_month_offer_applied === "true";
  const now = new Date().toISOString();

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      plan_name: plan.id,
      plan: plan.id,
      status: internalStatus,
      provider: "stripe",
      provider_customer_id: getStringId(subscription.customer),
      provider_subscription_id: subscription.id,
      stripe_customer_id: getStringId(subscription.customer),
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      provider_price_id: priceId,
      stripe_event_id: eventId,
      monthly_limit: plan.responseLimit,
      price: plan.monthlyPrice,
      first_month_price: plan.firstMonthPrice ?? null,
      is_first_month_offer: Boolean(plan.firstMonthPrice),
      first_month_price_applied: firstMonthOfferApplied,
      first_month_offer_used_at: firstMonthOfferApplied && internalStatus === "active" ? new Date().toISOString() : undefined,
      promo_code: firstMonthOfferApplied ? "stripe_pro_first_month_29" : null,
      current_period_start: unixToIso(periodSubscription.current_period_start),
      current_period_end: unixToIso(periodSubscription.current_period_end),
      cancel_at_period_end: subscription.cancel_at_period_end,
      last_payment_status: lastPaymentStatus || subscription.status,
      updated_at: now,
      metadata: {
        provider: "stripe",
        last_stripe_event_id: eventId,
        stripe_status: subscription.status,
        stripe_price_id: priceId
      }
    },
    { onConflict: "user_id" }
  );

  if (error) {
    throw new AppError("Não foi possível atualizar a assinatura pelo webhook Stripe.", 500);
  }

  await logEvent("subscription_status_updated", {
    source: "stripe_webhook",
    plan: plan.id,
    status: internalStatus,
    stripe_status: subscription.status
  });
  serverLog({
    event: "subscription_status_updated",
    route: "/api/stripe/webhook",
    userId,
    status: "ok",
    metadata: {
      plan: plan.id,
      status: internalStatus,
      stripe_status: subscription.status
    }
  });
}

async function updateSubscriptionFromCheckoutSession(session: Stripe.Checkout.Session, eventId: string) {
  if (!session.subscription || typeof session.subscription !== "string") return;

  const subscription = await getStripe().subscriptions.retrieve(session.subscription);
  const sessionUserId = session.metadata?.user_id || session.client_reference_id || null;
  await updateSubscriptionFromStripe(subscription, eventId, session.payment_status || null, sessionUserId);
  const plan = session.metadata?.plan || session.metadata?.plan_id || null;

  await logEvent("checkout_completed", {
    source: "stripe_webhook",
    plan: plan || "sem_plano",
    status: session.payment_status || "completed"
  });
  await trackServerAppEvent({
    user_id: sessionUserId,
    event_name: "checkout_completed",
    source: "stripe_webhook",
    page: "/assinatura",
    plan,
    metadata: {
      source: "stripe_webhook",
      plan: plan || "sem_plano",
      status: session.payment_status || "completed"
    }
  });

  const supabase = getSupabaseAdmin();
  await supabase
    .from("subscriptions")
    .update({
      stripe_checkout_session_id: session.id,
      stripe_event_id: eventId,
      provider_customer_id: getStringId(session.customer),
      stripe_customer_id: getStringId(session.customer),
      stripe_subscription_id: subscription.id,
      last_payment_status: session.payment_status || "checkout_completed",
      updated_at: new Date().toISOString()
    })
    .eq("provider", "stripe")
    .eq("provider_subscription_id", subscription.id);
}

async function updatePaymentStatusFromInvoice(invoice: Stripe.Invoice, eventId: string, paymentStatus: string) {
  const subscriptionId = getStringId((invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null }).subscription);
  if (!subscriptionId) return;

  if (paymentStatus === "failed") {
    await logEvent("failed_payment_received", {
      source: "stripe_webhook"
    });
    serverLog({ level: "warn", event: "failed_payment_received", route: "/api/stripe/webhook", metadata: { has_subscription: true } });
  }

  const stripeSubscription = await getStripe().subscriptions.retrieve(subscriptionId);
  await updateSubscriptionFromStripe(stripeSubscription, eventId, paymentStatus);

  const paymentId = getStringId((invoice as Stripe.Invoice & { payment_intent?: string | null }).payment_intent);
  const supabase = getSupabaseAdmin();
  await supabase
    .from("subscriptions")
    .update({
      provider_payment_id: paymentId,
      stripe_event_id: eventId,
      subscription_status: stripeSubscription.status,
      last_payment_status: paymentStatus,
      updated_at: new Date().toISOString()
    })
    .eq("provider", "stripe")
    .eq("provider_subscription_id", subscriptionId);
}

export async function POST(request: Request) {
  try {
    assertRequestSize(request, 256_000);
    await enforceRateLimit({ request, route: "api:stripe-webhook", limit: 240, windowMs: 60_000 });
    const stripe = getStripe();
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      throw new AppError("Assinatura do webhook Stripe ausente.", 400);
    }

    const rawBody = await request.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, getStripeWebhookSecret());
    } catch {
      throw new AppError("Webhook Stripe invalido.", 400);
    }

    serverLog({ event: "webhook_received", route: "/api/stripe/webhook", status: "ok", metadata: { provider: "stripe", event_type: event.type } });
    await trackServerAppEvent({
      event_name: "stripe_webhook_received",
      source: "stripe",
      page: "/api/stripe/webhook",
      metadata: {
        source: "stripe",
        event_type: event.type
      }
    });

    const shouldProcess = await markEventProcessed(event);
    if (!shouldProcess) {
      return Response.json({ ok: true, duplicate: true });
    }

    switch (event.type) {
      case "checkout.session.completed":
        await updateSubscriptionFromCheckoutSession(event.data.object as Stripe.Checkout.Session, event.id);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await updateSubscriptionFromStripe(event.data.object as Stripe.Subscription, event.id);
        break;
      case "invoice.payment_succeeded":
        await updatePaymentStatusFromInvoice(event.data.object as Stripe.Invoice, event.id, "succeeded");
        break;
      case "invoice.payment_failed":
        await updatePaymentStatusFromInvoice(event.data.object as Stripe.Invoice, event.id, "failed");
        break;
      default:
        break;
    }

    await logEvent("stripe_webhook_succeeded", {
      source: "stripe",
      event_type: event.type
    });
    serverLog({ event: "stripe_webhook_processed", route: "/api/stripe/webhook", status: "ok", metadata: { event_type: event.type } });
    return Response.json({ ok: true, event: event.type });
  } catch (error) {
    await logEvent("stripe_webhook_failed", {
      source: "stripe",
      error_name: error instanceof Error ? error.name : "unknown"
    });
    serverLog({ level: "warn", event: "stripe_webhook_failed", route: "/api/stripe/webhook", error });
    return errorResponse(error);
  }
}

export function GET() {
  return Response.json({ error: "Método não permitido. Use POST." }, { status: 405 });
}
