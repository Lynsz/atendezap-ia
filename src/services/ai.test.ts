import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn()
}));

vi.mock("@/lib/supabase/browser", () => ({
  supabase: {
    auth: {
      getSession: mocks.getSession
    }
  }
}));

describe("generateCustomerResponse service", () => {
  beforeEach(() => {
    mocks.getSession.mockReset().mockResolvedValue({
      data: {
        session: {
          access_token: "test-token"
        }
      }
    });
  });

  it("chama a rota de IA com payload minimo autenticado", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          response: "Resposta pronta",
          usage: { used: 1, limit: 20, remaining: 19 }
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const { generateCustomerResponse } = await import("./ai");
    await generateCustomerResponse({
      customerMessage: "Qual o valor?",
      responseType: "atendimento"
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/ai/generate-response",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token"
        }),
        body: JSON.stringify({
          customerMessage: "Qual o valor?",
          responseType: "atendimento"
        })
      })
    );

    vi.unstubAllGlobals();
  });
});
