import { createHmac } from "node:crypto";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("verifyWhatsAppWebhookSignature", () => {
  let verify: typeof import("./whatsapp-webhook-signature").verifyWhatsAppWebhookSignature;

  beforeAll(async () => {
    ({ verifyWhatsAppWebhookSignature: verify } = await import("./whatsapp-webhook-signature"));
  });

  it("aceita assinatura sha256 válida", () => {
    const body = '{"object":"whatsapp_business_account"}';
    const secret = "test-only-app-secret";
    const signature = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
    expect(verify(body, signature, secret)).toEqual({ required: true, valid: true });
  });

  it("recusa assinatura ausente ou alterada quando o segredo existe", () => {
    expect(verify("body", null, "test-only-app-secret").valid).toBe(false);
    expect(verify("body", `sha256=${"0".repeat(64)}`, "test-only-app-secret").valid).toBe(false);
  });

  it("marca validação como opcional quando não há App Secret", () => {
    expect(verify("body", null, null)).toEqual({ required: false, valid: true });
  });
});
