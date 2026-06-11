import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  getSupabaseAdmin: vi.fn(),
  getStripe: vi.fn(),
  getStripeWebhookSecret: vi.fn(() => "whsec_test"),
  customerCreate: vi.fn(),
  checkoutCreate: vi.fn(),
  portalCreate: vi.fn(),
  constructEvent: vi.fn(),
  subscriptionRetrieve: vi.fn(),
  upsertSubscription: vi.fn(),
  updateSubscription: vi.fn(),
  insertWebhookEvent: vi.fn(),
  currentSubscription: null as Record<string, unknown> | null
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mocks.createClient
}));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseAdmin: mocks.getSupabaseAdmin
}));

vi.mock("@/lib/rate-limit", () => ({
  assertRequestSize: vi.fn(),
  enforceRateLimit: vi.fn()
}));

vi.mock("@/lib/logger", () => ({
  serverLog: vi.fn()
}));

vi.mock("@/services/stripe", async () => {
  const actual = await vi.importActual<typeof import("@/services/stripe")>("@/services/stripe");
  return {
    ...actual,
    getStripe: mocks.getStripe,
    getStripeWebhookSecret: mocks.getStripeWebhookSecret
  };
});

function createAuthClient() {
  return {
    auth: {
      getUser: vi.fn(async () => ({
        data: {
          user: {
            id: "11111111-1111-4111-8111-111111111111",
            email: "cliente@example.com",
            user_metadata: { name: "Cliente Teste" }
          }
        },
        error: null
      }))
    }
  };
}

type SupabaseQueryMock = {
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  maybeSingle: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  upsert?: ReturnType<typeof vi.fn>;
};

function createQuery(data: Record<string, unknown> | null = null): SupabaseQueryMock {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    maybeSingle: vi.fn(async () => ({ data, error: null })),
    update: vi.fn(() => query)
  };

  return query;
}

function createAdminClient(subscription: Record<string, unknown> | null = mocks.currentSubscription) {
  const subscriptionQuery = createQuery(subscription);
  subscriptionQuery.upsert = mocks.upsertSubscription;
  subscriptionQuery.update = vi.fn((payload: Record<string, unknown>) => {
    mocks.updateSubscription(payload);
    return subscriptionQuery;
  });

  return {
    from: vi.fn((table: string) => {
      if (table === "subscriptions") return subscriptionQuery;
      if (table === "stripe_webhook_events") {
        return {
          insert: mocks.insertWebhookEvent
        };
      }
      throw new Error(`Tabela inesperada no teste: ${table}`);
    })
  };
}

function createStripeMock() {
  return {
    customers: {
      create: mocks.customerCreate
    },
    checkout: {
      sessions: {
        create: mocks.checkoutCreate
      }
    },
    billingPortal: {
      sessions: {
        create: mocks.portalCreate
      }
    },
    webhooks: {
      constructEvent: mocks.constructEvent
    },
    subscriptions: {
      retrieve: mocks.subscriptionRetrieve
    }
  };
}

