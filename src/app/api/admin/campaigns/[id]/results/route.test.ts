import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  insertPayload: null as Record<string, unknown> | null
}));

vi.mock("@/lib/admin", () => ({
  requireAdmin: mocks.requireAdmin
}));

vi.mock("@/lib/rate-limit", () => ({
  assertRequestSize: vi.fn(),
  enforceRateLimit: vi.fn()
}));

vi.mock("@/lib/logger", () => ({
  serverLog: vi.fn()
}));

vi.mock("@/lib/events", () => ({
  logEvent: vi.fn()
}));

function createAdminSupabase() {
  const chain = {
    insert: vi.fn((payload: Record<string, unknown>) => {
      mocks.insertPayload = payload;
      return chain;
    }),
    select: vi.fn(() => chain),
    single: vi.fn(async () => ({ data: mocks.insertPayload, error: null })),
    eq: vi.fn(() => chain),
    order: vi.fn(async () => ({ data: [], error: null }))
  };
  return { from: vi.fn(() => chain) };
}

describe("POST /api/admin/campaigns/[id]/results", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.insertPayload = null;
    mocks.requireAdmin.mockReset().mockResolvedValue({
      user: { id: "admin-id", email: "admin@example.com" },
      supabase: createAdminSupabase()
    });
  });

  it("admin registra resultado e calcula custo por lead", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/admin/campaigns/33333333-3333-4333-8333-333333333333/results", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({ leads: 10, signups: 2, subscriptions: 1, spend_amount: 100 })
      }),
      { params: Promise.resolve({ id: "33333333-3333-4333-8333-333333333333" }) }
    );

    expect(response.status).toBe(201);
    expect(mocks.insertPayload).toMatchObject({
      campaign_id: "33333333-3333-4333-8333-333333333333",
      leads: 10,
      cost_per_lead: 10,
      cost_per_signup: 50,
      cost_per_subscription: 100
    });
  });

  it("valores negativos sao rejeitados", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/admin/campaigns/33333333-3333-4333-8333-333333333333/results", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({ leads: -1, spend_amount: 100 })
      }),
      { params: Promise.resolve({ id: "33333333-3333-4333-8333-333333333333" }) }
    );

    expect(response.status).toBe(400);
    expect(mocks.insertPayload).toBeNull();
  });
});
