import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";

const mocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  enforceRateLimit: vi.fn(),
  verifyState: vi.fn(),
  exchangeCode: vi.fn(),
  debugToken: vi.fn(),
  assertPermissions: vi.fn(),
  getWabas: vi.fn(),
  getPhones: vi.fn(),
  subscribe: vi.fn(),
  normalizeError: vi.fn((error: unknown) => error),
  encryptSecret: vi.fn(),
  maskSecret: vi.fn((value: string) => `masked:${value.slice(-3)}`),
  getSupabaseAdmin: vi.fn(),
  audit: vi.fn(),
  event: vi.fn(),
  track: vi.fn()
}));

vi.mock("@/lib/auth/server", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/lib/rate-limit", () => ({ enforceRateLimit: mocks.enforceRateLimit }));
vi.mock("@/lib/server/meta-embedded-signup", () => ({
  verifyEmbeddedSignupState: mocks.verifyState,
  exchangeCodeForAccessToken: mocks.exchangeCode,
  debugMetaToken: mocks.debugToken,
  assertMinimumWhatsAppPermissions: mocks.assertPermissions,
  getOwnedWhatsAppBusinessAccounts: mocks.getWabas,
  getWhatsAppPhoneNumbers: mocks.getPhones,
  subscribeAppToWaba: mocks.subscribe,
  normalizeEmbeddedSignupError: mocks.normalizeError
}));
vi.mock("@/lib/server/secure-token-store", () => ({ encryptSecret: mocks.encryptSecret, maskSecret: mocks.maskSecret }));
vi.mock("@/lib/supabase/server", () => ({ getSupabaseAdmin: mocks.getSupabaseAdmin }));
vi.mock("@/lib/server/whatsapp-audit", () => ({ writeWhatsAppAudit: mocks.audit }));
vi.mock("@/lib/server/whatsapp-connection-events", () => ({ writeWhatsAppConnectionEvent: mocks.event }));
vi.mock("@/lib/analytics/server", () => ({ trackServerAppEvent: mocks.track }));

function queuedSupabase(results: Array<{ data?: unknown; error?: unknown }>, savedValues: Array<Record<string, unknown>>) {
  return {
    from: vi.fn(() => {
      const result = results.shift() || { data: null, error: null };
      const chain: Record<string, unknown> = {};
      for (const method of ["select", "eq", "order", "limit"]) chain[method] = vi.fn(() => chain);
      chain.insert = vi.fn((values: Record<string, unknown>) => { savedValues.push(values); return chain; });
      chain.update = vi.fn((values: Record<string, unknown>) => { savedValues.push(values); return chain; });
      chain.single = vi.fn(() => Promise.resolve(result));
      chain.maybeSingle = vi.fn(() => Promise.resolve(result));
      return chain;
    })
  };
}

function request(body: Record<string, unknown>) {
  return new Request("https://app.test/api/whatsapp/embedded-signup/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

const validBody = { code: "test-code-value", state: "signed-state-value-with-enough-length" };

describe("POST Embedded Signup complete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireUser.mockResolvedValue({ id: "user-a" });
    mocks.exchangeCode.mockResolvedValue({ accessToken: "test-whatsapp-token", expiresAt: null });
    mocks.debugToken.mockResolvedValue({ userId: "meta-user", permissions: ["whatsapp_business_management", "whatsapp_business_messaging"], expiresAt: "2026-12-01T00:00:00.000Z" });
    mocks.getWabas.mockResolvedValue([{ metaBusinessId: "11111", businessName: "Empresa", wabaId: "22222", wabaName: "Conta WhatsApp" }]);
    mocks.getPhones.mockResolvedValue([{ id: "33333", displayPhoneNumber: "+55 11 90000-0000", verifiedName: "Empresa", qualityRating: "GREEN", messagingLimitTier: "TIER_1K" }]);
    mocks.encryptSecret.mockReturnValue("v1.encrypted-test-value");
  });

  it("requires login and rejects client authority fields", async () => {
    mocks.requireUser.mockRejectedValueOnce(new AppError("SessÃ£o invÃ¡lida.", 401));
    const { POST } = await import("./route");
    expect((await POST(request(validBody))).status).toBe(401);

    mocks.requireUser.mockResolvedValue({ id: "user-a" });
    const response = await POST(request({ ...validBody, user_id: "user-b" }));
    expect(response.status).toBe(400);
    expect(mocks.exchangeCode).not.toHaveBeenCalled();
  });

  it("returns a friendly validation error when code is absent", async () => {
    const { POST } = await import("./route");
    const response = await POST(request({ state: validBody.state }));
    expect(response.status).toBe(400);
    expect((await response.json()).error).toMatch(/Dados inv/i);
  });

  it("validates WABA and phone server-side, encrypts the token, and returns no credential", async () => {
    const savedValues: Array<Record<string, unknown>> = [];
    mocks.getSupabaseAdmin.mockReturnValue(queuedSupabase([
      { data: null, error: null },
      { data: null, error: null },
      { data: { id: "connection-a", business_name: "Conta WhatsApp", connection_status: "connected", display_phone_number: "+55 11 90000-0000", phone_number_id: "33333" }, error: null }
    ], savedValues));

    const { POST } = await import("./route");
    const response = await POST(request(validBody));
    const responseText = await response.text();
    expect(response.status).toBe(201);
    expect(mocks.getWabas).toHaveBeenCalledWith("test-whatsapp-token", "meta-user");
    expect(mocks.getPhones).toHaveBeenCalledWith({ accessToken: "test-whatsapp-token", wabaId: "22222" });
    expect(mocks.subscribe.mock.invocationCallOrder[0]).toBeLessThan(mocks.encryptSecret.mock.invocationCallOrder[0]);
    expect(mocks.encryptSecret).toHaveBeenCalledWith("test-whatsapp-token");
    expect(savedValues[0]).toEqual(expect.objectContaining({ user_id: "user-a", access_token_encrypted: "v1.encrypted-test-value", phone_number_id: "33333", whatsapp_business_account_id: "22222" }));
    expect(responseText).not.toContain("test-whatsapp-token");
    expect(responseText).not.toContain("v1.encrypted-test-value");
  });

  it("does not trust a WABA ID supplied by the client", async () => {
    const savedValues: Array<Record<string, unknown>> = [];
    mocks.getSupabaseAdmin.mockReturnValue(queuedSupabase([], savedValues));
    const { POST } = await import("./route");
    const response = await POST(request({ ...validBody, wabaId: "99999" }));
    expect(response.status).toBe(409);
    expect(savedValues).toHaveLength(0);
  });

  it("normalizes Meta authorization failures without exposing provider payloads", async () => {
    mocks.exchangeCode.mockRejectedValue(new AppError("A Meta recusou a autorizaÃ§Ã£o.", 403));
    const { POST } = await import("./route");
    const response = await POST(request(validBody));
    const text = await response.text();
    expect(response.status).toBe(403);
    expect(text).not.toMatch(/access_token|test-whatsapp-token/i);
  });
});
