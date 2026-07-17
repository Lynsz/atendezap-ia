import "server-only";

import { z } from "zod";
import { AppError } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { isWhatsAppEnabled as readWhatsAppEnabled, readServerEnv } from "@/lib/server/env";

const apiVersionSchema = z.string().regex(/^v\d+\.\d+$/);
const phoneNumberIdSchema = z.string().regex(/^\d{5,30}$/);
const recipientSchema = z.string().regex(/^\d{7,15}$/);

export type WhatsAppServerConfig = {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  verifyToken: string;
  appSecret: string | null;
  apiVersion: string;
};

export function isWhatsAppEnabled() {
  return readWhatsAppEnabled();
}

function requireValue(name: Parameters<typeof readServerEnv>[0], message: string) {
  const value = readServerEnv(name);
  if (!value) throw new AppError(message, 503);
  return value;
}

export function getWhatsAppServerConfig(): WhatsAppServerConfig {
  if (!isWhatsAppEnabled()) {
    throw new AppError("A integração com WhatsApp está desativada neste ambiente.", 503);
  }

  const accessToken = requireValue("WHATSAPP_ACCESS_TOKEN", "O token da WhatsApp Cloud API não está configurado.");
  const phoneNumberId = requireValue("WHATSAPP_PHONE_NUMBER_ID", "O número da WhatsApp Cloud API não está configurado.");
  const businessAccountId = requireValue("WHATSAPP_BUSINESS_ACCOUNT_ID", "A conta empresarial do WhatsApp não está configurada.");
  const verifyToken = requireValue("WHATSAPP_VERIFY_TOKEN", "O token de verificação do webhook não está configurado.");
  const apiVersion = requireValue("WHATSAPP_API_VERSION", "A versão da WhatsApp Cloud API não está configurada.");

  if (!apiVersionSchema.safeParse(apiVersion).success || !phoneNumberIdSchema.safeParse(phoneNumberId).success) {
    throw new AppError("A configuração da WhatsApp Cloud API é inválida.", 503);
  }

  return {
    accessToken,
    phoneNumberId,
    businessAccountId,
    verifyToken,
    appSecret: readServerEnv("WHATSAPP_APP_SECRET") || null,
    apiVersion
  };
}

export const getWhatsAppConfig = getWhatsAppServerConfig;

export function getWhatsAppWebhookConfig() {
  if (!isWhatsAppEnabled()) {
    throw new AppError("A integração com WhatsApp está desativada neste ambiente.", 503);
  }

  const appSecret = readServerEnv("WHATSAPP_APP_SECRET") || null;
  if (process.env.NODE_ENV === "production" && !appSecret) {
    throw new AppError("O App Secret do WhatsApp é obrigatório em produção.", 503);
  }

  return {
    verifyToken: requireValue("WHATSAPP_VERIFY_TOKEN", "O token de verificação do webhook não está configurado."),
    appSecret
  };
}

export function getWhatsAppSafeStatus() {
  const enabled = isWhatsAppEnabled();
  const requiredNames = [
    "WHATSAPP_ACCESS_TOKEN",
    "WHATSAPP_PHONE_NUMBER_ID",
    "WHATSAPP_BUSINESS_ACCOUNT_ID",
    "WHATSAPP_VERIFY_TOKEN",
    "WHATSAPP_API_VERSION"
  ] as const;
  const missing = requiredNames.filter((name) => !readServerEnv(name));

  const maskIdentifier = (value: string) => (value.length <= 6 ? "••••" : `${value.slice(0, 3)}••••${value.slice(-3)}`);
  return {
    enabled,
    configured: enabled && missing.length === 0,
    signatureValidation: Boolean(readServerEnv("WHATSAPP_APP_SECRET")),
    missing,
    phoneNumberIdMasked: readServerEnv("WHATSAPP_PHONE_NUMBER_ID") ? maskIdentifier(readServerEnv("WHATSAPP_PHONE_NUMBER_ID")) : null,
    businessAccountIdMasked: readServerEnv("WHATSAPP_BUSINESS_ACCOUNT_ID") ? maskIdentifier(readServerEnv("WHATSAPP_BUSINESS_ACCOUNT_ID")) : null
  };
}

export async function sendWhatsAppTextMessage(input: { to: string; text: string }) {
  const config = getWhatsAppServerConfig();
  const to = recipientSchema.parse(input.to.replace(/^\+/, ""));
  const message = input.text.trim();
  if (!message || message.length > 4096) {
    throw new AppError("A resposta deve ter entre 1 e 4.096 caracteres.", 400);
  }

  const graphBaseUrl = `https://graph.facebook.com/${config.apiVersion}`;
  const response = await fetch(`${graphBaseUrl}/${config.phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body: message }
    }),
    cache: "no-store"
  });

  const body = (await response.json().catch(() => null)) as { messages?: Array<{ id?: string }> } | null;
  const messageId = body?.messages?.[0]?.id?.trim();
  if (!response.ok || !messageId) {
    serverLog({
      level: "warn",
      event: "whatsapp_cloud_api_send_failed",
      route: "src/lib/server/whatsapp",
      status: response.status,
      metadata: { error_type: "provider_rejected" }
    });
    throw new AppError("O WhatsApp não aceitou o envio. Revise a conexão e tente novamente.", 502);
  }

  return { messageId };
}
