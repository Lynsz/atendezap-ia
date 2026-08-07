import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { AppError } from "@/lib/errors";
import { isWhatsAppEmbeddedSignupEnabled, readServerEnv } from "@/lib/server/env";

const idSchema = z.string().regex(/^\d{5,40}$/);
const codeSchema = z.string().trim().min(8).max(4096);
const requiredPermissions = ["whatsapp_business_management", "whatsapp_business_messaging"] as const;

type MetaRecord = Record<string, unknown>;

export type MetaTokenDebug = {
  valid: boolean;
  userId: string;
  appId: string;
  expiresAt: string | null;
  permissions: string[];
};

export type OwnedWhatsAppBusinessAccount = {
  metaBusinessId: string;
  businessName: string;
  wabaId: string;
  wabaName: string;
};

export type WhatsAppPhoneNumber = {
  id: string;
  displayPhoneNumber: string | null;
  verifiedName: string | null;
  qualityRating: string | null;
  messagingLimitTier: string | null;
};

function record(value: unknown): MetaRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as MetaRecord : null;
}

function safeText(value: unknown, max = 255) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function metaConfig() {
  const appId = readServerEnv("NEXT_PUBLIC_META_APP_ID");
  const appSecret = readServerEnv("META_APP_SECRET");
  const apiVersion = readServerEnv("META_GRAPH_API_VERSION") || readServerEnv("WHATSAPP_API_VERSION");
  const redirectUri = readServerEnv("WHATSAPP_EMBEDDED_SIGNUP_REDIRECT_URI");
  if (!appId || !appSecret || !/^v\d+\.\d+$/.test(apiVersion)) {
    throw new AppError("O Embedded Signup da Meta ainda não está configurado neste ambiente.", 503);
  }
  return { appId, appSecret, apiVersion, redirectUri };
}

export function isEmbeddedSignupEnabled() {
  return isWhatsAppEmbeddedSignupEnabled();
}

export function requireEmbeddedSignupEnabled() {
  if (!isEmbeddedSignupEnabled()) {
    throw new AppError("A conexão pelo Embedded Signup está desativada neste ambiente.", 503);
  }
  return metaConfig();
}

export function getEmbeddedSignupPublicConfig() {
  const enabled = isEmbeddedSignupEnabled();
  const appId = readServerEnv("NEXT_PUBLIC_META_APP_ID");
  const configId = readServerEnv("NEXT_PUBLIC_META_CONFIG_ID");
  const redirectUri = readServerEnv("WHATSAPP_EMBEDDED_SIGNUP_REDIRECT_URI");
  const graphVersion = readServerEnv("META_GRAPH_API_VERSION") || readServerEnv("WHATSAPP_API_VERSION") || null;
  const validGraphVersion = /^v\d+\.\d+$/.test(graphVersion || "");
  return {
    enabled: enabled && validGraphVersion && Boolean(appId && configId && readServerEnv("META_APP_SECRET") && readServerEnv("WHATSAPP_TOKEN_ENCRYPTION_KEY")),
    appId: appId || null,
    configId: configId || null,
    redirectUri: redirectUri || null,
    graphVersion
  };
}

export function createEmbeddedSignupState(userId: string) {
  const { appSecret } = metaConfig();
  const payload = Buffer.from(JSON.stringify({ sub: userId, nonce: randomBytes(16).toString("base64url"), iat: Date.now() })).toString("base64url");
  const signature = createHmac("sha256", appSecret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyEmbeddedSignupState(state: string, userId: string) {
  const { appSecret } = metaConfig();
  const [payload, signature] = state.split(".");
  if (!payload || !signature) throw new AppError("A sessão de conexão expirou. Inicie novamente.", 403);
  const expected = createHmac("sha256", appSecret).update(payload).digest();
  let actual: Buffer;
  try {
    actual = Buffer.from(signature, "base64url");
  } catch {
    throw new AppError("A sessão de conexão é inválida.", 403);
  }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    throw new AppError("A sessão de conexão é inválida.", 403);
  }
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { sub?: unknown; iat?: unknown };
    if (parsed.sub !== userId || typeof parsed.iat !== "number" || Date.now() - parsed.iat > 10 * 60_000 || parsed.iat > Date.now() + 30_000) {
      throw new Error("invalid_state");
    }
  } catch {
    throw new AppError("A sessão de conexão expirou. Inicie novamente.", 403);
  }
}

async function metaJson(url: URL, init: RequestInit = {}) {
  let response: Response;
  try {
    response = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(15_000) });
  } catch {
    throw new AppError("A Meta não respondeu a tempo. Tente novamente.", 503);
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) throw normalizeEmbeddedSignupError({ status: response.status, body });
  return record(body);
}

export async function exchangeCodeForAccessToken(code: string) {
  const parsedCode = codeSchema.parse(code);
  const { appId, appSecret, apiVersion, redirectUri } = requireEmbeddedSignupEnabled();
  const url = new URL(`https://graph.facebook.com/${apiVersion}/oauth/access_token`);
  url.searchParams.set("client_id", appId);
  url.searchParams.set("client_secret", appSecret);
  url.searchParams.set("code", parsedCode);
  if (redirectUri) url.searchParams.set("redirect_uri", redirectUri);
  const body = await metaJson(url);
  const accessToken = safeText(body?.access_token, 4096);
  if (!accessToken) throw new AppError("A Meta não retornou uma credencial válida.", 502);
  const expiresIn = Number(body?.expires_in);
  return { accessToken, expiresAt: Number.isFinite(expiresIn) && expiresIn > 0 ? new Date(Date.now() + expiresIn * 1000).toISOString() : null };
}

