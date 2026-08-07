import "server-only";

import { randomUUID } from "node:crypto";
import { AppError } from "@/lib/errors";
import { readServerEnv } from "@/lib/server/env";
import { getWhatsAppProviderConfigForConnection, getWhatsAppServerConfig } from "@/lib/server/whatsapp";
import { normalizeWhatsAppProviderError, toWhatsAppProviderError } from "@/lib/server/whatsapp-errors";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  getSafeMediaExtension,
  isAllowedWhatsAppMediaType,
  type WhatsAppMediaType
} from "@/lib/whatsapp/allowed-media-types";

const META_MEDIA_TIMEOUT_MS = 15_000;
const DEFAULT_MAX_MEDIA_SIZE_MB = 10;

export class WhatsAppMediaError extends AppError {
  constructor(message: string, status: number, public errorType: string) {
    super(message, status);
    this.name = "WhatsAppMediaError";
  }
}

export type WhatsAppMediaMetadata = {
  id: string;
  mimeType: string;
  sha256: string | null;
  fileSize: number;
  temporaryUrl: string;
};

export function isWhatsAppMediaDownloadEnabled() {
  return /^(1|true)$/i.test(readServerEnv("WHATSAPP_MEDIA_DOWNLOAD_ENABLED"));
}

export function isWhatsAppMediaUploadEnabled() {
  return /^(1|true)$/i.test(readServerEnv("WHATSAPP_MEDIA_UPLOAD_ENABLED"));
}

export function getWhatsAppMaxMediaBytes() {
  const configured = Number(readServerEnv("WHATSAPP_MAX_MEDIA_SIZE_MB"));
  const megabytes = Number.isFinite(configured) && configured > 0 ? Math.min(configured, 10) : DEFAULT_MAX_MEDIA_SIZE_MB;
  return Math.floor(megabytes * 1024 * 1024);
}

export function getWhatsAppMediaRetentionDays() {
  const configured = Number(readServerEnv("WHATSAPP_MEDIA_RETENTION_DAYS"));
  return Number.isInteger(configured) && configured > 0 ? Math.min(configured, 365) : 30;
}

export function getWhatsAppMediaBucket() {
  const bucket = readServerEnv("SUPABASE_STORAGE_WHATSAPP_BUCKET");
  if (!bucket || !/^[a-z0-9][a-z0-9._-]{1,62}$/i.test(bucket)) {
    throw new WhatsAppMediaError("O armazenamento privado de mídias não está configurado.", 503, "storage_not_configured");
  }
  return bucket;
}

function isTrustedMetaMediaUrl(value: string) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    return url.protocol === "https:" && ["facebook.com", "fbcdn.net", "fbsbx.com"].some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

function providerError(status: number, body: unknown) {
  return normalizeWhatsAppProviderError(status, body as { error?: { code?: number; error_subcode?: number; type?: string } } | null);
}

export function validateWhatsAppMediaType(input: { mimeType: string; mediaType: WhatsAppMediaType; filename?: string | null }) {
  if (!isAllowedWhatsAppMediaType(input)) {
    throw new WhatsAppMediaError("Este tipo de arquivo não é permitido nesta fase.", 415, "blocked_type");
  }
}

export function validateWhatsAppMediaSize(size: number) {
  if (!Number.isFinite(size) || size < 0 || size > getWhatsAppMaxMediaBytes()) {
    throw new WhatsAppMediaError("O arquivo excede o limite permitido.", 413, "blocked_size");
  }
}

export function validateWhatsAppMediaBytes(buffer: Buffer, mimeType: string) {
  const matches =
    (mimeType === "image/jpeg" && buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) ||
    (mimeType === "image/png" && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) ||
    (mimeType === "image/webp" && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") ||
    (mimeType === "application/pdf" && buffer.subarray(0, 5).toString("ascii") === "%PDF-") ||
    (mimeType === "text/plain" && !buffer.includes(0) && (() => {
      try {
        new TextDecoder("utf-8", { fatal: true }).decode(buffer);
        return true;
      } catch {
        return false;
      }
    })());
  if (!matches) throw new WhatsAppMediaError("O conteúdo do arquivo não corresponde ao tipo informado.", 415, "blocked_type");
}

export async function getWhatsAppMediaMetadata(mediaId: string, connectionId?: string): Promise<WhatsAppMediaMetadata> {
  const config = connectionId ? await getWhatsAppProviderConfigForConnection(connectionId) : getWhatsAppServerConfig();
  let response: Response;
  try {
    const url = new URL(`https://graph.facebook.com/${config.apiVersion}/${encodeURIComponent(mediaId)}`);
    url.searchParams.set("phone_number_id", config.phoneNumberId);
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${config.accessToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(META_MEDIA_TIMEOUT_MS)
    });
  } catch (error) {
    throw toWhatsAppProviderError(error);
  }
  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!response.ok) throw providerError(response.status, body);
  const temporaryUrl = typeof body?.url === "string" ? body.url : "";
  const mimeType = typeof body?.mime_type === "string" ? body.mime_type.trim().toLowerCase() : "";
  const fileSize = Number(body?.file_size);
  if (!temporaryUrl || !mimeType || !Number.isFinite(fileSize) || !isTrustedMetaMediaUrl(temporaryUrl)) {
    throw new WhatsAppMediaError("A mídia recebida não pôde ser validada.", 502, "provider_invalid_metadata");
  }
  return {
    id: typeof body?.id === "string" ? body.id : mediaId,
    mimeType,
    sha256: typeof body?.sha256 === "string" ? body.sha256.slice(0, 128) : null,
    fileSize,
    temporaryUrl
  };
}

