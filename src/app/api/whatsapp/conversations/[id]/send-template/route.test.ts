import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  sendWhatsAppTemplateMessage: vi.fn(),
  trackServerAppEvent: vi.fn(),
  getSupabaseAdmin: vi.fn(),
  enforceWhatsAppSendLimits: vi.fn(),
  writeWhatsAppAudit: vi.fn()
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
  createWhatsAppSendAttempt: vi.fn(),
  updateWhatsAppSendAttempt: vi.fn(),
  enforceWhatsAppSendLimits: mocks.enforceWhatsAppSendLimits,
  sendWithControlledRetry: vi.fn()
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
    expect(mocks.trackServerAppEvent).toHaveBeenCalledWith(expect.objectContaining({ event_name: "whatsapp_template_not_approved" }));
  });
});