describe("Stripe API routes", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();

    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    process.env.NEXT_PUBLIC_APP_URL = "https://app.example.com";
    process.env.STRIPE_PRICE_STARTER = "price_starter";
    process.env.STRIPE_PRICE_PRO = "price_pro";
    process.env.STRIPE_PRICE_PRO_FIRST_MONTH_29 = "price_pro_29";
    process.env.STRIPE_PRICE_PREMIUM = "price_premium";
    process.env.STRIPE_PRO_FIRST_MONTH_COUPON_ID = "coupon_pro_29";

    mocks.currentSubscription = null;
    mocks.createClient.mockReset().mockReturnValue(createAuthClient());
    mocks.getSupabaseAdmin.mockReset().mockImplementation(() => createAdminClient());
    mocks.getStripe.mockReset().mockImplementation(() => createStripeMock());
    mocks.getStripeWebhookSecret.mockReset().mockReturnValue("whsec_test");
    mocks.customerCreate.mockReset().mockResolvedValue({ id: "cus_test" });
    mocks.checkoutCreate.mockReset().mockResolvedValue({ id: "cs_test", url: "https://checkout.stripe.test/session" });
    mocks.portalCreate.mockReset().mockResolvedValue({ url: "https://billing.stripe.test/session" });
    mocks.constructEvent.mockReset();
    mocks.subscriptionRetrieve.mockReset();
    mocks.upsertSubscription.mockReset().mockResolvedValue({ error: null });
    mocks.updateSubscription.mockReset();
    mocks.insertWebhookEvent.mockReset().mockResolvedValue({ error: null });
  });

  it("rejeita plano invalido no checkout", async () => {
    const { POST } = await import("./create-checkout-session/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({ planId: "enterprise" })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("Plano invalido");
    expect(mocks.checkoutCreate).not.toHaveBeenCalled();
  });

  it("retorna 401 quando checkout nao tem usuario logado", async () => {
    const { POST } = await import("./create-checkout-session/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "starter" })
      })
    );

    expect(response.status).toBe(401);
    expect(mocks.checkoutCreate).not.toHaveBeenCalled();
  });

  it("cria checkout session para plano starter com metadata segura", async () => {
    const { POST } = await import("./create-checkout-session/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({ plan: "starter", source: "pricing", utm_source: "meta" })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.url).toBe("https://checkout.stripe.test/session");
    expect(mocks.checkoutCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        customer: "cus_test",
        client_reference_id: "11111111-1111-4111-8111-111111111111",
        line_items: [{ price: "price_starter", quantity: 1 }],
        discounts: undefined,
        success_url: "https://app.example.com/assinatura?checkout=success",
        cancel_url: "https://app.example.com/assinatura?checkout=cancelled",
        metadata: expect.objectContaining({
          user_id: "11111111-1111-4111-8111-111111111111",
          plan: "starter",
          price_id: "price_starter",
          utm_source: "meta"
        })
      })
    );
    expect(mocks.upsertSubscription).toHaveBeenCalledWith(
      expect.objectContaining({
        provider_customer_id: "cus_test",
        stripe_customer_id: "cus_test",
        subscription_status: "pending"
      }),
      { onConflict: "user_id" }
    );
  });

  it("checkout rejeita preco enviado pelo client", async () => {
    const { POST } = await import("./create-checkout-session/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({ plan: "starter", price: "price_malicioso" })
      })
    );

    expect(response.status).toBe(400);
    expect(mocks.checkoutCreate).not.toHaveBeenCalled();
  });

  it("checkout retorna erro amigavel quando price id nao esta configurado", async () => {
    delete process.env.STRIPE_PRICE_STARTER;

    const { POST } = await import("./create-checkout-session/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({ plan: "starter" })
      })
    );

    const body = await response.json();

    expect(response.status).toBeGreaterThanOrEqual(500);
    expect(body.error).toContain("Stripe ainda não está configurado neste ambiente.");
    expect(mocks.checkoutCreate).not.toHaveBeenCalled();
  });

  it("cria checkout do Pro com price recorrente e cupom de primeiro mes", async () => {
    const { POST } = await import("./create-checkout-session/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({ plan: "pro" })
      })
    );

    expect(response.status).toBe(200);
    expect(mocks.checkoutCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: "price_pro", quantity: 1 }],
        discounts: [{ coupon: "coupon_pro_29" }],
        metadata: expect.objectContaining({
          plan: "pro",
          price_id: "price_pro",
          first_month_offer_applied: "true"
        })
      })
    );
  });

  it("cria checkout do Pro sem desconto quando cupom nao esta configurado", async () => {
    delete process.env.STRIPE_PRO_FIRST_MONTH_COUPON_ID;

    const { POST } = await import("./create-checkout-session/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({ plan: "pro" })
      })
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.firstMonthPriceApplied).toBe(false);
    expect(mocks.checkoutCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: "price_pro", quantity: 1 }],
        discounts: undefined,
        metadata: expect.objectContaining({
          plan: "pro",
          first_month_offer_applied: "false"
        })
      })
    );
  });

  it("cria checkout Premium com price premium", async () => {
    const { POST } = await import("./create-checkout-session/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({ plan: "premium" })
      })
    );

    expect(response.status).toBe(200);
    expect(mocks.checkoutCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: "price_premium", quantity: 1 }],
        discounts: undefined
      })
    );
  });

  it("retorna erro controlado quando portal nao encontra customer Stripe", async () => {
    const { POST } = await import("./create-portal-session/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/create-portal-session", {
        method: "POST",
        headers: { Authorization: "Bearer token" }
      })
    );

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toContain("Portal de assinatura");
    expect(mocks.portalCreate).not.toHaveBeenCalled();
  });

  it("retorna 401 quando portal nao tem usuario logado", async () => {
    const { POST } = await import("./create-portal-session/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/create-portal-session", {
        method: "POST"
      })
    );

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toContain("login");
    expect(mocks.portalCreate).not.toHaveBeenCalled();
  });

  it("cria portal Stripe com retorno para assinatura quando existe customer", async () => {
    mocks.currentSubscription = {
      provider: "stripe",
      provider_customer_id: "cus_test",
      stripe_customer_id: "cus_test"
    };

    const { POST } = await import("./create-portal-session/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/create-portal-session", {
        method: "POST",
        headers: { Authorization: "Bearer token" }
      })
    );

    expect(response.status).toBe(200);
    expect(mocks.portalCreate).toHaveBeenCalledWith({
      customer: "cus_test",
      return_url: "https://app.example.com/assinatura"
    });
  });

  it("rejeita webhook com assinatura invalida", async () => {
    mocks.constructEvent.mockImplementation(() => {
      throw new Error("invalid signature");
    });

    const { POST } = await import("./webhook/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": "invalid" },
        body: "{}"
      })
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("Webhook Stripe invalido");
    expect(mocks.insertWebhookEvent).not.toHaveBeenCalled();
  });

  it("atualiza assinatura via webhook e mapeia price promocional do Pro como pro", async () => {
    mocks.constructEvent.mockReturnValue({
      id: "evt_subscription_updated",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_test",
          status: "active",
          customer: "cus_test",
          metadata: { user_id: "11111111-1111-4111-8111-111111111111" },
          items: { data: [{ price: { id: "price_pro_29" } }] },
          cancel_at_period_end: false,
          current_period_start: 1_700_000_000,
          current_period_end: 1_702_592_000
        }
      }
    });

    const { POST } = await import("./webhook/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": "valid" },
        body: "{}"
      })
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.event).toBe("customer.subscription.updated");
    expect(mocks.upsertSubscription).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "11111111-1111-4111-8111-111111111111",
        plan: "pro",
        provider_customer_id: "cus_test",
        stripe_customer_id: "cus_test",
        provider_subscription_id: "sub_test",
        stripe_subscription_id: "sub_test",
        subscription_status: "active",
        monthly_limit: 500
      }),
      { onConflict: "user_id" }
    );
  });

  it("mantem assinatura Pro com cupom como plan pro no webhook", async () => {
    mocks.constructEvent.mockReturnValue({
      id: "evt_subscription_pro_coupon",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_pro_coupon",
          status: "active",
          customer: "cus_test",
          metadata: {
            user_id: "11111111-1111-4111-8111-111111111111",
            plan: "pro",
            first_month_offer_applied: "true"
          },
          items: { data: [{ price: { id: "price_pro" } }] },
          cancel_at_period_end: false,
          current_period_start: 1_700_000_000,
          current_period_end: 1_702_592_000
        }
      }
    });

    const { POST } = await import("./webhook/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": "valid" },
        body: "{}"
      })
    );

    expect(response.status).toBe(200);
    expect(mocks.upsertSubscription).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "11111111-1111-4111-8111-111111111111",
        plan: "pro",
        provider_price_id: "price_pro",
        monthly_limit: 500,
        first_month_price_applied: true,
        promo_code: "stripe_pro_first_month_29"
      }),
      { onConflict: "user_id" }
    );
  });

  it("preserva status Stripe de pagamento vencido sem liberar como ativo", async () => {
    mocks.constructEvent.mockReturnValue({
      id: "evt_subscription_unpaid",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_unpaid",
          status: "unpaid",
          customer: "cus_test",
          metadata: { user_id: "11111111-1111-4111-8111-111111111111", plan: "pro" },
          items: { data: [{ price: { id: "price_pro" } }] },
          cancel_at_period_end: false
        }
      }
    });

    const { POST } = await import("./webhook/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": "valid" },
        body: "{}"
      })
    );

    expect(response.status).toBe(200);
    expect(mocks.upsertSubscription).toHaveBeenCalledWith(
      expect.objectContaining({
        plan: "pro",
        status: "unpaid",
        subscription_status: "unpaid",
        monthly_limit: 500
      }),
      { onConflict: "user_id" }
    );
  });

  it("processa webhook sem user_id sem quebrar quando nao ha assinatura salva", async () => {
    mocks.constructEvent.mockReturnValue({
      id: "evt_missing_user",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_missing_user",
          status: "active",
          customer: "cus_missing_user",
          metadata: {},
          items: { data: [{ price: { id: "price_unknown" } }] },
          cancel_at_period_end: false
        }
      }
    });

    const { POST } = await import("./webhook/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": "valid" },
        body: "{}"
      })
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.event).toBe("customer.subscription.updated");
    expect(mocks.upsertSubscription).not.toHaveBeenCalled();
  });

  it("marca assinatura como cancelada em subscription.deleted", async () => {
    mocks.constructEvent.mockReturnValue({
      id: "evt_subscription_deleted",
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_deleted",
          status: "canceled",
          customer: "cus_test",
          metadata: { user_id: "11111111-1111-4111-8111-111111111111" },
          items: { data: [{ price: { id: "price_premium" } }] },
          cancel_at_period_end: false,
          current_period_start: 1_700_000_000,
          current_period_end: 1_702_592_000
        }
      }
    });

    const { POST } = await import("./webhook/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": "valid" },
        body: "{}"
      })
    );

    expect(response.status).toBe(200);
    expect(mocks.upsertSubscription).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "11111111-1111-4111-8111-111111111111",
        plan: "premium",
        status: "canceled",
        subscription_status: "canceled"
      }),
      { onConflict: "user_id" }
    );
  });

  it("marca invoice.payment_failed como falha controlada", async () => {
    mocks.constructEvent.mockReturnValue({
      id: "evt_invoice_failed",
      type: "invoice.payment_failed",
      data: {
        object: {
          subscription: "sub_failed",
          payment_intent: "pi_failed"
        }
      }
    });
    mocks.subscriptionRetrieve.mockResolvedValue({
      id: "sub_failed",
      status: "past_due",
      customer: "cus_test",
      metadata: { user_id: "11111111-1111-4111-8111-111111111111" },
      items: { data: [{ price: { id: "price_starter" } }] },
      cancel_at_period_end: false
    });

    const { POST } = await import("./webhook/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": "valid" },
        body: "{}"
      })
    );

    expect(response.status).toBe(200);
    expect(mocks.upsertSubscription).toHaveBeenCalledWith(
      expect.objectContaining({
        plan: "starter",
        status: "past_due",
        last_payment_status: "failed"
      }),
      { onConflict: "user_id" }
    );
    expect(mocks.updateSubscription).toHaveBeenCalledWith(
      expect.objectContaining({
        provider_payment_id: "pi_failed",
        last_payment_status: "failed"
      })
    );
  });

  it("marca invoice.payment_succeeded como pagamento bem sucedido", async () => {
    mocks.constructEvent.mockReturnValue({
      id: "evt_invoice_succeeded",
      type: "invoice.payment_succeeded",
      data: {
        object: {
          subscription: "sub_paid",
          payment_intent: "pi_paid"
        }
      }
    });
    mocks.subscriptionRetrieve.mockResolvedValue({
      id: "sub_paid",
      status: "active",
      customer: "cus_test",
      metadata: { user_id: "11111111-1111-4111-8111-111111111111" },
      items: { data: [{ price: { id: "price_pro" } }] },
      cancel_at_period_end: false
    });

    const { POST } = await import("./webhook/route");
    const response = await POST(
      new Request("https://app.example.com/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": "valid" },
        body: "{}"
      })
    );

    expect(response.status).toBe(200);
    expect(mocks.upsertSubscription).toHaveBeenCalledWith(
      expect.objectContaining({
        plan: "pro",
        status: "active",
        last_payment_status: "succeeded"
      }),
      { onConflict: "user_id" }
    );
    expect(mocks.updateSubscription).toHaveBeenCalledWith(
      expect.objectContaining({
        provider_payment_id: "pi_paid",
        last_payment_status: "succeeded"
      })
    );
  });
});
