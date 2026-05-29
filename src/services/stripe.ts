import Stripe from "stripe";
import {
  getPlanIdByConfiguredStripePriceId,
  getSaasPlan,
  getStripePriceEnvNamesForPlan,
  type PlanId,
  type SaasPlan
} from "@/config/plans";
import { AppError } from "@/lib/errors";

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
    throw new AppError("Stripe nao esta configurado neste ambiente.", 503);
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
    throw new AppError("Webhook Stripe nao esta configurado neste ambiente.", 500);
  }
  return webhookSecret;
}

export function getAppUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl.replace(/\/$/, "")}`;

  if (process.env.NODE_ENV !== "production") return "http://localhost:3000";

  throw new AppError("URL publica do app nao configurada. Defina NEXT_PUBLIC_APP_URL na Vercel.", 500);
}

function envValue(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return "";
}

function getCheckoutStripePriceId(planId: PlanId) {
  const plan = getSaasPlan(planId);
  if (!plan) return "";
  return envValue(plan.priceEnv, `${plan.priceEnv}_MONTHLY`);
}

export function getStripePlanPriceIds(planId: PlanId) {
  const checkoutPriceId = getCheckoutStripePriceId(planId);
  const plan = getSaasPlan(planId);
  const compatibilityPriceIds = getStripePriceEnvNamesForPlan(planId)
    .filter((envName) => envName !== plan?.priceEnv)
    .map((envName) => envValue(envName));
  return [checkoutPriceId, ...compatibilityPriceIds].filter(Boolean);
}

export function getStripePriceId(plan: SaasPlan) {
  const priceId = getCheckoutStripePriceId(plan.id);
  if (!priceId) {
    throw new AppError(`Preco Stripe nao configurado para o plano ${plan.name}.`, 503);
  }
  return priceId;
}

export function getStripeCouponId(plan: SaasPlan, shouldApplyFirstMonthOffer: boolean) {
  if (!shouldApplyFirstMonthOffer) return null;
  if (plan.id !== "pro") return null;
  return (
    envValue(
      plan.firstMonthCouponEnv || "STRIPE_PRO_FIRST_MONTH_COUPON_ID",
      "STRIPE_COUPON_PRO_FIRST_MONTH_29",
      "STRIPE_COUPON_PRO_FIRST_MONTH"
    ) || null
  );
}

export function getSaasPlanByStripePriceId(stripePriceId: string | null | undefined) {
  const planId = getPlanIdByConfiguredStripePriceId(stripePriceId, (name) => envValue(name));
  return planId ? getSaasPlan(planId) : null;
}

export function mapStripeSubscriptionStatus(status?: StripeSubscriptionStatus | string | null) {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "unpaid":
      return "unpaid";
    case "canceled":
      return "canceled";
    case "incomplete":
      return "incomplete";
    case "incomplete_expired":
      return "incomplete_expired";
    case "paused":
      return "paused";
    default:
      return "pending";
  }
}

export function unixToIso(value?: number | null) {
  return value ? new Date(value * 1000).toISOString() : null;
}

export type StripeCheckoutAttribution = {
  price_id?: string;
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
    price_id: cleanMetadataValue(attribution.price_id),
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
