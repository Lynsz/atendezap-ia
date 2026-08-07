import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { AppError } from "@/lib/errors";
import {
  assertMinimumWhatsAppPermissions,
  createEmbeddedSignupState,
  getEmbeddedSignupPublicConfig,
  verifyEmbeddedSignupState
} from "@/lib/server/meta-embedded-signup";

const envNames = [
  "NEXT_PUBLIC_META_APP_ID",
  "NEXT_PUBLIC_META_CONFIG_ID",
  "META_APP_SECRET",
  "META_GRAPH_API_VERSION",
  "WHATSAPP_EMBEDDED_SIGNUP_ENABLED",
  "WHATSAPP_TOKEN_ENCRYPTION_KEY"
] as const;
const original = Object.fromEntries(envNames.map((name) => [name, process.env[name]]));

function configure() {
  process.env.NEXT_PUBLIC_META_APP_ID = "1234567890";
  process.env.NEXT_PUBLIC_META_CONFIG_ID = "9876543210";
  process.env.META_APP_SECRET = "test-meta-secret";
  process.env.META_GRAPH_API_VERSION = "v23.0";
  process.env.WHATSAPP_EMBEDDED_SIGNUP_ENABLED = "true";
  process.env.WHATSAPP_TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 3).toString("base64");
}

describe("Meta Embedded Signup server helper", () => {
  afterEach(() => {
    vi.useRealTimers();
    for (const name of envNames) {
      if (original[name] === undefined) delete process.env[name];
      else process.env[name] = original[name];
    }
  });

  it("returns disabled unless every required public and server setting exists", () => {
    configure();
    expect(getEmbeddedSignupPublicConfig()).toMatchObject({ enabled: true, appId: "1234567890", configId: "9876543210" });
    delete process.env.META_GRAPH_API_VERSION;
    delete process.env.WHATSAPP_API_VERSION;
    expect(getEmbeddedSignupPublicConfig().enabled).toBe(false);
  });

  it("binds anti-CSRF state to the authenticated user and expiration", () => {
    configure();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-07T12:00:00.000Z"));
    const state = createEmbeddedSignupState("user-a");
    expect(() => verifyEmbeddedSignupState(state, "user-a")).not.toThrow();
    expect(() => verifyEmbeddedSignupState(state, "user-b")).toThrow(AppError);
    vi.advanceTimersByTime(11 * 60_000);
    expect(() => verifyEmbeddedSignupState(state, "user-a")).toThrow(/expirou/i);
  });

  it("requires both WhatsApp management permissions", () => {
    expect(() => assertMinimumWhatsAppPermissions(["whatsapp_business_management", "whatsapp_business_messaging"])).not.toThrow();
    expect(() => assertMinimumWhatsAppPermissions(["whatsapp_business_management"])).toThrow(/permiss/i);
  });
});
