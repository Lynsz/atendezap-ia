import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const trackServerAppEvent = vi.fn();
const persistWhatsAppInbound = vi.fn();
const persistWhatsAppStatus = vi.fn();
const markWhatsAppEventReceived = vi.fn();
const markWhatsAppEventProcessed = vi.fn();
const markWhatsAppEventFailed = vi.fn();
const writeWhatsAppAudit = vi.fn();

vi.mock("server-only", () => ({}));
vi.mock("@/lib/analytics/server", () => ({ trackServerAppEvent }));
vi.mock("@/lib/server/whatsapp-inbound", () => ({ persistWhatsAppInbound }));
vi.mock("@/lib/server/whatsapp-status", () => ({ persistWhatsAppStatus }));
vi.mock("@/lib/server/whatsapp-audit", () => ({ writeWhatsAppAudit }));
vi.mock("@/lib/server/whatsapp-event-idempotency", () => ({ markWhatsAppEventReceived, markWhatsAppEventProcessed, markWhatsAppEventFailed }));

describe("WhatsApp webhook route", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.WHATSAPP_ENABLED = "true";
    process.env.WHATSAPP_VERIFY_TOKEN = "test-only-verify-token";
    process.env.WHATSAPP_APP_SECRET = "";
    markWhatsAppEventReceived.mockResolvedValue({ acquired: true, eventId: "event-1", retry: false });
    persistWhatsAppInbound.mockResolvedValue({ persisted: true, duplicate: false, userId: "user-1", messageId: "message-1", conversationId: "conversation-1" });
  });

  afterEach(() => {
    delete process.env.WHATSAPP_ENABLED;
    delete process.env.WHATSAPP_VERIFY_TOKEN;
    delete process.env.WHATSAPP_APP_SECRET;
  });

  it("responde ao challenge somente com token correto", async () => {
    const { GET } = await import("./route");
    const accepted = await GET(new Request("https://app.test/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=test-only-verify-token&hub.challenge=12345"));
    expect(accepted.status).toBe(200);
    expect(await accepted.text()).toBe("12345");

    const rejected = await GET(new Request("https://app.test/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=12345"));
    expect(rejected.status).toBe(403);
  });

  it("persiste inbound e nunca dispara envio automático", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { POST } = await import("./route");
    const payload = {
      object: "whatsapp_business_account",
      entry: [{ id: "waba", changes: [{ field: "messages", value: { metadata: { phone_number_id: "12345" }, messages: [{ from: "5511999999999", id: "wamid.1", timestamp: "1710000000", type: "text", text: { body: "Oi" } }] } }] }]
    };
    const response = await POST(new Request("https://app.test/api/whatsapp/webhook", { method: "POST", body: JSON.stringify(payload) }));
    expect(response.status).toBe(200);
    expect(persistWhatsAppInbound).toHaveBeenCalledTimes(1);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("rejeita assinatura inválida quando o App Secret está configurado", async () => {
    process.env.WHATSAPP_APP_SECRET = "test-only-app-secret";
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://app.test/api/whatsapp/webhook", {
        method: "POST",
        headers: { "x-hub-signature-256": `sha256=${"0".repeat(64)}` },
        body: JSON.stringify({ object: "whatsapp_business_account", entry: [] })
      })
    );
    expect(response.status).toBe(401);
    expect(persistWhatsAppInbound).not.toHaveBeenCalled();
  });

  it("ignora evento duplicado antes de persistir dados de negócio", async () => {
    markWhatsAppEventReceived
      .mockResolvedValueOnce({ acquired: true, eventId: "event-1", retry: false })
      .mockResolvedValueOnce({ acquired: false, eventId: "event-1", retry: false });
    const { POST } = await import("./route");
    const payload = {
      object: "whatsapp_business_account",
      entry: [{ id: "waba", changes: [{ field: "messages", value: { metadata: { phone_number_id: "12345" }, messages: [{ from: "5511999999999", id: "wamid.duplicate", timestamp: "1710000000", type: "text", text: { body: "Oi" } }] } }] }]
    };
    const first = await POST(new Request("https://app.test/api/whatsapp/webhook", { method: "POST", body: JSON.stringify(payload) }));
    const duplicate = await POST(new Request("https://app.test/api/whatsapp/webhook", { method: "POST", body: JSON.stringify(payload) }));
    expect(first.status).toBe(200);
    expect(duplicate.status).toBe(200);
    expect(persistWhatsAppInbound).toHaveBeenCalledTimes(1);
    expect(trackServerAppEvent).toHaveBeenCalledWith(expect.objectContaining({ event_name: "whatsapp_webhook_duplicate_ignored" }));
  });
});
