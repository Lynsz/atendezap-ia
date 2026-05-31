import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  insertPayload: null as Record<string, unknown> | null,
  filters: [] as Array<[string, string]>
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

function selectChain(data: unknown[] = []) {
  const chain = {
    select: vi.fn(() => chain),
    eq: vi.fn((key: string, value: string) => {
      mocks.filters.push([key, value]);
      return chain;
    }),
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
        ...mocks.insertPayload
      },
      error: null
    }))
  };
  return chain;
}

describe("/api/admin/product-insights", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.insertPayload = null;
    mocks.filters = [];
    mocks.requireAdmin.mockReset().mockResolvedValue({
      user: { id: "admin-id", email: "admin@example.com" },
      supabase: { from: vi.fn(() => selectChain([])) }
    });
  });

  it("usuario comum nao acessa insights admin", async () => {
    mocks.requireAdmin.mockRejectedValueOnce(new AppError("Acesso restrito a administradores.", 403));
    const { GET } = await import("./route");
    const response = await GET(new Request("https://app.example.test/api/admin/product-insights"));

    expect(response.status).toBe(403);
  });

  it("filtros funcionam", async () => {
    const { GET } = await import("./route");
    const response = await GET(new Request("https://app.example.test/api/admin/product-insights?type=bug&severity=critical&status=new&impact_area=billing"));

    expect(response.status).toBe(200);
    expect(mocks.filters).toEqual([
      ["type", "bug"],
      ["severity", "critical"],
      ["status", "new"],
      ["impact_area", "billing"]
    ]);
  });

  it("admin cria insight", async () => {
    mocks.requireAdmin.mockResolvedValueOnce({
      user: { id: "admin-id", email: "admin@example.com" },
      supabase: { from: vi.fn(() => insertChain()) }
    });
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/admin/product-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({ source: "manual", type: "bug", category: "Checkout", title: "Checkout falhou", severity: "critical", status: "new", impact_area: "billing" })
      })
    );

    expect(response.status).toBe(201);
    expect(mocks.insertPayload).toMatchObject({ source: "manual", type: "bug", severity: "critical", status: "new", impact_area: "billing" });
  });

  it("type invalido e rejeitado", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/admin/product-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({ source: "manual", type: "idea", category: "Produto", title: "Nova ideia" })
      })
    );

    expect(response.status).toBe(400);
    expect(mocks.insertPayload).toBeNull();
  });
});
