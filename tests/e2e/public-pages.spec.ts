import { expect, test } from "@playwright/test";

const publicPages = [
  { path: "/", text: /AtendeZap IA/i, cta: /Baixar|Comecar|Criar|Teste/i },
  { path: "/ebook", text: /guia gratuito/i, cta: /Baixar guia gratuito/i },
  { path: "/ebook/obrigado", text: /guia gratuito/i, cta: /Acessar guia gratuito/i },
  { path: "/ebook/guia", text: /WhatsApp/i, cta: /AtendeZap IA|precos|demo/i },
  { path: "/demo", text: /Demonstracao gratuita|Teste como o AtendeZap IA/i, cta: /Gerar resposta de exemplo/i },
  { path: "/login", text: /Entrar|login|e-mail/i, cta: /Entrar|acessar/i },
  { path: "/cadastro", text: /Criar|cadastro|conta/i, cta: /Criar|Comecar/i },
  { path: "/termos", text: /Termos/i, cta: /AtendeZap IA|WhatsApp/i },
  { path: "/privacidade", text: /Privacidade|Politica/i, cta: /AtendeZap IA|dados/i }
];

test.describe("paginas publicas", () => {
  for (const pageCase of publicPages) {
    test(`${pageCase.path} carrega sem erro visivel`, async ({ page }) => {
      const response = await page.goto(pageCase.path);

      expect(response?.status(), pageCase.path).toBe(200);
      await expect(page.locator("body")).toContainText(pageCase.text);
      await expect(page.locator("body")).toContainText(pageCase.cta);
      await expect(page.locator("body")).not.toContainText(/Application error|Unhandled Runtime Error|404|500/i);
    });
  }

  test("/api/health retorna ok", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.status).toBe("ok");
  });
});
