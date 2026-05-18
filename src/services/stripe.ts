import Stripe from "stripe";
import { AppError } from "@/lib/errors";
import { type PlanId, type SaasPlan } from "@/config/plans";

export type StripeSubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "paused"
  | "trialing"
  | "unpaid";

let stripeClient: Stripe | null = null;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    throw new AppError("Stripe não está configurado neste ambiente.", 503);
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      typescript: true
    });
  }

  return stripeClient;
}

export function getStripeWebhookSecret() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    throw new AppError("Webhook Stripe não está configurado neste ambiente.", 500);
  }
  return webhookSecret;
}

export function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function getStripePriceId(plan: SaasPlan) {
  if (!plan.stripePriceId) {
    throw new AppError(`Preço Stripe não configurado para o plano ${plan.name}.`, 503);
  }
  return plan.stripePriceId;
}

export function getStripeCouponId(plan: SaasPlan, shouldApplyFirstMonthOffer: boolean) {
  if (!shouldApplyFirstMonthOffer) return null;
  if (!plan.stripeCouponId) {
    throw new AppError("Cupom Stripe do primeiro mês do Plano Pro não configurado.", 503);
  }
  return plan.stripeCouponId;
}

export function mapStripeSubscriptionStatus(status?: StripeSubscriptionStatus | string | null) {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trial";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
      return "canceled";
    case "incomplete":
      return "pending";
    case "incomplete_expired":
      return "inactive";
    case "paused":
      return "inactive";
    default:
      return "pending";
  }
}

export function unixToIso(value?: number | null) {
  return value ? new Date(value * 1000).toISOString() : null;
}

export type StripeCheckoutAttribution = {
  source?: string;
  funnel?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

function cleanMetadataValue(value?: string | null) {
  return value?.trim().slice(0, 160) || "";
}

export function buildStripeCheckoutMetadata(
  userId: string,
  planId: PlanId,
  firstMonthOfferApplied: boolean,
  attribution: StripeCheckoutAttribution = {}
) {
  const metadata = {
    user_id: userId,
    plan_id: planId,
    plan: planId,
    first_month_offer_applied: firstMonthOfferApplied ? "true" : "false",
    acquisition_source: cleanMetadataValue(attribution.source) || "stripe",
    funnel_source: cleanMetadataValue(attribution.funnel) || "pricing",
    utm_source: cleanMetadataValue(attribution.utm_source),
    utm_medium: cleanMetadataValue(attribution.utm_medium),
    utm_campaign: cleanMetadataValue(attribution.utm_campaign),
    utm_content: cleanMetadataValue(attribution.utm_content),
    utm_term: cleanMetadataValue(attribution.utm_term)
  };

  return Object.fromEntries(Object.entries(metadata).filter(([, value]) => value)) as Record<string, string>;
}
