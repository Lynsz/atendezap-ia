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
    const checklist = readFileSync(join(repoRoot, "src/components/dashboard/first-steps-checklist.tsx"), "utf8");

    expect(checklist).toContain("Primeiros passos");
    expect(checklist).toContain("Comece por aqui");
    expect(source).toContain("Concluir onboarding");
    expect(source).toContain("Gerar primeira resposta");
    expect(source).toContain("Copiar uma resposta");
    expect(source).toContain("Salvar uma resposta útil");
    expect(source).toContain("Testar um template");
    expect(source).toContain("Abrir biblioteca");
    expect(source).toContain("Ver planos");
  });

  it("mantem orientacao para primeira resposta e proximos passos", () => {
    const source = readDashboardSource();

    expect(source).toContain("Gere sua primeira resposta");
    expect(source).toContain("Cole aqui uma mensagem que um cliente mandaria no WhatsApp.");
    expect(source).toContain("Cole aqui a mensagem que seu cliente enviou.");
    expect(source).toContain("Resposta gerada. Revise, ajuste se necessário e copie para enviar manualmente pelo WhatsApp.");
    expect(source).toContain("CUSTOMER_MESSAGE_LIMIT");
    expect(source).toContain("Próximos passos");
  });

  it("usa eventos de ativacao sem nomes de campos sensiveis", () => {
    const source = readDashboardSource();

    for (const eventName of [
      "activation_onboarding_completed",
      "activation_dashboard_viewed",
      "activation_first_response_generated",
      "activation_first_response_copied",
      "activation_first_response_saved",
      "activation_templates_viewed",
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
