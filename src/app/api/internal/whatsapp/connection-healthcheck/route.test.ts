import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";

const mocks = vi.hoisted(() => ({
  requireInternalJob: vi.fn(),
  readServerEnv: vi.fn(),
  debugMetaToken: vi.fn(),
  decryptSecret: vi.fn(),
  getSupabaseAdmin: vi.fn(),
  audit: vi.fn(),
  event: vi.fn(),
  track: vi.fn()
}));
vi.mock("@/lib/server/internal-job-auth", () => ({ requireInternalJob: mocks.requireInternalJob }));
vi.mock("@/lib/server/env", () => ({ readServerEnv: mocks.readServerEnv }));
vi.mock("@/lib/server/meta-embedded-signup", () => ({ debugMetaToken: mocks.debugMetaToken }));
vi.mock("@/lib/server/secure-token-store", () => ({ decryptSecret: mocks.decryptSecret }));
vi.mock("@/lib/supabase/server", () => ({ getSupabaseAdmin: mocks.getSupabaseAdmin }));
vi.mock("@/lib/server/whatsapp-audit", () => ({ writeWhatsAppAudit: mocks.audit }));
vi.mock("@/lib/server/whatsapp-connection-events", () => ({ writeWhatsAppConnectionEvent: mocks.event }));
vi.mock("@/lib/analytics/server", () => ({ trackServerAppEvent: mocks.track }));

function healthClient(connections: unknown[], updates: Array<Record<string, unknown>>) {
  let call = 0;
  return {
    from: vi.fn(() => {
      const current = call++;
      const chain: Record<string, unknown> = {};
      for (const method of ["select", "eq", "order", "limit"]) chain[method] = vi.fn(() => chain);
      chain.update = vi.fn((values: Record<string, unknown>) => { updates.push(values); return chain; });
      const result = current === 0 ? { data: connections, error: null } : { data: null, error: null };
      chain.then = (resolve: (value: unknown) => unknown) => Promise.resolve(result).then(resolve);
      return chain;
    })
  };
}

describe("POST internal WhatsApp connection healthcheck", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireInternalJob.mockImplementation(() => undefined);
    mocks.readServerEnv.mockReturnValue("true");
    mocks.decryptSecret.mockReturnValue("test-whatsapp-token");
    mocks.debugMetaToken.mockResolvedValue({ valid: true });
  });

  it("requires the internal job secret", async () => {
    mocks.requireInternalJob.mockImplementation(() => { throw new AppError("NÃ£o autorizado.", 401); });
    const { POST } = await import("./route");
    const response = await POST(new Request("https://app.test/api/internal/whatsapp/connection-healthcheck", { method: "POST" }));
    expect(response.status).toBe(401);
  });

  it("returns a friendly error while disabled", async () => {
    mocks.readServerEnv.mockReturnValue("");
    const { POST } = await import("./route");
    const response = await POST(new Request("https://app.test/api/internal/whatsapp/connection-healthcheck", { method: "POST" }));
    expect(response.status).toBe(503);
    expect((await response.json()).error).toMatch(/desativado/i);
  });

  it("marks a valid encrypted connection as healthy without returning its token", async () => {
    const updates: Array<Record<string, unknown>> = [];
    mocks.getSupabaseAdmin.mockReturnValue(healthClient([{ id: "connection-a", user_id: "user-a", access_token_encrypted: "v1.encrypted" }], updates));
    const { POST } = await import("./route");
    const response = await POST(new Request("https://app.test/api/internal/whatsapp/connection-healthcheck", { method: "POST" }));
    const text = await response.text();
    expect(response.status).toBe(200);
    expect(updates[0]).toEqual(expect.objectContaining({ last_error_type: null }));
    expect(text).not.toMatch(/encrypted|whatsapp-token/i);
  });

  it("marks an invalid token as needs_reauth and exposes only a safe status", async () => {
    const updates: Array<Record<string, unknown>> = [];
    mocks.debugMetaToken.mockRejectedValue(new Error("provider-payload-with-secret"));
    mocks.getSupabaseAdmin.mockReturnValue(healthClient([{ id: "connection-a", user_id: "user-a", access_token_encrypted: "v1.encrypted" }], updates));
    const { POST } = await import("./route");
    const response = await POST(new Request("https://app.test/api/internal/whatsapp/connection-healthcheck", { method: "POST" }));
    const text = await response.text();
    expect(response.status).toBe(200);
    expect(updates[0]).toEqual(expect.objectContaining({ connection_status: "needs_reauth", last_error_type: "token_invalid_or_expired" }));
    expect(text).toContain("needs_reauth");
    expect(text).not.toContain("provider-payload-with-secret");
  });
});
