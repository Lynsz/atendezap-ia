import { afterEach, describe, expect, it, vi } from "vitest";
import { buildCustomerResponsePrompt, generateCustomerResponseWithAi } from "./ai-response";

const mocks = vi.hoisted(() => ({
  completionsCreate: vi.fn()
}));

vi.mock("openai", () => ({
  default: vi.fn(function OpenAI() {
    return {
      chat: {
        completions: {
          create: mocks.completionsCreate
        }
      }
    };
  })
}));

describe("buildCustomerResponsePrompt", () => {
  const originalOpenAIKey = process.env.OPENAI_API_KEY;

  afterEach(() => {
    mocks.completionsCreate.mockReset();
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
    expect(prompt).toContain("preco, prazo, estoque, disponibilidade, endereco, entrega ou agenda");
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
      message: "A geracao de IA nao esta configurada neste ambiente.",
      status: 500
    });
  });

  it("fails instead of using fallback when OpenAI returns an empty answer", async () => {
    process.env.OPENAI_API_KEY = "test-openai-key";
    mocks.completionsCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "   " } }]
    });

    await expect(generateCustomerResponseWithAi(baseInput)).rejects.toMatchObject({
      message: "Nao foi possivel gerar a resposta agora. Tente novamente em instantes.",
      status: 502
    });
  });
});
