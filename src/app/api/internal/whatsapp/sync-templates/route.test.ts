import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";

const mocks = vi.hoisted(() => ({
  requireInternalJob: vi.fn(),
  requireWhatsAppTemplateSyncEnabled: vi.fn(),
  getWhatsAppServerConfig: vi.fn(),
  getSupabaseAdmin: vi.fn(),
  syncMetaTemplatesForConnection: vi.fn(),
  writeWhatsAppAudit: vi.fn(),
  trackServerAppEvent: vi.fn()
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/server/internal-job-auth", () => ({ requireInternalJob: mocks.requireInternalJob }));
vi.mock("@/lib/server/whatsapp", () => ({ getWhatsAppServerConfig: mocks.getWhatsAppServerConfig }));
vi.mock("@/lib/supabase/server", () => ({ getSupabaseAdmin: mocks.getSupabaseAdmin }));
vi.mock("@/lib/server/whatsapp-audit", () => ({ writeWhatsAppAudit: mocks.writeWhatsAppAudit }));
vi.mock("@/lib/analytics/server", () => ({ trackServerAppEvent: mocks.trackServerAppEvent }));
vi.mock("@/lib/server/whatsapp-templates-meta", () => ({
  getTemplateSyncCountRange: () => "1_9",
  requireWhatsAppTemplateSyncEnabled: mocks.requireWhatsAppTemplateSyncEnabled,
  syncMetaTemplatesForConnection: mocks.syncMetaTemplatesForConnection,
  templateSyncHasErrors: (summary: { errors: Array<{ count: number }> }) => summary.errors.some((error) => error.count > 0)
}));

function request() {
  return new Request("https://app.test/api/internal/whatsapp/sync-templates", {
    method: "POST",
    headers: { Authorization: "Bearer test-only-internal-secret" }
  });
}

describe("POST internal WhatsApp template sync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getWhatsAppServerConfig.mockReturnValue({ businessAccountId: "waba-test" });
    mocks.getSupabaseAdmin.mockReturnValue({
      from: vi.fn(() => {
        const chain: Record<string, unknown> = {};
        for (const method of ["select", "eq"]) chain[method] = vi.fn(() => chain);
        chain.limit = vi.fn(() => Promise.resolve({ data: [{ id: "connection-a", user_id: "user-a" }], error: null }));
        return chain;
      })
    });
    mocks.syncMetaTemplatesForConnection.mockResolvedValue({ found: 1, created: 1, updated: 0, statusChanged: 1, errors: [] });
  });

  it("exige o segredo interno antes de consultar banco ou Meta", async () => {
    mocks.requireInternalJob.mockImplementationOnce(() => {
      throw new AppError("Acesso não autorizado.", 401);
    });
    const { POST } = await import("./route");
    const response = await POST(request());
    expect(response.status).toBe(401);
    expect(mocks.getSupabaseAdmin).not.toHaveBeenCalled();
    expect(mocks.syncMetaTemplatesForConnection).not.toHaveBeenCalled();
  });

  it("exige a flag de sincronização depois de autenticar o job", async () => {
    mocks.requireWhatsAppTemplateSyncEnabled.mockImplementationOnce(() => {
      throw new AppError("A sincronização de templates está desativada neste ambiente.", 503);
    });
    const { POST } = await import("./route");
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(mocks.getSupabaseAdmin).not.toHaveBeenCalled();
  });

  it("retorna apenas contagens seguras para o job autenticado", async () => {
    const { POST } = await import("./route");
    const response = await POST(request());
    const responseText = await response.text();
    expect(response.status).toBe(200);
    expect(JSON.parse(responseText)).toEqual({ summary: { found: 1, created: 1, updated: 0, statusChanged: 1, errors: [] } });
    expect(responseText).not.toContain("test-only-internal-secret");
  });
});
