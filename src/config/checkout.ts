export type CheckoutPlanId = "basic" | "starter" | "premium";

export type CheckoutPlan = {
  id: CheckoutPlanId;
  name: string;
  price: string;
  checkoutUrl: string;
  active: boolean;
};

export const CHECKOUT_PLANS: Record<CheckoutPlanId, CheckoutPlan> = {
  basic: {
    id: "basic",
    name: "Plano Básico",
    price: "R$29,00/mês",
    checkoutUrl: process.env.NEXT_PUBLIC_KIWI_INITIAL_CHECKOUT_URL || "",
    active: Boolean(process.env.NEXT_PUBLIC_KIWI_INITIAL_CHECKOUT_URL)
  },
  starter: {
    id: "starter",
    name: "Plano Starter",
    price: "R$49,00/mês",
    checkoutUrl: process.env.NEXT_PUBLIC_KIWI_PRO_CHECKOUT_URL || "",
    active: Boolean(process.env.NEXT_PUBLIC_KIWI_PRO_CHECKOUT_URL)
  },
  premium: {
    id: "premium",
    name: "Plano Premium",
    price: "R$79,00/mês",
    checkoutUrl: "",
    active: false
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
    basic: "plano_basico",
    starter: "plano_starter",
    premium: "plano_premium"
  };

  url.searchParams.set("utm_source", "site");
  url.searchParams.set("utm_medium", "landing_page");
  url.searchParams.set("utm_campaign", "atendezap_ia");
  url.searchParams.set("utm_content", utmContent[planId]);
  url.searchParams.set("src", "atendezap_ia");
  url.searchParams.set("billing", "monthly");

  return url.toString();
}
