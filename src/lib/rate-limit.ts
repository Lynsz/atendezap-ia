import { AppError } from "@/lib/errors";

const buckets = new Map<string, { count: number; resetAt: number }>();

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfter: number;
  backend: "memory" | "upstash";
};

export type RateLimitOptions = {
  request: Request;
  route: string;
  identifier?: string | null;
  limit: number;
  windowMs: number;
  message?: string;
};

const DEFAULT_RATE_LIMIT_MESSAGE = "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.";

function nowMs() {
  return Date.now();
}

function cleanKeyPart(value: string) {
  return value.trim().replace(/[^a-zA-Z0-9:._-]/g, "_").slice(0, 160) || "unknown";
}

function memoryCheckRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = nowMs();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      limit,
      remaining: Math.max(limit - 1, 0),
      resetAt,
      retryAfter: Math.ceil(windowMs / 1000),
      backend: "memory"
    };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetAt: bucket.resetAt,
      retryAfter: Math.max(Math.ceil((bucket.resetAt - now) / 1000), 1),
      backend: "memory"
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    limit,
    remaining: Math.max(limit - bucket.count, 0),
    resetAt: bucket.resetAt,
    retryAfter: Math.max(Math.ceil((bucket.resetAt - now) / 1000), 1),
    backend: "memory"
  };
}

async function upstashCommand<T>(command: unknown[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim().replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store"
  });

  if (!response.ok) throw new Error(`Upstash rate limit command failed with ${response.status}`);
  return (await response.json()) as { result: T };
}

async function upstashCheckRateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult | null> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;

  const now = nowMs();
  const redisKey = `rl:${key}`;
  const countResult = await upstashCommand<number>(["INCR", redisKey]);
  if (!countResult) return null;

  if (countResult.result === 1) {
    await upstashCommand<number>(["PEXPIRE", redisKey, windowMs]);
  }

  const ttlResult = await upstashCommand<number>(["PTTL", redisKey]);
  const ttl = ttlResult?.result && ttlResult.result > 0 ? ttlResult.result : windowMs;
  const resetAt = now + ttl;
  const allowed = countResult.result <= limit;

  return {
    allowed,
    limit,
    remaining: Math.max(limit - countResult.result, 0),
    resetAt,
    retryAfter: Math.max(Math.ceil(ttl / 1000), 1),
    backend: "upstash"
  };
}

export function checkRateLimit(key: string, limit = 5, windowMs = 60_000) {
  return memoryCheckRateLimit(cleanKeyPart(key), limit, windowMs).allowed;
}

export async function checkRateLimitAsync(key: string, limit = 5, windowMs = 60_000) {
  const safeKey = cleanKeyPart(key);

  try {
    const upstashResult = await upstashCheckRateLimit(safeKey, limit, windowMs);
    if (upstashResult) return upstashResult;
  } catch (error) {
    console.warn("Rate limit Upstash indisponivel, usando memoria local:", error instanceof Error ? error.message : "unknown");
  }

  return memoryCheckRateLimit(safeKey, limit, windowMs);
}

export async function enforceRateLimit({ request, route, identifier, limit, windowMs, message = DEFAULT_RATE_LIMIT_MESSAGE }: RateLimitOptions) {
  const ip = clientIp(request.headers);
  const rateIdentity = identifier ? `user:${identifier}` : `ip:${ip}`;
  const result = await checkRateLimitAsync(`${route}:${rateIdentity}`, limit, windowMs);

  if (!result.allowed) {
    throw new AppError(message, 429);
  }

  return {
    ...result,
    ip
  };
}

export function clientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    headers.get("x-vercel-forwarded-for") ||
    "unknown"
  );
}

export function assertRequestSize(request: Request, maxBytes: number) {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) return;

  const parsedLength = Number(contentLength);
  if (Number.isFinite(parsedLength) && parsedLength > maxBytes) {
    throw new AppError("Solicitacao muito grande. Reduza o conteudo enviado e tente novamente.", 413);
  }
}
