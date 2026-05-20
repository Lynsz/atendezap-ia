import { describe, expect, it, vi } from "vitest";
import { checkRateLimitAsync } from "@/lib/rate-limit";

describe("rate limit", () => {
  it("bloqueia quando o limite em memoria e excedido", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    const key = `test:${crypto.randomUUID()}`;

    const first = await checkRateLimitAsync(key, 2, 60_000);
    const second = await checkRateLimitAsync(key, 2, 60_000);
    const third = await checkRateLimitAsync(key, 2, 60_000);

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    expect(third.backend).toBe("memory");
  });
});
