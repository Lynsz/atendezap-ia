import { expect, test } from "@playwright/test";

test("funil do ebook preserva UTMs e redireciona para obrigado", async ({ page }) => {
  let submittedPayload: Record<string, unknown> | null = null;

  await page.route("**/api/ebook-lead", async (route) => {
    submittedPayload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        redirectTo: "/ebook/obrigado",
        message: "Lead cadastrado para teste e2e.",
        emailStatus: "skipped"
      })
    });
  });

  await page.goto("/ebook?utm_source=meta&utm_medium=cpc&utm_campaign=e2e&utm_content=criativo&utm_term=whatsapp");
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("atendezap_ia_utm_attribution_v1")))
    .toContain("ebook_page");
  await page.locator('input[name="name"]').fill("Cliente E2E");
  await page.locator('input[name="email"]').fill("cliente.e2e@example.com");
  await page.locator('select[name="business_type"]').selectOption({ index: 1 });
  await page.getByRole("button", { name: /Baixar guia gratuito/i }).click();

  await expect(page).toHaveURL(/\/ebook\/obrigado$/);
  const payload = submittedPayload as unknown as Record<string, unknown>;
  expect(payload).toMatchObject({
    name: "Cliente E2E",
    email: "cliente.e2e@example.com",
    utm_source: "meta",
    utm_medium: "cpc",
    utm_campaign: "e2e",
    utm_content: "criativo",
    utm_term: "whatsapp"
  });
  expect(String(payload.business_type)).toContain("Prestador");

  await expect(page.getByRole("link", { name: /Acessar guia gratuito/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Testar o AtendeZap IA agora/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Conhecer o AtendeZap IA/i })).toBeVisible();
});
