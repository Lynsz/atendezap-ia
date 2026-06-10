import { describe, expect, it } from "vitest";
import { getUsageCycle, getUsageLimit, getUsageSnapshot, subscriptionBlockMessage } from "@/lib/usage-limits";

describe("usage-limits", () => {
  it("usa ciclo da assinatura quando disponivel", () => {
    const cycle = getUsageCycle({
      current_period_start: "2026-05-10T00:00:00.000Z",
      current_period_end: "2026-06-10T00:00:00.000Z"
    });

    expect(cycle).toEqual({
      periodStart: "2026-05-10T00:00:00.000Z",
      periodEnd: "2026-06-10T00:00:00.000Z",
      source: "subscription"
    });
  });

  it("usa mes calendario como fallback seguro", () => {
    const cycle = getUsageCycle(null, new Date("2026-05-30T12:00:00.000Z"));

    expect(cycle.periodStart).toBe("2026-05-01T00:00:00.000Z");
    expect(cycle.periodEnd).toBe("2026-06-01T00:00:00.000Z");
    expect(cycle.source).toBe("calendar_month");
  });

  it("calcula snapshot de limite mensal", () => {
    const cycle = getUsageCycle(null, new Date("2026-05-30T12:00:00.000Z"));
    expect(getUsageSnapshot(80, 100, cycle)).toMatchObject({
      used: 80,
      limit: 100,
      remaining: 20,
      percent: 80,
      nearLimit: true,
      reachedLimit: false
    });
    expect(getUsageSnapshot(100, 100, cycle)).toMatchObject({ remaining: 0, reachedLimit: true });
  });

  it("mantem mensagens amigaveis por status", () => {
    expect(subscriptionBlockMessage("past_due", "pro")).toContain("pagamento");
    expect(getUsageLimit({ plan: "premium", status: "active" })).toBe(1500);
  });

  it("ignora limite pago quando assinatura nao esta ativa", () => {
    expect(getUsageLimit({ plan: "pro", status: "canceled", monthly_limit: 500 })).toBe(20);
    expect(getUsageLimit({ plan: "pro", status: "unpaid", monthly_limit: 500 })).toBe(20);
    expect(getUsageLimit({ plan: "pro", status: "incomplete", monthly_limit: 500 })).toBe(20);
  });
});
