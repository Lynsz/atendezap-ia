import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  responseCount: 30,
  subscription: { plan_name: "free", status: "trial" },
  createClient: vi.fn()
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mocks.createClient
}));

vi.mock("@/lib/ai-response", () => ({
  generateCustomerResponseWithAi: vi.fn()
}));

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
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn(() => ({
                limit: vi.fn(() => ({
                  maybeSingle: vi.fn(async () => ({ data: mocks.subscription, error: null }))
                }))
              }))
            }))
          }))
        };
      }

      if (table === "generated_responses") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              gte: vi.fn(async () => ({ count: mocks.responseCount, error: null }))
            }))
          }))
        };
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
    mocks.subscription = { plan_name: "free", status: "trial" };
    mocks.createClient.mockReset();
    mocks.createClient.mockReturnValue(createSupabaseMock());
  });

  it("retorna 403 quando o limite mensal do plano foi atingido", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/ai/generate-response", {
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
    expect(body.error).toContain("limite de respostas");
    expect(body.usage).toEqual({
      used: 30,
      limit: 30,
      remaining: 0
    });
  });
});
