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
    price: "R$29,00",
    checkoutUrl: "https://pay.kiwify.com.br/TzuyT33",
    active: true
  },
  starter: {
    id: "starter",
    name: "Plano Starter",
    price: "R$49,00",
    checkoutUrl: "https://pay.kiwify.com.br/YKQD0lL",
    active: true
  },
  premium: {
    id: "premium",
    name: "Plano Premium",
    price: "R$79,00",
    checkoutUrl: "https://pay.kiwify.com.br/kpokbPx",
    active: true
  }
};

const CHECKOUT_UTM_BASE = {
  utm_source: "site",
  utm_medium: "landing_page",
  utm_campaign: "atendezap_ia",
  src: "atendezap_ia"
} as const;

export function getCheckoutPlan(planId: CheckoutPlanId) {
  return CHECKOUT_PLANS[planId];
}

export function getCheckoutUrl(planId: CheckoutPlanId) {
  const plan = getCheckoutPlan(planId);
  const url = new URL(plan.checkoutUrl);

  Object.entries(CHECKOUT_UTM_BASE).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const utmContent: Record<CheckoutPlanId, string> = {
    basic: "plano_basico",
    starter: "plano_starter",
    premium: "plano_premium"
  };

  url.searchParams.set("utm_content", utmContent[planId]);

  return url.toString();
}
