import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";

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

function selectChain(data: unknown[]) {
  const chain = {
    select: vi.fn(() => chain),
    order: vi.fn(() => chain),
    limit: vi.fn(async () => ({ data, error: null }))
  };
  return chain;
}

function insertChain() {
  const chain = {
    insert: vi.fn((payload: Record<string, unknown>) => {
      mocks.insertPayload = payload;
      return chain;
    }),
    select: vi.fn(() => chain),
    single: vi.fn(async () => ({
      data: {
        id: "33333333-3333-4333-8333-333333333333",
        name: "Teste Meta",
        channel: "Meta Ads",
        objective: "Leads"
      },
      error: null
    }))
  };
  return chain;
}

function createAdminSupabase() {
  return {
    from: vi.fn((table: string) => {
      if (table === "campaign_experiments") return selectChain([]);
      return selectChain([]);
    })
  };
}

describe("/api/admin/campaigns", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.insertPayload = null;
    mocks.requireAdmin.mockReset().mockResolvedValue({
      user: { id: "admin-id", email: "admin@example.com" },
      supabase: createAdminSupabase()
    });
  });

  it("usuario comum nao acessa campanhas admin", async () => {
    mocks.requireAdmin.mockRejectedValueOnce(new AppError("Acesso restrito a administradores.", 403));
    const { GET } = await import("./route");
    const response = await GET(new Request("https://app.example.test/api/admin/campaigns"));

    expect(response.status).toBe(403);
  });

  it("admin lista campanhas com comparacoes", async () => {
    const { GET } = await import("./route");
    const response = await GET(new Request("https://app.example.test/api/admin/campaigns", { headers: { Authorization: "Bearer token" } }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ campaigns: [], nicheSummary: [], channelSummary: [] });
  });

  it("admin cria campanha", async () => {
    const supabase = {
      from: vi.fn(() => insertChain())
    };
    mocks.requireAdmin.mockResolvedValueOnce({
      user: { id: "admin-id", email: "admin@example.com" },
      supabase
    });
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({ name: "Teste Meta", channel: "Meta Ads", objective: "Validar delivery", status: "planned" })
      })
    );

    expect(response.status).toBe(201);
    expect(mocks.insertPayload).toMatchObject({ name: "Teste Meta", channel: "Meta Ads", objective: "Validar delivery", status: "planned" });
  });

  it("status invalido e rejeitado", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({ name: "Teste Meta", channel: "Meta Ads", objective: "Validar delivery", status: "done" })
      })
    );

    expect(response.status).toBe(400);
    expect(mocks.insertPayload).toBeNull();
  });
});
