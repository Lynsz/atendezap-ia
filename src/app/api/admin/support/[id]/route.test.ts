import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";

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

function createAdminSupabase() {
  const chain = {
    update: vi.fn((payload: Record<string, unknown>) => {
      mocks.updatePayload = payload;
      return chain;
    }),
    eq: vi.fn(() => chain),
    select: vi.fn(() => chain),
    maybeSingle: vi.fn(async () => ({
      data: {
        id: "33333333-3333-4333-8333-333333333333",
        user_id: "11111111-1111-4111-8111-111111111111",
        email: "user@example.com",
        category: "Bug",
        subject: "Erro",
        message: "Erro no produto",
        status: "in_progress",
        priority: "high",
        admin_notes: "Em analise",
        created_at: "2026-05-28T12:00:00.000Z",
        updated_at: "2026-05-28T12:00:00.000Z"
      },
      error: null
    }))
  };
  return { from: vi.fn(() => chain) };
}

describe("PATCH /api/admin/support/[id]", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.updatePayload = null;
    mocks.requireAdmin.mockReset().mockResolvedValue({
      user: { id: "admin-id", email: "admin@example.com" },
      supabase: createAdminSupabase()
    });
  });

  it("admin altera status e prioridade", async () => {
    const { PATCH } = await import("./route");
    const response = await PATCH(
      new Request("https://app.example.test/api/admin/support/33333333-3333-4333-8333-333333333333", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token"
        },
        body: JSON.stringify({
          status: "in_progress",
          priority: "high",
          admin_notes: "Em analise"
        })
      }),
      { params: Promise.resolve({ id: "33333333-3333-4333-8333-333333333333" }) }
    );

    expect(response.status).toBe(200);
    expect(mocks.updatePayload).toMatchObject({
      status: "in_progress",
      priority: "high",
      admin_notes: "Em analise"
    });
  });

  it("usuario comum nao acessa admin support", async () => {
    mocks.requireAdmin.mockRejectedValueOnce(new AppError("Acesso restrito a administradores.", 403));
    const { PATCH } = await import("./route");
    const response = await PATCH(
      new Request("https://app.example.test/api/admin/support/33333333-3333-4333-8333-333333333333", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" })
      }),
      { params: Promise.resolve({ id: "33333333-3333-4333-8333-333333333333" }) }
    );

    expect(response.status).toBe(403);
  });

  it("rejeita status invalido", async () => {
    const { PATCH } = await import("./route");
    const response = await PATCH(
      new Request("https://app.example.test/api/admin/support/33333333-3333-4333-8333-333333333333", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "done" })
      }),
      { params: Promise.resolve({ id: "33333333-3333-4333-8333-333333333333" }) }
    );

    expect(response.status).toBe(400);
    expect(mocks.updatePayload).toBeNull();
  });
});
