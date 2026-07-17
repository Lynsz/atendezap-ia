import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyWhatsAppWebhookSignature(rawBody: string, signatureHeader: string | null, appSecret: string | null) {
  if (!appSecret) return { required: false, valid: true } as const;
  if (!signatureHeader?.startsWith("sha256=")) return { required: true, valid: false } as const;

  const expected = Buffer.from(`sha256=${createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex")}`);
  const received = Buffer.from(signatureHeader);
  const valid = expected.length === received.length && timingSafeEqual(expected, received);
  return { required: true, valid } as const;
}
