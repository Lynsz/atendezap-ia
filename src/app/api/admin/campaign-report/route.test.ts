import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn()
}));

vi.mock("@/lib/admin", () => ({
  requireAdmin: mocks.requireAdmin
}));

vi.mock("@/lib/rate-limit", () => ({
  enforceRateLimit: vi.fn()
}));

vi.mock("@/lib/logger", () => ({
  serverLog: vi.fn()
}));

function createCampaignReportSupabase() {
  const now = new Date().toISOString();
  const rows: Record<string, unknown[]> = {
    ebook_leads: [
      { email: "cliente@example.com", created_at: now, utm_source: "meta", utm_campaign: "campanha-maio", utm_content: "demo_criativo_1" },
      { email: "outro@example.com", created_at: now, utm_source: "google", utm_campaign: "busca", utm_content: "ebook_criativo_1" }
    ],
    profiles: [
      { id: "user_1", email: "cliente@example.com", created_at: now },
      { id: "user_2", email: "fora@example.com", created_at: now }
    ],
    businesses: [{ user_id: "user_1", onboarding_completed: true, created_at: now, updated_at: now }],
    generated_responses: [{ user_id: "user_1", created_at: now }],
    subscriptions: [
      {
        user_id: "user_1",
        status: "active",
        acquisition_source: "meta",
        funnel_source: "pricing",
        metadata: { utm_source: "meta", utm_campaign: "campanha-maio" },
        stripe_checkout_session_id: "cs_test",
        created_at: now
      }
    ],
    user_feedback: [{ type: "dificuldade_uso", created_at: now }],
    events: [{ event_name: "demo_response_success", metadata: { utm_source: "meta", utm_campaign: "campanha-maio" }, created_at: now }]
  };

  return {
    from: vi.fn((table: string) => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => ({ data: rows[table] || [], error: null }))
      }))
    }))
  };
}

describe("GET /api/admin/campaign-report", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.requireAdmin.mockReset().mockResolvedValue({
      user: { id: "admin-id" },
      supabase: createCampaignReportSupabase()
    });
  });

  it("retorna relatorio agregado filtrado por campanha", async () => {
    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://app.example.test/api/admin/campaign-report?period=7d&utm_source=meta&utm_campaign=campanha-maio", {
        headers: { Authorization: "Bearer token" }
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.metrics.totalLeads).toBe(1);
    expect(body.metrics.totalSignups).toBe(1);
    expect(body.metrics.onboardingCompleted).toBe(1);
    expect(body.metrics.firstResponseGenerated).toBe(1);
    expect(body.metrics.checkoutStarted).toBe(1);
    expect(body.metrics.activeSubscriptions).toBe(1);
    expect(body.metrics.demoUses).toBe(1);
    expect(body.metrics.feedbackCount).toBe(1);
    expect(body.metrics.leadToSignupRate).toBe(100);
    expect(body.breakdowns.leadsByUtmSource).toEqual([{ label: "meta", count: 1 }]);
    expect(body.breakdowns.leadsByUtmContent).toEqual([{ label: "demo_criativo_1", count: 1 }]);
    expect(body.leads).toBeUndefined();
    expect(body.profiles).toBeUndefined();
  });

  it("retorna 401 quando nao ha sessao", async () => {
    mocks.requireAdmin.mockRejectedValueOnce(new AppError("Sessao nao encontrada.", 401));

    const { GET } = await import("./route");
    const response = await GET(new Request("https://app.example.test/api/admin/campaign-report"));

    expect(response.status).toBe(401);
  });

  it("retorna 403 para usuario comum", async () => {
    mocks.requireAdmin.mockRejectedValueOnce(new AppError("Acesso restrito a administradores.", 403));

    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://app.example.test/api/admin/campaign-report", {
        headers: { Authorization: "Bearer token" }
      })
    );

    expect(response.status).toBe(403);
  });
});
