import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  usageCount: 30,
  usageLimit: 30,
  subscription: { plan_name: "free", status: "trial", current_period_start: null, current_period_end: null } as Record<string, unknown> | null,
  userProfile: {
    business_name: "Studio Maria",
    business_type: "Estetica",
    tone: "Acolhedor",
    description: "Atendimento de estetica"
  } as Record<string, unknown> | null,
  createClient: vi.fn(),
  generateCustomerResponseWithAi: vi.fn(),
  tableFilters: [] as Array<{ table: string; column: string; value: unknown }>,
  insertPayload: null as Record<string, unknown> | null,
  usageUpdatePayload: null as Record<string, unknown> | null
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mocks.createClient
}));

vi.mock("@/lib/ai-response", () => ({
  generateCustomerResponseWithAi: mocks.generateCustomerResponseWithAi
}));

vi.mock("@/lib/rate-limit", () => ({
  assertRequestSize: vi.fn(),
  enforceRateLimit: vi.fn(async () => ({ ip: "127.0.0.1" }))
}));

vi.mock("@/lib/analytics/server", () => ({
  trackServerAppEvent: vi.fn()
}));

type QueryChain = {
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  gte: ReturnType<typeof vi.fn>;
  lt: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  maybeSingle: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

function createChain(table: string, terminal: () => Promise<Record<string, unknown>>) {
  const chain = {} as QueryChain;
  chain.select = vi.fn(() => chain);
  chain.eq = vi.fn((column: string, value: unknown) => {
      mocks.tableFilters.push({ table, column, value });
      return chain;
    });
  chain.gte = vi.fn(() => chain);
  chain.lt = vi.fn(() => chain);
  chain.order = vi.fn(() => chain);
  chain.limit = vi.fn(() => chain);
  chain.maybeSingle = vi.fn(terminal);
  chain.single = vi.fn(terminal);
  chain.insert = vi.fn((payload: Record<string, unknown>) => {
    if (table === "generated_responses") {
      mocks.insertPayload = payload;
    }
    return chain;
  });
  chain.update = vi.fn((payload: Record<string, unknown>) => {
    if (table === "ai_usage") {
      mocks.usageUpdatePayload = payload;
    }
    return chain;
  });

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
      if (table === "subscriptions") {
        return createChain(table, async () => ({ data: mocks.subscription, error: null }));
      }

      if (table === "generated_responses") {
        const chain = createChain(table, async () => ({
          data: { id: "response_1", user_id: "11111111-1111-4111-8111-111111111111" },
          error: null
        }));
        return chain;
      }

      if (table === "ai_usage") {
        return createChain(table, async () => ({
          data: {
            id: "usage_1",
            user_id: "11111111-1111-4111-8111-111111111111",
            month: "2026-06",
            count: mocks.usageUpdatePayload?.count ?? mocks.usageCount,
            limit: mocks.usageUpdatePayload?.limit ?? mocks.usageLimit
          },
          error: null
        }));
      }

      if (table === "user_profiles") {
        return createChain(table, async () => ({
          data: mocks.userProfile,
          error: null
        }));
      }

      if (table === "businesses") {
        return createChain(table, async () => ({
          data: {
            id: "22222222-2222-4222-8222-222222222222",
            user_id: "11111111-1111-4111-8111-111111111111",
            business_name: "Studio Maria",
            business_area: "beleza",
            business_type: "Estetica",
            brand_tone: "Acolhedor"
          },
          error: null
        }));
      }

      throw new Error(`Tabela inesperada no teste: ${table}`);
    })
  };
}

