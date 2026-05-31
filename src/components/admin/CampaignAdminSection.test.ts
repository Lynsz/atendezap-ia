import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));

function readRepoFile(relativePath: string) {
  return readFileSync(join(repoRoot, relativePath), "utf8");
}

describe("CampaignAdminSection", () => {
  it("mantem estados vazios e blocos de comparacao na pagina", () => {
    const component = readRepoFile("src/components/admin/CampaignAdminSection.tsx");

    expect(component).toContain("Nenhuma campanha registrada.");
    expect(component).toContain("Sem dados suficientes para comparar nichos.");
    expect(component).toContain("Sem dados suficientes para comparar canais.");
    expect(component).toContain("Resultados por nicho");
    expect(component).toContain("Resultados por canal");
  });

  it("mantem aviso para nao registrar dados sensiveis", () => {
    const component = readRepoFile("src/components/admin/CampaignAdminSection.tsx");

    expect(component).toContain("Não registre dados pessoais");
    expect(component).toContain("Não integra com plataformas de anúncio");
  });
});
