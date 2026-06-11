import { describe, expect, it } from "vitest";
import { businessTypeOptions } from "@/lib/ai/business-templates";
import { filterWhatsAppTemplates, getRecommendedWhatsAppTemplates, whatsappTemplates } from "./whatsapp-templates";

describe("whatsapp templates catalog", () => {
  it("carrega pelo menos 5 templates por nicho", () => {
    for (const businessType of businessTypeOptions) {
      expect(whatsappTemplates.filter((template) => template.businessType === businessType).length).toBeGreaterThanOrEqual(5);
    }
  });

  it("cada template tem id, categoria, titulo e conteudo", () => {
    for (const template of whatsappTemplates) {
      expect(template.id).toBeTruthy();
      expect(template.niche).toBeTruthy();
      expect(template.category).toBeTruthy();
      expect(template.title).toBeTruthy();
      expect(template.content).toBeTruthy();
      expect(template.content).not.toMatch(/preco fixo|prazo exato/i);
    }
  });

  it("filtra por nicho", () => {
    const templates = filterWhatsAppTemplates({ businessType: "Delivery" });
    expect(templates.length).toBeGreaterThanOrEqual(5);
    expect(templates.every((template) => template.businessType === "Delivery")).toBe(true);
  });

  it("filtra por categoria", () => {
    const templates = filterWhatsAppTemplates({ category: "Pagamento" });
    expect(templates.length).toBeGreaterThan(0);
    expect(templates.every((template) => template.category === "Pagamento")).toBe(true);
  });

  it("busca por texto", () => {
    const templates = filterWhatsAppTemplates({ search: "garantia" });
    expect(templates.some((template) => template.title.toLowerCase().includes("garantia") || template.content.toLowerCase().includes("garantia"))).toBe(true);
  });

  it("recomenda templates conforme business_type", () => {
    const templates = getRecommendedWhatsAppTemplates("Estetica", 3);
    expect(templates).toHaveLength(3);
    expect(templates.every((template) => template.businessType === "Estetica")).toBe(true);
  });

  it("expoe os nichos minimos em slug", () => {
    expect(new Set(whatsappTemplates.map((template) => template.niche))).toEqual(
      new Set(["delivery", "estetica", "restaurante", "loja", "assistencia_tecnica", "prestador_servico", "autonomo", "geral"])
    );
  });
});
