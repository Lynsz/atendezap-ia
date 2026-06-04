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

function createMetricsSupabase() {
  const rows: Record<string, unknown[]> = {
    ebook_leads: [
      { email: "cliente@example.com", created_at: new Date().toISOString() },
      { email: "lead@example.com", created_at: new Date().toISOString() }
    ],
    profiles: [
      { id: "user_1", email: "cliente@example.com", created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
      { id: "user_2", email: "outro@example.com", created_at: new Date().toISOString() }
    ],
    businesses: [
      { user_id: "user_1", onboarding_completed: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ],
    generated_responses: [
      { user_id: "user_1", created_at: new Date().toISOString() },
      { user_id: "user_1", created_at: new Date().toISOString() }
    ],
    subscriptions: [
      { user_id: "user_1", plan: "pro", plan_name: "Pro", price: 97, status: "active", stripe_checkout_session_id: "cs_test", created_at: new Date().toISOString() }
    ],
    user_feedback: [
      { type: "bug", status: "new", created_at: new Date().toISOString() },
      { type: "elogio", status: "resolved", created_at: new Date().toISOString() }
    ],
    ai_response_feedback: [
      { rating: "positive", comment: null, created_at: new Date().toISOString() }
    ],
    saved_responses: [
      { user_id: "user_1", source_template_id: null, category: "Atendimento", copy_count: 1, is_favorite: true, created_at: new Date().toISOString() },
      { user_id: "user_1", source_template_id: "delivery-1", category: "Entrega", copy_count: 0, is_favorite: false, created_at: new Date().toISOString() }
    ],
    events: [
      { event_name: "ai_generation_failed", created_at: new Date().toISOString() },
      { event_name: "pricing_page_view", metadata: { page: "pricing" }, created_at: new Date().toISOString() },
      { event_name: "plan_cta_click", metadata: { plan: "pro" }, created_at: new Date().toISOString() },
      { event_name: "first_response_to_pricing_click", metadata: { source: "dashboard" }, created_at: new Date().toISOString() },
      { event_name: "demo_to_signup_click", metadata: { source: "demo" }, created_at: new Date().toISOString() },
      { event_name: "ebook_to_signup_click", metadata: { source: "ebook" }, created_at: new Date().toISOString() },
      { event_name: "checkout_started", created_at: new Date().toISOString() },
      { event_name: "checkout_failed", created_at: new Date().toISOString() }
    ],
    stripe_webhook_events: [
      { event_type: "checkout.session.completed", processed_at: new Date().toISOString(), created_at: new Date().toISOString() }
    ],
    support_requests: [
      { status: "pending", created_at: new Date().toISOString() },
      { status: "resolved", created_at: new Date().toISOString() }
    ]
  };

  return {
    from: vi.fn((table: string) => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => ({ data: rows[table] || [], error: null }))
      }))
    }))
  };
}

describe("GET /api/admin/metrics", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.requireAdmin.mockReset().mockResolvedValue({
      user: { id: "admin-id" },
      supabase: createMetricsSupabase()
    });
  });

  it("retorna metricas agregadas sem listas pessoais", async () => {
    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://app.example.test/api/admin/metrics?period=7d", {
        headers: { Authorization: "Bearer token" }
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.funnel.totalLeads).toBe(2);
    expect(body.funnel.totalUsers).toBe(2);
    expect(body.funnel.activatedUsers).toBe(1);
    expect(body.funnel.activationRate).toBe(50);
    expect(body.usage.totalResponses).toBe(2);
    expect(body.operationalHealth.responsesGeneratedToday).toBe(2);
    expect(body.operationalHealth.aiFailuresToday).toBe(1);
    expect(body.operationalHealth.checkoutsStartedToday).toBe(1);
    expect(body.operationalHealth.stripeWebhooksProcessedToday).toBe(1);
    expect(body.feedback.byType.bug).toBe(1);
    expect(body.activation.newUsersLast7Days).toBe(2);
    expect(body.activation.onboardingCompletedLast7Days).toBe(1);
    expect(body.activation.firstResponsesGenerated).toBe(1);
    expect(body.activation.responsesSaved).toBe(2);
    expect(body.activation.usersWithCopiedResponse).toBe(1);
    expect(body.activation.usersWithFavoriteResponse).toBe(1);
    expect(body.conversion.pricingPageViews).toBe(1);
    expect(body.conversion.planClicks).toBe(1);
    expect(body.conversion.checkoutsStarted).toBe(1);
    expect(body.conversion.checkoutFailures).toBe(1);
    expect(body.conversion.firstResponseToPricingClicks).toBe(1);
    expect(body.conversion.usersSavedResponseBeforeCheckout).toBe(1);
    expect(body.conversion.approximateFirstResponseToCheckoutRate).toBe(100);
    expect(body.conversion.approximateCheckoutToSubscriptionRate).toBe(100);
    expect(body.usage.totalSavedTemplates).toBe(1);
    expect(body.availability.supportRequests).toBe(true);
    expect(body.funnel.usersWithSavedOrCopiedResponse).toBe(1);
    expect(body.revenue.activeSubscriptions).toBe(1);
    expect(body.revenue.estimatedMrr).toBe(97);
    expect(body.revenue.activeSubscriptionsByPlan).toEqual([{ label: "pro", count: 1 }]);
    expect(body.supportQuality.openSupportRequests).toBe(1);
    expect(body.conversion).toBeDefined();
    expect(body.leads).toBeUndefined();
    expect(body.profiles).toBeUndefined();
  });

  it("mantem metricas carregaveis quando uma tabela opcional esta indisponivel", async () => {
    mocks.requireAdmin.mockResolvedValueOnce({
      user: { id: "admin-id" },
      supabase: {
        from: vi.fn((table: string) => ({
          select: vi.fn(() => ({
            limit: vi.fn(() =>
              table === "support_requests"
                ? { data: null, error: { message: "relation does not exist" } }
                : { data: [], error: null }
            )
          }))
        }))
      }
    });

    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://app.example.test/api/admin/metrics?period=7d", {
        headers: { Authorization: "Bearer token" }
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.availability.supportRequests).toBe(false);
    expect(body.supportQuality.openSupportRequests).toBe(0);
    expect(body.funnel.totalLeads).toBe(0);
    expect(body.conversion.pricingPageViews).toBe(0);
  });

  it("bloqueia usuario comum via requireAdmin", async () => {
    mocks.requireAdmin.mockRejectedValueOnce(new AppError("Acesso restrito a administradores.", 403));

    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://app.example.test/api/admin/metrics", {
        headers: { Authorization: "Bearer token" }
      })
    );

    expect(response.status).toBe(403);
  });
});
