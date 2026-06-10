import { getPlanResponseLimit } from "@/lib/plan-limits";

export const MONTHLY_LIMIT_EXCEEDED_MESSAGE =
  "Voce atingiu o limite mensal do seu plano. Aguarde a renovacao do ciclo ou altere seu plano.";

export const SUBSCRIPTION_INACTIVE_MESSAGE = "Sua assinatura nao esta ativa no momento.";
export const SUBSCRIPTION_PAST_DUE_MESSAGE = "Atualize o pagamento para continuar usando o AtendeZap IA.";
export const DEMO_LIMIT_EXCEEDED_MESSAGE = "Voce atingiu o limite de testes gratuitos por enquanto. Crie uma conta para continuar usando.";
export const TOO_MANY_ATTEMPTS_MESSAGE = "Muitas tentativas em pouco tempo. Tente novamente depois.";
export const TEMPORARY_AI_ERROR_MESSAGE = "Nao foi possivel gerar a resposta agora. Tente novamente em instantes.";

export type UsageSubscription = {
  id?: string | null;
  plan?: string | null;
  plan_name?: string | null;
  status?: string | null;
  subscription_status?: string | null;
  monthly_limit?: number | null;
  current_period_start?: string | null;
  current_period_end?: string | null;
  provider_subscription_id?: string | null;
  stripe_subscription_id?: string | null;
};

export type UsageCycle = {
  periodStart: string;
  periodEnd: string;
  source: "subscription" | "calendar_month";
};

export function getSubscriptionPlanName(subscription?: UsageSubscription | null) {
  return subscription?.plan || subscription?.plan_name || null;
}

export function getSubscriptionStatus(subscription?: UsageSubscription | null) {
  return subscription?.subscription_status || subscription?.status || null;
}

export function isUsableSubscriptionStatus(status?: string | null) {
  const normalized = status?.trim().toLowerCase();
  return normalized === "active" || normalized === "trialing" || normalized === "trial";
}

export function subscriptionBlockMessage(status?: string | null, planName?: string | null) {
  const normalized = status?.trim().toLowerCase();
  const hasPaidPlan = Boolean(planName && planName !== "free");
  if (!hasPaidPlan || normalized === "free") return "Escolha um plano para continuar usando.";
  if (normalized === "past_due" || normalized === "unpaid") return SUBSCRIPTION_PAST_DUE_MESSAGE;
  return SUBSCRIPTION_INACTIVE_MESSAGE;
}

export function getUsageLimit(subscription?: UsageSubscription | null) {
  const status = getSubscriptionStatus(subscription);
  const planName = getSubscriptionPlanName(subscription);
  if (isUsableSubscriptionStatus(status) && subscription?.monthly_limit) {
    return subscription.monthly_limit;
  }
  return getPlanResponseLimit(planName, status);
}

export function getUsageCycle(subscription?: UsageSubscription | null, now = new Date()): UsageCycle {
  if (subscription?.current_period_start && subscription.current_period_end) {
    return {
      periodStart: new Date(subscription.current_period_start).toISOString(),
      periodEnd: new Date(subscription.current_period_end).toISOString(),
      source: "subscription"
    };
  }

  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  return {
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
    source: "calendar_month"
  };
}

export function getUsageSnapshot(used: number, limit: number, cycle: UsageCycle) {
  const safeUsed = Math.max(used, 0);
  const safeLimit = Math.max(limit, 0);
  const remaining = Math.max(safeLimit - safeUsed, 0);
  const percent = safeLimit > 0 ? Math.min(100, Math.round((safeUsed / safeLimit) * 100)) : 0;

  return {
    used: safeUsed,
    limit: safeLimit,
    remaining,
    percent,
    periodStart: cycle.periodStart,
    periodEnd: cycle.periodEnd,
    cycleSource: cycle.source,
    nearLimit: percent >= 80 && safeUsed < safeLimit,
    reachedLimit: safeLimit > 0 && safeUsed >= safeLimit
  };
}