export async function downloadWhatsAppMedia(input: { connectionId?: string; mediaId: string; mediaType: WhatsAppMediaType; filename?: string | null; metadata?: WhatsAppMediaMetadata }) {
  const metadata = input.metadata || await getWhatsAppMediaMetadata(input.mediaId, input.connectionId);
  validateWhatsAppMediaType({ mediaType: input.mediaType, mimeType: metadata.mimeType, filename: input.filename });
  validateWhatsAppMediaSize(metadata.fileSize);
  const config = input.connectionId ? await getWhatsAppProviderConfigForConnection(input.connectionId) : getWhatsAppServerConfig();
  let response: Response;
  try {
    response = await fetch(metadata.temporaryUrl, {
      headers: { Authorization: `Bearer ${config.accessToken}` },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(META_MEDIA_TIMEOUT_MS)
    });
  } catch (error) {
    throw toWhatsAppProviderError(error);
  }
  if (!response.ok) throw providerError(response.status, null);
  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > 0) validateWhatsAppMediaSize(contentLength);
  const responseMime = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
  if (responseMime && responseMime !== metadata.mimeType) {
    throw new WhatsAppMediaError("O tipo retornado pelo provedor não corresponde aos metadados.", 415, "blocked_type");
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  validateWhatsAppMediaSize(buffer.length);
  validateWhatsAppMediaBytes(buffer, metadata.mimeType);
  return { buffer, metadata };
}

export async function storeWhatsAppMediaFile(input: { userId: string; mediaId: string; buffer: Buffer; mimeType: string }) {
  const bucket = getWhatsAppMediaBucket();
  const extension = getSafeMediaExtension(input.mimeType);
  if (!extension) throw new WhatsAppMediaError("Este tipo de arquivo não pode ser armazenado.", 415, "blocked_type");
  const path = `${input.userId}/${input.mediaId}/${randomUUID()}.${extension}`;
  const { error } = await getSupabaseAdmin().storage.from(bucket).upload(path, input.buffer, {
    contentType: input.mimeType,
    cacheControl: "0",
    upsert: false
  });
  if (error) throw new WhatsAppMediaError("Não foi possível armazenar a mídia com segurança.", 503, "storage_upload_failed");
  return { bucket, path };
}

export async function readStoredWhatsAppMediaFile(input: { bucket: string; path: string }) {
  if (input.bucket !== getWhatsAppMediaBucket()) throw new WhatsAppMediaError("Arquivo de mídia inválido.", 404, "storage_bucket_mismatch");
  const { data, error } = await getSupabaseAdmin().storage.from(input.bucket).download(input.path);
  if (error || !data) throw new WhatsAppMediaError("Arquivo de mídia não encontrado.", 404, "storage_download_failed");
  const buffer = Buffer.from(await data.arrayBuffer());
  validateWhatsAppMediaSize(buffer.length);
  return buffer;
}

export async function removeStoredWhatsAppMediaFile(input: { bucket: string; path: string }) {
  if (input.bucket !== getWhatsAppMediaBucket()) throw new WhatsAppMediaError("Arquivo de mídia inválido.", 404, "storage_bucket_mismatch");
  const { error } = await getSupabaseAdmin().storage.from(input.bucket).remove([input.path]);
  if (error) throw new WhatsAppMediaError("Não foi possível remover a mídia armazenada.", 503, "storage_delete_failed");
}

export async function uploadMediaToWhatsApp(input: { connectionId: string; fileBuffer: Buffer; mimeType: string; filename: string }) {
  validateWhatsAppMediaSize(input.fileBuffer.length);
  validateWhatsAppMediaBytes(input.fileBuffer, input.mimeType);
  const config = await getWhatsAppProviderConfigForConnection(input.connectionId);
  const form = new FormData();
  form.set("messaging_product", "whatsapp");
  form.set("file", new Blob([new Uint8Array(input.fileBuffer)], { type: input.mimeType }), input.filename);
  let response: Response;
  try {
    response = await fetch(`https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/media`, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.accessToken}` },
      body: form,
      cache: "no-store",
      signal: AbortSignal.timeout(META_MEDIA_TIMEOUT_MS)
    });
  } catch (error) {
    throw toWhatsAppProviderError(error);
  }
  const body = (await response.json().catch(() => null)) as { id?: string; error?: { code?: number } } | null;
  if (!response.ok || !body?.id) throw providerError(response.status, body);
  return { mediaId: body.id };
}

export function buildSafeMediaPreviewUrl(mediaId: string) {
  return `/api/whatsapp/media/${encodeURIComponent(mediaId)}`;
}
