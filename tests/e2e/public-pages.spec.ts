import { expect, test } from "@playwright/test";

const publicPages = [
  { path: "/", text: /AtendeZap IA/i, cta: /Baixar|Comecar|Criar|Teste/i },
  { path: "/atendimento-whatsapp-ia", text: /AtendeZap IA|WhatsApp/i, cta: /Testar demo gratis|Ver planos|Baixar guia gratuito/i },
  { path: "/ebook", text: /guia gratuito/i, cta: /Baixar guia gratuito/i },
  { path: "/ebook/obrigado", text: /guia gratuito/i, cta: /Acessar guia gratuito/i },
  { path: "/ebook/guia", text: /WhatsApp/i, cta: /AtendeZap IA|precos|demo/i },
  { path: "/demo", text: /Demonstracao gratuita|Teste como o AtendeZap IA/i, cta: /Gerar resposta de exemplo/i },
  { path: "/para/delivery", text: /Delivery|respostas rapidas/i, cta: /Testar demo gratis|Criar minha conta/i },
  { path: "/para/estetica", text: /Estetica|respostas mais claras/i, cta: /Testar demo gratis|Criar minha conta/i },
  { path: "/para/assistencia-tecnica", text: /Assistencia tecnica|orcamentos/i, cta: /Testar demo gratis|Criar minha conta/i },
  { path: "/para/lojas", text: /Lojas|vendem pelo WhatsApp/i, cta: /Testar demo gratis|Criar minha conta/i },
  { path: "/para/restaurantes", text: /Restaurantes|cardapio/i, cta: /Testar demo gratis|Criar minha conta/i },
  { path: "/para/prestadores-de-servico", text: /Prestadores de servico|orcamento/i, cta: /Testar demo gratis|Criar minha conta/i },
  { path: "/para/autonomos", text: /Autonomos|trabalhando sozinho/i, cta: /Testar demo gratis|Criar minha conta/i },
  { path: "/feedback", text: /Ajude a melhorar|Enviar feedback/i, cta: /Enviar feedback/i },
  { path: "/suporte", text: /Suporte|Como podemos ajudar/i, cta: /Enviar suporte|Privacidade|Termos/i },
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

  test("sitemap inclui paginas publicas e exclui areas privadas", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(body).toContain("<loc>http://localhost:3000/</loc>");
    expect(body).toContain("<loc>http://localhost:3000/demo</loc>");
    expect(body).toContain("<loc>http://localhost:3000/para/delivery</loc>");
    expect(body).not.toContain("/dashboard");
    expect(body).not.toContain("/admin");
    expect(body).not.toContain("/assinatura");
    expect(body).not.toContain("/api/");
  });

  test("robots bloqueia rotas privadas e aponta para sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(body).toContain("Disallow: /dashboard");
    expect(body).toContain("Disallow: /admin");
    expect(body).toContain("Disallow: /assinatura");
    expect(body).toContain("Disallow: /api");
    expect(body).toContain("Sitemap: http://localhost:3000/sitemap.xml");
  });

  test("demo nao exibe stack trace quando API retorna erro interno", async ({ page }) => {
    await page.route("**/api/demo/generate-response", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Error: segredo interno\\n    at generateResponse (/app/src/internal.ts:10:5)" })
      });
    });

    await page.goto("/demo");
    await page.getByRole("button", { name: /Gerar resposta de exemplo/i }).click();

    await expect(page.getByText(/Nao foi possivel gerar a resposta|Não foi possível gerar a resposta/i)).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/internal\.ts|at generateResponse|segredo interno/i);
  });

  test("nicho invalido retorna 404", async ({ page }) => {
    const response = await page.goto("/para/nicho-invalido");
    expect(response?.status()).toBe(404);
  });

  test("landing delivery da campanha pos-1.2 mantem CTA, Pro R$ 29 e copy sem automacao", async ({ page }) => {
    const response = await page.goto(
      "/para/delivery?utm_source=meta&utm_medium=paid_social&utm_campaign=post_12_campaign_01&utm_content=delivery_criativo_01"
    );

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("link", { name: /Testar demo gratis/i }).first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Primeiro mes por R$ 29");
    await expect(page.locator("body")).toContainText(/nao envia mensagens automaticamente pelo WhatsApp/i);
  });
});
