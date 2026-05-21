import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/rate-limit", () => ({
  assertRequestSize: vi.fn(),
  enforceRateLimit: vi.fn(async () => ({ ip: "127.0.0.1" }))
}));

vi.mock("@/lib/events", () => ({
  logEvent: vi.fn()
}));

vi.mock("@/lib/email", () => ({
  sendEbookDeliveryEmail: vi.fn(async () => ({
    eventType: "ebook_delivery",
    status: "skipped",
    subject: "Guia AtendeZap IA",
    provider: "resend"
  }))
}));

vi.mock("@/lib/logger", () => ({
  serverLog: vi.fn()
}));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseAdmin: vi.fn(() => ({
    from: vi.fn(() => ({
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(async () => ({ data: { id: "lead_1" }, error: null }))
        }))
      })),
      insert: vi.fn(async () => ({ error: null }))
    }))
  }))
}));

describe("POST /api/ebook-lead", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("retorna 400 quando e-mail esta ausente", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/ebook-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Cliente Teste",
          business_type: "Autonomo"
        })
      }) as never
    );

    expect(response.status).toBe(400);
  });

  it("retorna 400 para e-mail invalido", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/ebook-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Cliente Teste",
          email: "email-invalido",
          business_type: "Autonomo"
        })
      }) as never
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("Dados");
    expect(body.details.email[0]).toContain("e-mail valido");
  });
});