export async function debugMetaToken(accessToken: string): Promise<MetaTokenDebug> {
  const { appId, appSecret, apiVersion } = metaConfig();
  const url = new URL(`https://graph.facebook.com/${apiVersion}/debug_token`);
  url.searchParams.set("input_token", accessToken);
  url.searchParams.set("access_token", `${appId}|${appSecret}`);
  const body = await metaJson(url);
  const data = record(body?.data);
  const permissions = Array.isArray(data?.scopes) ? data.scopes.flatMap((value) => typeof value === "string" ? [value] : []) : [];
  const userId = safeText(data?.user_id, 80);
  const valid = data?.is_valid === true && safeText(data?.app_id, 80) === appId && Boolean(userId);
  if (!valid) throw new AppError("A autorização retornada pela Meta não é válida.", 403);
  const expiresAtUnix = Number(data?.expires_at);
  return { valid, userId, appId, permissions, expiresAt: Number.isFinite(expiresAtUnix) && expiresAtUnix > 0 ? new Date(expiresAtUnix * 1000).toISOString() : null };
}

export function assertMinimumWhatsAppPermissions(permissions: string[]) {
  const missing = requiredPermissions.filter((permission) => !permissions.includes(permission));
  if (missing.length) throw new AppError("A autorização da Meta não concedeu todas as permissões necessárias para o atendimento.", 403);
}

export async function getOwnedWhatsAppBusinessAccounts(accessToken: string, metaUserId?: string) {
  const { apiVersion } = metaConfig();
  const userId = metaUserId || (await debugMetaToken(accessToken)).userId;
  const businessesUrl = new URL(`https://graph.facebook.com/${apiVersion}/${encodeURIComponent(userId)}/businesses`);
  businessesUrl.searchParams.set("fields", "id,name");
  businessesUrl.searchParams.set("limit", "100");
  const businesses = await metaJson(businessesUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
  const result: OwnedWhatsAppBusinessAccount[] = [];
  for (const item of Array.isArray(businesses?.data) ? businesses.data.slice(0, 100) : []) {
    const business = record(item);
    const businessId = safeText(business?.id, 80);
    if (!idSchema.safeParse(businessId).success) continue;
    const wabasUrl = new URL(`https://graph.facebook.com/${apiVersion}/${businessId}/owned_whatsapp_business_accounts`);
    wabasUrl.searchParams.set("fields", "id,name");
    wabasUrl.searchParams.set("limit", "100");
    const wabas = await metaJson(wabasUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
    for (const wabaItem of Array.isArray(wabas?.data) ? wabas.data.slice(0, 100) : []) {
      const waba = record(wabaItem);
      const wabaId = safeText(waba?.id, 80);
      if (!idSchema.safeParse(wabaId).success) continue;
      result.push({ metaBusinessId: businessId, businessName: safeText(business?.name, 160) || "Negócio WhatsApp", wabaId, wabaName: safeText(waba?.name, 160) || "Conta WhatsApp Business" });
    }
  }
  return result;
}

export async function getWhatsAppPhoneNumbers(input: { accessToken: string; wabaId: string }) {
  const { apiVersion } = metaConfig();
  const wabaId = idSchema.parse(input.wabaId);
  const url = new URL(`https://graph.facebook.com/${apiVersion}/${wabaId}/phone_numbers`);
  url.searchParams.set("fields", "id,display_phone_number,verified_name,quality_rating,messaging_limit_tier");
  url.searchParams.set("limit", "100");
  const body = await metaJson(url, { headers: { Authorization: `Bearer ${input.accessToken}` } });
  return (Array.isArray(body?.data) ? body.data : []).flatMap((item): WhatsAppPhoneNumber[] => {
    const phone = record(item);
    const id = safeText(phone?.id, 80);
    if (!idSchema.safeParse(id).success) return [];
    return [{
      id,
      displayPhoneNumber: safeText(phone?.display_phone_number, 40) || null,
      verifiedName: safeText(phone?.verified_name, 160) || null,
      qualityRating: safeText(phone?.quality_rating, 40) || null,
      messagingLimitTier: safeText(phone?.messaging_limit_tier, 80) || null
    }];
  });
}

export async function subscribeAppToWaba(input: { accessToken: string; wabaId: string }) {
  const { apiVersion } = metaConfig();
  const wabaId = idSchema.parse(input.wabaId);
  const url = new URL(`https://graph.facebook.com/${apiVersion}/${wabaId}/subscribed_apps`);
  await metaJson(url, { method: "POST", headers: { Authorization: `Bearer ${input.accessToken}` } });
}

export function normalizeEmbeddedSignupError(error: unknown) {
  if (error instanceof AppError || error instanceof z.ZodError) return error;
  const status = typeof record(error)?.status === "number" ? record(error)?.status as number : 502;
  if (status === 401 || status === 403) return new AppError("A Meta recusou a autorização. Revise as permissões e tente novamente.", 403);
  if (status === 429) return new AppError("A Meta limitou temporariamente novas tentativas. Aguarde e tente novamente.", 429);
  return new AppError("Não foi possível concluir a conexão com a Meta agora.", 502);
}
