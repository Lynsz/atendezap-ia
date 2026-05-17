import Stripe from "stripe";
import { getSaasPlan, getSaasPlanByStripePriceId } from "@/config/plans";
import { AppError, errorResponse } from "@/lib/errors";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getStripe, getStripeWebhookSecret, mapStripeSubscriptionStatus, unixToIso } from "@/services/stripe";

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

async function markEventProcessed(event: Stripe.Event) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("stripe_webhook_events").insert({
    provider_event_id: event.id,
    event_type: event.type,
    payload: event,
    processed_at: new Date().toISOString()
  });

  if (error) {
    if (error.code === "23505") return false;
    throw new AppError("Nao foi possivel registrar o webhook Stripe.", 500);
  }

  return true;
}

async function updateSubscriptionFromStripe(subscription: Stripe.Subscription, eventId: string, lastPaymentStatus?: string | null) {
  const supabase = getSupabaseAdmin();
  const periodSubscription = subscription as StripeSubscriptionWithPeriod;
  const priceId = getSubscriptionPriceId(subscription);
  const plan = getSaasPlan(subscription.metadata.plan_id) || getSaasPlanByStripePriceId(priceId);
  const userId = subscription.metadata.user_id;

  if (!userId || !plan) {
    console.warn("Stripe webhook sem user_id ou plano reconhecido.", {
      subscriptionId: subscription.id,
      eventId,
      priceId
    });
    return;
  }

  const internalStatus = mapStripeSubscriptionStatus(subscription.status);
  const firstMonthOfferApplied = subscription.metadata.first_month_offer_applied === "true";

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      plan_name: plan.id,
      plan: plan.id,
      status: internalStatus,
      provider: "stripe",
      provider_customer_id: getStringId(subscription.customer),
      provider_subscription_id: subscription.id,
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
    throw new AppError("Nao foi possivel atualizar a assinatura pelo webhook Stripe.", 500);
  }
}

async function updateSubscriptionFromCheckoutSession(session: Stripe.Checkout.Session, eventId: string) {
  if (!session.subscription || typeof session.subscription !== "string") return;

  const subscription = await getStripe().subscriptions.retrieve(session.subscription);
  await updateSubscriptionFromStripe(subscription, eventId, session.payment_status || null);

  const supabase = getSupabaseAdmin();
  await supabase
    .from("subscriptions")
    .update({
      stripe_checkout_session_id: session.id,
      stripe_event_id: eventId,
      provider_customer_id: getStringId(session.customer),
      last_payment_status: session.payment_status || "checkout_completed"
    })
    .eq("provider", "stripe")
    .eq("provider_subscription_id", subscription.id);
}

async function updatePaymentStatusFromInvoice(invoice: Stripe.Invoice, eventId: string, paymentStatus: string) {
  const subscriptionId = getStringId((invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null }).subscription);
  if (!subscriptionId) return;

  const stripeSubscription = await getStripe().subscriptions.retrieve(subscriptionId);
  await updateSubscriptionFromStripe(stripeSubscription, eventId, paymentStatus);

  const paymentId = getStringId((invoice as Stripe.Invoice & { payment_intent?: string | null }).payment_intent);
  const supabase = getSupabaseAdmin();
  await supabase
    .from("subscriptions")
    .update({
      provider_payment_id: paymentId,
      stripe_event_id: eventId,
      last_payment_status: paymentStatus
    })
    .eq("provider", "stripe")
    .eq("provider_subscription_id", subscriptionId);
}

export async function POST(request: Request) {
  try {
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

    return Response.json({ ok: true, event: event.type });
  } catch (error) {
    return errorResponse(error);
  }
}

export function GET() {
  return Response.json({ error: "Metodo nao permitido. Use POST." }, { status: 405 });
}
