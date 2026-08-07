import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";

const mocks = vi.hoisted(() => ({ requireUser: vi.fn(), enforceRateLimit: vi.fn(), getSupabaseAdmin: vi.fn(), audit: vi.fn(), event: vi.fn(), track: vi.fn() }));
vi.mock("@/lib/auth/server", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/lib/rate-limit", () => ({ enforceRateLimit: mocks.enforceRateLimit }));
vi.mock("@/lib/supabase/server", () => ({ getSupabaseAdmin: mocks.getSupabaseAdmin }));
vi.mock("@/lib/server/whatsapp-audit", () => ({ writeWhatsAppAudit: mocks.audit }));
vi.mock("@/lib/server/whatsapp-connection-events", () => ({ writeWhatsAppConnectionEvent: mocks.event }));
vi.mock("@/lib/analytics/server", () => ({ trackServerAppEvent: mocks.track }));

function supabaseForDisconnect(connection: { id: string } | null, updates: Array<Record<string, unknown>>, filters: unknown[][]) {
  let call = 0;
  return {
    from: vi.fn(() => {
      const current = call++;
      const chain: Record<string, unknown> = {};
      for (const method of ["select", "order", "limit"]) chain[method] = vi.fn(() => chain);
      chain.eq = vi.fn((...args: unknown[]) => { filters.push(args); return chain; });
      chain.update = vi.fn((values: Record<string, unknown>) => { updates.push(values); return chain; });
      const result = current === 0 ? { data: connection, error: null } : { data: null, error: null };
      chain.maybeSingle = vi.fn(() => Promise.resolve(result));
      chain.then = (resolve: (value: unknown) => unknown) => Promise.resolve(result).then(resolve);
      return chain;
    })
  };
}

describe("POST disconnect WhatsApp connection", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.requireUser.mockResolvedValue({ id: "user-a" }); });

  it("requires login", async () => {
    mocks.requireUser.mockRejectedValue(new AppError("SessÃ£o invÃ¡lida.", 401));
    const { POST } = await import("./route");
    expect((await POST(new Request("https://app.test", { method: "POST" }))).status).toBe(401);
  });

  it("filters by session user, disconnects, and invalidates the token without deleting history", async () => {
    const updates: Array<Record<string, unknown>> = [];
    const filters: unknown[][] = [];
    const client = supabaseForDisconnect({ id: "connection-a" }, updates, filters);
    mocks.getSupabaseAdmin.mockReturnValue(client);
    const { POST } = await import("./route");
    const response = await POST(new Request("https://app.test", { method: "POST" }));
    expect(response.status).toBe(200);
    expect(filters).toContainEqual(["user_id", "user-a"]);
    expect(updates[0]).toEqual(expect.objectContaining({ connection_status: "disconnected", access_token_encrypted: null }));
    expect(client.from).toHaveBeenCalledTimes(2);
    expect(client.from).toHaveBeenNthCalledWith(1, "whatsapp_connections");
    expect(client.from).toHaveBeenNthCalledWith(2, "whatsapp_connections");
  });

  it("cannot disconnect another user's connection", async () => {
    mocks.getSupabaseAdmin.mockReturnValue(supabaseForDisconnect(null, [], []));
    const { POST } = await import("./route");
    const response = await POST(new Request("https://app.test", { method: "POST" }));
    expect(response.status).toBe(404);
  });
});
