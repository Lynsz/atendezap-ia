import { expect, test } from "@playwright/test";

test("landing da campanha pos-1.1 e responsiva, clara e registra eventos seguros", async ({ page }) => {
  const appEvents: Array<Record<string, unknown>> = [];
  const consoleErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.route("**/api/events", async (route) => {
    const payload = route.request().postDataJSON() as Record<string, unknown>;
    appEvents.push(payload);
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });

  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto(
    "/?utm_source=instagram&utm_medium=organic&utm_campaign=post_1_1_small_campaign&utm_content=story_01"
  );

  expect(response?.status()).toBe(200);
  await expect(page.getByText(/gera respostas para voc[eê] copiar, ajustar e enviar/i).first()).toBeVisible();
  await expect(page.getByText(/n[aã]o envia mensagens automaticamente no WhatsApp/i).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Criar minha conta/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Testar demo gr[aá]tis/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Termos/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Privacidade/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Suporte/i }).first()).toBeVisible();

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  expect(await page.locator("[data-nextjs-dialog]").count()).toBe(0);

  await expect.poll(() => appEvents.some((event) => event.event_name === "campaign_landing_viewed")).toBe(true);
  const landingEvent = appEvents.find((event) => event.event_name === "campaign_landing_viewed");
  expect(landingEvent?.metadata).toMatchObject({
    utm_source: "instagram",
    utm_medium: "organic",
    utm_campaign: "post_1_1_small_campaign",
    utm_content: "story_01"
  });

  await page.getByRole("link", { name: /Criar minha conta/i }).first().click();
  await expect(page).toHaveURL(/\/cadastro/);
  await expect.poll(() => appEvents.some((event) => event.event_name === "campaign_signup_clicked")).toBe(true);

  for (const event of appEvents) {
    const serialized = JSON.stringify(event);
    expect(serialized).not.toMatch(/customerQuestion|generatedAnswer|cliente@example\.com|4242424242424242|OPENAI_API_KEY/);
  }
  expect(consoleErrors).toEqual([]);
});
