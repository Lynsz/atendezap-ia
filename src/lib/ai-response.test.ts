import { describe, expect, it } from "vitest";
import { buildCustomerResponsePrompt } from "./ai-response";

describe("buildCustomerResponsePrompt", () => {
  const baseInput = {
    customerQuestion: "Tem horario hoje e qual o valor?",
    responseType: "atendimento" as const,
    businessData: {
      business_name: "Studio Teste",
      business_type: "Estetica",
      brand_tone: "Acolhedor",
      products_services: "limpeza de pele"
    }
  };

  it("includes the business template and tone context", () => {
    const prompt = buildCustomerResponsePrompt(baseInput);

    expect(prompt).toContain("Template do tipo de atuacao");
    expect(prompt).toContain("Tipo de atuacao: Estetica");
    expect(prompt).toContain("Tom de voz: Acolhedor");
  });

  it("instructs the model not to invent price or confirm scheduling", () => {
    const prompt = buildCustomerResponsePrompt(baseInput);

    expect(prompt).toContain("Nao inventar preco");
    expect(prompt).toContain("Nao confirmar agendamento");
  });
});
