import { describe, expect, it } from "vitest";
import { getPlanResponseLimit } from "@/lib/plan-limits";

describe("getPlanResponseLimit", () => {
  it("aplica os limites mensais do MVP por plano", () => {
    expect(getPlanResponseLimit("free")).toBe(30);
    expect(getPlanResponseLimit("qualquer", "trial")).toBe(30);
    expect(getPlanResponseLimit("Inicial")).toBe(300);
    expect(getPlanResponseLimit("Pro")).toBe(1000);
    expect(getPlanResponseLimit("Premium")).toBe(3000);
  });

  it("usa free como fallback seguro", () => {
    expect(getPlanResponseLimit(null, null)).toBe(30);
    expect(getPlanResponseLimit("plano-inexistente")).toBe(30);
  });
});
