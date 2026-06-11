import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));

function readDashboardSource() {
  return readFileSync(join(repoRoot, "src/components/pages/SaasDashboardPage.tsx"), "utf8");
}

describe("SaasDashboardPage UX", () => {
  it("mantem estado vazio claro para biblioteca", () => {
    const source = readDashboardSource();

    expect(source).toContain('data-testid="saved-responses-empty-state"');
    expect(source).toContain("Você ainda não salvou respostas.");
    expect(source).toContain("Gere uma resposta no dashboard e salve para reutilizar depois.");
  });

  it("mantem estado de carregamento acessivel na biblioteca", () => {
    const source = readDashboardSource();

    expect(source).toContain('role="status"');
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain("Carregando respostas salvas...");
  });
});
