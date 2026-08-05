import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";

const mocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  sendWhatsAppTemplateMessage: vi.fn(),
  trackServerAppEvent: vi.fn(),
  getSupabaseAdmin: vi.fn(),
  enforceWhatsAppSendLimits: vi.fn(),
  writeWhatsAppAudit: vi.fn(),
  createWhatsAppSendAttempt: vi.fn(),
  updateWhatsAppSendAttempt: vi.fn(),
  sendWithControlledRetry: vi.fn()
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/server", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/lib/server/whatsapp", () => ({ sendWhatsAppTemplateMessage: mocks.sendWhatsAppTemplateMessage }));
vi.mock("@/lib/analytics/server", () => ({ trackServerAppEvent: mocks.trackServerAppEvent }));
vi.mock("@/lib/rate-limit", () => ({ assertRequestSize: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ getSupabaseAdmin: mocks.getSupabaseAdmin }));
vi.mock("@/lib/server/whatsapp-audit", () => ({ writeWhatsAppAudit: mocks.writeWhatsAppAudit }));
vi.mock("@/lib/server/whatsapp-send-safety", () => ({
  createWhatsAppContentFingerprint: vi.fn(() => "fingerprint"),
  createWhatsAppSendAttempt: mocks.createWhatsAppSendAttempt,
  updateWhatsAppSendAttempt: mocks.updateWhatsAppSendAttempt,
  enforceWhatsAppSendLimits: mocks.enforceWhatsAppSendLimits,
  sendWithControlledRetry: mocks.sendWithControlledRetry
}));

const conversationId = "11111111-1111-4111-8111-111111111111";
const templateId = "22222222-2222-4222-8222-222222222222";

