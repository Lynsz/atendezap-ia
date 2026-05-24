import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendEbookDeliveryEmail: vi.fn(),
  getSupabaseAdmin: vi.fn(),
  leadUpsertPayload: null as Record<string, unknown> | null,
  emailEventPayload: null as Record<string, unknown> | null,
  leadSaveError: null as Error | null
}));

vi.mock("@/lib/rate-limit", () => ({
  assertRequestSize: vi.fn(),
  enforceRateLimit: vi.fn(async () => ({ ip: "127.0.0.1" }))
}));

vi.mock("@/lib/events", () => ({
  logEvent: vi.fn()
}));

vi.mock("@/lib/email", () => ({
  sendEbookDeliveryEmail: mocks.sendEbookDeliveryEmail
}));

vi.mock("@/lib/logger", () => ({
  serverLog: vi.fn()
}));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseAdmin: mocks.getSupabaseAdmin
}));

function createSupabaseMock() {
  return {
    from: vi.fn((table: string) => {
      if (table === "ebook_leads") {
        return {
          upsert: vi.fn((payload: Record<string, unknown>) => {
            mocks.leadUpsertPayload = payload;
            return {
              select: vi.fn(() => ({
                single: vi.fn(async () => ({
                  data: mocks.leadSaveError ? null : { id: "lead_1" },
                  error: mocks.leadSaveError
                }))
              }))
            };
          })
        };
      }

      if (table === "lead_email_events") {
        return {
          insert: vi.fn(async (payload: Record<string, unknown>) => {
            mocks.emailEventPayload = payload;
            return { error: null };
          })
        };
      }

      throw new Error(`Tabela inesperada no teste: ${table}`);
    })
  };
}

function createRequest(body: Record<string, unknown>) {
  return new Request("https://app.example.test/api/ebook-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }) as never;
}

const validLead = {
  name: "Cliente Teste",
  email: "Cliente@Example.com",
  whatsapp: "(11) 99999-9999",
  business_type: "Autonomo",
  source: "ebook_page",
  utm_source: "meta",
  utm_medium: "cpc",
  utm_campaign: "campanha-maio",
  utm_content: "criativo-1",
  utm_term: "whatsapp ia"
};

describe("POST /api/ebook-lead", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.sendEbookDeliveryEmail.mockReset().mockResolvedValue({
      eventType: "ebook_delivery",
      status: "skipped_not_configured",
      subject: "Seu guia gratuito do AtendeZap IA esta aqui",
      provider: "resend",
      error: "RESEND_API_KEY nao configurada."
    });
    mocks.getSupabaseAdmin.mockReset().mockReturnValue(createSupabaseMock());
    mocks.leadUpsertPayload = null;
    mocks.emailEventPayload = null;
    mocks.leadSaveError = null;
  });

  it("retorna 400 quando nome esta ausente", async () => {
    const { POST } = await import("./route");
    const response = await POST(createRequest({ email: "cliente@example.com", business_type: "Autonomo" }));

    expect(response.status).toBe(400);
  });

  it("retorna 400 quando e-mail esta ausente", async () => {
    const { POST } = await import("./route");
    const response = await POST(createRequest({ name: "Cliente Teste", business_type: "Autonomo" }));

    expect(response.status).toBe(400);
  });

  it("retorna 400 para e-mail invalido", async () => {
    const { POST } = await import("./route");
    const response = await POST(createRequest({ name: "Cliente Teste", email: "email-invalido", business_type: "Autonomo" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("Dados");
    expect(body.details.email[0]).toContain("e-mail valido");
  });

  it("salva lead valido, preserva UTMs e registra skipped_not_configured sem quebrar o fluxo", async () => {
    const { POST } = await import("./route");
    const response = await POST(createRequest(validLead));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ ok: true, redirectTo: "/ebook/obrigado", emailStatus: "skipped_not_configured" });
    expect(mocks.leadUpsertPayload).toMatchObject({
      name: "Cliente Teste",
      email: "cliente@example.com",
      whatsapp: "(11) 99999-9999",
      business_type: "Autonomo",
      source: "ebook_page",
      utm_source: "meta",
      utm_medium: "cpc",
      utm_campaign: "campanha-maio",
      utm_content: "criativo-1",
      utm_term: "whatsapp ia"
    });
    expect(mocks.emailEventPayload).toMatchObject({
      lead_id: "lead_1",
      email: "cliente@example.com",
      event_type: "ebook_delivery",
      status: "skipped_not_configured",
      error: "RESEND_API_KEY nao configurada."
    });
  });

  it("registra status sent quando Resend envia o ebook", async () => {
    mocks.sendEbookDeliveryEmail.mockResolvedValueOnce({
      eventType: "ebook_delivery",
      status: "sent",
      subject: "Seu guia gratuito do AtendeZap IA esta aqui",
      provider: "resend",
      providerMessageId: "email_123"
    });
    const { POST } = await import("./route");
    const response = await POST(createRequest(validLead));

    expect(response.status).toBe(200);
    expect(mocks.emailEventPayload).toMatchObject({
      status: "sent",
      provider_message_id: "email_123",
      error: null
    });
    expect(mocks.emailEventPayload?.sent_at).toEqual(expect.any(String));
  });

  it("registra status failed quando Resend falha sem perder o lead", async () => {
    mocks.sendEbookDeliveryEmail.mockResolvedValueOnce({
      eventType: "ebook_delivery",
      status: "failed",
      subject: "Seu guia gratuito do AtendeZap IA esta aqui",
      provider: "resend",
      error: "Dominio nao verificado."
    });
    const { POST } = await import("./route");
    const response = await POST(createRequest(validLead));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.emailStatus).toBe("failed");
    expect(mocks.leadUpsertPayload).toMatchObject({ email: "cliente@example.com" });
    expect(mocks.emailEventPayload).toMatchObject({
      status: "failed",
      error: "Dominio nao verificado."
    });
  });

  it("retorna erro amigavel e nao envia e-mail quando salvar lead falha", async () => {
    mocks.leadSaveError = new Error("database unavailable");
    const { POST } = await import("./route");
    const response = await POST(createRequest(validLead));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toContain("Nao foi possivel liberar o guia");
    expect(mocks.sendEbookDeliveryEmail).not.toHaveBeenCalled();
    expect(mocks.emailEventPayload).toBeNull();
  });
});
