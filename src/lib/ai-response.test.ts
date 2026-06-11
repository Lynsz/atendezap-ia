import { afterEach, describe, expect, it } from "vitest";
import { buildCustomerResponsePrompt, generateCustomerResponseWithAi } from "./ai-response";

describe("buildCustomerResponsePrompt", () => {
  const originalOpenAIKey = process.env.OPENAI_API_KEY;

  afterEach(() => {
    if (originalOpenAIKey) {
      process.env.OPENAI_API_KEY = originalOpenAIKey;
    } else {
      delete process.env.OPENAI_API_KEY;
    }
  });

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
    expect(prompt).toContain("Tipo de negocio: Estetica");
    expect(prompt).toContain("Tom: Acolhedor");
  });

  it("instructs the model not to invent price or confirm scheduling", () => {
    const prompt = buildCustomerResponsePrompt(baseInput);

    expect(prompt).toContain("Nao invente preco");
    expect(prompt).toContain("Nao confirme agendamento");
  });

  it("uses safe fallbacks when business context is incomplete", () => {
    const prompt = buildCustomerResponsePrompt({
      customerQuestion: "Qual o valor?",
      responseType: "atendimento",
      businessData: {
        business_name: "",
        business_type: "",
        brand_tone: "",
        description: ""
      }
    });

    expect(prompt).toContain("Nome do negocio: seu negocio");
    expect(prompt).toContain("Tipo de negocio: atendimento");
    expect(prompt).toContain("Tom: educado e profissional");
  });

  it("fails with a friendly error when OPENAI_API_KEY is missing", async () => {
    delete process.env.OPENAI_API_KEY;

    await expect(generateCustomerResponseWithAi(baseInput)).rejects.toMatchObject({
      message: "A chave da OpenAI não está configurada neste ambiente.",
      status: 500
    });
  });
});
