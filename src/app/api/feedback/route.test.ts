import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  getSupabaseAdmin: vi.fn(),
  requireAdmin: vi.fn(),
  insertFeedback: vi.fn(),
  updateFeedback: vi.fn()
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mocks.createClient
}));

vi.mock("@/lib/rate-limit", () => ({
  assertRequestSize: vi.fn(),
  enforceRateLimit: vi.fn(async () => ({ ip: "127.0.0.1" }))
}));

vi.mock("@/lib/logger", () => ({
  serverLog: vi.fn()
}));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseAdmin: mocks.getSupabaseAdmin
}));

vi.mock("@/lib/admin", () => ({
  requireAdmin: mocks.requireAdmin
}));

function createInsertQuery() {
  return {
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: mocks.insertFeedback
      }))
    }))
  };
}

describe("POST /api/feedback", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    mocks.createClient.mockReset();
    mocks.getSupabaseAdmin.mockReset().mockReturnValue({
      from: vi.fn(() => createInsertQuery())
    });
    mocks.insertFeedback.mockReset().mockResolvedValue({ data: { id: "feedback_1" }, error: null });
  });

  it("retorna 400 para mensagem curta", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "cliente@example.com",
          type: "bug",
          message: "bug"
        })
      })
    );

    expect(response.status).toBe(400);
  });

  it("exige e-mail quando nao ha usuario autenticado", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "dificuldade_uso",
          message: "Nao entendi como configurar o atendimento."
        })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("e-mail");
  });

  it("salva feedback publico valido", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Cliente Teste",
          email: "Cliente@Example.com",
          type: "sugestao",
          message: "Seria bom explicar melhor o limite mensal.",
          page: "dashboard"
        })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(mocks.insertFeedback).toHaveBeenCalled();
  });

  it("associa user_id quando ha sessao", async () => {
    mocks.createClient.mockReturnValue({
      auth: {
        getUser: vi.fn(async () => ({
          data: {
            user: {
              id: "11111111-1111-4111-8111-111111111111",
              email: "cliente@example.com",
              user_metadata: { name: "Cliente Logado" }
            }
          },
          error: null
        }))
      }
    });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({
          type: "bug",
          message: "O botao de checkout nao abriu para mim."
        })
      })
    );

    expect(response.status).toBe(200);
  });
});

describe("PATCH /api/feedback", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.updateFeedback.mockReset().mockResolvedValue({ error: null });
    mocks.requireAdmin.mockReset().mockResolvedValue({
      user: { id: "admin-id" },
      supabase: {
        from: vi.fn(() => ({
          update: vi.fn(() => ({
            eq: mocks.updateFeedback
          }))
        }))
      }
    });
  });

  it("permite admin marcar feedback como resolvido", async () => {
    const { PATCH } = await import("./route");
    const response = await PATCH(
      new Request("https://app.example.test/api/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({
          id: "11111111-1111-4111-8111-111111111111",
          status: "resolved"
        })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("resolved");
    expect(mocks.requireAdmin).toHaveBeenCalled();
  });
});
