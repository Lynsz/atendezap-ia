import { describe, expect, it } from "vitest";
import { formatBusinessNicheGuidanceForPrompt, getBusinessNiche } from "./business-niche-guidance";
import { buildWhatsappResponsePrompt } from "./build-whatsapp-response-prompt";

describe("buildWhatsappResponsePrompt", () => {
  it("includes business context, tone, response type and short WhatsApp rules", () => {
    const prompt = buildWhatsappResponsePrompt({
      customerQuestion: "Tem horario hoje e qual o valor?",
      responseType: "atendimento",
      businessData: {
        business_name: "Studio Teste",
        business_type: "Estetica",
        business_area: "Beleza",
        brand_tone: "acolhedor",
        products_services: "limpeza de pele",
        common_questions: "preco e horario"
      }
    });

    expect(prompt).toContain("Mensagem do cliente:");
    expect(prompt).toContain("Tipo de resposta:\natendimento");
    expect(prompt).toContain("Nome do negocio: Studio Teste");
    expect(prompt).toContain("Tipo de negocio: Estetica");
    expect(prompt).toContain("Tom: acolhedor");
    expect(prompt).toContain("Template do tipo de atuacao");
    expect(prompt).toContain("Orientacao curta por nicho");
    expect(prompt).toContain("Responda em portugues do Brasil");
    expect(prompt).toContain("Normalmente use entre 1 e 4 frases curtas");
    expect(prompt).toContain("Nao use titulo");
  });

  it("blocks invented commercial details and unsupported confirmations", () => {
    const prompt = buildWhatsappResponsePrompt({
      customerQuestion: "Pode confirmar meu pedido e me dar desconto?",
      responseType: "venda",
      businessData: {
        business_name: "Delivery Teste",
        business_type: "Delivery"
      }
    });

    expect(prompt).toContain("Nao invente preco, desconto, estoque, prazo, entrega, endereco, horario, agenda, disponibilidade, link, garantia, servico ou forma de pagamento");
    expect(prompt).toContain("Nao confirme agendamento, reserva, entrega ou atendimento sem dados suficientes");
    expect(prompt).toContain("Nao confirme pedido ou pagamento sem informacao clara no contexto");
    expect(prompt).toContain("Quando a resposta depender de preco, estoque, prazo, entrega, agenda, endereco ou disponibilidade e essa informacao nao estiver no contexto, nao invente");
  });

  it("adds niche-specific guidance for risky verticals", () => {
    const deliveryPrompt = buildWhatsappResponsePrompt({
      customerQuestion: "Entrega em quanto tempo?",
      responseType: "atendimento",
      businessData: { business_name: "Pizza Teste", business_type: "Delivery" }
    });
    const techPrompt = buildWhatsappResponsePrompt({
      customerQuestion: "Quanto custa consertar?",
      responseType: "orcamento",
      businessData: { business_name: "Tech Teste", business_type: "Assistencia tecnica" }
    });

    expect(deliveryPrompt).toContain("Confirme bairro ou regiao antes de prometer entrega");
    expect(techPrompt).toContain("Nao feche diagnostico sem avaliacao");
    expect(techPrompt).toContain("Nao invente preco, prazo, garantia ou disponibilidade de peca");
  });
});

describe("business niche guidance", () => {
  it("normalizes accents and falls back to geral", () => {
    expect(getBusinessNiche("Assistencia tecnica")).toBe("assistencia_tecnica");
    expect(getBusinessNiche("Prestador de servico")).toBe("prestador_servico");
    expect(getBusinessNiche("tipo desconhecido")).toBe("geral");
  });

  it("formats guidance without customer content", () => {
    const guidance = formatBusinessNicheGuidanceForPrompt("Loja");

    expect(guidance).toContain("Nicho: Loja");
    expect(guidance).toContain("Nao confirme estoque sem informacao");
    expect(guidance).not.toContain("cliente@example.com");
  });
});
