import "server-only";

import { z } from "zod";
import { AppError } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { isWhatsAppEnabled as readWhatsAppEnabled, readServerEnv } from "@/lib/server/env";
import { normalizeWhatsAppProviderError, toWhatsAppProviderError } from "@/lib/server/whatsapp-errors";
import { decryptSecret } from "@/lib/server/secure-token-store";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { buildTemplateSendComponents, type WhatsAppTemplateVariable } from "@/lib/whatsapp/template-validation";
import { writeWhatsAppConnectionEvent } from "@/lib/server/whatsapp-connection-events";

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

export type WhatsAppConnection = {
  id: string;
  user_id: string;
  business_name: string;
  connection_source: "env_global" | "embedded_signup" | "manual_admin";
  connection_status: "pending" | "connected" | "needs_reauth" | "disconnected" | "failed" | "disabled";
  phone_number_id: string;
  business_account_id: string;
  whatsapp_business_account_id: string | null;
  access_token_encrypted: string | null;
  token_expires_at: string | null;
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
    businessAccountIdMasked: readServerEnv("WHATSAPP_BUSINESS_ACCOUNT_ID") ? maskIdentifier(readServerEnv("WHATSAPP_BUSINESS_ACCOUNT_ID")) : null,
    embeddedSignupEnabled: /^(1|true)$/i.test(readServerEnv("WHATSAPP_EMBEDDED_SIGNUP_ENABLED"))
  };
}

export async function getWhatsAppConnectionForUser(userId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("whatsapp_connections")
    .select("id,user_id,business_name,connection_source,connection_status,phone_number_id,business_account_id,whatsapp_business_account_id,access_token_encrypted,token_expires_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as WhatsAppConnection | null;
}

export async function getWhatsAppConnectionByPhoneNumberId(phoneNumberId: string) {
  const normalized = phoneNumberIdSchema.parse(phoneNumberId);
  const { data, error } = await getSupabaseAdmin()
    .from("whatsapp_connections")
    .select("id,user_id,business_name,connection_source,connection_status,phone_number_id,business_account_id,whatsapp_business_account_id,access_token_encrypted,token_expires_at")
    .eq("phone_number_id", normalized)
    .maybeSingle();
  if (error) throw error;
  return data as WhatsAppConnection | null;
}

async function getWhatsAppConnectionById(connectionId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("whatsapp_connections")
    .select("id,user_id,business_name,connection_source,connection_status,phone_number_id,business_account_id,whatsapp_business_account_id,access_token_encrypted,token_expires_at")
    .eq("id", connectionId)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new AppError("Sua integração WhatsApp precisa ser conectada ou reautorizada antes de enviar mensagens.", 409);
  return data as WhatsAppConnection;
}

export async function getWhatsAppAccessTokenForConnection(connectionId: string) {
  const connection = await getWhatsAppConnectionById(connectionId);
  if (connection.connection_status !== "connected") {
    throw new AppError("Sua integração WhatsApp precisa ser conectada ou reautorizada antes de enviar mensagens.", 409);
  }
  if (connection.connection_source === "env_global") {
    if (!isWhatsAppEnabled()) throw new AppError("A conexão legada do WhatsApp está desativada neste ambiente.", 503);
    return requireValue("WHATSAPP_ACCESS_TOKEN", "O token da WhatsApp Cloud API não está configurado.");
  }
  if (!connection.access_token_encrypted) {
    throw new AppError("Sua integração WhatsApp precisa ser reautorizada antes de enviar mensagens.", 409);
  }
  return decryptSecret(connection.access_token_encrypted);
}

export async function getWhatsAppProviderConfigForConnection(connectionId: string) {
  const connection = await getWhatsAppConnectionById(connectionId);
  const accessToken = await getWhatsAppAccessTokenForConnection(connectionId);
  const apiVersion = readServerEnv("META_GRAPH_API_VERSION") || readServerEnv("WHATSAPP_API_VERSION");
  if (!apiVersion) throw new AppError("A versão da API da Meta não está configurada.", 503);
  if (!apiVersionSchema.safeParse(apiVersion).success) throw new AppError("A versão da API da Meta é inválida.", 503);
  return {
    connection,
    accessToken,
    phoneNumberId: connection.phone_number_id,
    businessAccountId: connection.whatsapp_business_account_id || connection.business_account_id,
    apiVersion
  };
}

async function callWhatsAppMessagesApi(connectionId: string, payload: Record<string, unknown>) {
  const config = await getWhatsAppProviderConfigForConnection(connectionId);
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
  await writeWhatsAppConnectionEvent({
    userId: config.connection.user_id,
    connectionId: config.connection.id,
    eventType: "connection_used_for_send",
    status: "sent"
  });
  return { messageId };
}

export async function sendWhatsAppTextMessage(input: { connectionId: string; to: string; text?: string; body?: string }) {
  const to = recipientSchema.parse(input.to.replace(/^\+/, ""));
  const message = (input.text ?? input.body ?? "").trim();
  if (!message || message.length > 4096) throw new AppError("A resposta deve ter entre 1 e 4.096 caracteres.", 400);
  return callWhatsAppMessagesApi(input.connectionId, { messaging_product: "whatsapp", recipient_type: "individual", to, type: "text", text: { preview_url: false, body: message } });
}

export async function sendWhatsAppTemplateMessage(input: { connectionId: string; to: string; name: string; language: string; variables: string[]; variablesSchema?: WhatsAppTemplateVariable[] }) {
  const to = recipientSchema.parse(input.to.replace(/^\+/, ""));
  const components = input.variablesSchema?.length
    ? buildTemplateSendComponents(input.variablesSchema, input.variables)
    : input.variables.length
      ? [{ type: "body", parameters: input.variables.map((value) => ({ type: "text" as const, text: value })) }]
      : [];
  return callWhatsAppMessagesApi(input.connectionId, {
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

export async function sendWhatsAppImageMessage(input: { connectionId: string; to: string; mediaId: string; caption?: string | null }) {
  const to = recipientSchema.parse(input.to.replace(/^\+/, ""));
  const mediaId = mediaIdSchema.parse(input.mediaId);
  const caption = optionalCaption(input.caption);
  return callWhatsAppMessagesApi(input.connectionId, {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "image",
    image: { id: mediaId, ...(caption ? { caption } : {}) }
  });
}

export async function sendWhatsAppDocumentMessage(input: { connectionId: string; to: string; mediaId: string; caption?: string | null; filename?: string | null }) {
  const to = recipientSchema.parse(input.to.replace(/^\+/, ""));
  const mediaId = mediaIdSchema.parse(input.mediaId);
  const caption = optionalCaption(input.caption);
  const filename = input.filename?.trim().replace(/[\r\n"\\/]/g, "_").slice(0, 120) || "documento";
  return callWhatsAppMessagesApi(input.connectionId, {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "document",
    document: { id: mediaId, filename, ...(caption ? { caption } : {}) }
  });
}

export async function sendWhatsAppMediaMessage(input:
  | { connectionId: string; to: string; type: "image"; mediaId: string; caption?: string | null }
  | { connectionId: string; to: string; type: "document"; mediaId: string; caption?: string | null; filename?: string | null }
) {
  return input.type === "image"
    ? sendWhatsAppImageMessage(input)
    : sendWhatsAppDocumentMessage(input);
}
