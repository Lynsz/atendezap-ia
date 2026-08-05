import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  readServerEnv: vi.fn((name: string) => {
    if (name === "WHATSAPP_MAX_MEDIA_SIZE_MB") return "1";
    if (name === "SUPABASE_STORAGE_WHATSAPP_BUCKET") return "whatsapp-media";
    return "";
  }),
  getWhatsAppServerConfig: vi.fn(() => ({ accessToken: "test-only-token", phoneNumberId: "123456789", apiVersion: "v23.0" }))
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/server/env", () => ({ readServerEnv: mocks.readServerEnv }));
vi.mock("@/lib/server/whatsapp", () => ({ getWhatsAppServerConfig: mocks.getWhatsAppServerConfig }));
vi.mock("@/lib/supabase/server", () => ({ getSupabaseAdmin: vi.fn() }));

function metadataResponse(overrides: Record<string, unknown> = {}) {
  return new Response(JSON.stringify({
    id: "media-provider-1",
    url: "https://lookaside.fbsbx.com/media/file?token=test-only-placeholder",
    mime_type: "image/png",
    sha256: "hash-test-only",
    file_size: "8",
    ...overrides
  }), { status: 200, headers: { "Content-Type": "application/json" } });
}

describe("WhatsApp media server helper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it("baixa mídia permitida somente pelo servidor e valida assinatura do arquivo", async () => {
    const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(metadataResponse())
      .mockResolvedValueOnce(new Response(png, { status: 200, headers: { "Content-Type": "image/png", "Content-Length": "8" } }));
    vi.stubGlobal("fetch", fetchMock);
    const { downloadWhatsAppMedia } = await import("./whatsapp-media");
    const result = await downloadWhatsAppMedia({ mediaId: "media-provider-1", mediaType: "image", filename: "imagem.png" });
    expect(result.buffer).toEqual(Buffer.from(png));
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe("Bearer test-only-token");
  });

  it("bloqueia MIME perigoso antes de baixar o binário", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(metadataResponse({ mime_type: "text/html", file_size: "100" }));
    vi.stubGlobal("fetch", fetchMock);
    const { downloadWhatsAppMedia } = await import("./whatsapp-media");
    await expect(downloadWhatsAppMedia({ mediaId: "media-provider-1", mediaType: "document", filename: "arquivo.html" })).rejects.toMatchObject({ errorType: "blocked_type", status: 415 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("bloqueia tamanho acima do limite antes de baixar", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(metadataResponse({ file_size: String(2 * 1024 * 1024) }));
    vi.stubGlobal("fetch", fetchMock);
    const { downloadWhatsAppMedia } = await import("./whatsapp-media");
    await expect(downloadWhatsAppMedia({ mediaId: "media-provider-1", mediaType: "image", filename: "imagem.png" })).rejects.toMatchObject({ errorType: "blocked_size", status: 413 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("normaliza erro da Meta sem expor token ou URL temporária", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ error: { code: 190, message: "provider detail" } }), { status: 401 })));
    const { getWhatsAppMediaMetadata } = await import("./whatsapp-media");
    let error: unknown;
    try { await getWhatsAppMediaMetadata("media-provider-1"); } catch (caught) { error = caught; }
    expect(error).toMatchObject({ errorType: "provider_authentication" });
    expect(JSON.stringify(error)).not.toContain("test-only-token");
    expect(JSON.stringify(error)).not.toContain("lookaside");
    expect(JSON.stringify(error)).not.toContain("provider detail");
  });
});
