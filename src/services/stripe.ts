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
    throw new AppError("Pagamento indisponivel no momento. Configure STRIPE_SECRET_KEY no servidor.", 503);
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
    throw new AppError("Webhook Stripe nao configurado.", 500);
  }
  return webhookSecret;
}

export function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function getStripePriceId(plan: SaasPlan) {
  if (!plan.stripePriceId) {
    throw new AppError(`Preco Stripe nao configurado para o plano ${plan.name}.`, 503);
  }
  return plan.stripePriceId;
}

export function getStripeCouponId(plan: SaasPlan, shouldApplyFirstMonthOffer: boolean) {
  if (!shouldApplyFirstMonthOffer) return null;
  if (!plan.stripeCouponId) {
    throw new AppError("Cupom Stripe do primeiro mes do Plano Pro nao configurado.", 503);
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

export function buildStripeCheckoutMetadata(userId: string, planId: PlanId, firstMonthOfferApplied: boolean) {
  return {
    user_id: userId,
    plan_id: planId,
    first_month_offer_applied: firstMonthOfferApplied ? "true" : "false",
    acquisition_source: "stripe",
    funnel_source: "pricing"
  };
}

