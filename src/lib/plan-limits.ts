import { SAAS_PLANS } from "@/config/plans";

export const PLAN_RESPONSE_LIMITS: Record<string, number> = {
  free: 30,
  trial: 30,
  inicial: SAAS_PLANS.starter.responseLimit,
  starter: SAAS_PLANS.starter.responseLimit,
  pro: SAAS_PLANS.pro.responseLimit,
  premium: SAAS_PLANS.premium.responseLimit
};

export function getPlanResponseLimit(planName?: string | null, status?: string | null) {
  const normalizedPlan = planName?.trim().toLowerCase() || "";
  const normalizedStatus = status?.trim().toLowerCase() || "";

  if (normalizedStatus === "trial") return PLAN_RESPONSE_LIMITS.trial;
  if (normalizedStatus && normalizedStatus !== "active") return PLAN_RESPONSE_LIMITS.free;
  return PLAN_RESPONSE_LIMITS[normalizedPlan] ?? PLAN_RESPONSE_LIMITS.free;
}
