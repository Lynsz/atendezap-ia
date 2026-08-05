import "server-only";

import { z } from "zod";
import { AppError } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { isWhatsAppEnabled as readWhatsAppEnabled, readServerEnv } from "@/lib/server/env";
import { normalizeWhatsAppProviderError, toWhatsAppProviderError } from "@/lib/server/whatsapp-errors";
import { buildTemplateSendComponents, type WhatsAppTemplateVariable } from "@/lib/whatsapp/template-validation";

const apiVersionSchema = z.string().regex(/^v\d+\.\d+$/);
const phoneNumberIdSchema = z.string().regex(/^\d{5,30}$/);
const recipientSchema = z.string().regex(/^\d{7,15}$/);
const mediaIdSchema = z.string().trim().min(1).max(255);

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
  if (!isWhatsAppEnabled()) throw new AppError("A integração com WhatsApp está desativada neste ambiente.", 503);
  const accessToken = requireValue("WHATSAPP_ACCESS_TOKEN", "O token da WhatsApp Cloud API não está configurado.");
  const phoneNumberId = requireValue("WHATSAPP_PHONE_NUMBER_ID", "O número da WhatsApp Cloud API não está configurado.");
  const businessAccountId = requireValue("WHATSAPP_BUSINESS_ACCOUNT_ID", "A conta empresarial do WhatsApp não está configurada.");
  const verifyToken = requireValue("WHATSAPP_VERIFY_TOKEN", "O token de verificação do webhook não está configurado.");
  const apiVersion = requireValue("WHATSAPP_API_VERSION", "A versão da WhatsApp Cloud API não está configurada.");
  if (!apiVersionSchema.safeParse(apiVersion).success || !phoneNumberIdSchema.safeParse(phoneNumberId).success) {
    throw new AppError("A configuração da WhatsApp Cloud API é inválida.", 503);
  }
  return { accessToken, phoneNumberId, businessAccountId, verifyToken, appSecret: readServerEnv("WHATSAPP_APP_SECRET") || null, apiVersion };
}

export const getWhatsAppConfig = getWhatsAppServerConfig;

export function getWhatsAppWebhookConfig() {
  if (!isWhatsAppEnabled()) throw new AppError("A integração com WhatsApp está desativada neste ambiente.", 503);
  const appSecret = readServerEnv("WHATSAPP_APP_SECRET") || null;
  if (process.env.NODE_ENV === "production" && !appSecret) throw new AppError("O App Secret do WhatsApp é obrigatório em produção.", 503);
  return {
    verifyToken: requireValue("WHATSAPP_VERIFY_TOKEN", "O token de verificação do webhook não está configurado."),
    appSecret
  };
}

export function getWhatsAppSafeStatus() {
  const enabled = isWhatsAppEnabled();
  const requiredNames = ["WHATSAPP_ACCESS_TOKEN", "WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_BUSINESS_ACCOUNT_ID", "WHATSAPP_VERIFY_TOKEN", "WHATSAPP_API_VERSION"] as const;
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

async function callWhatsAppMessagesApi(payload: Record<string, unknown>) {
  const config = getWhatsAppServerConfig();
  let response: Response;
  try {
    response = await fetch(`https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000)
    });
  } catch (error) {
    throw toWhatsAppProviderError(error);
  }
  const body = (await response.json().catch(() => null)) as {
    messages?: Array<{ id?: string }>;
    error?: { code?: number; error_subcode?: number; type?: string };
  } | null;
  const messageId = body?.messages?.[0]?.id?.trim();
  if (!response.ok || !messageId) {
    const normalized = normalizeWhatsAppProviderError(response.status, body);
    serverLog({
      level: "warn",
      event: "whatsapp_cloud_api_send_failed",
      route: "src/lib/server/whatsapp",
      status: response.status,
      metadata: { error_type: normalized.errorType, retryable: normalized.retryable }
    });
    throw normalized;
  }
  return { messageId };
}

export async function sendWhatsAppTextMessage(input: { to: string; text: string }) {
  const to = recipientSchema.parse(input.to.replace(/^\+/, ""));
  const message = input.text.trim();
  if (!message || message.length > 4096) throw new AppError("A resposta deve ter entre 1 e 4.096 caracteres.", 400);
  return callWhatsAppMessagesApi({ messaging_product: "whatsapp", recipient_type: "individual", to, type: "text", text: { preview_url: false, body: message } });
}

export async function sendWhatsAppTemplateMessage(input: { to: string; name: string; language: string; variables: string[]; variablesSchema?: WhatsAppTemplateVariable[] }) {
  const to = recipientSchema.parse(input.to.replace(/^\+/, ""));
  const components = input.variablesSchema?.length
    ? buildTemplateSendComponents(input.variablesSchema, input.variables)
    : input.variables.length
      ? [{ type: "body", parameters: input.variables.map((value) => ({ type: "text" as const, text: value })) }]
      : [];
  return callWhatsAppMessagesApi({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "template",
    template: { name: input.name, language: { code: input.language }, ...(components.length ? { components } : {}) }
  });
}

function optionalCaption(value: string | null | undefined) {
  const caption = value?.trim() || "";
  if (caption.length > 1024) throw new AppError("A legenda deve ter no máximo 1.024 caracteres.", 400);
  return caption || null;
}

export async function sendWhatsAppImageMessage(input: { to: string; mediaId: string; caption?: string | null }) {
  const to = recipientSchema.parse(input.to.replace(/^\+/, ""));
  const mediaId = mediaIdSchema.parse(input.mediaId);
  const caption = optionalCaption(input.caption);
  return callWhatsAppMessagesApi({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "image",
    image: { id: mediaId, ...(caption ? { caption } : {}) }
  });
}

export async function sendWhatsAppDocumentMessage(input: { to: string; mediaId: string; caption?: string | null; filename?: string | null }) {
  const to = recipientSchema.parse(input.to.replace(/^\+/, ""));
  const mediaId = mediaIdSchema.parse(input.mediaId);
  const caption = optionalCaption(input.caption);
  const filename = input.filename?.trim().replace(/[\r\n"\\/]/g, "_").slice(0, 120) || "documento";
  return callWhatsAppMessagesApi({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "document",
    document: { id: mediaId, filename, ...(caption ? { caption } : {}) }
  });
}
