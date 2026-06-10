import { describe, expect, it } from "vitest";
import { BILLING_PLANS, PAID_BILLING_PLAN_IDS, getBillingPlanLimit } from "@/lib/billing/plans";

describe("billing plans", () => {
  it("centraliza limites e envs dos planos do MVP", () => {
    expect(BILLING_PLANS.free.monthlyLimit).toBe(20);
    expect(BILLING_PLANS.starter.monthlyLimit).toBe(100);
    expect(BILLING_PLANS.pro.monthlyLimit).toBe(500);
    expect(BILLING_PLANS.premium.monthlyLimit).toBe(1500);
    expect(BILLING_PLANS.starter.stripePriceIdEnvName).toBe("STRIPE_PRICE_STARTER");
    expect(BILLING_PLANS.pro.recommended).toBe(true);
    expect(PAID_BILLING_PLAN_IDS).toEqual(["starter", "pro", "premium"]);
  });

  it("usa free como fallback de limite", () => {
    expect(getBillingPlanLimit("desconhecido")).toBe(20);
  });
});
