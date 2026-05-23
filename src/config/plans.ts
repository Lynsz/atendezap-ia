export type PlanId = "starter" | "pro" | "premium";

export type SaasPlan = {
  id: PlanId;
  name: string;
  description: string;
  priceEnv: string;
  promoPriceEnv?: string;
  firstMonthCouponEnv?: string;
  monthlyPrice: number;
  monthlyPriceLabel: string;
  firstMonthPrice?: number;
  firstMonthPriceLabel?: string;
  recurringPriceLabel?: string;
  responseLimit: number;
  features: string[];
  badge: string;
  recommended?: boolean;
};

export const SAAS_PLANS: Record<PlanId, SaasPlan> = {
  starter: {
    id: "starter",
    name: "Starter",
    description: "Para começar com IA no atendimento, com limite mensal menor e uso leve.",
    priceEnv: "STRIPE_PRICE_STARTER",
    monthlyPrice: 49,
    monthlyPriceLabel: "R$ 49/mês",
    responseLimit: 150,
    badge: "Entrada",
    features: [
      "Até 150 respostas com IA por mês",
      "Cadastro do negócio, serviço ou atividade",
      "Geração de respostas com IA",
      "Dashboard",
      "Histórico básico",
      "Modelos básicos de respostas"
    ]
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "Melhor custo-benefício para quem atende clientes todos os dias e precisa de mais respostas mensais.",
    priceEnv: "STRIPE_PRICE_PRO",
    promoPriceEnv: "STRIPE_PRICE_PRO_FIRST_MONTH_29",
    firstMonthCouponEnv: "STRIPE_PRO_FIRST_MONTH_COUPON_ID",
    monthlyPrice: 97,
    monthlyPriceLabel: "R$ 97/mês",
    firstMonthPrice: 29,
    firstMonthPriceLabel: "R$ 29 no primeiro mês",
    recurringPriceLabel: "Depois, R$ 97/mês",
    responseLimit: 600,
    badge: "Mais recomendado",
    recommended: true,
    features: [
      "Até 600 respostas com IA por mês",
      "Tudo do Starter",
      "Histórico completo",
      "Organização de clientes",
      "Respostas mais personalizadas",
      "Modelos por tipo de atendimento",
      "Acesso a melhorias futuras",
      "Prioridade nas atualizações"
    ]
  },
  premium: {
    id: "premium",
    name: "Premium",
    description: "Para quem tem volume maior e precisa de mais limite mensal para atendimentos frequentes.",
    priceEnv: "STRIPE_PRICE_PREMIUM",
    monthlyPrice: 197,
    monthlyPriceLabel: "R$ 197/mês",
    responseLimit: 2000,
    badge: "Alto volume",
    features: [
      "Até 2.000 respostas com IA por mês",
      "Tudo do Pro",
      "Biblioteca premium de respostas",
      "Modelos avançados para vendas, suporte, cobrança e pós-venda",
      "Acesso antecipado a novas funções",
      "Suporte prioritário assíncrono",
      "Bônus de onboarding gravado"
    ]
  }
};

export const PLAN_IDS = Object.keys(SAAS_PLANS) as PlanId[];

export function getSaasPlan(planId: string | null | undefined) {
  if (!planId) return null;
  return SAAS_PLANS[planId as PlanId] ?? null;
}

export function isPlanId(planId: string | null | undefined): planId is PlanId {
  return Boolean(planId && planId in SAAS_PLANS);
}

export function planPriceForFirstCharge(plan: SaasPlan, shouldApplyFirstMonthOffer: boolean) {
  return shouldApplyFirstMonthOffer && plan.firstMonthPrice ? plan.firstMonthPrice : plan.monthlyPrice;
}
