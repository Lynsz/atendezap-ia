import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  trackServerAppEvent: vi.fn(),
  generatedResponse: { id: "22222222-2222-4222-8222-222222222222" } as Record<string, unknown> | null,
  upsertPayload: null as Record<string, unknown> | null,
  tableFilters: [] as Array<{ table: string; column: string; value: unknown }>
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mocks.createClient
}));

vi.mock("@/lib/analytics/server", () => ({
  trackServerAppEvent: mocks.trackServerAppEvent
}));

type QueryChain = {
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  maybeSingle: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  upsert: ReturnType<typeof vi.fn>;
};

function createChain(table: string, terminal: () => Promise<Record<string, unknown>>) {
  const chain = {} as QueryChain;
  chain.select = vi.fn(() => chain);
  chain.eq = vi.fn((column: string, value: unknown) => {
    mocks.tableFilters.push({ table, column, value });
    return chain;
  });
  chain.maybeSingle = vi.fn(terminal);
  chain.single = vi.fn(terminal);
  chain.upsert = vi.fn((payload: Record<string, unknown>) => {
    mocks.upsertPayload = payload;
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
      if (table === "generated_responses") {
        return createChain(table, async () => ({ data: mocks.generatedResponse, error: null }));
      }

      if (table === "ai_response_feedback") {
        return createChain(table, async () => ({
          data: { id: "33333333-3333-4333-8333-333333333333", ...mocks.upsertPayload },
          error: null
        }));
      }

      throw new Error(`Tabela inesperada no teste: ${table}`);
    })
  };
}

function createRequest(body: Record<string, unknown>, authorization = "Bearer test-token") {
  return new Request("https://app.example.test/api/ai/response-feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify(body)
  });
}

describe("POST /api/ai/response-feedback", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    mocks.generatedResponse = { id: "22222222-2222-4222-8222-222222222222" };
    mocks.upsertPayload = null;
    mocks.tableFilters = [];
    mocks.trackServerAppEvent.mockReset();
    mocks.createClient.mockReset();
    mocks.createClient.mockReturnValue(createSupabaseMock());
  });

  it("requires login", async () => {
    const { POST } = await import("./route");
    const response = await POST(createRequest({}, ""));

    expect(response.status).toBe(401);
  });

  it("does not allow feedback for another user's response", async () => {
    mocks.generatedResponse = null;
    const { POST } = await import("./route");
    const response = await POST(
      createRequest({
        responseId: "22222222-2222-4222-8222-222222222222",
        rating: "negative",
        feedbackReason: "too_generic",
        comment: "Ficou generica."
      })
    );

    expect(response.status).toBe(404);
    expect(mocks.tableFilters).toEqual(
      expect.arrayContaining([
        { table: "generated_responses", column: "id", value: "22222222-2222-4222-8222-222222222222" },
        { table: "generated_responses", column: "user_id", value: "11111111-1111-4111-8111-111111111111" }
      ])
    );
  });

  it("saves negative feedback for own response", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      createRequest({
        responseId: "22222222-2222-4222-8222-222222222222",
        rating: "negative",
        feedbackReason: "too_generic",
        comment: "Ficou generica."
      })
    );

    expect(response.status).toBe(200);
    expect(mocks.upsertPayload).toMatchObject({
      user_id: "11111111-1111-4111-8111-111111111111",
      response_id: "22222222-2222-4222-8222-222222222222",
      rating: "negative",
      feedback_reason: "too_generic",
      comment: "Ficou generica."
    });
    expect(mocks.trackServerAppEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event_name: "ai_response_feedback_submitted",
        metadata: expect.objectContaining({
          feedback_rating: "negative",
          feedback_reason: "too_generic"
        })
      })
    );
    expect(JSON.stringify(mocks.trackServerAppEvent.mock.calls[0][0])).not.toContain("Ficou generica");
  });

  it("rejects long comments and unknown content fields", async () => {
    const { POST } = await import("./route");
    const longComment = await POST(
      createRequest({
        responseId: "22222222-2222-4222-8222-222222222222",
        rating: "negative",
        feedbackReason: "too_long",
        comment: "x".repeat(501)
      })
    );

    expect(longComment.status).toBe(400);

    const sensitiveFields = await POST(
      createRequest({
        responseId: "22222222-2222-4222-8222-222222222222",
        rating: "positive",
        customerQuestion: "Pergunta completa",
        generatedAnswer: "Resposta completa"
      })
    );

    expect(sensitiveFields.status).toBe(400);
    expect(mocks.upsertPayload).toBeNull();
  });
});
