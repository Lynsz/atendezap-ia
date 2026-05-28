import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));

function readDashboardSource() {
  return readFileSync(join(repoRoot, "src/components/pages/SaasDashboardPage.tsx"), "utf8");
}

describe("dashboard de ativacao", () => {
  it("mantem checklist de primeiros passos para usuario novo", () => {
    const source = readDashboardSource();

    expect(source).toContain("Primeiros passos");
    expect(source).toContain("Concluir onboarding");
    expect(source).toContain("Gerar primeira resposta");
    expect(source).toContain("Copiar uma resposta");
    expect(source).toContain("Salvar uma resposta útil");
    expect(source).toContain("Ver templates prontos");
    expect(source).toContain("Marcar uma resposta como favorita");
    expect(source).toContain("Conhecer os planos");
  });

  it("mantem orientacao para primeira resposta e proximos passos", () => {
    const source = readDashboardSource();

    expect(source).toContain("Comece gerando sua primeira resposta");
    expect(source).toContain("Digite uma pergunta comum que seus clientes fazem no WhatsApp");
    expect(source).toContain("Qual o valor?");
    expect(source).toContain("Vocês atendem hoje?");
    expect(source).toContain("Tem entrega?");
    expect(source).toContain("Quais formas de pagamento?");
    expect(source).toContain("Como faço para agendar?");
    expect(source).toContain("Próximos passos");
  });

  it("usa eventos de ativacao sem nomes de campos sensiveis", () => {
    const source = readDashboardSource();

    for (const eventName of [
      "activation_onboarding_completed",
      "activation_first_response_generated",
      "activation_response_copied",
      "activation_response_saved",
      "activation_template_viewed",
      "activation_template_saved",
      "activation_favorite_created",
      "activation_pricing_viewed"
    ]) {
      expect(source).toContain(eventName);
    }

    expect(source).not.toContain("activation_customer_question");
    expect(source).not.toContain("activation_generated_answer");
  });
});
