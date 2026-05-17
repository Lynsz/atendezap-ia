import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { AppError, errorResponse } from "@/lib/errors";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getSaasPlan, isPlanId, planPriceForFirstCharge } from "@/config/plans";
import {
  asaasSubscriptionDescription,
  buildAsaasExternalReference,
  createAsaasCustomer,
  createAsaasSubscription,
  listAsaasSubscriptionPayments,
  nextAsaasDueDate,
  updateAsaasPayment
} from "@/services/asaas";

export const runtime = "nodejs";

const createSubscriptionSchema = z.object({
  planId: z.string().trim(),
  billingType: z.enum(["UNDEFINED", "BOLETO", "CREDIT_CARD", "PIX"]).default("UNDEFINED"),
  customer: z
    .object({
      name: z.string().trim().min(2).max(160).optional(),
      email: z.string().trim().email().optional(),
      cpfCnpj: z.string().trim().min(11).max(18).optional(),
      mobilePhone: z.string().trim().max(30).optional()
    })
    .optional()
});

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
  try {
    const user = await authenticateRequest(request);
    const body = createSubscriptionSchema.parse(await request.json());

    if (!isPlanId(body.planId)) {
      throw new AppError("Plano inválido.", 400);
    }

    const plan = getSaasPlan(body.planId);
    if (!plan) {
      throw new AppError("Plano não encontrado.", 404);
    }

    const supabase = getSupabaseAdmin();
    const { data: currentSubscription } = await supabase
      .from("subscriptions")
      .select("id, provider_customer_id, first_month_offer_used_at, first_month_price_applied")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const shouldApplyFirstMonthOffer =
      plan.id === "pro" && !currentSubscription?.first_month_offer_used_at && !currentSubscription?.first_month_price_applied;
    const firstChargeValue = planPriceForFirstCharge(plan, shouldApplyFirstMonthOffer);
    const externalReference = buildAsaasExternalReference(user.id, plan.id);

    let asaasCustomerId = currentSubscription?.provider_customer_id as string | undefined;

    if (!asaasCustomerId) {
      const asaasCustomer = await createAsaasCustomer({
        name: body.customer?.name || user.user_metadata?.name || user.email || "Cliente AtendeZap IA",
        email: body.customer?.email || user.email || undefined,
        cpfCnpj: body.customer?.cpfCnpj,
        mobilePhone: body.customer?.mobilePhone,
        externalReference: user.id
      });
      asaasCustomerId = asaasCustomer.id;
    }

    const asaasSubscription = await createAsaasSubscription({
      customer: asaasCustomerId,
      billingType: body.billingType,
      value: plan.monthlyPrice,
      nextDueDate: nextAsaasDueDate(),
      description: asaasSubscriptionDescription(plan, shouldApplyFirstMonthOffer),
      externalReference
    });

    const payments = await listAsaasSubscriptionPayments(asaasSubscription.id).catch(() => ({ data: [] }));
    const firstPayment = payments.data
      ?.slice()
      .sort((left, right) => String(left.dueDate || "").localeCompare(String(right.dueDate || "")))[0];

    if (shouldApplyFirstMonthOffer && (!firstPayment?.id || !firstPayment.dueDate)) {
      throw new AppError("Assinatura criada, mas a primeira cobranca ainda nao ficou disponivel para aplicar o valor promocional.", 502);
    }

    const adjustedFirstPayment =
      shouldApplyFirstMonthOffer && firstPayment?.id && firstPayment.dueDate
        ? await updateAsaasPayment(firstPayment.id, {
            billingType: body.billingType,
            value: firstChargeValue,
            dueDate: firstPayment.dueDate,
            description: asaasSubscriptionDescription(plan, true),
            externalReference: `${externalReference}:first_month`
          })
        : firstPayment;
    const now = new Date().toISOString();

    const subscriptionPayload = {
      user_id: user.id,
      plan_name: plan.id,
      plan: plan.id,
      status: "pending",
      provider: "asaas",
      provider_customer_id: asaasCustomerId,
      provider_subscription_id: asaasSubscription.id,
      provider_payment_id: firstPayment?.id || null,
      acquisition_source: "asaas",
      funnel_source: "pricing",
      monthly_limit: plan.responseLimit,
      price: plan.monthlyPrice,
      first_month_price: plan.firstMonthPrice ?? null,
      is_first_month_offer: Boolean(plan.firstMonthPrice),
      first_month_price_applied: shouldApplyFirstMonthOffer,
      promo_code: shouldApplyFirstMonthOffer ? "pro_first_month_29" : null,
      current_period_start: now,
      current_period_end: null,
      last_payment_status: firstPayment?.status || asaasSubscription.status || "PENDING",
      metadata: {
        provider: "asaas",
        plan: plan.id,
        subscription_monthly_value: plan.monthlyPrice,
        first_charge_value: firstChargeValue,
        billing_type: body.billingType,
        subscription_external_reference: externalReference
      }
    };

    const { error: upsertError } = await supabase.from("subscriptions").upsert(subscriptionPayload, { onConflict: "user_id" });
    if (upsertError) {
      throw new AppError("Assinatura criada no Asaas, mas não foi possível salvar no Supabase.", 500);
    }

    return Response.json({
      ok: true,
      provider: "asaas",
      subscriptionId: asaasSubscription.id,
      paymentId: adjustedFirstPayment?.id || firstPayment?.id || null,
      checkoutUrl: adjustedFirstPayment?.invoiceUrl || firstPayment?.invoiceUrl || asaasSubscription.invoiceUrl || asaasSubscription.paymentLink || null,
      invoiceUrl: adjustedFirstPayment?.invoiceUrl || firstPayment?.invoiceUrl || asaasSubscription.invoiceUrl || null,
      bankSlipUrl: adjustedFirstPayment?.bankSlipUrl || firstPayment?.bankSlipUrl || asaasSubscription.bankSlipUrl || null,
      firstMonthPriceApplied: shouldApplyFirstMonthOffer
    });
  } catch (error) {
    return errorResponse(error);
  }
}
