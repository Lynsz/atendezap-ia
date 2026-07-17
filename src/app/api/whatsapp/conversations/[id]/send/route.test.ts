import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";

const mocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  sendWhatsAppTextMessage: vi.fn(),
  trackServerAppEvent: vi.fn(),
  enforceRateLimit: vi.fn(),
  getSupabaseAdmin: vi.fn()
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/server", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/lib/server/whatsapp", () => ({ sendWhatsAppTextMessage: mocks.sendWhatsAppTextMessage }));
vi.mock("@/lib/analytics/server", () => ({ trackServerAppEvent: mocks.trackServerAppEvent }));
vi.mock("@/lib/rate-limit", () => ({ assertRequestSize: vi.fn(), enforceRateLimit: mocks.enforceRateLimit }));
vi.mock("@/lib/supabase/server", () => ({ getSupabaseAdmin: mocks.getSupabaseAdmin }));

const conversationId = "11111111-1111-4111-8111-111111111111";
const contactId = "22222222-2222-4222-8222-222222222222";
const connectionId = "33333333-3333-4333-8333-333333333333";

function createQueuedSupabase(results: Array<{ data?: unknown; error?: unknown }>) {
  return {
    from: vi.fn(() => {
      const result = results.shift() || { data: null, error: null };
      const chain: Record<string, unknown> = {};
      for (const method of ["select", "eq", "insert", "update", "in", "order", "limit", "not"]) {
        chain[method] = vi.fn(() => chain);
      }
      chain.single = vi.fn(() => Promise.resolve(result));
      chain.maybeSingle = vi.fn(() => Promise.resolve(result));
      chain.then = (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) => Promise.resolve(result).then(resolve, reject);
      return chain;
    })
  };
}

function request(body: Record<string, unknown>) {
  return new Request(`https://app.test/api/whatsapp/conversations/${conversationId}/send`, {
    method: "POST",
    headers: { Authorization: "Bearer test-only-token", "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

function validBody() {
  return { text: "Resposta revisada", confirmSend: true, idempotencyKey: "44444444-4444-4444-8444-444444444444" };
}

describe("POST WhatsApp send", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireUser.mockResolvedValue({ id: "user-a" });
    mocks.sendWhatsAppTextMessage.mockResolvedValue({ messageId: "wamid.sent" });
  });

  it("exige login", async () => {
    mocks.requireUser.mockRejectedValue(new AppError("Sessão inválida.", 401));
    const { POST } = await import("./route");
    const response = await POST(request(validBody()), { params: Promise.resolve({ id: conversationId }) });
    expect(response.status).toBe(401);
    expect(mocks.sendWhatsAppTextMessage).not.toHaveBeenCalled();
  });

  it("exige confirmação explícita no body", async () => {
    const { POST } = await import("./route");
    const response = await POST(request({ ...validBody(), confirmSend: false }), { params: Promise.resolve({ id: conversationId }) });
    expect(response.status).toBe(400);
    expect(mocks.sendWhatsAppTextMessage).not.toHaveBeenCalled();
  });

  it("bloqueia janela de 24 horas fechada", async () => {
    mocks.getSupabaseAdmin.mockReturnValue(
      createQueuedSupabase([
        { data: { id: conversationId, contact_id: contactId, connection_id: connectionId, customer_service_window_until: "2020-01-01T00:00:00.000Z" }, error: null },
        { data: { id: contactId, phone_number: "5511999999999", opt_in_status: "opted_in" }, error: null },
        { data: { id: connectionId, status: "active" }, error: null }
      ])
    );
    const { POST } = await import("./route");
    const response = await POST(request(validBody()), { params: Promise.resolve({ id: conversationId }) });
    expect(response.status).toBe(403);
    expect(mocks.sendWhatsAppTextMessage).not.toHaveBeenCalled();
    expect(mocks.trackServerAppEvent).toHaveBeenCalledWith(expect.objectContaining({ event_name: "whatsapp_reply_blocked_window_closed" }));
  });

  it("bloqueia contato com opt-out", async () => {
    mocks.getSupabaseAdmin.mockReturnValue(
      createQueuedSupabase([
        { data: { id: conversationId, contact_id: contactId, connection_id: connectionId, customer_service_window_until: "2099-01-01T00:00:00.000Z" }, error: null },
        { data: { id: contactId, phone_number: "5511999999999", opt_in_status: "opted_out" }, error: null },
        { data: { id: connectionId, status: "active" }, error: null }
      ])
    );
    const { POST } = await import("./route");
    const response = await POST(request(validBody()), { params: Promise.resolve({ id: conversationId }) });
    expect(response.status).toBe(403);
    expect(mocks.sendWhatsAppTextMessage).not.toHaveBeenCalled();
  });

  it("envia pelo helper server-side e não retorna token", async () => {
    mocks.getSupabaseAdmin.mockReturnValue(
      createQueuedSupabase([
        { data: { id: conversationId, contact_id: contactId, connection_id: connectionId, customer_service_window_until: "2099-01-01T00:00:00.000Z" }, error: null },
        { data: { id: contactId, phone_number: "5511999999999", opt_in_status: "opted_in" }, error: null },
        { data: { id: connectionId, status: "active" }, error: null },
        { data: null, error: null },
        { data: { id: "message-pending" }, error: null },
        { data: { id: "message-pending", direction: "outbound", message_type: "text", text: "Resposta revisada", status: "sent", created_at: new Date().toISOString() }, error: null },
        { data: null, error: null }
      ])
    );
    const { POST } = await import("./route");
    const response = await POST(request(validBody()), { params: Promise.resolve({ id: conversationId }) });
    const body = await response.json();
    expect(response.status).toBe(201);
    expect(mocks.sendWhatsAppTextMessage).toHaveBeenCalledWith({ to: "5511999999999", text: "Resposta revisada" });
    expect(JSON.stringify(body)).not.toContain("token");
    expect(JSON.stringify(body)).not.toContain("EAA");
  });
});
