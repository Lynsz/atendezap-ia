import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { AppError } from "@/lib/errors";
import { assertTokenEncryptionConfigured, decryptSecret, encryptSecret, maskSecret } from "@/lib/server/secure-token-store";

describe("secure WhatsApp token store", () => {
  const originalKey = process.env.WHATSAPP_TOKEN_ENCRYPTION_KEY;

  afterEach(() => {
    if (originalKey === undefined) delete process.env.WHATSAPP_TOKEN_ENCRYPTION_KEY;
    else process.env.WHATSAPP_TOKEN_ENCRYPTION_KEY = originalKey;
  });

  it("encrypts with authenticated encryption and decrypts only server-side", () => {
    process.env.WHATSAPP_TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
    const token = "test-whatsapp-token-for-encryption";
    const encrypted = encryptSecret(token);

    expect(encrypted).toMatch(/^v1\./);
    expect(encrypted).not.toContain(token);
    expect(decryptSecret(encrypted)).toBe(token);
  });

  it("blocks storage when the encryption key is absent or invalid", () => {
    delete process.env.WHATSAPP_TOKEN_ENCRYPTION_KEY;
    expect(() => assertTokenEncryptionConfigured()).toThrow(AppError);
    expect(() => encryptSecret("test-whatsapp-token")).toThrow(/armazenamento seguro/i);
  });

  it("rejects tampered ciphertext and masks identifiers", () => {
    process.env.WHATSAPP_TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 9).toString("base64");
    const encrypted = encryptSecret("test-whatsapp-token");
    const [version, iv, tag, payload] = encrypted.split(".");
    const tamperedTag = `${tag.startsWith("A") ? "B" : "A"}${tag.slice(1)}`;
    expect(() => decryptSecret([version, iv, tamperedTag, payload].join("."))).toThrow(/reautorizada/i);
    expect(maskSecret("123456789012")).toMatch(/^123.+012$/);
  });
});
