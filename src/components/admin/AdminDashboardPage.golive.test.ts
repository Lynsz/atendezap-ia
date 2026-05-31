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
    expect(source).toContain("Resumo 72h");
    expect(source).toContain("Health check");
    expect(source).toContain("Primeiras respostas hoje");
    expect(source).toContain("Decisao recomendada");
    expect(source).toContain("Falhas de webhook hoje");
    expect(source).toContain("Incidentes recentes");
    expect(source).toContain("Nao disponivel");
    expect(source).not.toContain("customer_question");
    expect(source).not.toContain("generated_answer");
    expect(source).not.toContain("payment_method");
  });
});
