import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));

function readAdminSource() {
  return readFileSync(join(repoRoot, "src/components/admin/AdminDashboardPage.tsx"), "utf8");
}

describe("AdminDashboardPage go-live", () => {
  it("mantem secao agregada de go-live sem dados sensiveis", () => {
    const source = readAdminSource();

    expect(source).toContain("Go-Live");
    expect(source).toContain("Acompanhamento controlado");
    expect(source).toContain("Release 1.2");
    expect(source).toContain("Deploy controlado preparado");
    expect(source).toContain("Campanha pos-1.2");
    expect(source).toContain("Bloqueada ate smoke aprovado");
    expect(source).toContain("Pos-Deploy 1.2");
    expect(source).toContain("Atencao: validar producao");
    expect(source).toContain("Bugs P0/P1");
    expect(source).toContain("Decisao campanha pos-1.2");
    expect(source).toContain("Bloqueada ate validacao real");
    expect(source).toContain("Resumo 72h");
    expect(source).toContain("Health check");
    expect(source).toContain("Primeiras respostas hoje");
    expect(source).toContain("Decisao recomendada");
    expect(source).toContain("Falhas de webhook hoje");
    expect(source).toContain("Incidentes recentes");
    expect(source).toContain("Nao disponivel");
    expect(source).toContain("Lancamento pequeno");
    expect(source).toContain("Acompanhamento do lancamento pequeno");
    expect(source).toContain("Decisao recomendada");
    expect(source).toContain("Revisar Stripe/pricing/confianca");
    expect(source).not.toContain("customer_question");
    expect(source).not.toContain("generated_answer");
    expect(source).not.toContain("payment_method");
  });

  it("mantem secao agregada de ativacao com diagnostico simples", () => {
    const source = readAdminSource();

    expect(source).toContain("Primeira experiencia e retencao inicial");
    expect(source).toContain("Usuarios novos 7 dias");
    expect(source).toContain("Onboardings concluidos");
    expect(source).toContain("Primeiras respostas");
    expect(source).toContain("Respostas copiadas");
    expect(source).toContain("Respostas salvas");
    expect(source).toContain("Templates salvos");
    expect(source).toContain("Favoritos criados");
    expect(source).toContain("Usuarios ativos 7 dias");
    expect(source).toContain("Revisar clareza do onboarding.");
    expect(source).toContain("Revisar dashboard inicial e exemplos.");
    expect(source).toContain("Revisar utilidade da resposta e CTAs de copiar/salvar.");
    expect(source).toContain("Revisar templates, favoritos e e-mails de ativacao.");
    expect(source).not.toContain("customer_question");
    expect(source).not.toContain("generated_answer");
  });
});
