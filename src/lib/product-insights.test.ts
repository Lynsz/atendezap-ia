import { describe, expect, it } from "vitest";
import {
  createProductInsightSchema,
  getProductInsightDiagnostics,
  summarizeProductInsights,
  updateProductInsightSchema,
  type ProductInsight
} from "./product-insights";

describe("product-insights", () => {
  it("rejeita type, severity, status e impact_area invalidos", () => {
    const base = { source: "manual", category: "Onboarding", title: "Usuário confuso" };

    expect(() => createProductInsightSchema.parse({ ...base, type: "idea" })).toThrow();
    expect(() => createProductInsightSchema.parse({ ...base, type: "bug", severity: "urgent" })).toThrow();
    expect(() => createProductInsightSchema.parse({ ...base, type: "bug", status: "done" })).toThrow();
    expect(() => createProductInsightSchema.parse({ ...base, type: "bug", impact_area: "crm" })).toThrow();
  });

  it("rejeita descricao muito longa", () => {
    expect(() =>
      createProductInsightSchema.parse({
        source: "manual",
        type: "bug",
        category: "Checkout",
        title: "Erro no checkout",
        description: "x".repeat(1801)
      })
    ).toThrow();
  });

  it("aceita update parcial valido", () => {
    expect(updateProductInsightSchema.parse({ status: "planned" })).toEqual({ status: "planned" });
  });

  it("calcula cards de agrupamento sem quebrar sem dados", () => {
    expect(summarizeProductInsights([])).toEqual({
      totalNew: 0,
      criticalBugs: 0,
      onboardingIssues: 0,
      aiIssues: 0,
      featureRequests: 0,
      billingIssues: 0,
      churnReasons: 0,
      campaignLearnings: 0
    });
  });

  it("gera agrupamentos e diagnosticos com dados simulados", () => {
    const insights = [
      { type: "bug", severity: "critical", status: "new", impact_area: "billing", category: "checkout", title: "Checkout falhou", description: null },
      { type: "ai_quality", severity: "high", status: "new", impact_area: "ai_quality", category: "IA", title: "Resposta ruim", description: null },
      { type: "ai_quality", severity: "high", status: "new", impact_area: "ai_quality", category: "IA", title: "Tom ruim", description: null },
      { type: "ai_quality", severity: "high", status: "new", impact_area: "ai_quality", category: "IA", title: "Faltou contexto", description: null },
      { type: "feature_request", severity: "medium", status: "reviewing", impact_area: "usability", category: "WhatsApp", title: "Integração WhatsApp automático", description: null },
      { type: "feature_request", severity: "medium", status: "reviewing", impact_area: "usability", category: "WhatsApp", title: "WhatsApp automatico", description: null }
    ] as ProductInsight[];

    expect(summarizeProductInsights(insights)).toMatchObject({
      totalNew: 4,
      criticalBugs: 1,
      aiIssues: 3,
      featureRequests: 2,
      billingIssues: 1
    });
    expect(getProductInsightDiagnostics(insights)).toContain("Priorizar qualidade das respostas e templates.");
    expect(getProductInsightDiagnostics(insights)).toContain("Reforçar comunicação do escopo atual e avaliar integração futura.");
    expect(getProductInsightDiagnostics(insights)).toContain("Priorizar billing antes de campanhas.");
  });
});
