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

describe("saved responses service", () => {
  beforeEach(() => {
    mocks.getSession.mockReset().mockResolvedValue({
      data: {
        session: {
          access_token: "test-token"
        }
      }
    });
  });

  it("saveResponseToLibrary chama a API autenticada", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          savedResponse: {
            id: "33333333-3333-4333-8333-333333333333",
            user_id: "11111111-1111-4111-8111-111111111111",
            response_id: "22222222-2222-4222-8222-222222222222",
            title: "Resposta",
            content: "Conteudo",
            category: "Preco",
            created_at: "2026-05-26T12:00:00.000Z",
            updated_at: "2026-05-26T12:00:00.000Z"
          }
        }),
        { status: 201 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const { saveResponseToLibrary } = await import("./saved-responses");
    await saveResponseToLibrary({
      response_id: "22222222-2222-4222-8222-222222222222",
      source_template_id: "delivery-1",
      category: "Preco"
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/saved-responses",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token"
        }),
        body: JSON.stringify({
          response_id: "22222222-2222-4222-8222-222222222222",
          source_template_id: "delivery-1",
          category: "Preco"
        })
      })
    );
    vi.unstubAllGlobals();
  });

  it("listSavedResponses chama a API autenticada e retorna a biblioteca", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          savedResponses: [
            {
              id: "33333333-3333-4333-8333-333333333333",
              user_id: "11111111-1111-4111-8111-111111111111",
              response_id: null,
              title: "Resposta",
              content: "Conteudo",
              category: "geral",
              source: "manual",
              is_favorite: false,
              created_at: "2026-05-26T12:00:00.000Z",
              updated_at: "2026-05-26T12:00:00.000Z"
            }
          ]
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const { listSavedResponses } = await import("./saved-responses");
    const savedResponses = await listSavedResponses();

    expect(savedResponses).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/saved-responses",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token"
        })
      })
    );
    vi.unstubAllGlobals();
  });

  it("updateSavedResponse chama PATCH autenticado com titulo, conteudo e categoria", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          savedResponse: {
            id: "33333333-3333-4333-8333-333333333333",
            title: "Novo titulo",
            content: "Novo conteudo",
            category: "Delivery"
          }
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const { updateSavedResponse } = await import("./saved-responses");
    await updateSavedResponse("33333333-3333-4333-8333-333333333333", {
      title: "Novo titulo",
      content: "Novo conteudo",
      category: "Delivery"
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/saved-responses/33333333-3333-4333-8333-333333333333",
      expect.objectContaining({
        method: "PATCH",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token"
        }),
        body: JSON.stringify({
          title: "Novo titulo",
          content: "Novo conteudo",
          category: "Delivery"
        })
      })
    );
    vi.unstubAllGlobals();
  });

  it("deleteSavedResponse chama DELETE autenticado", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ deleted: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const { deleteSavedResponse } = await import("./saved-responses");
    await deleteSavedResponse("33333333-3333-4333-8333-333333333333");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/saved-responses/33333333-3333-4333-8333-333333333333",
      expect.objectContaining({
        method: "DELETE",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token"
        })
      })
    );
    vi.unstubAllGlobals();
  });

  it("duplicateSavedResponse chama a API autenticada", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          savedResponse: {
            id: "44444444-4444-4444-8444-444444444444",
            user_id: "11111111-1111-4111-8111-111111111111",
            response_id: null,
            source_template_id: null,
            source: "template",
            title: "Resposta (Copia)",
            content: "Conteudo",
            category: "Preco",
            created_at: "2026-05-26T12:00:00.000Z",
            updated_at: "2026-05-26T12:00:00.000Z"
          }
        }),
        { status: 201 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const { duplicateSavedResponse } = await import("./saved-responses");
    await duplicateSavedResponse("33333333-3333-4333-8333-333333333333");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/saved-responses/33333333-3333-4333-8333-333333333333/duplicate",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token"
        })
      })
    );
    vi.unstubAllGlobals();
  });

  it("updateSavedResponseFavorite chama PATCH autenticado com favorito", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          savedResponse: {
            id: "33333333-3333-4333-8333-333333333333",
            is_favorite: true
          }
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const { updateSavedResponseFavorite } = await import("./saved-responses");
    await updateSavedResponseFavorite("33333333-3333-4333-8333-333333333333", true);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/saved-responses/33333333-3333-4333-8333-333333333333",
      expect.objectContaining({
        method: "PATCH",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token"
        }),
        body: JSON.stringify({ is_favorite: true })
      })
    );
    vi.unstubAllGlobals();
  });

  it("recordSavedResponseCopy chama PATCH autenticado com incremento", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          savedResponse: {
            id: "33333333-3333-4333-8333-333333333333",
            copy_count: 1
          }
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const { recordSavedResponseCopy } = await import("./saved-responses");
    await recordSavedResponseCopy("33333333-3333-4333-8333-333333333333");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/saved-responses/33333333-3333-4333-8333-333333333333",
      expect.objectContaining({
        method: "PATCH",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token"
        }),
        body: JSON.stringify({ copy_count_action: "increment" })
      })
    );
    vi.unstubAllGlobals();
  });
});
