import { afterEach, describe, expect, it, vi } from "vitest";
import { SAAS_PLANS } from "@/config/plans";
import {
  buildStripeCheckoutMetadata,
  getStripe,
  getStripeCouponId,
  getStripePriceId,
  getStripeWebhookSecret,
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

    expect(() => getStripe()).toThrow("Stripe não está configurado neste ambiente.");
    expect(() => getStripeWebhookSecret()).toThrow("Webhook Stripe não está configurado neste ambiente.");
  });

  it("valida price e cupom obrigatorios para checkout", () => {
    expect(() => getStripePriceId({ ...SAAS_PLANS.starter, stripePriceId: "" })).toThrow("Preço Stripe não configurado");
    expect(() => getStripeCouponId({ ...SAAS_PLANS.pro, stripeCouponId: "" }, true)).toThrow("Cupom Stripe do primeiro mês");
    expect(getStripeCouponId(SAAS_PLANS.pro, false)).toBeNull();
  });

  it("sanitiza metadata de checkout e preserva UTMs", () => {
    const metadata = buildStripeCheckoutMetadata("user_123", "pro", true, {
      source: "  ads  ",
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
