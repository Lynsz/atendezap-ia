import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  tableFilters: [] as Array<{ table: string; column: string; value: unknown }>,
  insertPayload: null as Record<string, unknown> | null,
  existingRequest: null as Record<string, unknown> | null,
  rows: [
    {
      id: "33333333-3333-4333-8333-333333333333",
      user_id: "11111111-1111-4111-8111-111111111111",
      type: "export",
      status: "pending",
      notes: null,
      created_at: "2026-05-28T12:00:00.000Z",
      updated_at: "2026-05-28T12:00:00.000Z"
    }
  ] as Record<string, unknown>[]
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

type QueryChain = {
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  in: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  maybeSingle: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  then: (resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown) => unknown;
};

function createChain(table: string) {
  const chain = {} as QueryChain;
  chain.select = vi.fn(() => chain);
  chain.eq = vi.fn((column: string, value: unknown) => {
    mocks.tableFilters.push({ table, column, value });
    return chain;
  });
  chain.in = vi.fn((column: string, value: unknown) => {
    mocks.tableFilters.push({ table, column, value });
    return chain;
  });
  chain.order = vi.fn(() => chain);
  chain.limit = vi.fn(() => chain);
  chain.maybeSingle = vi.fn(async () => ({ data: mocks.existingRequest, error: null }));
  chain.single = vi.fn(async () => ({
    data: mocks.insertPayload
      ? {
          id: "44444444-4444-4444-8444-444444444444",
          ...mocks.insertPayload,
          created_at: "2026-05-28T12:00:00.000Z",
          updated_at: "2026-05-28T12:00:00.000Z"
        }
      : null,
    error: null
  }));
  chain.insert = vi.fn((payload: Record<string, unknown>) => {
    mocks.insertPayload = payload;
    return chain;
  });
  chain.then = (resolve) => resolve({ data: mocks.rows, error: null });
  return chain;
}

function createSupabaseMock() {
  return {
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: { id: "11111111-1111-4111-8111-111111111111" } },
        error: null
      }))
    },
    from: vi.fn((table: string) => {
      return createChain(table);
    })
  };
}

describe("/api/data-requests", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    mocks.tableFilters = [];
    mocks.insertPayload = null;
    mocks.existingRequest = null;
    mocks.createClient.mockReset().mockReturnValue(createSupabaseMock());
  });

  it("bloqueia sem sessao", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/data-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "export" })
      })
    );

    expect(response.status).toBe(401);
  });

  it("lista apenas solicitacoes do usuario autenticado", async () => {
    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://app.example.test/api/data-requests", {
        headers: { Authorization: "Bearer token" }
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.dataRequests).toHaveLength(1);
    expect(mocks.tableFilters).toContainEqual({
      table: "data_requests",
      column: "user_id",
      value: "11111111-1111-4111-8111-111111111111"
    });
  });

  it("cria solicitacao de exportacao usando user_id da sessao", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/data-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token"
        },
        body: JSON.stringify({ type: "export", user_id: "99999999-9999-4999-8999-999999999999" })
      })
    );

    expect(response.status).toBe(400);
    expect(mocks.insertPayload).toBeNull();

    const validResponse = await POST(
      new Request("https://app.example.test/api/data-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token"
        },
        body: JSON.stringify({ type: "export" })
      })
    );

    expect(validResponse.status).toBe(201);
    expect(mocks.insertPayload).toMatchObject({
      user_id: "11111111-1111-4111-8111-111111111111",
      type: "export",
      status: "pending",
      notes: null
    });
  });

  it("cria solicitacao de exclusao e rejeita tipo invalido", async () => {
    const { POST } = await import("./route");
    const invalidResponse = await POST(
      new Request("https://app.example.test/api/data-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token"
        },
        body: JSON.stringify({ type: "download" })
      })
    );

    expect(invalidResponse.status).toBe(400);

    const validResponse = await POST(
      new Request("https://app.example.test/api/data-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token"
        },
        body: JSON.stringify({ type: "deletion" })
      })
    );

    expect(validResponse.status).toBe(201);
    expect(mocks.insertPayload).toMatchObject({ type: "deletion" });
  });

  it("reaproveita solicitacao pendente do mesmo tipo", async () => {
    mocks.existingRequest = mocks.rows[0];
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/data-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token"
        },
        body: JSON.stringify({ type: "export" })
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.alreadyPending).toBe(true);
    expect(mocks.insertPayload).toBeNull();
  });
});