describe("POST /api/ai/generate-response", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
    process.env.OPENAI_API_KEY = "test-openai-key";
    mocks.usageCount = 30;
    mocks.usageLimit = 20;
    mocks.subscription = { plan_name: "free", status: "trial", current_period_start: null, current_period_end: null };
    mocks.userProfile = {
      business_name: "Studio Maria",
      business_type: "Estetica",
      tone: "Acolhedor",
      description: "Atendimento de estetica"
    };
    mocks.tableFilters = [];
    mocks.insertPayload = null;
    mocks.usageUpdatePayload = null;
    mocks.createClient.mockReset();
    mocks.createClient.mockReturnValue(createSupabaseMock());
    mocks.generateCustomerResponseWithAi.mockReset().mockResolvedValue({
      generatedAnswer: "Resposta de teste",
      mode: "fallback_without_openai_key"
    });
  });

  it("retorna 403 quando o limite mensal do plano foi atingido", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/ai/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          customerMessage: "Tem horário hoje?",
          responseType: "atendimento"
        })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error).toContain("limite mensal");
    expect(body.usage).toMatchObject({
      used: 30,
      limit: 20,
      remaining: 0
    });
    expect(mocks.generateCustomerResponseWithAi).not.toHaveBeenCalled();
    expect(mocks.insertPayload).toBeNull();
  });

  it("retorna 401 sem sessao", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/ai/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      })
    );

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toContain("logado");
    expect(mocks.generateCustomerResponseWithAi).not.toHaveBeenCalled();
    expect(mocks.insertPayload).toBeNull();
  });

  it("retorna 400 para pergunta vazia", async () => {
    mocks.usageCount = 0;
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/ai/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          customerMessage: "",
          responseType: "atendimento"
        })
      })
    );

    expect(response.status).toBe(400);
  });

  it("retorna 400 para pergunta muito grande", async () => {
    mocks.usageCount = 0;
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/ai/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          customerMessage: "a".repeat(1201),
          responseType: "atendimento"
        })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("mensagem esta muito longa");
  });

  it("retorna 403 quando onboarding nao foi concluido", async () => {
    mocks.usageCount = 0;
    mocks.userProfile = null;

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/ai/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          customerMessage: "Tem horario hoje?",
          responseType: "atendimento"
        })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error).toBe("Complete o onboarding antes de gerar respostas.");
    expect(mocks.generateCustomerResponseWithAi).not.toHaveBeenCalled();
    expect(mocks.insertPayload).toBeNull();
  });

  it("retorna erro amigavel quando OPENAI_API_KEY esta ausente", async () => {
    mocks.usageCount = 0;
    delete process.env.OPENAI_API_KEY;

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/ai/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          customerMessage: "Tem horario hoje?",
          responseType: "atendimento"
        })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("A geracao de IA nao esta configurada neste ambiente.");
    expect(mocks.generateCustomerResponseWithAi).not.toHaveBeenCalled();
    expect(mocks.insertPayload).toBeNull();
    expect(mocks.usageUpdatePayload).toBeNull();
  });

  it("filtra negocio e historico pelo user_id da sessao", async () => {
    mocks.usageCount = 0;
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/ai/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          customerMessage: "Tem horario hoje?",
          responseType: "atendimento"
        })
      })
    );

    expect(response.status).toBe(200);
    expect(mocks.tableFilters).toEqual(
      expect.arrayContaining([
        { table: "subscriptions", column: "user_id", value: "11111111-1111-4111-8111-111111111111" },
        { table: "ai_usage", column: "user_id", value: "11111111-1111-4111-8111-111111111111" },
        { table: "user_profiles", column: "user_id", value: "11111111-1111-4111-8111-111111111111" },
        { table: "businesses", column: "user_id", value: "11111111-1111-4111-8111-111111111111" }
      ])
    );
    expect(mocks.tableFilters).not.toContainEqual({ table: "businesses", column: "id", value: "33333333-3333-4333-8333-333333333333" });
    expect(mocks.insertPayload).toMatchObject({
      user_id: "11111111-1111-4111-8111-111111111111",
      business_id: "22222222-2222-4222-8222-222222222222",
      business_type: "Estetica",
      brand_tone: "Acolhedor"
    });
  });

  it("permite uso free quando o usuario ainda nao tem assinatura persistida", async () => {
    mocks.usageCount = 0;
    mocks.subscription = null;

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/ai/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          customerMessage: "Tem horario hoje?",
          responseType: "atendimento"
        })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.generatedAnswer).toBe("Resposta de teste");
    expect(body.response).toBe("Resposta de teste");
    expect(body.usage).toMatchObject({
      count: 1,
      used: 1,
      limit: 20,
      remaining: 19,
      plan: "free"
    });
    expect(mocks.generateCustomerResponseWithAi).toHaveBeenCalledTimes(1);
    expect(mocks.insertPayload).toMatchObject({
      user_id: "11111111-1111-4111-8111-111111111111",
      business_id: "22222222-2222-4222-8222-222222222222"
    });
  });

  it("nao persiste uso quando a IA falha", async () => {
    mocks.usageCount = 0;
    mocks.generateCustomerResponseWithAi.mockRejectedValueOnce(new Error("OpenAI indisponivel"));

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/ai/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          customerMessage: "Tem horario hoje?",
          responseType: "atendimento"
        })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toContain("Nao foi possivel gerar");
    expect(mocks.generateCustomerResponseWithAi).toHaveBeenCalledTimes(1);
    expect(mocks.insertPayload).toBeNull();
    expect(mocks.usageUpdatePayload).toBeNull();
  });

  it("usa limite free quando assinatura paga esta cancelada", async () => {
    mocks.usageCount = 0;
    mocks.subscription = { plan_name: "pro", plan: "pro", status: "canceled", subscription_status: "canceled", monthly_limit: null };

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/ai/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          customerMessage: "Tem horario hoje?",
          responseType: "atendimento"
        })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.usage).toMatchObject({
      used: 1,
      limit: 20,
      plan: "free"
    });
    expect(mocks.generateCustomerResponseWithAi).toHaveBeenCalledTimes(1);
  });
});
