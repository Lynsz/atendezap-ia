import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  send: vi.fn()
}));

vi.mock("server-only", () => ({}));

vi.mock("resend", () => ({
  Resend: vi.fn(function Resend() {
    return {
      emails: {
        send: mocks.send
      }
    };
  })
}));

describe("email transacional", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.send.mockReset();
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;
    process.env.NEXT_PUBLIC_APP_URL = "https://app.example.test";
  });

  it("nao quebra quando RESEND_API_KEY nao esta configurada", async () => {
    const { sendEbookDeliveryEmail } = await import("./email");
    const result = await sendEbookDeliveryEmail({ name: "Maria Cliente", email: "maria@example.com" });

    expect(result.status).toBe("skipped_not_configured");
    expect(result.error).toContain("RESEND_API_KEY");
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("nao envia quando EMAIL_FROM nao esta configurado", async () => {
    process.env.RESEND_API_KEY = "test_key";
    const { sendEbookDeliveryEmail } = await import("./email");
    const result = await sendEbookDeliveryEmail({ name: "Maria Cliente", email: "maria@example.com" });

    expect(result.status).toBe("skipped_not_configured");
    expect(result.error).toContain("EMAIL_FROM");
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("monta o e-mail do ebook com guia, demo, planos e aviso de solicitacao", async () => {
    const { buildEbookDeliveryEmail } = await import("./email");
    const email = buildEbookDeliveryEmail({ name: "Maria Cliente", email: "maria@example.com" });

    expect(email.subject).toBe("Seu guia gratuito do AtendeZap IA esta aqui");
    expect(email.text).toContain("https://app.example.test/ebook/guia");
    expect(email.text).toContain("https://app.example.test/demo");
    expect(email.html).toContain("Acessar guia gratuito");
    expect(email.html).toContain("Testar o AtendeZap IA");
    expect(email.html).toContain("solicitou o guia gratuito");
  });

  it("retorna sent com id do Resend quando envio funciona", async () => {
    process.env.RESEND_API_KEY = "test_key";
    process.env.EMAIL_FROM = "AtendeZap IA <noreply@example.test>";
    mocks.send.mockResolvedValueOnce({ data: { id: "email_123" }, error: null });

    const { sendEbookDeliveryEmail } = await import("./email");
    const result = await sendEbookDeliveryEmail({ name: "Maria Cliente", email: "maria@example.com" });

    expect(result).toMatchObject({
      status: "sent",
      provider: "resend",
      providerMessageId: "email_123",
      eventType: "ebook_delivery"
    });
    expect(mocks.send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "AtendeZap IA <noreply@example.test>",
        to: "maria@example.com",
        subject: "Seu guia gratuito do AtendeZap IA esta aqui"
      })
    );
  });

  it("retorna failed sem stack trace quando Resend retorna erro", async () => {
    process.env.RESEND_API_KEY = "test_key";
    process.env.EMAIL_FROM = "AtendeZap IA <noreply@example.test>";
    mocks.send.mockResolvedValueOnce({ data: null, error: { message: "Domain not verified" } });

    const { sendEbookDeliveryEmail } = await import("./email");
    const result = await sendEbookDeliveryEmail({ name: "Maria Cliente", email: "maria@example.com" });

    expect(result).toMatchObject({
      status: "failed",
      error: "Domain not verified"
    });
  });
});
