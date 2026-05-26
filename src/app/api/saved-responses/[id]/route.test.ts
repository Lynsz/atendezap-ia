import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  tableFilters: [] as Array<{ table: string; column: string; value: unknown }>,
  updatePayload: null as Record<string, unknown> | null,
  deleteCalled: false,
  savedResponse: {
    id: "33333333-3333-4333-8333-333333333333",
    user_id: "11111111-1111-4111-8111-111111111111",
    response_id: "22222222-2222-4222-8222-222222222222",
    title: "Resposta",
    content: "Conteudo salvo",
    category: "Preco",
    created_at: "2026-05-26T12:00:00.000Z",
    updated_at: "2026-05-26T12:00:00.000Z"
  } as Record<string, unknown> | null
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mocks.createClient
}));

type QueryChain = {
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  maybeSingle: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

function createChain(table: string) {
  const chain = {} as QueryChain;
  chain.select = vi.fn(() => chain);
  chain.eq = vi.fn((column: string, value: unknown) => {
    mocks.tableFilters.push({ table, column, value });
    return chain;
  });
  chain.update = vi.fn((payload: Record<string, unknown>) => {
    mocks.updatePayload = payload;
    return chain;
  });
  chain.delete = vi.fn(() => {
    mocks.deleteCalled = true;
    return chain;
  });
  chain.maybeSingle = vi.fn(async () => ({
    data: mocks.savedResponse ? { ...mocks.savedResponse, ...(mocks.updatePayload || {}) } : null,
    error: null
  }));
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
      if (table === "saved_responses") return createChain(table);
      throw new Error(`Tabela inesperada no teste: ${table}`);
    })
  };
}

describe("/api/saved-responses/[id]", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    mocks.tableFilters = [];
    mocks.updatePayload = null;
    mocks.deleteCalled = false;
    mocks.savedResponse = {
      id: "33333333-3333-4333-8333-333333333333",
      user_id: "11111111-1111-4111-8111-111111111111",
      response_id: "22222222-2222-4222-8222-222222222222",
      title: "Resposta",
      content: "Conteudo salvo",
      category: "Preco",
      created_at: "2026-05-26T12:00:00.000Z",
      updated_at: "2026-05-26T12:00:00.000Z"
    };
    mocks.createClient.mockReset();
    mocks.createClient.mockReturnValue(createSupabaseMock());
  });

  it("atualiza somente resposta salva do usuario autenticado", async () => {
    const { PATCH } = await import("./route");
    const response = await PATCH(
      new Request("https://app.example.test/api/saved-responses/33333333-3333-4333-8333-333333333333", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({
          title: "Novo titulo",
          category: "Pagamento"
        })
      }),
      { params: Promise.resolve({ id: "33333333-3333-4333-8333-333333333333" }) }
    );

    expect(response.status).toBe(200);
    expect(mocks.updatePayload).toEqual({
      title: "Novo titulo",
      category: "Pagamento"
    });
    expect(mocks.tableFilters).toEqual(
      expect.arrayContaining([
        { table: "saved_responses", column: "id", value: "33333333-3333-4333-8333-333333333333" },
        { table: "saved_responses", column: "user_id", value: "11111111-1111-4111-8111-111111111111" }
      ])
    );
  });

  it("nao edita resposta salva de outro usuario", async () => {
    mocks.savedResponse = null;
    const { PATCH } = await import("./route");
    const response = await PATCH(
      new Request("https://app.example.test/api/saved-responses/33333333-3333-4333-8333-333333333333", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token"
        },
        body: JSON.stringify({ title: "Novo titulo" })
      }),
      { params: Promise.resolve({ id: "33333333-3333-4333-8333-333333333333" }) }
    );

    expect(response.status).toBe(404);
  });

  it("exclui somente resposta salva do usuario autenticado", async () => {
    const { DELETE } = await import("./route");
    const response = await DELETE(
      new Request("https://app.example.test/api/saved-responses/33333333-3333-4333-8333-333333333333", {
        method: "DELETE",
        headers: {
          Authorization: "Bearer test-token"
        }
      }),
      { params: Promise.resolve({ id: "33333333-3333-4333-8333-333333333333" }) }
    );

    expect(response.status).toBe(200);
    expect(mocks.deleteCalled).toBe(true);
    expect(mocks.tableFilters).toEqual(
      expect.arrayContaining([
        { table: "saved_responses", column: "id", value: "33333333-3333-4333-8333-333333333333" },
        { table: "saved_responses", column: "user_id", value: "11111111-1111-4111-8111-111111111111" }
      ])
    );
  });
});
