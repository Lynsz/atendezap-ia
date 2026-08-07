import "server-only";

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { AppError } from "@/lib/errors";
import { readServerEnv } from "@/lib/server/env";

const VERSION = "v1";

function encryptionKey() {
  const configured = readServerEnv("WHATSAPP_TOKEN_ENCRYPTION_KEY");
  if (!configured) return null;
  const value = configured.replace(/^base64:/i, "");
  const key = /^[a-f\d]{64}$/i.test(value) ? Buffer.from(value, "hex") : Buffer.from(value, "base64");
  return key.length === 32 ? key : null;
}

export function assertTokenEncryptionConfigured() {
  if (!encryptionKey()) {
    throw new AppError("O armazenamento seguro do token do WhatsApp não está configurado.", 503);
  }
}

export function encryptSecret(value: string) {
  const secret = value.trim();
  if (!secret) throw new AppError("O token recebido da Meta é inválido.", 502);
  const key = encryptionKey();
  if (!key) {
    throw new AppError("O armazenamento seguro do token do WhatsApp não está configurado.", 503);
  }
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, iv.toString("base64url"), tag.toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function decryptSecret(encryptedValue: string) {
  const key = encryptionKey();
  if (!key) {
    throw new AppError("O armazenamento seguro do token do WhatsApp não está configurado.", 503);
  }
  const [version, ivValue, tagValue, payloadValue] = encryptedValue.split(".");
  if (version !== VERSION || !ivValue || !tagValue || !payloadValue) {
    throw new AppError("A credencial da integração precisa ser reautorizada.", 409);
  }
  try {
    const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivValue, "base64url"));
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(payloadValue, "base64url")), decipher.final()]).toString("utf8");
  } catch {
    throw new AppError("A credencial da integração precisa ser reautorizada.", 409);
  }
}

export function maskSecret(value: string) {
  const normalized = value.trim();
  if (!normalized) return "••••";
  if (normalized.length <= 8) return "••••";
  return `${normalized.slice(0, 3)}••••${normalized.slice(-3)}`;
}
