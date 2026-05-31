import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  updatePayload: null as Record<string, unknown> | null
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
    update: vi.fn((payload: Record<string, unknown>) => {
      mocks.updatePayload = payload;
      return chain;
    }),
    eq: vi.fn(() => chain),
    select: vi.fn(() => chain),
    maybeSingle: vi.fn(async () => ({
      data: { id: "33333333-3333-4333-8333-333333333333", status: "running", decision: "iterate" },
      error: null
    })),
    delete: vi.fn(() => chain)
  };
  return { from: vi.fn(() => chain) };
}

describe("PATCH /api/admin/campaigns/[id]", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.updatePayload = null;
    mocks.requireAdmin.mockReset().mockResolvedValue({
      user: { id: "admin-id", email: "admin@example.com" },
      supabase: createAdminSupabase()
    });
  });

  it("admin edita campanha", async () => {
    const { PATCH } = await import("./route");
    const response = await PATCH(
      new Request("https://app.example.test/api/admin/campaigns/33333333-3333-4333-8333-333333333333", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({ status: "running", decision: "iterate" })
      }),
      { params: Promise.resolve({ id: "33333333-3333-4333-8333-333333333333" }) }
    );

    expect(response.status).toBe(200);
    expect(mocks.updatePayload).toMatchObject({ status: "running", decision: "iterate" });
  });

  it("decision invalida e rejeitada", async () => {
    const { PATCH } = await import("./route");
    const response = await PATCH(
      new Request("https://app.example.test/api/admin/campaigns/33333333-3333-4333-8333-333333333333", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({ decision: "delete" })
      }),
      { params: Promise.resolve({ id: "33333333-3333-4333-8333-333333333333" }) }
    );

    expect(response.status).toBe(400);
    expect(mocks.updatePayload).toBeNull();
  });
});
