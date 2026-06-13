import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  getSupabaseAdmin: vi.fn(),
  sendTransactionalEmail: vi.fn(),
  insertPayload: null as Record<string, unknown> | null,
  tableFilters: [] as Array<{ table: string; column: string; value: unknown }>,
  rows: [
    {
      id: "33333333-3333-4333-8333-333333333333",
      user_id: "11111111-1111-4111-8111-111111111111",
      email: "user@example.com",
      category: "Duvida",
      subject: "Como uso?",
      message: "Preciso de ajuda para usar.",
      status: "pending",
      priority: "medium",
      admin_notes: null,
      created_at: "2026-05-28T12:00:00.000Z",
      updated_at: "2026-05-28T12:00:00.000Z"
    }
  ] as Record<string, unknown>[]
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mocks.createClient
}));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseAdmin: mocks.getSupabaseAdmin
}));

vi.mock("@/lib/email", () => ({
  sendTransactionalEmail: mocks.sendTransactionalEmail
}));

vi.mock("@/lib/rate-limit", () => ({
  assertRequestSize: vi.fn(),
  enforceRateLimit: vi.fn()
}));

vi.mock("@/lib/events", () => ({
  logEvent: vi.fn()
}));

vi.mock("@/lib/analytics/server", () => ({
  trackServerAppEvent: vi.fn()
}));

vi.mock("@/lib/logger", () => ({
  serverLog: vi.fn()
}));

function createAuthSupabase(user: { id: string; email?: string | null } | null = { id: "11111111-1111-4111-8111-111111111111", email: "user@example.com" }) {
  const chain = {
    select: vi.fn(() => chain),
    eq: vi.fn((column: string, value: unknown) => {
      mocks.tableFilters.push({ table: "support_requests", column, value });
      return chain;
    }),
    order: vi.fn(() => chain),
    limit: vi.fn(() => chain),
    then: (resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown) => resolve({ data: mocks.rows, error: null })
  };

  return {
    auth: {
      getUser: vi.fn(async () => ({ data: { user }, error: null }))
    },
    from: vi.fn(() => chain)
  };
}

function createAdminSupabase() {
  const chain = {
    insert: vi.fn((payload: Record<string, unknown>) => {
      mocks.insertPayload = payload;
      return chain;
    }),
    select: vi.fn(() => chain),
    single: vi.fn(async () => ({
      data: {
        id: "44444444-4444-4444-8444-444444444444",
        ...mocks.insertPayload,
        created_at: "2026-05-28T12:00:00.000Z",
        updated_at: "2026-05-28T12:00:00.000Z"
      },
      error: null
    }))
  };

  return { from: vi.fn(() => chain) };
}

describe("/api/support", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    process.env.SUPPORT_EMAIL = "support@example.com";
    mocks.insertPayload = null;
    mocks.tableFilters = [];
    mocks.createClient.mockReset().mockReturnValue(createAuthSupabase());
    mocks.getSupabaseAdmin.mockReset().mockReturnValue(createAdminSupabase());
    mocks.sendTransactionalEmail.mockReset().mockResolvedValue({ status: "sent", provider: "resend" });
  });

  it("usuario logado cria solicitacao usando user_id da sessao", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token"
        },
        body: JSON.stringify({
          email: "fake@example.com",
          category: "Geracao de resposta",
          subject: "IA nao gera",
          message: "A geracao de resposta falhou agora.",
          user_id: "99999999-9999-4999-8999-999999999999"
        })
      }) as never
    );

    expect(response.status).toBe(400);
    expect(mocks.insertPayload).toBeNull();

    const validResponse = await POST(
      new Request("https://app.example.test/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token"
        },
        body: JSON.stringify({
          category: "Geracao de resposta",
          subject: "IA nao gera",
          message: "A geracao de resposta falhou agora."
        })
      }) as never
    );

    expect(validResponse.status).toBe(201);
    expect(mocks.insertPayload).toMatchObject({
      user_id: "11111111-1111-4111-8111-111111111111",
      email: "user@example.com",
      category: "Geracao de resposta",
      status: "pending",
      priority: "high"
    });
  });

  it("visitante cria solicitacao com e-mail", async () => {
    mocks.createClient.mockReturnValue(createAuthSupabase(null));
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "visitante@example.com",
          category: "Duvida",
          subject: "Tenho uma duvida",
          message: "Gostaria de entender melhor os planos."
        })
      }) as never
    );

    expect(response.status).toBe(201);
    expect(mocks.insertPayload).toMatchObject({
      user_id: null,
      email: "visitante@example.com",
      category: "Duvida"
    });
  });

  it("aceita categoria especifica do beta", async () => {
    mocks.createClient.mockReturnValue(createAuthSupabase(null));
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "beta@example.com",
          category: "problema no beta",
          subject: "Fluxo confuso",
          message: "Tive dificuldade para entender o primeiro passo."
        })
      }) as never
    );

    expect(response.status).toBe(201);
    expect(mocks.insertPayload).toMatchObject({
      email: "beta@example.com",
      category: "problema no beta",
      priority: "medium"
    });
  });

  it("visitante sem e-mail recebe erro", async () => {
    mocks.createClient.mockReturnValue(createAuthSupabase(null));
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "Duvida",
          subject: "Tenho uma duvida",
          message: "Gostaria de entender melhor os planos."
        })
      }) as never
    );

    expect(response.status).toBe(400);
  });

  it("usuario lista apenas suas solicitacoes", async () => {
    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://app.example.test/api/support", {
        headers: { Authorization: "Bearer token" }
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.supportRequests).toHaveLength(1);
    expect(body.supportRequests[0]).not.toHaveProperty("admin_notes");
    expect(mocks.tableFilters).toContainEqual({
      table: "support_requests",
      column: "user_id",
      value: "11111111-1111-4111-8111-111111111111"
    });
  });

  it("rejeita categoria invalida e mensagem longa", async () => {
    const { POST } = await import("./route");
    const invalidCategory = await POST(
      new Request("https://app.example.test/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "visitante@example.com",
          category: "CRM",
          subject: "Assunto",
          message: "Mensagem valida para teste."
        })
      }) as never
    );

    expect(invalidCategory.status).toBe(400);

    const longMessage = await POST(
      new Request("https://app.example.test/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "visitante@example.com",
          category: "Bug",
          subject: "Assunto",
          message: "x".repeat(3001)
        })
      }) as never
    );

    expect(longMessage.status).toBe(400);
  });

  it("falha no e-mail nao quebra criacao", async () => {
    mocks.sendTransactionalEmail.mockResolvedValue({ status: "failed", provider: "resend", error: "falhou" });
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "visitante@example.com",
          category: "Bug",
          subject: "Bug no dashboard",
          message: "Encontrei um erro ao abrir o dashboard."
        })
      }) as never
    );

    expect(response.status).toBe(201);
  });
});
