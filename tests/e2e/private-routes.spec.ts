import { expect, test } from "@playwright/test";

test.describe("protecao sem login", () => {
  for (const path of ["/dashboard", "/onboarding", "/dashboard/biblioteca", "/dashboard/templates", "/dashboard/privacidade", "/dashboard/ajuda", "/assinatura", "/admin"]) {
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
    { path: "/api/saved-responses/33333333-3333-4333-8333-333333333333/duplicate", method: "post" as const, body: {} },
    { path: "/api/data-requests", method: "get" as const },
    { path: "/api/data-requests", method: "post" as const, body: { type: "export" } },
    { path: "/api/support", method: "get" as const },
    { path: "/api/cancellation-feedback", method: "post" as const, body: { reason: "preco" } },
    { path: "/api/stripe/create-checkout-session", method: "post" as const, body: { planId: "starter" } },
    { path: "/api/stripe/create-portal-session", method: "post" as const, body: {} },
    { path: "/api/admin/overview", method: "get" as const },
    { path: "/api/admin/metrics", method: "get" as const },
    { path: "/api/admin/campaign-report", method: "get" as const },
    { path: "/api/admin/campaigns", method: "get" as const },
    { path: "/api/admin/campaigns", method: "post" as const, body: { name: "Teste", channel: "Meta Ads", objective: "Leads" } },
    { path: "/api/admin/campaigns/33333333-3333-4333-8333-333333333333", method: "patch" as const, body: { status: "running" } },
    { path: "/api/admin/campaigns/33333333-3333-4333-8333-333333333333/results", method: "post" as const, body: { leads: 1 } },
    { path: "/api/admin/campaign-results/33333333-3333-4333-8333-333333333333", method: "patch" as const, body: { leads: 2 } },
    { path: "/api/admin/product-insights", method: "get" as const },
    { path: "/api/admin/product-insights", method: "post" as const, body: { source: "manual", type: "bug", category: "Checkout", title: "Checkout falhou" } },
    { path: "/api/admin/product-insights/33333333-3333-4333-8333-333333333333", method: "patch" as const, body: { status: "planned" } },
    { path: "/api/admin/data-requests", method: "get" as const },
    { path: "/api/admin/support/33333333-3333-4333-8333-333333333333", method: "patch" as const, body: { status: "resolved" } },
    { path: "/api/admin/leads", method: "get" as const },
    { path: "/api/admin/subscriptions", method: "get" as const },
    { path: "/api/admin/export-leads", method: "get" as const }
  ];

  for (const api of privateApis) {
    test(`${api.method.toUpperCase()} ${api.path} bloqueia sem sessao`, async ({ request }) => {
      const response =
        api.method === "post"
          ? await request.post(api.path, { data: api.body })
          : api.method === "patch"
            ? await request.patch(api.path, { data: api.body })
          : await request.get(api.path);

      expect([401, 403, 404]).toContain(response.status());
      if (api.path === "/api/admin/overview" || api.path === "/api/admin/metrics" || api.path === "/api/admin/campaign-report" || !api.path.startsWith("/api/admin/")) {
        expect([401, 403]).toContain(response.status());
      }
    });
  }
});
