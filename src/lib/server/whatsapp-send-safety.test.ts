import { beforeAll, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ enforceRateLimit: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/rate-limit", () => ({ enforceRateLimit: mocks.enforceRateLimit }));

describe("WhatsApp send safety", () => {
  let fingerprint: typeof import("./whatsapp-send-safety").createWhatsAppContentFingerprint;
  let retry: typeof import("./whatsapp-send-safety").sendWithControlledRetry;
  let enforceLimits: typeof import("./whatsapp-send-safety").enforceWhatsAppSendLimits;
  let ProviderError: typeof import("./whatsapp-errors").WhatsAppProviderError;

  beforeAll(async () => {
    ({ createWhatsAppContentFingerprint: fingerprint, sendWithControlledRetry: retry, enforceWhatsAppSendLimits: enforceLimits } = await import("./whatsapp-send-safety"));
    ({ WhatsAppProviderError: ProviderError } = await import("./whatsapp-errors"));
  });

  it("gera o mesmo hash para texto equivalente sem persistir o conteúdo", () => {
    const first = fingerprint("  Olá   CLIENTE ");
    expect(first).toBe(fingerprint("olá cliente"));
    expect(first).toMatch(/^[a-f0-9]{64}$/);
    expect(first).not.toContain("cliente");
  });

  it("faz no máximo um retry para falha transitória", async () => {
    const operation = vi.fn()
      .mockRejectedValueOnce(new ProviderError("temporário", 503, "provider_transient", true))
      .mockResolvedValueOnce("ok");
    await expect(retry(operation)).resolves.toEqual({ value: "ok", attempts: 2 });
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("não repete falha permanente", async () => {
    const operation = vi.fn().mockRejectedValue(new ProviderError("permanente", 502, "provider_rejected", false));
    await expect(retry(operation)).rejects.toMatchObject({ retryable: false, attempts: 1 });
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it("encerra falha transitória depois de duas tentativas totais", async () => {
    const operation = vi.fn().mockRejectedValue(new ProviderError("temporário", 503, "provider_transient", true));
    await expect(retry(operation)).rejects.toMatchObject({ retryable: true, attempts: 2 });
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("normaliza limite excedido por usuário ou conversa", async () => {
    mocks.enforceRateLimit.mockRejectedValueOnce(new Error("backend indisponível ou limite"));
    await expect(enforceLimits({
      request: new Request("https://app.test/api/whatsapp"),
      userId: "user-a",
      conversationId: "conversation-a",
      messageType: "text"
    })).rejects.toMatchObject({ status: 429, errorType: "rate_limit", retryable: true });
  });
});
