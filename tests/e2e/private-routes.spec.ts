import { expect, test } from "@playwright/test";

test.describe("protecao sem login", () => {
  for (const path of ["/dashboard", "/dashboard/biblioteca", "/assinatura", "/admin"]) {
    test(`${path} redireciona ou bloqueia acesso anonimo`, async ({ page }) => {
      await page.goto(path);

      const currentUrl = page.url();
      const redirectedToLogin = currentUrl.includes("/login") && currentUrl.includes("redirectTo");
      const body = page.locator("body");

      if (!redirectedToLogin) {
        await expect(body).toContainText(/login|Entrar|e-mail|Acesso|restrito|Faça login/i);
        await expect(body).not.toContainText(/Métricas|Leads capturados|Assinaturas|Histórico de respostas/i);
      }
    });
  }

  const privateApis = [
    { path: "/api/ai/generate-response", method: "post" as const, body: { customerQuestion: "Oi" } },
    { path: "/api/ai/response-feedback", method: "post" as const, body: { responseId: "22222222-2222-4222-8222-222222222222", rating: "positive" } },
    { path: "/api/saved-responses", method: "get" as const },
    { path: "/api/saved-responses", method: "post" as const, body: { content: "Resposta" } },
    { path: "/api/stripe/create-checkout-session", method: "post" as const, body: { planId: "starter" } },
    { path: "/api/stripe/create-portal-session", method: "post" as const, body: {} },
    { path: "/api/admin/overview", method: "get" as const },
    { path: "/api/admin/metrics", method: "get" as const },
    { path: "/api/admin/campaign-report", method: "get" as const },
    { path: "/api/admin/leads", method: "get" as const },
    { path: "/api/admin/subscriptions", method: "get" as const },
    { path: "/api/admin/export-leads", method: "get" as const }
  ];

  for (const api of privateApis) {
    test(`${api.method.toUpperCase()} ${api.path} bloqueia sem sessao`, async ({ request }) => {
      const response =
        api.method === "post"
          ? await request.post(api.path, { data: api.body })
          : await request.get(api.path);

      expect([401, 403, 404]).toContain(response.status());
      if (api.path === "/api/admin/overview" || api.path === "/api/admin/metrics" || api.path === "/api/admin/campaign-report" || !api.path.startsWith("/api/admin/")) {
        expect([401, 403]).toContain(response.status());
      }
    });
  }
});
