import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";

const mocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  enforceRateLimit: vi.fn(),
  getWhatsAppServerConfig: vi.fn(),
  getSupabaseAdmin: vi.fn(),
  requireWhatsAppTemplateSyncEnabled: vi.fn(),
  syncMetaTemplatesForConnection: vi.fn(),
  writeWhatsAppAudit: vi.fn(),
  trackServerAppEvent: vi.fn()
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/server", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/lib/rate-limit", () => ({ enforceRateLimit: mocks.enforceRateLimit }));
vi.mock("@/lib/server/whatsapp", () => ({ getWhatsAppServerConfig: mocks.getWhatsAppServerConfig }));
vi.mock("@/lib/supabase/server", () => ({ getSupabaseAdmin: mocks.getSupabaseAdmin }));
vi.mock("@/lib/server/whatsapp-audit", () => ({ writeWhatsAppAudit: mocks.writeWhatsAppAudit }));
vi.mock("@/lib/analytics/server", () => ({ trackServerAppEvent: mocks.trackServerAppEvent }));
vi.mock("@/lib/server/whatsapp-templates-meta", () => ({
  getTemplateSyncCountRange: (count: number) => count === 0 ? "0" : "1_9",
  requireWhatsAppTemplateSyncEnabled: mocks.requireWhatsAppTemplateSyncEnabled,
  syncMetaTemplatesForConnection: mocks.syncMetaTemplatesForConnection,
  templateSyncHasErrors: (summary: { errors: Array<{ count: number }> }) => summary.errors.some((error) => error.count > 0)
}));

function supabaseWithConnection(connection: { id: string } | null) {
  return {
    from: vi.fn(() => {
      const chain: Record<string, unknown> = {};
      for (const method of ["select", "eq", "order", "limit"]) chain[method] = vi.fn(() => chain);
      chain.maybeSingle = vi.fn(() => Promise.resolve({ data: connection, error: null }));
      return chain;
    })
  };
}

function request() {
  return new Request("https://app.test/api/whatsapp/templates/sync", {
    method: "POST",
    headers: { Authorization: "Bearer test-only", "Content-Type": "application/json" },
    body: "{}"
  });
}

describe("POST WhatsApp template sync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireUser.mockResolvedValue({ id: "user-a" });
    mocks.getWhatsAppServerConfig.mockReturnValue({ businessAccountId: "waba-test" });
    mocks.getSupabaseAdmin.mockReturnValue(supabaseWithConnection({ id: "connection-a" }));
    mocks.syncMetaTemplatesForConnection.mockResolvedValue({ found: 2, created: 1, updated: 1, statusChanged: 1, errors: [] });
  });

  it("exige login antes de sincronizar", async () => {
    mocks.requireUser.mockRejectedValueOnce(new AppError("Sessão inválida.", 401));
    const { POST } = await import("./route");
    const response = await POST(request());
    expect(response.status).toBe(401);
    expect(mocks.syncMetaTemplatesForConnection).not.toHaveBeenCalled();
  });

  it("bloqueia com mensagem amigável quando a flag está desativada", async () => {
    mocks.requireWhatsAppTemplateSyncEnabled.mockImplementationOnce(() => {
      throw new AppError("A sincronização de templates está desativada neste ambiente.", 503);
    });
    const { POST } = await import("./route");
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "Não foi possível sincronizar os templates agora. Verifique a configuração do WhatsApp." });
    expect(mocks.getSupabaseAdmin).not.toHaveBeenCalled();
  });

  it("sincroniza somente a conexão do usuário e retorna resumo seguro", async () => {
    const { POST } = await import("./route");
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: "Templates sincronizados com a Meta.",
      summary: { found: 2, created: 1, updated: 1, statusChanged: 1, errors: [] }
    });
    expect(mocks.syncMetaTemplatesForConnection).toHaveBeenCalledWith("user-a", "connection-a");
  });

  it("não mascara falha de persistência como sincronização concluída", async () => {
    mocks.syncMetaTemplatesForConnection.mockResolvedValueOnce({
      found: 1,
      created: 0,
      updated: 0,
      statusChanged: 0,
      errors: [{ type: "template_persistence_failed", count: 1 }]
    });
    const { POST } = await import("./route");
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(mocks.writeWhatsAppAudit).toHaveBeenCalledWith(expect.objectContaining({ action: "template_sync_failed" }));
    expect(mocks.trackServerAppEvent).not.toHaveBeenCalledWith(expect.objectContaining({ event_name: "whatsapp_template_sync_completed" }));
  });
});
