import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

function readRepoFile(relativePath: string) {
  return readFileSync(join(repoRoot, relativePath), "utf8");
}

describe("prontidao para beta controlado", () => {
  it("landing explica que nao envia WhatsApp automaticamente", () => {
    const landing = readRepoFile("src/app/page.tsx");

    expect(landing).toContain("O AtendeZap IA gera respostas para você copiar, ajustar e enviar. Ele não envia mensagens automaticamente no WhatsApp.");
    expect(landing).toContain('href="/cadastro"');
    expect(landing).toContain('href="/demo"');
  });

  it("dashboard orienta usuario novo e mostra checklist sem depender de dados sensiveis", () => {
    const dashboard = readRepoFile("src/components/pages/SaasDashboardPage.tsx");

    expect(dashboard).toContain("Gere sua primeira resposta");
    expect(dashboard).toContain("Cole aqui uma mensagem que um cliente mandaria no WhatsApp.");
    expect(dashboard).toContain("Qual o valor?");
    expect(dashboard).toContain("Vocês atendem hoje?");
    expect(dashboard).toContain("Tem entrega?");
    expect(dashboard).toContain("Como faço para agendar?");
    expect(dashboard).toContain("Quais formas de pagamento?");
    expect(dashboard).toContain("Concluir onboarding");
    expect(dashboard).toContain("Gerar primeira resposta");
    expect(dashboard).toContain("Copiar uma resposta");
    expect(dashboard).toContain("Salvar uma resposta útil");
    expect(dashboard).toContain("Testar um template");
    expect(dashboard).toContain("Abrir biblioteca");
    expect(dashboard).toContain("Ver planos");
  });

  it("feedback de IA aparece apos resposta com aviso de revisao", () => {
    const dashboard = readRepoFile("src/components/pages/SaasDashboardPage.tsx");

    expect(dashboard).toContain("Revise a resposta antes de enviar ao cliente.");
    expect(dashboard).toContain("Essa resposta foi útil?");
    expect(dashboard).toContain("O que poderia melhorar?");
    expect(dashboard).not.toContain("generatedAnswer, question");
  });

  it("admin tem bloco beta protegido por rotas admin", () => {
    const adminPage = readRepoFile("src/components/admin/AdminDashboardPage.tsx");
    const metricsRoute = readRepoFile("src/app/api/admin/metrics/route.ts");
    const overviewRoute = readRepoFile("src/app/api/admin/overview/route.ts");

    expect(adminPage).toContain("Acompanhamento do beta controlado");
    expect(adminPage).toContain("Muitos usuarios sem onboarding.");
    expect(metricsRoute).toContain("requireAdmin(request)");
    expect(overviewRoute).toContain("requireAdmin(request)");
  });

  it("status nao imprime valores de secrets", () => {
    const statusPage = readRepoFile("src/app/status/page.tsx");
    const healthRoute = readRepoFile("src/app/api/health/route.ts");

    expect(statusPage).toContain("Status do sistema");
    expect(statusPage).toContain("sem expor valores de variaveis, tokens ou dados internos");
    expect(healthRoute).not.toMatch(/process\.env\.[A-Z0-9_]+[^)]*}/);
    expect(statusPage).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(statusPage).not.toContain("STRIPE_WEBHOOK_SECRET");
  });
});
