import Stripe from "stripe";
import { AppError } from "@/lib/errors";
import { getSaasPlan, PLAN_IDS, type PlanId, type SaasPlan } from "@/config/plans";

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
  const compatibilityPriceIds = plan?.promoPriceEnv ? [envValue(plan.promoPriceEnv)] : [];
  return [checkoutPriceId, ...compatibilityPriceIds].filter(Boolean);
}

export function getStripePriceId(plan: SaasPlan) {
  const priceId = getCheckoutStripePriceId(plan.id);
  if (!priceId) {
    throw new AppError(`Preço Stripe não configurado para o plano ${plan.name}.`, 503);
  }
  return priceId;
}

export function getStripeCouponId(plan: SaasPlan, shouldApplyFirstMonthOffer: boolean) {
  if (!shouldApplyFirstMonthOffer) return null;
  if (plan.id !== "pro") return null;
  const couponId = envValue(plan.firstMonthCouponEnv || "STRIPE_PRO_FIRST_MONTH_COUPON_ID", "STRIPE_COUPON_PRO_FIRST_MONTH_29", "STRIPE_COUPON_PRO_FIRST_MONTH");
  if (!couponId) {
    throw new AppError("Cupom Stripe do primeiro mês do Plano Pro não configurado.", 503);
  }
  return couponId;
}

export function getSaasPlanByStripePriceId(stripePriceId: string | null | undefined) {
  if (!stripePriceId) return null;
  const planId = PLAN_IDS.find((id) => getStripePlanPriceIds(id).includes(stripePriceId));
  return planId ? getSaasPlan(planId) : null;
}

export function mapStripeSubscriptionStatus(status?: StripeSubscriptionStatus | string | null) {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
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
