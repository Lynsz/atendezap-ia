import "server-only";

import { timingSafeEqual } from "node:crypto";
import { AppError } from "@/lib/errors";
import { readServerEnv } from "@/lib/server/env";

export function requireInternalJob(request: Request) {
  const expected = readServerEnv("INTERNAL_JOB_SECRET");
  if (!expected) throw new AppError("O job interno não está configurado.", 503);

  const authorization = request.headers.get("authorization") || "";
  const provided = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : request.headers.get("x-internal-job-secret")?.trim() || "";
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  if (expectedBuffer.length !== providedBuffer.length || !timingSafeEqual(expectedBuffer, providedBuffer)) {
    throw new AppError("Acesso não autorizado.", 401);
  }
}
