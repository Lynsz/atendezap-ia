import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";

const mocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  getSupabaseAdmin: vi.fn(),
  enforceWhatsAppSendLimits: vi.fn(),
  createWhatsAppSendAttempt: vi.fn(),
  updateWhatsAppSendAttempt: vi.fn(),
  readStoredWhatsAppMediaFile: vi.fn(),
  uploadMediaToWhatsApp: vi.fn(),
  validateWhatsAppMediaType: vi.fn(),
  validateWhatsAppMediaSize: vi.fn(),
  validateWhatsAppMediaBytes: vi.fn(),
  sendWhatsAppImageMessage: vi.fn(),
  sendWhatsAppDocumentMessage: vi.fn(),
  writeWhatsAppAudit: vi.fn(),
  trackServerAppEvent: vi.fn()
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/server", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/lib/supabase/server", () => ({ getSupabaseAdmin: mocks.getSupabaseAdmin }));
vi.mock("@/lib/rate-limit", () => ({ assertRequestSize: vi.fn() }));
vi.mock("@/lib/server/whatsapp", () => ({ sendWhatsAppImageMessage: mocks.sendWhatsAppImageMessage, sendWhatsAppDocumentMessage: mocks.sendWhatsAppDocumentMessage }));
vi.mock("@/lib/server/whatsapp-audit", () => ({ writeWhatsAppAudit: mocks.writeWhatsAppAudit }));
vi.mock("@/lib/analytics/server", () => ({ trackServerAppEvent: mocks.trackServerAppEvent }));
vi.mock("@/lib/server/whatsapp-media", () => ({
  isWhatsAppMediaUploadEnabled: () => true,
  readStoredWhatsAppMediaFile: mocks.readStoredWhatsAppMediaFile,
  uploadMediaToWhatsApp: mocks.uploadMediaToWhatsApp,
  validateWhatsAppMediaType: mocks.validateWhatsAppMediaType,
  validateWhatsAppMediaSize: mocks.validateWhatsAppMediaSize,
  validateWhatsAppMediaBytes: mocks.validateWhatsAppMediaBytes
}));
vi.mock("@/lib/server/whatsapp-send-safety", () => ({
  createWhatsAppContentFingerprint: vi.fn(() => "fingerprint"),
  createWhatsAppSendAttempt: mocks.createWhatsAppSendAttempt,
  updateWhatsAppSendAttempt: mocks.updateWhatsAppSendAttempt,
  enforceWhatsAppSendLimits: mocks.enforceWhatsAppSendLimits,
  sendWithControlledRetry: vi.fn(async (operation: () => Promise<unknown>) => ({ value: await operation(), attempts: 1 }))
}));

const conversationId = "11111111-1111-4111-8111-111111111111";
const contactId = "22222222-2222-4222-8222-222222222222";
const connectionId = "33333333-3333-4333-8333-333333333333";
const mediaId = "44444444-4444-4444-8444-444444444444";

function createQueuedSupabase(results: Array<{ data?: unknown; error?: unknown }>) {
  return {
    from: vi.fn(() => {
      const result = results.shift() || { data: null, error: null };
      const chain: Record<string, unknown> = {};
      for (const method of ["select", "eq", "insert", "update", "order", "limit"]) chain[method] = vi.fn(() => chain);
      chain.single = vi.fn(() => Promise.resolve(result));
      chain.maybeSingle = vi.fn(() => Promise.resolve(result));
      chain.then = (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) => Promise.resolve(result).then(resolve, reject);
      return chain;
    })
  };
}

