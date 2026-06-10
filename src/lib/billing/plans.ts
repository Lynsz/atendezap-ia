export type BillingPlanId = "free" | "starter" | "pro" | "premium";
export type PaidBillingPlanId = Exclude<BillingPlanId, "free">;

export type BillingPlan = {
  id: BillingPlanId;
  name: string;
  description: string;
  monthlyLimit: number;
  priceLabel: string;
  features: string[];
  stripePriceIdEnvName?: string;
  recommended?: boolean;
  note?: string;
};

export const BILLING_PLANS: Record<BillingPlanId, BillingPlan> = {
  free: {
    id: "free",
    name: "Free",
    description: "Para testar o produto",
    monthlyLimit: 20,
    priceLabel: "R$ 0",
    features: ["20 respostas com IA por mes", "Dashboard basico", "Biblioteca de respostas salvas"]
  },
  starter: {
    id: "starter",
    name: "Starter",
    description: "Para quem atende poucos clientes",
    monthlyLimit: 100,
    priceLabel: "R$ 49/mes",
    stripePriceIdEnvName: "STRIPE_PRICE_STARTER",
    features: ["100 respostas com IA por mes", "Contexto do negocio", "Historico e biblioteca"]
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "Para quem atende clientes todos os dias",
    monthlyLimit: 500,
    priceLabel: "R$ 97/mes",
    stripePriceIdEnvName: "STRIPE_PRICE_PRO",
    recommended: true,
    note: "Primeiro mes por R$ 29 para novos usuarios",
    features: ["500 respostas com IA por mes", "Tudo do Starter", "Templates por tipo de atendimento", "Prioridade nas melhorias"]
  },
  premium: {
    id: "premium",
    name: "Premium",
    description: "Para negocios com maior volume de atendimento",
    monthlyLimit: 1500,
    priceLabel: "R$ 197/mes",
    stripePriceIdEnvName: "STRIPE_PRICE_PREMIUM",
    features: ["1.500 respostas com IA por mes", "Tudo do Pro", "Maior limite mensal", "Suporte prioritario assincrono"]
  }
};

export const PAID_BILLING_PLAN_IDS: PaidBillingPlanId[] = ["starter", "pro", "premium"];

export function getBillingPlan(planId?: string | null) {
  if (!planId) return null;
  return BILLING_PLANS[planId.trim().toLowerCase() as BillingPlanId] ?? null;
}

export function getBillingPlanLimit(planId?: string | null) {
  return getBillingPlan(planId)?.monthlyLimit ?? BILLING_PLANS.free.monthlyLimit;
}
