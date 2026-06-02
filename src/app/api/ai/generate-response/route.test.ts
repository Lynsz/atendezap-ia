import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  responseCount: 30,
  subscription: { plan_name: "free", status: "trial", current_period_start: null, current_period_end: null },
  createClient: vi.fn(),
  generateCustomerResponseWithAi: vi.fn(),
  tableFilters: [] as Array<{ table: string; column: string; value: unknown }>,
  insertPayload: null as Record<string, unknown> | null
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mocks.createClient
}));

vi.mock("@/lib/ai-response", () => ({
  generateCustomerResponseWithAi: mocks.generateCustomerResponseWithAi
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
    mocks.insertPayload = payload;
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
        chain.gte.mockImplementation(() => chain);
        chain.lt.mockImplementation(async () => ({ count: mocks.responseCount, error: null }) as never);
        return chain;
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
    mocks.responseCount = 30;
    mocks.subscription = { plan_name: "free", status: "trial", current_period_start: null, current_period_end: null };
    mocks.tableFilters = [];
    mocks.insertPayload = null;
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
          customerQuestion: "Tem horário hoje?",
          responseType: "atendimento",
          businessData: {
            id: "22222222-2222-4222-8222-222222222222",
            business_name: "Studio Maria",
            business_area: "beleza",
            description: "",
            products_services: "",
            prices: "",
            opening_hours: "",
            address: "",
            payment_methods: "",
            booking_or_payment_link: "",
            brand_tone: "profissional"
          }
        })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error).toContain("limite mensal");
    expect(body.usage).toMatchObject({
      used: 30,
      limit: 30,
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
    expect(body.error).toContain("Sess");
    expect(mocks.generateCustomerResponseWithAi).not.toHaveBeenCalled();
    expect(mocks.insertPayload).toBeNull();
  });

  it("retorna 400 para pergunta vazia", async () => {
    mocks.responseCount = 0;
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/ai/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          customerQuestion: "",
          responseType: "atendimento",
          businessData: {
            business_name: "Studio Maria"
          }
        })
      })
    );

    expect(response.status).toBe(400);
  });

  it("retorna 400 para pergunta muito grande", async () => {
    mocks.responseCount = 0;
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/ai/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          customerQuestion: "a".repeat(1201),
          responseType: "atendimento",
          businessData: {
            business_name: "Studio Maria"
          }
        })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("Pergunta muito longa");
  });

  it("filtra negocio e historico pelo user_id da sessao", async () => {
    mocks.responseCount = 0;
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/ai/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          customerQuestion: "Tem horario hoje?",
          responseType: "atendimento",
          businessData: {
            id: "22222222-2222-4222-8222-222222222222",
            business_name: "Studio Maria",
            business_area: "beleza"
          },
          businessId: "33333333-3333-4333-8333-333333333333"
        })
      })
    );

    expect(response.status).toBe(200);
    expect(mocks.tableFilters).toEqual(
      expect.arrayContaining([
        { table: "subscriptions", column: "user_id", value: "11111111-1111-4111-8111-111111111111" },
        { table: "generated_responses", column: "user_id", value: "11111111-1111-4111-8111-111111111111" },
        { table: "businesses", column: "id", value: "22222222-2222-4222-8222-222222222222" },
        { table: "businesses", column: "user_id", value: "11111111-1111-4111-8111-111111111111" }
      ])
    );
    expect(mocks.tableFilters).not.toContainEqual({ table: "businesses", column: "user_id", value: "33333333-3333-4333-8333-333333333333" });
    expect(mocks.insertPayload).toMatchObject({
      user_id: "11111111-1111-4111-8111-111111111111",
      business_id: "22222222-2222-4222-8222-222222222222",
      business_type: "Estetica",
      brand_tone: "Acolhedor"
    });
  });

  it("nao persiste uso quando a IA falha", async () => {
    mocks.responseCount = 0;
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
          customerQuestion: "Tem horario hoje?",
          responseType: "atendimento",
          businessData: {
            id: "22222222-2222-4222-8222-222222222222",
            business_name: "Studio Maria",
            business_area: "beleza",
            brand_tone: "profissional"
          }
        })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toContain("Nao foi possivel gerar");
    expect(mocks.generateCustomerResponseWithAi).toHaveBeenCalledTimes(1);
    expect(mocks.insertPayload).toBeNull();
  });
});
