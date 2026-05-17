export type PlanId = "starter" | "pro" | "premium";

export type SaasPlan = {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number;
  monthlyPriceLabel: string;
  firstMonthPrice?: number;
  firstMonthPriceLabel?: string;
  recurringPriceLabel?: string;
  responseLimit: number;
  features: string[];
  badge: string;
  recommended?: boolean;
  stripePriceId: string;
  stripeCouponId?: string;
};

function envValue(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return "";
}

export const SAAS_PLANS: Record<PlanId, SaasPlan> = {
  starter: {
    id: "starter",
    name: "Starter",
    description: "Plano de entrada para começar a responder melhor pelo WhatsApp.",
    monthlyPrice: 49,
    monthlyPriceLabel: "R$ 49/mês",
    responseLimit: 150,
    badge: "Entrada",
    stripePriceId: envValue("STRIPE_PRICE_STARTER", "STRIPE_PRICE_STARTER_MONTHLY"),
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
    description: "Plano recomendado para quem atende, vende ou responde clientes pelo WhatsApp todos os dias.",
    monthlyPrice: 97,
    monthlyPriceLabel: "R$ 97/mês",
    firstMonthPrice: 29,
    firstMonthPriceLabel: "R$ 29 no primeiro mês",
    recurringPriceLabel: "Depois, R$ 97/mês",
    responseLimit: 600,
    badge: "Mais recomendado",
    recommended: true,
    stripePriceId: envValue("STRIPE_PRICE_PRO", "STRIPE_PRICE_PRO_MONTHLY"),
    stripeCouponId: envValue("STRIPE_COUPON_PRO_FIRST_MONTH_29", "STRIPE_COUPON_PRO_FIRST_MONTH", "STRIPE_PRICE_PRO_FIRST_MONTH_29"),
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
    description: "Plano completo para maior volume de atendimento e mais recursos.",
    monthlyPrice: 197,
    monthlyPriceLabel: "R$ 197/mês",
    responseLimit: 2000,
    badge: "Alto volume",
    stripePriceId: envValue("STRIPE_PRICE_PREMIUM", "STRIPE_PRICE_PREMIUM_MONTHLY"),
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

export function getSaasPlanByStripePriceId(stripePriceId: string | null | undefined) {
  if (!stripePriceId) return null;
  return PLAN_IDS.map((planId) => SAAS_PLANS[planId]).find((plan) => plan.stripePriceId === stripePriceId) ?? null;
}

export function isPlanId(planId: string | null | undefined): planId is PlanId {
  return Boolean(planId && planId in SAAS_PLANS);
}

export function planPriceForFirstCharge(plan: SaasPlan, shouldApplyFirstMonthOffer: boolean) {
  return shouldApplyFirstMonthOffer && plan.firstMonthPrice ? plan.firstMonthPrice : plan.monthlyPrice;
}
