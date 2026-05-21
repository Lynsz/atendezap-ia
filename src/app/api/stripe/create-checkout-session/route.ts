import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getSaasPlan, isPlanId } from "@/config/plans";
import { AppError, errorResponse } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  buildStripeCheckoutMetadata,
  getAppUrl,
  getStripe,
  getStripeCouponId,
  getStripePriceId
} from "@/services/stripe";

export const runtime = "nodejs";

const createCheckoutSchema = z.object({
  planId: z.string().trim().max(40),
  source: z.string().trim().max(80).optional(),
  funnel: z.string().trim().max(80).optional(),
  utm_source: z.string().trim().max(160).optional(),
  utm_medium: z.string().trim().max(160).optional(),
  utm_campaign: z.string().trim().max(160).optional(),
  utm_content: z.string().trim().max(160).optional(),
  utm_term: z.string().trim().max(160).optional()
}).strict();

async function authenticateRequest(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const authorization = request.headers.get("authorization");

  if (!url || !anonKey) {
    throw new AppError("Supabase não configurado no servidor.", 500);
  }

  if (!authorization) {
    throw new AppError("Faça login para iniciar a assinatura.", 401);
  }

  const supabase = createClient(url, anonKey, {
    global: {
      headers: {
        Authorization: authorization
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AppError("Sessão inválida. Faça login novamente.", 401);
  }

  return user;
}

export async function POST(request: Request) {
  let userId: string | null = null;
  try {
    assertRequestSize(request, 8_192);
    await enforceRateLimit({ request, route: "api:stripe-checkout:ip", limit: 20, windowMs: 10 * 60_000 });
    const user = await authenticateRequest(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:stripe-checkout:user", identifier: user.id, limit: 6, windowMs: 5 * 60_000 });
    const body = createCheckoutSchema.parse(await request.json());

    if (!isPlanId(body.planId)) {
      throw new AppError("Plano invalido.", 400);
    }

    const plan = getSaasPlan(body.planId);
    if (!plan) {
      throw new AppError("Plano não encontrado.", 404);
    }

    const supabase = getSupabaseAdmin();
    const { data: currentSubscription } = await supabase
      .from("subscriptions")
      .select("id, provider, provider_customer_id, stripe_customer_id, first_month_offer_used_at, first_month_price_applied")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const shouldApplyFirstMonthOffer =
      plan.id === "pro" && !currentSubscription?.first_month_offer_used_at && !currentSubscription?.first_month_price_applied;

    const stripe = getStripe();
    const priceId = getStripePriceId(plan);
    const couponId = getStripeCouponId(plan, shouldApplyFirstMonthOffer);
    const appUrl = getAppUrl();
    const metadata = buildStripeCheckoutMetadata(user.id, plan.id, shouldApplyFirstMonthOffer, {
      price_id: priceId,
      source: body.source,
      funnel: body.funnel,
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
      utm_content: body.utm_content,
      utm_term: body.utm_term
    });

    let customerId =
      currentSubscription?.provider === "stripe"
        ? (currentSubscription.provider_customer_id as string | null) || (currentSubscription.stripe_customer_id as string | null) || undefined
        : undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: user.user_metadata?.name || user.email || "Cliente AtendeZap IA",
        metadata: {
          user_id: user.id
        }
      });
      customerId = customer.id;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      // O preco normal do Pro fica no Price recorrente da Stripe. Este cupom
      // deve ter duration="once" para ajustar apenas a primeira fatura para R$ 29.
      // A partir do segundo mês, a Stripe cobra automaticamente o valor normal.
      discounts: couponId ? [{ coupon: couponId }] : undefined,
      allow_promotion_codes: false,
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/precos?checkout=cancelado`,
      metadata,
      subscription_data: {
        metadata
      }
    });

    const now = new Date().toISOString();
    const { error: upsertError } = await supabase.from("subscriptions").upsert(
      {
        user_id: user.id,
        plan_name: plan.id,
        plan: plan.id,
        status: "pending",
        provider: "stripe",
        provider_customer_id: customerId,
        provider_subscription_id: null,
        stripe_customer_id: customerId,
        stripe_subscription_id: null,
        subscription_status: "pending",
        provider_price_id: priceId,
        stripe_checkout_session_id: checkoutSession.id,
        acquisition_source: metadata.acquisition_source || "stripe",
        funnel_source: metadata.funnel_source || "pricing",
        monthly_limit: plan.responseLimit,
        usage_count: 0,
        price: plan.monthlyPrice,
        first_month_price: plan.firstMonthPrice ?? null,
        is_first_month_offer: Boolean(plan.firstMonthPrice),
        first_month_price_applied: shouldApplyFirstMonthOffer || Boolean(currentSubscription?.first_month_price_applied),
        promo_code: couponId ? "stripe_pro_first_month_29" : null,
        current_period_start: null,
        current_period_end: null,
        last_payment_status: "checkout_created",
        metadata: {
          provider: "stripe",
          checkout_session_id: checkoutSession.id,
          price_id: priceId,
          coupon_id: couponId,
          utm_source: metadata.utm_source || null,
          utm_medium: metadata.utm_medium || null,
          utm_campaign: metadata.utm_campaign || null,
          utm_content: metadata.utm_content || null,
          utm_term: metadata.utm_term || null,
          offer_reserved_at: shouldApplyFirstMonthOffer ? now : null
        }
      },
      { onConflict: "user_id" }
    );

    if (upsertError) {
      throw new AppError("Checkout criado na Stripe, mas não foi possível salvar a assinatura no Supabase.", 500);
    }

    serverLog({
      event: "stripe_checkout_created",
      route: "/api/stripe/create-checkout-session",
      userId: user.id,
      status: "ok",
      metadata: { plan: plan.id, first_month_offer: shouldApplyFirstMonthOffer }
    });

    return Response.json({
      ok: true,
      provider: "stripe",
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      firstMonthPriceApplied: shouldApplyFirstMonthOffer
    });
  } catch (error) {
    serverLog({ level: "warn", event: "stripe_checkout_failed", route: "/api/stripe/create-checkout-session", userId, error });
    return errorResponse(error);
  }
}
