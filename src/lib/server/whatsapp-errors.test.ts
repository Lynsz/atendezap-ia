import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("normalizeWhatsAppProviderError", () => {
  let normalize: typeof import("./whatsapp-errors").normalizeWhatsAppProviderError;

  beforeAll(async () => {
    ({ normalizeWhatsAppProviderError: normalize } = await import("./whatsapp-errors"));
  });

  it("classifica 429 e indisponibilidade como retryable sem vazar erro bruto", () => {
    const error = normalize(429, { error: { code: 613, type: "OAuthException" } });
    expect(error.retryable).toBe(true);
    expect(error.errorType).toBe("provider_rate_limited");
    expect(error.message).not.toContain("OAuthException");
  });

  it("classifica token inválido e destinatário indisponível como permanentes", () => {
    expect(normalize(401, { error: { code: 190 } })).toMatchObject({ retryable: false, errorType: "provider_authentication" });
    expect(normalize(400, { error: { code: 131026 } })).toMatchObject({ retryable: false, errorType: "recipient_unavailable" });
  });
});
