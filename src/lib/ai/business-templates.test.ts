import { describe, expect, it } from "vitest";
import { getBusinessExamples, getBusinessTemplate } from "./business-templates";

describe("business templates", () => {
  it("returns niche examples for delivery", () => {
    expect(getBusinessExamples("Delivery")).toContain("Vocês entregam no meu bairro?");
  });

  it("mantem exemplos de ativacao por nicho", () => {
    expect(getBusinessExamples("Delivery")).toEqual([
      "Vocês entregam no meu bairro?",
      "Qual o valor da entrega?",
      "Quanto tempo demora?",
      "Aceita Pix?"
    ]);
    expect(getBusinessExamples("Estetica")).toEqual([
      "Tem horário hoje?",
      "Qual o valor?",
      "Como faço para agendar?",
      "Onde fica?"
    ]);
    expect(getBusinessExamples("Assistencia tecnica")).toEqual([
      "Vocês consertam esse modelo?",
      "Quanto custa a avaliação?",
      "Tem garantia?",
      "Quanto tempo demora?"
    ]);
    expect(getBusinessExamples("Loja")).toEqual([
      "Tem esse produto disponível?",
      "Vocês entregam?",
      "Aceita cartão?",
      "Como funciona a troca?"
    ]);
    expect(getBusinessExamples("Restaurante")).toEqual([
      "Tem cardápio?",
      "Faz reserva?",
      "Tem delivery?",
      "Qual o horário de funcionamento?"
    ]);
    expect(getBusinessExamples("Prestador de servico")).toEqual([
      "Quanto fica esse serviço?",
      "Você atende na minha região?",
      "Tem horário essa semana?",
      "Quais formas de pagamento?"
    ]);
    expect(getBusinessExamples("Autonomo")).toEqual([
      "Como funciona seu serviço?",
      "Qual o valor?",
      "Você tem disponibilidade?",
      "O que preciso enviar para orçamento?"
    ]);
  });

  it("normalizes accented business types", () => {
    expect(getBusinessTemplate("Assistência técnica").type).toBe("Assistencia tecnica");
  });

  it("falls back to Outro for unknown business type", () => {
    expect(getBusinessTemplate("Servico muito especifico").type).toBe("Outro");
  });
});
