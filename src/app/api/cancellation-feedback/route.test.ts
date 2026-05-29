import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  insertPayload: null as Record<string, unknown> | null
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mocks.createClient
}));

vi.mock("@/lib/rate-limit", () => ({
  assertRequestSize: vi.fn(),
  enforceRateLimit: vi.fn()
}));

vi.mock("@/lib/events", () => ({
  logEvent: vi.fn()
}));

vi.mock("@/lib/logger", () => ({
  serverLog: vi.fn()
}));

function createSupabaseMock() {
  const chain = {
    insert: vi.fn((payload: Record<string, unknown>) => {
      mocks.insertPayload = payload;
      return chain;
    }),
    select: vi.fn(() => chain),
    single: vi.fn(async () => ({
      data: {
        id: "55555555-5555-4555-8555-555555555555",
        reason: mocks.insertPayload?.reason,
        created_at: "2026-05-29T12:00:00.000Z"
      },
      error: null
    }))
  };

  return {
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: { id: "11111111-1111-4111-8111-111111111111" } },
        error: null
      }))
    },
    from: vi.fn(() => chain)
  };
}

describe("POST /api/cancellation-feedback", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    mocks.insertPayload = null;
    mocks.createClient.mockReset().mockReturnValue(createSupabaseMock());
  });

  it("exige login", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/cancellation-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "preco" })
      })
    );

    expect(response.status).toBe(401);
    expect(mocks.insertPayload).toBeNull();
  });

  it("cria feedback usando user_id da sessao", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/cancellation-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token"
        },
        body: JSON.stringify({
          subscriptionId: "22222222-2222-4222-8222-222222222222",
          reason: "usei_pouco",
          comment: "Nao usei tanto quanto esperava.",
          user_id: "99999999-9999-4999-8999-999999999999"
        })
      })
    );

    expect(response.status).toBe(400);
    expect(mocks.insertPayload).toBeNull();

    const validResponse = await POST(
      new Request("https://app.example.test/api/cancellation-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token"
        },
        body: JSON.stringify({
          subscriptionId: "22222222-2222-4222-8222-222222222222",
          reason: "usei_pouco",
          comment: "Nao usei tanto quanto esperava."
        })
      })
    );

    expect(validResponse.status).toBe(201);
    expect(mocks.insertPayload).toMatchObject({
      user_id: "11111111-1111-4111-8111-111111111111",
      subscription_id: "22222222-2222-4222-8222-222222222222",
      reason: "usei_pouco",
      comment: "Nao usei tanto quanto esperava."
    });
  });

  it("rejeita motivo invalido", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/cancellation-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token"
        },
        body: JSON.stringify({ reason: "cartao" })
      })
    );

    expect(response.status).toBe(400);
    expect(mocks.insertPayload).toBeNull();
  });
});