function request(body: Record<string, unknown>) {
  return new Request(`https://app.test/api/whatsapp/conversations/${conversationId}/send-media`, {
    method: "POST",
    headers: { Authorization: "Bearer test-only", "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

function body() {
  return { mediaType: "image", storageMediaId: mediaId, caption: "Legenda revisada", confirmSend: true, clientRequestId: "55555555-5555-4555-8555-555555555555" };
}

function validRows(overrides: { optIn?: string; window?: string; media?: Record<string, unknown> | null } = {}) {
  return [
    { data: { id: conversationId, contact_id: contactId, connection_id: connectionId, customer_service_window_until: overrides.window || "2099-01-01T00:00:00.000Z" }, error: null },
    { data: { id: contactId, phone_number: "5511999999999", opt_in_status: overrides.optIn || "opted_in" }, error: null },
    { data: { id: connectionId, status: "active" }, error: null },
    { data: overrides.media === null ? null : { id: mediaId, direction: "outbound", media_type: "image", mime_type: "image/png", file_size: 8, original_filename: "imagem.png", storage_bucket: "whatsapp-media", storage_path: "user-a/file.png", download_status: "downloaded", scanned_status: "unavailable", ...overrides.media }, error: null }
  ];
}

describe("POST WhatsApp send media", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireUser.mockResolvedValue({ id: "user-a" });
    mocks.createWhatsAppSendAttempt.mockResolvedValue({ acquired: true, attempt: { id: "attempt-1" } });
    mocks.readStoredWhatsAppMediaFile.mockResolvedValue(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
    mocks.uploadMediaToWhatsApp.mockResolvedValue({ mediaId: "provider-media-1" });
    mocks.sendWhatsAppImageMessage.mockResolvedValue({ messageId: "wamid.sent" });
  });

  it("exige login", async () => {
    mocks.requireUser.mockRejectedValue(new AppError("Sessão inválida.", 401));
    const { POST } = await import("./route");
    const response = await POST(request(body()), { params: Promise.resolve({ id: conversationId }) });
    expect(response.status).toBe(401);
    expect(mocks.sendWhatsAppImageMessage).not.toHaveBeenCalled();
  });

  it("exige confirmação explícita e não aceita URL arbitrária", async () => {
    const { POST } = await import("./route");
    const unconfirmed = await POST(request({ ...body(), confirmSend: false }), { params: Promise.resolve({ id: conversationId }) });
    const externalUrl = await POST(request({ mediaType: "image", externalUrl: "https://example.test/file.png", confirmSend: true, clientRequestId: body().clientRequestId }), { params: Promise.resolve({ id: conversationId }) });
    expect(unconfirmed.status).toBe(400);
    expect(externalUrl.status).toBe(400);
    expect(mocks.sendWhatsAppImageMessage).not.toHaveBeenCalled();
  });

  it("valida propriedade da conversa e do arquivo", async () => {
    mocks.getSupabaseAdmin.mockReturnValueOnce(createQueuedSupabase([{ data: null, error: null }]));
    const { POST } = await import("./route");
    const missingConversation = await POST(request(body()), { params: Promise.resolve({ id: conversationId }) });
    mocks.getSupabaseAdmin.mockReturnValueOnce(createQueuedSupabase(validRows({ media: null })));
    const otherMedia = await POST(request(body()), { params: Promise.resolve({ id: conversationId }) });
    expect(missingConversation.status).toBe(404);
    expect(otherMedia.status).toBe(404);
    expect(mocks.sendWhatsAppImageMessage).not.toHaveBeenCalled();
  });

  it("bloqueia opt-out e janela de 24 horas fechada", async () => {
    const { POST } = await import("./route");
    mocks.getSupabaseAdmin.mockReturnValueOnce(createQueuedSupabase(validRows({ optIn: "opted_out" })));
    expect((await POST(request(body()), { params: Promise.resolve({ id: conversationId }) })).status).toBe(403);
    mocks.getSupabaseAdmin.mockReturnValueOnce(createQueuedSupabase(validRows({ window: "2020-01-01T00:00:00.000Z" })));
    expect((await POST(request(body()), { params: Promise.resolve({ id: conversationId }) })).status).toBe(403);
    expect(mocks.sendWhatsAppImageMessage).not.toHaveBeenCalled();
  });

  it("aplica rate limit e bloqueia arquivo perigoso antes do provedor", async () => {
    const { POST } = await import("./route");
    mocks.enforceWhatsAppSendLimits.mockRejectedValueOnce(new AppError("Muitos envios.", 429));
    expect((await POST(request(body()), { params: Promise.resolve({ id: conversationId }) })).status).toBe(429);
    mocks.getSupabaseAdmin.mockReturnValueOnce(createQueuedSupabase(validRows()));
    mocks.validateWhatsAppMediaType.mockImplementationOnce(() => { throw new AppError("Tipo bloqueado.", 415); });
    expect((await POST(request(body()), { params: Promise.resolve({ id: conversationId }) })).status).toBe(415);
    expect(mocks.sendWhatsAppImageMessage).not.toHaveBeenCalled();
  });

  it("duplo clique não duplica upload nem envio", async () => {
    mocks.getSupabaseAdmin.mockReturnValue(createQueuedSupabase(validRows()));
    mocks.createWhatsAppSendAttempt.mockResolvedValueOnce({ acquired: false, attempt: { id: "attempt-1", status: "pending" } });
    const { POST } = await import("./route");
    const response = await POST(request(body()), { params: Promise.resolve({ id: conversationId }) });
    expect(response.status).toBe(200);
    expect((await response.json()).duplicate).toBe(true);
    expect(mocks.uploadMediaToWhatsApp).not.toHaveBeenCalled();
  });

  it("faz upload controlado e envia pelo helper server-side", async () => {
    mocks.getSupabaseAdmin.mockReturnValue(createQueuedSupabase([
      ...validRows(),
      { data: { id: "pending-message" }, error: null },
      { data: { id: "pending-message", direction: "outbound", message_type: "image", text: "Legenda revisada", status: "sent", created_at: new Date().toISOString() }, error: null }
    ]));
    const { POST } = await import("./route");
    const response = await POST(request(body()), { params: Promise.resolve({ id: conversationId }) });
    expect(response.status).toBe(201);
    expect(mocks.uploadMediaToWhatsApp).toHaveBeenCalledWith(expect.objectContaining({ mimeType: "image/png" }));
    expect(mocks.sendWhatsAppImageMessage).toHaveBeenCalledWith({ connectionId, to: "5511999999999", mediaId: "provider-media-1", caption: "Legenda revisada" });
    expect(JSON.stringify(await response.json())).not.toContain("storage_path");
  });
});
