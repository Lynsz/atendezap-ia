import { expect, test } from "@playwright/test";

test("demo publica gera resposta ou fallback controlado", async ({ page }) => {
  await page.goto("/demo");
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("atendezap_ia_utm_attribution_v1")))
    .toContain("demo_page");

  await page.locator("select").first().selectOption("Delivery");
  await page.locator("select").nth(1).selectOption("Direto");
  await page.locator("button").filter({ hasText: "Qual o valor" }).click();
  await expect(page.locator("textarea")).toHaveValue(/Qual o valor/i);

  await page.getByRole("button", { name: /Gerar resposta de exemplo/i }).click();

  await expect(page.locator("article").filter({ hasText: /Resposta gerada/i })).toContainText(/Oi|Ola|Claro|entrega|resposta/i);
  await expect(page.getByRole("link", { name: /Criar conta/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Ver planos/i })).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/Application error|Unhandled Runtime Error/i);
});
