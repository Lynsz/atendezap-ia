export const PLAN_RESPONSE_LIMITS: Record<string, number> = {
  free: 30,
  trial: 30,
  inicial: 300,
  pro: 1000,
  premium: 3000
};

export function getPlanResponseLimit(planName?: string | null, status?: string | null) {
  const normalizedPlan = planName?.trim().toLowerCase() || "";
  const normalizedStatus = status?.trim().toLowerCase() || "";

  if (normalizedStatus === "trial") return PLAN_RESPONSE_LIMITS.trial;
  return PLAN_RESPONSE_LIMITS[normalizedPlan] ?? PLAN_RESPONSE_LIMITS.free;
}
