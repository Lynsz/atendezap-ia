import { describe, expect, it } from "vitest";
import { DEMO_DAILY_LIMIT, getPlanLimitDescription, getPlanResponseLimit } from "@/lib/plan-limits";

describe("getPlanResponseLimit", () => {
  it("aplica os limites mensais do MVP por plano", () => {
    expect(getPlanResponseLimit("free")).toBe(20);
    expect(getPlanResponseLimit("qualquer", "trial")).toBe(20);
    expect(getPlanResponseLimit("Inicial")).toBe(150);
    expect(getPlanResponseLimit("Starter")).toBe(150);
    expect(getPlanResponseLimit("Pro")).toBe(600);
    expect(getPlanResponseLimit("Premium")).toBe(2000);
  });

  it("usa free como fallback seguro", () => {
    expect(getPlanResponseLimit(null, null)).toBe(20);
    expect(getPlanResponseLimit("plano-inexistente")).toBe(20);
  });

  it("expose descricao centralizada de limite e limite da demo", () => {
    expect(getPlanLimitDescription("Pro")).toEqual({ plan: "pro", monthlyResponseLimit: 600 });
    expect(DEMO_DAILY_LIMIT).toBe(6);
  });

  it("nao libera limite pago para assinatura pendente, vencida ou cancelada", () => {
    expect(getPlanResponseLimit("Pro", "pending")).toBe(20);
    expect(getPlanResponseLimit("Pro", "past_due")).toBe(20);
    expect(getPlanResponseLimit("Pro", "unpaid")).toBe(20);
    expect(getPlanResponseLimit("Pro", "incomplete")).toBe(20);
    expect(getPlanResponseLimit("Pro", "incomplete_expired")).toBe(20);
    expect(getPlanResponseLimit("Pro", "paused")).toBe(20);
    expect(getPlanResponseLimit("Premium", "canceled")).toBe(20);
  });
});
