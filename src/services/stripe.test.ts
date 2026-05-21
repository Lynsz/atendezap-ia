import { afterEach, describe, expect, it, vi } from "vitest";
import { SAAS_PLANS } from "@/config/plans";
import {
  buildStripeCheckoutMetadata,
  getStripe,
  getStripeCouponId,
  getStripePriceId,
  getStripeWebhookSecret,
  getSaasPlanByStripePriceId,
  mapStripeSubscriptionStatus,
  unixToIso
} from "@/services/stripe";

describe("Stripe service helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("retorna erros controlados quando Stripe nao esta configurado", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "");

    expect(() => getStripe()).toThrow("Stripe");
    expect(() => getStripeWebhookSecret()).toThrow("Webhook Stripe");
  });

  it("valida price e cupom obrigatorios para checkout", () => {
    vi.stubEnv("STRIPE_PRICE_STARTER", "");
    vi.stubEnv("STRIPE_COUPON_PRO_FIRST_MONTH_29", "");

    expect(() => getStripePriceId(SAAS_PLANS.starter)).toThrow("Stripe");
    expect(() => getStripeCouponId(SAAS_PLANS.pro, true)).toThrow("Cupom Stripe");
    expect(getStripeCouponId(SAAS_PLANS.pro, false)).toBeNull();
  });

  it("sanitiza metadata de checkout e preserva UTMs", () => {
    const metadata = buildStripeCheckoutMetadata("user_123", "pro", true, {
      source: "  ads  ",
      price_id: "price_pro",
      funnel: "ebook",
      utm_source: "meta",
      utm_medium: "cpc",
      utm_campaign: "campanha_maio",
      utm_content: "criativo_a",
      utm_term: "whatsapp ia"
    });

    expect(metadata).toEqual({
      user_id: "user_123",
      plan_id: "pro",
      plan: "pro",
      price_id: "price_pro",
      first_month_offer_applied: "true",
      acquisition_source: "ads",
      funnel_source: "ebook",
      utm_source: "meta",
      utm_medium: "cpc",
      utm_campaign: "campanha_maio",
      utm_content: "criativo_a",
      utm_term: "whatsapp ia"
    });
  });

  it("mapeia price IDs Stripe para planos, incluindo o price promocional do Pro", () => {
    vi.stubEnv("STRIPE_PRICE_STARTER", "price_starter");
    vi.stubEnv("STRIPE_PRICE_PRO", "price_pro");
    vi.stubEnv("STRIPE_PRICE_PRO_FIRST_MONTH_29", "price_pro_29");
    vi.stubEnv("STRIPE_PRICE_PREMIUM", "price_premium");

    expect(getSaasPlanByStripePriceId("price_starter")?.id).toBe("starter");
    expect(getSaasPlanByStripePriceId("price_pro")?.id).toBe("pro");
    expect(getSaasPlanByStripePriceId("price_pro_29")?.id).toBe("pro");
    expect(getSaasPlanByStripePriceId("price_premium")?.id).toBe("premium");
    expect(getSaasPlanByStripePriceId("price_unknown")).toBeNull();
  });

  it("mapeia todos os planos de checkout configurados", () => {
    vi.stubEnv("STRIPE_PRICE_STARTER", "price_starter");
    vi.stubEnv("STRIPE_PRICE_PRO", "price_pro");
    vi.stubEnv("STRIPE_PRICE_PREMIUM", "price_premium");

    expect(getStripePriceId(SAAS_PLANS.starter)).toBe("price_starter");
    expect(getStripePriceId(SAAS_PLANS.pro)).toBe("price_pro");
    expect(getStripePriceId(SAAS_PLANS.premium)).toBe("price_premium");
  });

  it("usa o price recorrente normal do Pro no checkout mesmo com price promocional configurado", () => {
    vi.stubEnv("STRIPE_PRICE_PRO", "price_pro_recurring");
    vi.stubEnv("STRIPE_PRICE_PRO_FIRST_MONTH_29", "price_pro_29");

    expect(getStripePriceId(SAAS_PLANS.pro)).toBe("price_pro_recurring");
  });

  it("mapeia status Stripe para status internos", () => {
    expect(mapStripeSubscriptionStatus("active")).toBe("active");
    expect(mapStripeSubscriptionStatus("trialing")).toBe("trial");
    expect(mapStripeSubscriptionStatus("past_due")).toBe("past_due");
    expect(mapStripeSubscriptionStatus("unpaid")).toBe("past_due");
    expect(mapStripeSubscriptionStatus("canceled")).toBe("canceled");
    expect(mapStripeSubscriptionStatus("incomplete")).toBe("pending");
    expect(mapStripeSubscriptionStatus("paused")).toBe("inactive");
    expect(mapStripeSubscriptionStatus("unknown")).toBe("pending");
  });

  it("converte timestamps Unix para ISO", () => {
    expect(unixToIso(1_700_000_000)).toBe("2023-11-14T22:13:20.000Z");
    expect(unixToIso(null)).toBeNull();
  });
});
