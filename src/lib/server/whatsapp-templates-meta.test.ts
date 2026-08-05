import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getSupabaseAdmin: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ getSupabaseAdmin: mocks.getSupabaseAdmin }));
vi.mock("@/lib/logger", () => ({ serverLog: vi.fn() }));
vi.mock("@/lib/analytics/server", () => ({ trackServerAppEvent: vi.fn() }));
vi.mock("@/lib/server/whatsapp-audit", () => ({ writeWhatsAppAudit: vi.fn() }));

function mockTemplate(id: string, status = "APPROVED") {
  return { id, name: `template_${id}`, language: "pt_BR", status, category: "UTILITY", components: [{ type: "BODY", text: "Olá {{1}}" }] };
}

function queuedSupabase(results: Array<{ data?: unknown; error?: unknown }>) {
  const calls: Array<{ table: string; operation: string; value?: unknown }> = [];
  return {
    calls,
    from: vi.fn((table: string) => {
      const chain: Record<string, unknown> = {};
      for (const method of ["select", "eq", "limit"]) chain[method] = vi.fn(() => chain);
      chain.insert = vi.fn((value: unknown) => { calls.push({ table, operation: "insert", value }); return chain; });
      chain.update = vi.fn((value: unknown) => { calls.push({ table, operation: "update", value }); return chain; });
      const next = () => Promise.resolve(results.shift() || { data: null, error: null });
      chain.single = vi.fn(next);
      chain.maybeSingle = vi.fn(next);
      chain.then = (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) => next().then(resolve, reject);
      return chain;
    })
  };
}

describe("Meta template synchronization", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("WHATSAPP_ENABLED", "true");
    vi.stubEnv("WHATSAPP_TEMPLATE_SYNC_ENABLED", "true");
    vi.stubEnv("WHATSAPP_TEMPLATE_SYNC_LIMIT", "2");
    vi.stubEnv("WHATSAPP_ACCESS_TOKEN", "test-only-placeholder");
    vi.stubEnv("WHATSAPP_PHONE_NUMBER_ID", "1234567890");
    vi.stubEnv("WHATSAPP_BUSINESS_ACCOUNT_ID", "9876543210");
    vi.stubEnv("WHATSAPP_VERIFY_TOKEN", "test-only-placeholder");
    vi.stubEnv("WHATSAPP_API_VERSION", "v23.0");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("normaliza status, categoria, componentes e variáveis sem exemplos da Meta", async () => {
    const { normalizeMetaTemplate } = await import("./whatsapp-templates-meta");
    const normalized = normalizeMetaTemplate({ ...mockTemplate("1"), example: { body_text: [["valor real"]] }, quality_score: { score: "GREEN" } });
    expect(normalized).toMatchObject({ remoteStatus: "approved", legacyStatus: "approved", category: "utility", variablesCount: 1, qualityScore: "GREEN", supported: true });
    expect(JSON.stringify(normalized)).not.toContain("valor real");
  });

  it("respeita paginação e limite seguro por execução", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [mockTemplate("1")], paging: { cursors: { after: "cursor-1" } } }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [mockTemplate("2"), mockTemplate("3")] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { listMetaWhatsAppTemplates } = await import("./whatsapp-templates-meta");
    const templates = await listMetaWhatsAppTemplates();
    expect(templates.map((item) => item.metaTemplateId)).toEqual(["1", "2"]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.stringify(templates)).not.toContain("test-only-placeholder");
  });

  it("retorna erro amigável sem chamar a Meta quando a sincronização está desativada", async () => {
    vi.stubEnv("WHATSAPP_TEMPLATE_SYNC_ENABLED", "false");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { listMetaWhatsAppTemplates } = await import("./whatsapp-templates-meta");
    await expect(listMetaWhatsAppTemplates()).rejects.toThrow("sincronização de templates está desativada");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("cria template e histórico quando o status remoto aparece pela primeira vez", async () => {
    const supabase = queuedSupabase([
      { data: null, error: null },
      { data: null, error: null },
      { data: { id: "11111111-1111-4111-8111-111111111111" }, error: null },
      { data: null, error: null }
    ]);
    mocks.getSupabaseAdmin.mockReturnValue(supabase);
    const { normalizeMetaTemplate, syncMetaTemplateToLocal } = await import("./whatsapp-templates-meta");
    const result = await syncMetaTemplateToLocal("user-a", normalizeMetaTemplate(mockTemplate("1")), "connection-a");
    expect(result).toMatchObject({ created: true, updated: false, statusChanged: true });
    expect(supabase.calls).toEqual(expect.arrayContaining([
      expect.objectContaining({ table: "whatsapp_templates", operation: "insert" }),
      expect.objectContaining({ table: "whatsapp_template_status_history", operation: "insert" })
    ]));
    expect(JSON.stringify(supabase.calls)).not.toContain("test-only-placeholder");
  });

  it("atualiza template existente e registra a transição remota", async () => {
    const supabase = queuedSupabase([
      { data: { id: "11111111-1111-4111-8111-111111111111", remote_status: "pending", status: "pending", local_status: "active" }, error: null },
      { data: { id: "11111111-1111-4111-8111-111111111111" }, error: null },
      { data: null, error: null }
    ]);
    mocks.getSupabaseAdmin.mockReturnValue(supabase);
    const { normalizeMetaTemplate, syncMetaTemplateToLocal } = await import("./whatsapp-templates-meta");
    const result = await syncMetaTemplateToLocal("user-a", normalizeMetaTemplate(mockTemplate("1", "APPROVED")), "connection-a");
    expect(result).toMatchObject({ created: false, updated: true, statusChanged: true });
    expect(supabase.calls).toEqual(expect.arrayContaining([
      expect.objectContaining({ table: "whatsapp_templates", operation: "update", value: expect.objectContaining({ remote_status: "approved" }) }),
      expect.objectContaining({ table: "whatsapp_template_status_history", operation: "insert", value: expect.objectContaining({ previous_status: "pending", new_status: "approved", source: "meta_sync" }) })
    ]));
  });

  it("normaliza erro da Meta sem retornar token ou payload bruto", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { code: 190, message: "detalhe bruto privado" } }), { status: 401 })));
    const { listMetaWhatsAppTemplates } = await import("./whatsapp-templates-meta");
    await expect(listMetaWhatsAppTemplates()).rejects.toMatchObject({
      errorType: "provider_authentication",
      message: "A conexão com o WhatsApp precisa ser revisada antes de novos envios."
    });
  });
});
