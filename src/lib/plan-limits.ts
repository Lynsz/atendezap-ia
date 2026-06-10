import { SAAS_PLANS } from "@/config/plans";

export const FREE_RESPONSE_LIMIT = 20;
export const DEMO_DAILY_LIMIT = 6;
export const DEMO_WINDOW_MS = 10 * 60_000;

export const PLAN_RESPONSE_LIMITS: Record<string, number> = {
  free: FREE_RESPONSE_LIMIT,
  trial: FREE_RESPONSE_LIMIT,
  inicial: SAAS_PLANS.starter.responseLimit,
  starter: SAAS_PLANS.starter.responseLimit,
  pro: SAAS_PLANS.pro.responseLimit,
  premium: SAAS_PLANS.premium.responseLimit
};

export function getPlanResponseLimit(planName?: string | null, status?: string | null) {
  const normalizedPlan = planName?.trim().toLowerCase() || "";
  const normalizedStatus = status?.trim().toLowerCase() || "";

  if ((normalizedStatus === "trial" || normalizedStatus === "trialing") && (!normalizedPlan || normalizedPlan === "free")) return PLAN_RESPONSE_LIMITS.trial;
  if (normalizedStatus && !["active", "trial", "trialing"].includes(normalizedStatus)) return PLAN_RESPONSE_LIMITS.free;
  return PLAN_RESPONSE_LIMITS[normalizedPlan] ?? PLAN_RESPONSE_LIMITS.free;
}

export function getPlanLimitDescription(planName?: string | null, status?: string | null) {
  const normalizedPlan = planName?.trim().toLowerCase() || "free";
  return {
    plan: normalizedPlan,
    monthlyResponseLimit: getPlanResponseLimit(planName, status)
  };
}
