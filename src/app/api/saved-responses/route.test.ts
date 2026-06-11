import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  tableFilters: [] as Array<{ table: string; column: string; value: unknown }>,
  insertPayload: null as Record<string, unknown> | null,
  existingSavedResponse: null as Record<string, unknown> | null,
  generatedResponse: {
    id: "22222222-2222-4222-8222-222222222222",
    customer_question: "Qual o preço?",
    generated_answer: "O valor depende do serviço. Posso te passar as opções.",
    response_type: "orcamento"
  } as Record<string, unknown> | null,
  savedRows: [
    {
      id: "33333333-3333-4333-8333-333333333333",
      user_id: "11111111-1111-4111-8111-111111111111",
      response_id: "22222222-2222-4222-8222-222222222222",
      title: "Qual o preço?",
      content: "O valor depende do serviço. Posso te passar as opções.",
      category: "Preco",
      source: "ai",
      created_at: "2026-05-26T12:00:00.000Z",
      updated_at: "2026-05-26T12:00:00.000Z"
    }
  ]
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mocks.createClient
}));

type QueryChain = {
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
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
      if (table === "saved_responses") {
        return createChain(table, async () => {
          if (mocks.insertPayload) {
            return {
              data: {
                id: "33333333-3333-4333-8333-333333333333",
                ...mocks.insertPayload,
                created_at: "2026-05-26T12:00:00.000Z",
                updated_at: "2026-05-26T12:00:00.000Z"
              },
              error: null
            };
          }
          return { data: mocks.existingSavedResponse, error: null };
        });
      }

      if (table === "generated_responses") {
        return createChain(table, async () => ({ data: mocks.generatedResponse, error: null }));
      }

      throw new Error(`Tabela inesperada no teste: ${table}`);
    })
  };
}

describe("/api/saved-responses", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    mocks.tableFilters = [];
    mocks.insertPayload = null;
    mocks.existingSavedResponse = null;
    mocks.generatedResponse = {
      id: "22222222-2222-4222-8222-222222222222",
      customer_question: "Qual o preço?",
      generated_answer: "O valor depende do serviço. Posso te passar as opções.",
      response_type: "orcamento"
    };
    mocks.createClient.mockReset();
    mocks.createClient.mockReturnValue(createSupabaseMock());
  });

  it("retorna 401 sem sessao", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/saved-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "Resposta" })
      })
    );

    expect(response.status).toBe(401);
  });

  it("salva resposta gerada usando o user_id da sessao", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/saved-responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          response_id: "22222222-2222-4222-8222-222222222222",
          category: "Preco"
        })
      })
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.savedResponse.content).toBe("O valor depende do serviço. Posso te passar as opções.");
    expect(mocks.insertPayload).toMatchObject({
      user_id: "11111111-1111-4111-8111-111111111111",
      response_id: "22222222-2222-4222-8222-222222222222",
      source: "ai",
      category: "Preco"
    });
    expect(mocks.tableFilters).toEqual(
      expect.arrayContaining([
        { table: "generated_responses", column: "id", value: "22222222-2222-4222-8222-222222222222" },
        { table: "generated_responses", column: "user_id", value: "11111111-1111-4111-8111-111111111111" }
      ])
    );
  });

  it("salva template na biblioteca sem aceitar user_id do client", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/saved-responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          user_id: "99999999-9999-4999-8999-999999999999",
          source_template_id: "delivery-1",
          title: "Informar taxa de entrega",
          content: "Para [bairro], a taxa de entrega e [valor].",
          category: "Entrega"
        })
      })
    );

    expect(response.status).toBe(400);
    expect(mocks.insertPayload).toBeNull();

    const validResponse = await POST(
      new Request("https://app.example.test/api/saved-responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          source_template_id: "delivery-1",
          title: "Informar taxa de entrega",
          content: "Para [bairro], a taxa de entrega e [valor].",
          category: "Entrega"
        })
      })
    );

    expect(validResponse.status).toBe(201);
    expect(mocks.insertPayload).toMatchObject({
      user_id: "11111111-1111-4111-8111-111111111111",
      source_template_id: "delivery-1",
      title: "Informar taxa de entrega",
      category: "Entrega"
    });
    expect(mocks.insertPayload).toMatchObject({
      source: "template"
    });
  });

  it("cria resposta manual na biblioteca do usuario autenticado", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/saved-responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          title: "Resposta manual",
          content: "Mensagem que ja uso no WhatsApp.",
          category: "Informacoes gerais",
          source: "manual"
        })
      })
    );

    expect(response.status).toBe(201);
    expect(mocks.insertPayload).toMatchObject({
      user_id: "11111111-1111-4111-8111-111111111111",
      response_id: null,
      source_template_id: null,
      source: "manual",
      title: "Resposta manual",
      category: "Informacoes gerais"
    });
  });

  it("nao salva resposta original de outro usuario", async () => {
    mocks.generatedResponse = null;
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/saved-responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          response_id: "22222222-2222-4222-8222-222222222222",
          category: "Preco"
        })
      })
    );

    expect(response.status).toBe(404);
    expect(mocks.insertPayload).toBeNull();
  });

  it("rejeita categoria longa demais", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/saved-responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          content: "Resposta pronta",
          category: "x".repeat(81)
        })
      })
    );

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain("Categoria");
  });

  it("rejeita conteudo vazio sem resposta original", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/saved-responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          title: "Vazia",
          content: "",
          category: "Outro"
        })
      })
    );

    expect(response.status).toBe(400);
    expect(mocks.insertPayload).toBeNull();
  });
});
