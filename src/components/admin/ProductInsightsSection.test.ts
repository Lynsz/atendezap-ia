import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));

function readRepoFile(relativePath: string) {
  return readFileSync(join(repoRoot, relativePath), "utf8");
}

describe("ProductInsightsSection", () => {
  it("mantem cards, filtros e estado vazio", () => {
    const component = readRepoFile("src/components/admin/ProductInsightsSection.tsx");

    expect(component).toContain("Insights de Produto");
    expect(component).toContain("Bugs críticos");
    expect(component).toContain("Problemas de IA");
    expect(component).toContain("Motivos de churn");
    expect(component).toContain("Nenhum insight encontrado.");
    expect(component).toContain("Filtrar insights");
  });

  it("permite criar insight a partir de suporte e feedback sem copiar conteudo completo", () => {
    const component = readRepoFile("src/components/admin/ProductInsightsSection.tsx");

    expect(component).toContain("Insight criado a partir de solicitação de suporte");
    expect(component).toContain("Insight criado a partir de feedback de usuário");
    expect(component).toContain("Não cole conversa completa");
  });
});
