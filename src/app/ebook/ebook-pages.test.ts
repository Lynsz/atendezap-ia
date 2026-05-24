import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

function readPage(relativePath: string) {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
}

describe("paginas do funil de ebook", () => {
  it("obrigado oferece acesso imediato ao guia e proximos passos", () => {
    const source = readPage("./obrigado/page.tsx");

    expect(source).toContain('href="/ebook/guia"');
    expect(source).toContain("Acessar guia gratuito");
    expect(source).toContain('href="/demo"');
    expect(source).toContain('href="/precos"');
    expect(source).toContain("primeiro m");
  });

  it("guia abre sem login e possui CTAs para demo, conta, planos, termos e privacidade", () => {
    const source = readPage("./guia/page.tsx");

    expect(source).not.toContain("ProtectedRoute");
    expect(source).toContain('href="/demo"');
    expect(source).toContain('href="/cadastro"');
    expect(source).toContain('href="/precos"');
    expect(source).toContain('href="/termos"');
    expect(source).toContain('href="/privacidade"');
  });
});
