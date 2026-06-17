import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  insert: vi.fn()
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseAdmin: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: mocks.insert
    }))
  }))
}));

vi.mock("@/lib/logger", async () => {
  const actual = await vi.importActual<typeof import("@/lib/logger")>("@/lib/logger");
  return {
    ...actual,
    serverLog: vi.fn()
  };
});

describe("logEvent", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.insert.mockReset().mockResolvedValue({ error: null });
  });

  it("descarta metadados sensiveis antes de persistir eventos internos", async () => {
    const { logEvent } = await import("./events");

    await logEvent("first_response_generated", {
      source: "dashboard",
      plan: "pro",
      usage_count: 3,
      email: "cliente@example.com",
      phone: "11999999999",
      customerQuestion: "Meu pedido atrasou?",
      generatedAnswer: "Sinto muito pelo atraso.",
      token: "secret-token",
      stripe_customer_id: "cus_123",
      payment_method: "card"
    });

    expect(mocks.insert).toHaveBeenCalledWith({
      event_name: "first_response_generated",
      metadata: {
        source: "dashboard",
        plan: "pro",
        usage_count: 3
      }
    });
  });
});
