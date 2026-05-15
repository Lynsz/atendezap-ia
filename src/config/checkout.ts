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
    checkoutUrl: "https://pay.kiwify.com.br/SoDyO2k",
    active: true
  },
  starter: {
    id: "starter",
    name: "Plano Starter",
    price: "R$49,00/mês",
    checkoutUrl: "https://pay.kiwify.com.br/KfYbZzC",
    active: true
  },
  premium: {
    id: "premium",
    name: "Plano Premium",
    price: "R$79,00/mês",
    checkoutUrl: "https://pay.kiwify.com.br/n6jZUdh",
    active: true
  }
};

export function getCheckoutPlan(planId: CheckoutPlanId): CheckoutPlan {
  return CHECKOUT_PLANS[planId];
}

export function getCheckoutUrl(planId: CheckoutPlanId): string {
  const plan = getCheckoutPlan(planId);
  const url = new URL(plan.checkoutUrl);

  url.searchParams.set("utm_source", "site");
  url.searchParams.set("utm_medium", "landing_page");
  url.searchParams.set("utm_campaign", "atendezap_ia");
  url.searchParams.set("utm_content", `plano_${planId}`);
  url.searchParams.set("src", "atendezap_ia");
  url.searchParams.set("billing", "monthly");

  return url.toString();
}
