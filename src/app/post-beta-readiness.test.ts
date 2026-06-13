import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { whatsappTemplates } from "@/lib/templates/whatsapp-templates";
import { buildWhatsappResponsePrompt } from "@/lib/ai/build-whatsapp-response-prompt";

const root = process.cwd();

describe("post beta readiness", () => {
  it("mantem onboarding e primeira resposta com textos claros", () => {
    const source = readFileSync(join(root, "src/components/pages/SaasDashboardPage.tsx"), "utf8");

    expect(source).toContain("Nome do seu negócio ou atendimento");
    expect(source).toContain("Tipo de atendimento");
    expect(source).toContain("Tom das respostas");
    expect(source).toContain("Explique rapidamente o que você vende, atende ou oferece");
    expect(source).toContain("Cole aqui uma mensagem que um cliente mandaria no WhatsApp.");
    expect(source).toContain(": \"Gerar resposta\"}");
  });

  it("mantem prompt curto para WhatsApp sem inventar dados sensiveis de atendimento", () => {
    const prompt = buildWhatsappResponsePrompt({
      customerQuestion: "Qual o valor e tem horario hoje?",
      responseType: "atendimento",
      businessData: {
        business_name: "Studio Ana",
        business_type: "Estetica",
        brand_tone: "Simpatico"
      }
    });

    expect(prompt).toContain("mensagem curta, natural e util para WhatsApp");
    expect(prompt).toContain("Nao invente preco, prazo, disponibilidade, estoque, agenda");
    expect(prompt).toContain("prefira uma resposta curta pedindo o detalhe necessario");
    expect(prompt).toContain("sem inventar valores");
  });

  it("mantem exemplos para temas comuns do beta", () => {
    const catalog = whatsappTemplates.map((template) => `${template.category} ${template.title} ${template.content}`).join("\n").toLowerCase();

    for (const term of ["preco", "entrega", "agendamento", "disponibilidade", "pagamento", "orcamento", "horario", "pos-venda"]) {
      expect(catalog).toContain(term);
    }
  });
});
