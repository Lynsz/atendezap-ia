import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/rate-limit", () => ({
  assertRequestSize: vi.fn(),
  enforceRateLimit: vi.fn(async () => ({ ip: "127.0.0.1" }))
}));

vi.mock("@/lib/logger", () => ({
  serverLog: vi.fn()
}));

describe("POST /api/demo/generate-response", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("retorna fallback controlado sem OPENAI_API_KEY", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/demo/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: "Tem entrega?",
          businessType: "Delivery",
          tone: "Direto"
        })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.answer).toContain("Tem entrega?");
    expect(body.mode).toBe("fallback_without_openai_key");
  });

  it("retorna 400 para pergunta vazia", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/demo/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: "",
          businessType: "Delivery",
          tone: "Direto"
        })
      })
    );

    expect(response.status).toBe(400);
  });

  it("retorna 400 para pergunta muito grande", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/demo/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: "a".repeat(281),
          businessType: "Delivery",
          tone: "Direto"
        })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("Pergunta muito longa");
  });

  it("inclui template do nicho no prompt da demo", async () => {
    const { buildDemoPrompt } = await import("./route");
    const prompt = buildDemoPrompt("Quanto tempo demora?", "Assistencia tecnica", "Direto");

    expect(prompt).toContain("Template do nicho");
    expect(prompt).toContain("Quanto custa para avaliar?");
    expect(prompt).toContain("Nao confirme agendamento");
  });
});