function queuedSupabase(results: Array<{ data?: unknown; error?: unknown }>) {
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

describe("POST WhatsApp send-template", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireUser.mockResolvedValue({ id: "user-a" });
    mocks.sendWhatsAppTemplateMessage.mockResolvedValue({ messageId: "wamid.safe" });
    mocks.createWhatsAppSendAttempt.mockResolvedValue({ acquired: true, attempt: { id: "attempt-1" } });
    mocks.updateWhatsAppSendAttempt.mockResolvedValue(undefined);
    mocks.sendWithControlledRetry.mockImplementation(async (operation: () => Promise<unknown>) => ({ value: await operation(), attempts: 1 }));
  });

  it("bloqueia template não aprovado sem chamar a Meta", async () => {
    mocks.getSupabaseAdmin.mockReturnValue(queuedSupabase([
      { data: { id: conversationId, contact_id: "contact-1", connection_id: "connection-1" }, error: null },
      { data: { id: "contact-1", phone_number: "5511999999999", opt_in_status: "opted_in" }, error: null },
      { data: { id: "connection-1", status: "active" }, error: null },
      { data: { id: templateId, connection_id: "connection-1", name: "boas_vindas", language: "pt_BR", status: "pending", variables_count: 0 }, error: null }
    ]));
    const { POST } = await import("./route");
    const response = await POST(new Request(`https://app.test/api/whatsapp/conversations/${conversationId}/send-template`, {
      method: "POST",
      headers: { Authorization: "Bearer test-only", "Content-Type": "application/json" },
      body: JSON.stringify({ templateId, variables: [], confirmSend: true, clientRequestId: "33333333-3333-4333-8333-333333333333" })
    }), { params: Promise.resolve({ id: conversationId }) });
    expect(response.status).toBe(409);
    expect(mocks.sendWhatsAppTemplateMessage).not.toHaveBeenCalled();
    expect(mocks.trackServerAppEvent).toHaveBeenCalledWith(expect.objectContaining({ event_name: "whatsapp_template_send_blocked_status" }));
  });

  it.each(["pending", "rejected", "disabled"])("bloqueia status remoto %s", async (remoteStatus) => {
    mocks.getSupabaseAdmin.mockReturnValue(queuedSupabase([
      { data: { id: conversationId, contact_id: "contact-1", connection_id: "connection-1" }, error: null },
      { data: { id: "contact-1", phone_number: "5511999999999", opt_in_status: "opted_in" }, error: null },
      { data: { id: "connection-1", status: "active" }, error: null },
      { data: { id: templateId, connection_id: "connection-1", meta_template_id: "meta-1", name: "retorno", language: "pt_BR", category: "utility", status: remoteStatus, remote_status: remoteStatus, local_status: "active", variables_schema: [], variables_count: 0 }, error: null }
    ]));
    const { POST } = await import("./route");
    const response = await POST(new Request(`https://app.test/api/whatsapp/conversations/${conversationId}/send-template`, {
      method: "POST",
      headers: { Authorization: "Bearer test-only", "Content-Type": "application/json" },
      body: JSON.stringify({ templateId, variables: [], confirmSend: true, clientRequestId: "33333333-3333-4333-8333-333333333333" })
    }), { params: Promise.resolve({ id: conversationId }) });
    expect(response.status).toBe(409);
    expect(mocks.sendWhatsAppTemplateMessage).not.toHaveBeenCalled();
    expect(mocks.writeWhatsAppAudit).toHaveBeenCalledWith(expect.objectContaining({ action: "template_send_blocked_status" }));
  });

  it("envia template aprovado com variáveis validadas e confirmação explícita", async () => {
    mocks.getSupabaseAdmin.mockReturnValue(queuedSupabase([
      { data: { id: conversationId, contact_id: "contact-1", connection_id: "connection-1" }, error: null },
      { data: { id: "contact-1", phone_number: "5511999999999", opt_in_status: "opted_in" }, error: null },
      { data: { id: "connection-1", status: "active" }, error: null },
      { data: { id: templateId, connection_id: "connection-1", meta_template_id: "meta-1", meta_template_name: "retorno", name: "retorno", language: "pt_BR", category: "utility", status: "approved", remote_status: "approved", local_status: "active", variables_schema: [{ key: "body.1", component: "body", position: 1, name: "cliente", type: "text" }], variables_count: 1 }, error: null },
      { data: { id: "message-1" }, error: null },
      { data: { id: "message-1", direction: "outbound", message_type: "template", status: "sent", provider_created_at: new Date().toISOString(), created_at: new Date().toISOString() }, error: null },
      { data: null, error: null }
    ]));
    const { POST } = await import("./route");
    const response = await POST(new Request(`https://app.test/api/whatsapp/conversations/${conversationId}/send-template`, {
      method: "POST",
      headers: { Authorization: "Bearer test-only", "Content-Type": "application/json" },
      body: JSON.stringify({ templateId, variables: ["Ana"], confirmSend: true, clientRequestId: "33333333-3333-4333-8333-333333333333" })
    }), { params: Promise.resolve({ id: conversationId }) });
    expect(response.status).toBe(201);
    expect(mocks.sendWhatsAppTemplateMessage).toHaveBeenCalledWith(expect.objectContaining({ name: "retorno", variables: ["Ana"] }));
  });

  it("exige confirmSend verdadeiro", async () => {
    const { POST } = await import("./route");
    const response = await POST(new Request(`https://app.test/api/whatsapp/conversations/${conversationId}/send-template`, {
      method: "POST",
      headers: { Authorization: "Bearer test-only", "Content-Type": "application/json" },
      body: JSON.stringify({ templateId, variables: [], confirmSend: false, clientRequestId: "33333333-3333-4333-8333-333333333333" })
    }), { params: Promise.resolve({ id: conversationId }) });
    expect(response.status).toBe(400);
    expect(mocks.sendWhatsAppTemplateMessage).not.toHaveBeenCalled();
  });

  it("bloqueia opt-out antes de criar tentativa ou chamar a Meta", async () => {
    mocks.getSupabaseAdmin.mockReturnValue(queuedSupabase([
      { data: { id: conversationId, contact_id: "contact-1", connection_id: "connection-1" }, error: null },
      { data: { id: "contact-1", phone_number: "5511999999999", opt_in_status: "opted_out" }, error: null },
      { data: { id: "connection-1", status: "active" }, error: null },
      { data: { id: templateId, connection_id: "connection-1", meta_template_id: "meta-1", name: "retorno", language: "pt_BR", status: "approved", remote_status: "approved", local_status: "active", variables_schema: [], variables_count: 0 }, error: null }
    ]));
    const { POST } = await import("./route");
    const response = await POST(new Request(`https://app.test/api/whatsapp/conversations/${conversationId}/send-template`, {
      method: "POST",
      headers: { Authorization: "Bearer test-only", "Content-Type": "application/json" },
      body: JSON.stringify({ templateId, variables: [], confirmSend: true, clientRequestId: "33333333-3333-4333-8333-333333333333" })
    }), { params: Promise.resolve({ id: conversationId }) });
    expect(response.status).toBe(403);
    expect(mocks.createWhatsAppSendAttempt).not.toHaveBeenCalled();
    expect(mocks.sendWhatsAppTemplateMessage).not.toHaveBeenCalled();
  });

  it("não permite enviar template de outro usuário", async () => {
    mocks.getSupabaseAdmin.mockReturnValue(queuedSupabase([
      { data: { id: conversationId, contact_id: "contact-1", connection_id: "connection-1" }, error: null },
      { data: { id: "contact-1", phone_number: "5511999999999", opt_in_status: "opted_in" }, error: null },
      { data: { id: "connection-1", status: "active" }, error: null },
      { data: null, error: null }
    ]));
    const { POST } = await import("./route");
    const response = await POST(new Request(`https://app.test/api/whatsapp/conversations/${conversationId}/send-template`, {
      method: "POST",
      headers: { Authorization: "Bearer test-only", "Content-Type": "application/json" },
      body: JSON.stringify({ templateId, variables: [], confirmSend: true, clientRequestId: "33333333-3333-4333-8333-333333333333" })
    }), { params: Promise.resolve({ id: conversationId }) });
    expect(response.status).toBe(404);
    expect(mocks.sendWhatsAppTemplateMessage).not.toHaveBeenCalled();
  });

  it("bloqueia variável ausente ou longa antes da Meta", async () => {
    const rows = () => queuedSupabase([
      { data: { id: conversationId, contact_id: "contact-1", connection_id: "connection-1" }, error: null },
      { data: { id: "contact-1", phone_number: "5511999999999", opt_in_status: "opted_in" }, error: null },
      { data: { id: "connection-1", status: "active" }, error: null },
      { data: { id: templateId, connection_id: "connection-1", meta_template_id: "meta-1", name: "retorno", language: "pt_BR", category: "utility", status: "approved", remote_status: "approved", local_status: "active", variables_schema: [{ key: "body.1", component: "body", position: 1, name: "cliente", type: "text" }], variables_count: 1 }, error: null }
    ]);
    const request = (variables: string[]) => new Request(`https://app.test/api/whatsapp/conversations/${conversationId}/send-template`, {
      method: "POST",
      headers: { Authorization: "Bearer test-only", "Content-Type": "application/json" },
      body: JSON.stringify({ templateId, variables, confirmSend: true, clientRequestId: "33333333-3333-4333-8333-333333333333" })
    });
    const { POST } = await import("./route");
    mocks.getSupabaseAdmin.mockReturnValueOnce(rows());
    expect((await POST(request([]), { params: Promise.resolve({ id: conversationId }) })).status).toBe(400);
    mocks.getSupabaseAdmin.mockReturnValueOnce(rows());
    expect((await POST(request(["a".repeat(201)]), { params: Promise.resolve({ id: conversationId }) })).status).toBe(400);
    expect(mocks.sendWhatsAppTemplateMessage).not.toHaveBeenCalled();
  });

  it("preserva o rate limit do envio de templates", async () => {
    mocks.enforceWhatsAppSendLimits.mockRejectedValueOnce(new AppError("Muitos envios.", 429));
    const { POST } = await import("./route");
    const response = await POST(new Request(`https://app.test/api/whatsapp/conversations/${conversationId}/send-template`, {
      method: "POST",
      headers: { Authorization: "Bearer test-only", "Content-Type": "application/json" },
      body: JSON.stringify({ templateId, variables: [], confirmSend: true, clientRequestId: "33333333-3333-4333-8333-333333333333" })
    }), { params: Promise.resolve({ id: conversationId }) });
    expect(response.status).toBe(429);
    expect(mocks.sendWhatsAppTemplateMessage).not.toHaveBeenCalled();
  });
});
