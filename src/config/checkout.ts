import { SAAS_PLANS, type PlanId } from "@/config/plans";

export type CheckoutPlanId = PlanId;

export type CheckoutPlan = {
  id: CheckoutPlanId;
  name: string;
  price: string;
  checkoutUrl: string;
  active: boolean;
  monthlyLimit: number;
  firstMonthPrice?: string;
  recurringPrice?: string;
  isFirstMonthOffer?: boolean;
};

const kiwifyAcquisitionUrls: Record<CheckoutPlanId, string> = {
  starter: process.env.NEXT_PUBLIC_KIWIFY_STARTER_URL || "",
  pro: process.env.NEXT_PUBLIC_KIWIFY_PRO_ORDER_BUMP_URL || "",
  premium: process.env.NEXT_PUBLIC_KIWIFY_PREMIUM_URL || ""
};

export const CHECKOUT_PLANS: Record<CheckoutPlanId, CheckoutPlan> = {
  starter: {
    id: "starter",
    name: "Plano Starter",
    price: SAAS_PLANS.starter.monthlyPriceLabel,
    checkoutUrl: kiwifyAcquisitionUrls.starter,
    active: Boolean(kiwifyAcquisitionUrls.starter),
    monthlyLimit: SAAS_PLANS.starter.responseLimit
  },
  pro: {
    id: "pro",
    name: "Plano Pro",
    price: "R$ 29 no primeiro mês. Depois, R$ 97/mês.",
    firstMonthPrice: "R$ 29",
    recurringPrice: SAAS_PLANS.pro.monthlyPriceLabel,
    checkoutUrl: kiwifyAcquisitionUrls.pro,
    active: Boolean(kiwifyAcquisitionUrls.pro),
    monthlyLimit: SAAS_PLANS.pro.responseLimit,
    isFirstMonthOffer: true
  },
  premium: {
    id: "premium",
    name: "Plano Premium",
    price: SAAS_PLANS.premium.monthlyPriceLabel,
    checkoutUrl: kiwifyAcquisitionUrls.premium,
    active: Boolean(kiwifyAcquisitionUrls.premium),
    monthlyLimit: SAAS_PLANS.premium.responseLimit
  }
};

export function getCheckoutPlan(planId: CheckoutPlanId): CheckoutPlan {
  return CHECKOUT_PLANS[planId];
}

export function getCheckoutUrl(planId: CheckoutPlanId): string {
  const plan = getCheckoutPlan(planId);
  if (!plan.checkoutUrl) return "";

  const url = new URL(plan.checkoutUrl);
  url.searchParams.set("utm_source", "kiwify");
  url.searchParams.set("utm_medium", "ebook_funil");
  url.searchParams.set("utm_campaign", "atendezap_ia_aquisicao");
  url.searchParams.set("utm_content", `kiwify_${planId}`);
  url.searchParams.set("acquisition_source", "kiwify");
  url.searchParams.set("funnel_source", "ebook");

  if (planId === "pro") {
    url.searchParams.set("offer", "order_bump_pro_first_month_29");
  }

  return url.toString();
}
