import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";

const mocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  getEmbeddedSignupPublicConfig: vi.fn(),
  createEmbeddedSignupState: vi.fn(),
  audit: vi.fn(),
  event: vi.fn(),
  track: vi.fn()
}));

vi.mock("@/lib/auth/server", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/lib/server/meta-embedded-signup", () => ({
  getEmbeddedSignupPublicConfig: mocks.getEmbeddedSignupPublicConfig,
  createEmbeddedSignupState: mocks.createEmbeddedSignupState
}));
vi.mock("@/lib/server/whatsapp-audit", () => ({ writeWhatsAppAudit: mocks.audit }));
vi.mock("@/lib/server/whatsapp-connection-events", () => ({ writeWhatsAppConnectionEvent: mocks.event }));
vi.mock("@/lib/analytics/server", () => ({ trackServerAppEvent: mocks.track }));

describe("GET Embedded Signup public config", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireUser.mockResolvedValue({ id: "user-a" });
    mocks.createEmbeddedSignupState.mockReturnValue("signed-public-state");
    mocks.getEmbeddedSignupPublicConfig.mockReturnValue({ enabled: true, appId: "test-app-id", configId: "test-config-id", redirectUri: "https://app.test/callback", graphVersion: "v23.0" });
  });

  it("requires authentication", async () => {
    mocks.requireUser.mockRejectedValue(new AppError("SessÃ£o invÃ¡lida.", 401));
    const { GET } = await import("./route");
    const response = await GET(new Request("https://app.test/api/whatsapp/embedded-signup/config"));
    expect(response.status).toBe(401);
  });

  it("returns only public settings plus signed state", async () => {
    const { GET } = await import("./route");
    const response = await GET(new Request("https://app.test/api/whatsapp/embedded-signup/config"));
    const text = await response.text();
    const body = JSON.parse(text);
    expect(response.status).toBe(200);
    expect(body).toEqual(expect.objectContaining({ enabled: true, appId: "test-app-id", configId: "test-config-id", state: "signed-public-state" }));
    expect(text).not.toMatch(/app_secret|access_token|encryption_key|whatsapp-token/i);
  });

  it("returns disabled without creating state when configuration is incomplete", async () => {
    mocks.getEmbeddedSignupPublicConfig.mockReturnValue({ enabled: false, appId: null, configId: null, redirectUri: null, graphVersion: null });
    const { GET } = await import("./route");
    const response = await GET(new Request("https://app.test/api/whatsapp/embedded-signup/config"));
    expect(await response.json()).toMatchObject({ enabled: false, state: null });
    expect(mocks.createEmbeddedSignupState).not.toHaveBeenCalled();
  });
});
