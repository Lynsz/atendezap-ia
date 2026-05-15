import crypto from "crypto";

export function createAccessToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashForLog(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 12);
}
