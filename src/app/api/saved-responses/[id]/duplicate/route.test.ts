import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  tableFilters: [] as Array<{ table: string; column: string; value: unknown }>,
  insertPayload: null as Record<string, unknown> | null,
  originalSavedResponse: {
    id: "33333333-3333-4333-8333-333333333333",
    user_id: "11111111-1111-4111-8111-111111111111",
    response_id: null,
    source_template_id: "delivery-1",
    source: "template",
    title: "Taxa de entrega",
    content: "Para [bairro], a taxa de entrega e [valor].",
    category: "Entrega"
  } as Record<string, unknown> | null
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mocks.createClient
}));

type QueryChain = {
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  maybeSingle: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
};

function createChain(table: string) {
  const chain = {} as QueryChain;
  chain.select = vi.fn(() => chain);
  chain.eq = vi.fn((column: string, value: unknown) => {
    mocks.tableFilters.push({ table, column, value });
    return chain;
  });
  chain.maybeSingle = vi.fn(async () => ({
    data: mocks.originalSavedResponse,
    error: null
  }));
  chain.insert = vi.fn((payload: Record<string, unknown>) => {
    mocks.insertPayload = payload;
    return chain;
  });
  chain.single = vi.fn(async () => ({
    data: {
      id: "44444444-4444-4444-8444-444444444444",
      ...mocks.insertPayload,
      created_at: "2026-05-26T12:00:00.000Z",
      updated_at: "2026-05-26T12:00:00.000Z"
    },
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

describe("/api/saved-responses/[id]/duplicate", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    mocks.tableFilters = [];
    mocks.insertPayload = null;
    mocks.originalSavedResponse = {
      id: "33333333-3333-4333-8333-333333333333",
      user_id: "11111111-1111-4111-8111-111111111111",
      response_id: null,
      source_template_id: "delivery-1",
      source: "template",
      title: "Taxa de entrega",
      content: "Para [bairro], a taxa de entrega e [valor].",
      category: "Entrega"
    };
    mocks.createClient.mockReset();
    mocks.createClient.mockReturnValue(createSupabaseMock());
  });

  it("duplica somente resposta salva do usuario autenticado", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/saved-responses/33333333-3333-4333-8333-333333333333/duplicate", {
        method: "POST",
        headers: {
          Authorization: "Bearer test-token"
        }
      }),
      { params: Promise.resolve({ id: "33333333-3333-4333-8333-333333333333" }) }
    );

    expect(response.status).toBe(201);
    expect(mocks.tableFilters).toEqual(
      expect.arrayContaining([
        { table: "saved_responses", column: "id", value: "33333333-3333-4333-8333-333333333333" },
        { table: "saved_responses", column: "user_id", value: "11111111-1111-4111-8111-111111111111" }
      ])
    );
    expect(mocks.insertPayload).toMatchObject({
      user_id: "11111111-1111-4111-8111-111111111111",
      response_id: null,
      source_template_id: null,
      source: "template",
      title: "Taxa de entrega (Copia)",
      content: "Para [bairro], a taxa de entrega e [valor].",
      category: "Entrega"
    });
  });

  it("nao duplica resposta salva de outro usuario", async () => {
    mocks.originalSavedResponse = null;
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.example.test/api/saved-responses/33333333-3333-4333-8333-333333333333/duplicate", {
        method: "POST",
        headers: {
          Authorization: "Bearer test-token"
        }
      }),
      { params: Promise.resolve({ id: "33333333-3333-4333-8333-333333333333" }) }
    );

    expect(response.status).toBe(404);
    expect(mocks.insertPayload).toBeNull();
  });
});
