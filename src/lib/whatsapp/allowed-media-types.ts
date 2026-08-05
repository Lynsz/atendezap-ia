export const DOWNLOADABLE_WHATSAPP_MEDIA_TYPES = ["image", "document"] as const;
export const WHATSAPP_MEDIA_TYPES = ["image", "document", "audio", "video", "sticker"] as const;

export type WhatsAppMediaType = (typeof WHATSAPP_MEDIA_TYPES)[number];

export const ALLOWED_WHATSAPP_MEDIA_MIME_TYPES = {
  image: ["image/jpeg", "image/png", "image/webp"],
  document: ["application/pdf", "text/plain"]
} as const;

export const BLOCKED_WHATSAPP_MEDIA_MIME_TYPES = new Set([
  "application/javascript",
  "application/x-bat",
  "application/x-msdownload",
  "application/x-sh",
  "image/svg+xml",
  "text/html"
]);

const executableExtensionPattern = /\.(?:app|bat|bin|cmd|com|cpl|dll|dmg|exe|hta|jar|js|jse|lnk|msi|msp|pif|ps1|scr|sh|vbs|vbe|wsf)$/i;
const mimeExtensions: Record<string, readonly string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "application/pdf": ["pdf"],
  "text/plain": ["txt"]
};

export function isWhatsAppMediaType(value: string): value is WhatsAppMediaType {
  return (WHATSAPP_MEDIA_TYPES as readonly string[]).includes(value);
}

export function isDangerousMediaFilename(filename: string | null | undefined) {
  if (!filename) return false;
  return executableExtensionPattern.test(filename.trim()) || /[\u0000-\u001f\u007f]/.test(filename);
}

export function getSafeMediaExtension(mimeType: string) {
  return mimeExtensions[mimeType]?.[0] || null;
}

export function filenameMatchesMimeType(filename: string | null | undefined, mimeType: string) {
  if (!filename) return mimeType.startsWith("image/");
  const extension = filename.split(".").pop()?.toLowerCase();
  return Boolean(extension && mimeExtensions[mimeType]?.includes(extension));
}

export function isAllowedWhatsAppMediaType(input: { mediaType: string; mimeType: string; filename?: string | null }) {
  if (BLOCKED_WHATSAPP_MEDIA_MIME_TYPES.has(input.mimeType) || isDangerousMediaFilename(input.filename)) return false;
  if (input.mediaType !== "image" && input.mediaType !== "document") return false;
  const allowed = ALLOWED_WHATSAPP_MEDIA_MIME_TYPES[input.mediaType];
  return (allowed as readonly string[]).includes(input.mimeType) && filenameMatchesMimeType(input.filename, input.mimeType);
}

export function mediaMimeGroup(mimeType: string | null | undefined) {
  return mimeType?.split("/")[0] || "unknown";
}

export function mediaFileSizeRange(size: number | null | undefined) {
  if (!size || size < 0) return "unknown";
  if (size < 100 * 1024) return "under_100kb";
  if (size < 1024 * 1024) return "100kb_1mb";
  if (size < 5 * 1024 * 1024) return "1mb_5mb";
  return "over_5mb";
}
