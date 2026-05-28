import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  updatePayload: null as Record<string, unknown> | null,
  tableFilters: [] as Array<{ table: string; column: string; value: unknown }>
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
  const dataRequests = [
    {
      id: "33333333-3333-4333-8333-333333333333",
      user_id: "11111111-1111-4111-8111-111111111111",
      type: "export",
      status: "pending",
      notes: null,
      created_at: "2026-05-28T12:00:00.000Z",
      updated_at: "2026-05-28T12:00:00.000Z"
    }
  ];
  const profiles = [{ id: "11111111-1111-4111-8111-111111111111", email: "cliente@example.com" }];

  return {
    from: vi.fn((table: string) => {
      const chain = {
        select: vi.fn(() => chain),
        order: vi.fn(() => chain),
        limit: vi.fn(() => chain),
        in: vi.fn((column: string, value: unknown) => {
          mocks.tableFilters.push({ table, column, value });
          return chain;
        }),
        update: vi.fn((payload: Record<string, unknown>) => {
          mocks.updatePayload = payload;
          return chain;
        }),
        eq: vi.fn((column: string, value: unknown) => {
          mocks.tableFilters.push({ table, column, value });
          return chain;
        }),
        maybeSingle: vi.fn(async () => ({
          data: {
            ...dataRequests[0],
            ...mocks.updatePayload
          },
          error: null
        })),
        then: (resolve: (value: { data: unknown[]; error: null }) => unknown) => resolve({ data: table === "profiles" ? profiles : dataRequests, error: null })
      };
      return chain;
    })
  };
}

describe("/api/admin/data-requests", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.updatePayload = null;
    mocks.tableFilters = [];
    mocks.requireAdmin.mockReset().mockResolvedValue({
      user: { id: "admin-id", email: "admin@example.com" },
      supabase: createAdminSupabase()
    });
  });

  it("lista solicitacoes para admin com e-mail mascarado", async () => {
    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://app.example.test/api/admin/data-requests", {
        headers: { Authorization: "Bearer token" }
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.dataRequests[0]).toMatchObject({
      type: "export",
      status: "pending",
      user_email_masked: "cl***@example.com"
    });
    expect(body.dataRequests[0].user_email).toBeUndefined();
  });

  it("bloqueia usuario comum", async () => {
    mocks.requireAdmin.mockRejectedValueOnce(new AppError("Acesso restrito a administradores.", 403));
    const { GET } = await import("./route");
    const response = await GET(new Request("https://app.example.test/api/admin/data-requests"));

    expect(response.status).toBe(403);
  });

  it("atualiza status e nota interna", async () => {
    const { PATCH } = await import("./route");
    const response = await PATCH(
      new Request("https://app.example.test/api/admin/data-requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token"
        },
        body: JSON.stringify({
          id: "33333333-3333-4333-8333-333333333333",
          status: "completed",
          notes: "Exportacao enviada por canal seguro."
        })
      })
    );

    expect(response.status).toBe(200);
    expect(mocks.updatePayload).toMatchObject({
      status: "completed",
      notes: "Exportacao enviada por canal seguro."
    });
  });

  it("rejeita status invalido", async () => {
    const { PATCH } = await import("./route");
    const response = await PATCH(
      new Request("https://app.example.test/api/admin/data-requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token"
        },
        body: JSON.stringify({
          id: "33333333-3333-4333-8333-333333333333",
          status: "done"
        })
      })
    );

    expect(response.status).toBe(400);
    expect(mocks.updatePayload).toBeNull();
  });
});
