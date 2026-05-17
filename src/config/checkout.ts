export type CheckoutPlanId = "starter" | "pro" | "premium";

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

const checkoutUrls: Record<CheckoutPlanId, string> = {
  starter: process.env.NEXT_PUBLIC_CHECKOUT_STARTER_URL || "",
  pro: process.env.NEXT_PUBLIC_CHECKOUT_PRO_FIRST_MONTH_URL || process.env.NEXT_PUBLIC_CHECKOUT_PRO_URL || "",
  premium: process.env.NEXT_PUBLIC_CHECKOUT_PREMIUM_URL || ""
};

export const CHECKOUT_PLANS: Record<CheckoutPlanId, CheckoutPlan> = {
  starter: {
    id: "starter",
    name: "Plano Starter",
    price: "R$ 49/mês",
    checkoutUrl: checkoutUrls.starter,
    active: Boolean(checkoutUrls.starter),
    monthlyLimit: 150
  },
  pro: {
    id: "pro",
    name: "Plano Pro",
    price: "R$ 29 no primeiro mês. Depois, R$ 97/mês.",
    firstMonthPrice: "R$ 29",
    recurringPrice: "R$ 97/mês",
    checkoutUrl: checkoutUrls.pro,
    active: Boolean(checkoutUrls.pro),
    monthlyLimit: 600,
    isFirstMonthOffer: true
  },
  premium: {
    id: "premium",
    name: "Plano Premium",
    price: "R$ 197/mês",
    checkoutUrl: checkoutUrls.premium,
    active: Boolean(checkoutUrls.premium),
    monthlyLimit: 2000
  }
};

export function getCheckoutPlan(planId: CheckoutPlanId): CheckoutPlan {
  return CHECKOUT_PLANS[planId];
}

export function getCheckoutUrl(planId: CheckoutPlanId): string {
  const plan = getCheckoutPlan(planId);
  if (!plan.checkoutUrl) return "";

  const url = new URL(plan.checkoutUrl);
  const utmContent: Record<CheckoutPlanId, string> = {
    starter: "plano_starter",
    pro: "plano_pro_primeiro_mes",
    premium: "plano_premium"
  };

  url.searchParams.set("utm_source", "site");
  url.searchParams.set("utm_medium", "landing_page");
  url.searchParams.set("utm_campaign", "atendezap_ia_ebook_funil");
  url.searchParams.set("utm_content", utmContent[planId]);
  url.searchParams.set("src", "atendezap_ia");
  url.searchParams.set("billing", "monthly");

  if (planId === "pro") {
    url.searchParams.set("offer", "first_month_29_new_users");
  }

  return url.toString();
}
