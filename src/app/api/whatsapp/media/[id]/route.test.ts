import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";

const mocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  getSupabaseAdmin: vi.fn(),
  readStoredWhatsAppMediaFile: vi.fn(),
  writeWhatsAppAudit: vi.fn(),
  trackServerAppEvent: vi.fn()
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/server", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/lib/supabase/server", () => ({ getSupabaseAdmin: mocks.getSupabaseAdmin }));
vi.mock("@/lib/server/whatsapp-media", () => ({
  readStoredWhatsAppMediaFile: mocks.readStoredWhatsAppMediaFile,
  buildSafeMediaPreviewUrl: (id: string) => `/api/whatsapp/media/${id}`
}));
vi.mock("@/lib/server/whatsapp-audit", () => ({ writeWhatsAppAudit: mocks.writeWhatsAppAudit }));
vi.mock("@/lib/analytics/server", () => ({ trackServerAppEvent: mocks.trackServerAppEvent }));

const mediaId = "11111111-1111-4111-8111-111111111111";
const conversationId = "22222222-2222-4222-8222-222222222222";

function createQueuedSupabase(results: Array<{ data?: unknown; error?: unknown }>) {
  return {
    from: vi.fn(() => {
      const result = results.shift() || { data: null, error: null };
      const chain: Record<string, unknown> = {};
      for (const method of ["select", "eq", "order", "limit"]) chain[method] = vi.fn(() => chain);
      chain.maybeSingle = vi.fn(() => Promise.resolve(result));
      chain.then = (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) => Promise.resolve(result).then(resolve, reject);
      return chain;
    })
  };
}

function media(overrides: Record<string, unknown> = {}) {
  return {
    id: mediaId,
    user_id: "user-a",
    conversation_id: conversationId,
    message_id: "33333333-3333-4333-8333-333333333333",
    media_type: "image",
    mime_type: "image/png",
    original_filename: "imagem.png",
    file_size: 8,
    storage_bucket: "whatsapp-media",
    storage_path: "user-a/private-path.png",
    download_status: "downloaded",
    scanned_status: "unavailable",
    ...overrides
  };
}

describe("WhatsApp media preview and listing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireUser.mockResolvedValue({ id: "user-a" });
    mocks.readStoredWhatsAppMediaFile.mockResolvedValue(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  });

  it("exige login", async () => {
    mocks.requireUser.mockRejectedValue(new AppError("Sessão inválida.", 401));
    const { GET } = await import("./route");
    const response = await GET(new Request(`https://app.test/api/whatsapp/media/${mediaId}`), { params: Promise.resolve({ id: mediaId }) });
    expect(response.status).toBe(401);
    expect(mocks.readStoredWhatsAppMediaFile).not.toHaveBeenCalled();
  });

  it("usuário abre somente a própria mídia sem expor storage_path", async () => {
    mocks.getSupabaseAdmin.mockReturnValue(createQueuedSupabase([{ data: media(), error: null }]));
    const { GET } = await import("./route");
    const response = await GET(new Request(`https://app.test/api/whatsapp/media/${mediaId}`), { params: Promise.resolve({ id: mediaId }) });
    expect(response.status).toBe(200);
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(await response.text()).not.toContain("private-path");
  });

  it("não permite acessar mídia de outro usuário ou inexistente", async () => {
    mocks.getSupabaseAdmin.mockReturnValue(createQueuedSupabase([{ data: null, error: null }]));
    const { GET } = await import("./route");
    const response = await GET(new Request(`https://app.test/api/whatsapp/media/${mediaId}`), { params: Promise.resolve({ id: mediaId }) });
    expect(response.status).toBe(404);
    expect(mocks.readStoredWhatsAppMediaFile).not.toHaveBeenCalled();
  });

  it("mídia marcada como bloqueada não abre", async () => {
    mocks.getSupabaseAdmin.mockReturnValue(createQueuedSupabase([{ data: media({ scanned_status: "blocked" }), error: null }]));
    const { GET } = await import("./route");
    const response = await GET(new Request(`https://app.test/api/whatsapp/media/${mediaId}`), { params: Promise.resolve({ id: mediaId }) });
    expect(response.status).toBe(403);
    expect(mocks.readStoredWhatsAppMediaFile).not.toHaveBeenCalled();
  });

  it("lista metadados seguros e URL interna sem caminho de storage", async () => {
    mocks.getSupabaseAdmin.mockReturnValue(createQueuedSupabase([
      { data: { id: conversationId }, error: null },
      { data: [media()], error: null }
    ]));
    const { GET } = await import("../../conversations/[id]/media/route");
    const response = await GET(new Request(`https://app.test/api/whatsapp/conversations/${conversationId}/media`), { params: Promise.resolve({ id: conversationId }) });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.media[0].preview_url).toBe(`/api/whatsapp/media/${mediaId}`);
    expect(JSON.stringify(body)).not.toContain("storage_path");
    expect(JSON.stringify(body)).not.toContain("private-path");
  });
});
