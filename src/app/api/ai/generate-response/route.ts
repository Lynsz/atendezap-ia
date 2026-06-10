import { NextResponse } from "next/server";
import { assertAiUsageAvailable, getCurrentUsageMonth, incrementAiUsage } from "@/lib/ai-usage";
import { generateCustomerResponseWithAi } from "@/lib/ai-response";
import { AppError } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { serverLog } from "@/lib/logger";
import { generateResponseSchema } from "@/lib/mvp-validators";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { getAuthenticatedSupabase } from "@/lib/supabase/authenticated";
import {
  MONTHLY_LIMIT_EXCEEDED_MESSAGE,
  TEMPORARY_AI_ERROR_MESSAGE,
  getSubscriptionPlanName,
  getSubscriptionStatus,
  getUsageLimit
} from "@/lib/usage-limits";

export const runtime = "nodejs";

function isUsableSubscriptionStatus(status?: string | null) {
  const normalized = status?.trim().toLowerCase();
  return normalized === "active" || normalized === "trialing" || normalized === "trial";
}

function inactiveSubscriptionMessage(status?: string | null, hasPlan?: boolean) {
  const normalized = status?.trim().toLowerCase();
  if (!hasPlan || normalized === "free") return "Escolha um plano para continuar usando.";
  if (normalized === "past_due" || normalized === "unpaid") return "Atualize o pagamento para continuar usando o AtendeZap IA.";
  return "Sua assinatura nao esta ativa no momento.";
}

export async function POST(request: Request) {
  let userId: string | null = null;

  try {
    assertRequestSize(request, 65_536);
    await enforceRateLimit({
      request,
      route: "api:ai-generate-response:ip",
      limit: 20,
      windowMs: 5 * 60_000,
      message: "Voce enviou muitas solicitacoes rapidamente. Tente de novo em instantes."
    });

    const { supabase, user } = await getAuthenticatedSupabase(request, "/api/ai/generate-response");
    userId = user.id;

    await enforceRateLimit({
      request,
      route: "api:ai-generate-response:user",
      identifier: user.id,
      limit: 8,
      windowMs: 60_000,
      message: "Voce enviou muitas solicitacoes rapidamente. Tente de novo em instantes."
    });

    const payload = generateResponseSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json({ error: payload.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("id, plan_name, plan, status, subscription_status, monthly_limit")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const planName = getSubscriptionPlanName(subscription);
    const subscriptionStatus = getSubscriptionStatus(subscription);
    if (subscription && !isUsableSubscriptionStatus(subscriptionStatus)) {
      await logEvent("ai_generation_blocked_by_limit", {
        source: "dashboard",
        reason: "subscription_inactive",
        plan: planName || "sem_plano",
        status: subscriptionStatus || "sem_status"
      });
      serverLog({
        level: "warn",
        event: "ai_generation_blocked",
        route: "/api/ai/generate-response",
        userId: user.id,
        status: 403,
        metadata: { reason: "subscription_inactive", plan: planName || "sem_plano", subscription_status: subscriptionStatus || "sem_status" }
      });
      return NextResponse.json({ error: inactiveSubscriptionMessage(subscriptionStatus, Boolean(planName && planName !== "free")) }, { status: 403 });
    }

    const limit = getUsageLimit(subscription);
    const usageMonth = getCurrentUsageMonth();
    const { snapshot: usage } = await assertAiUsageAvailable(user.id, limit, usageMonth);

    serverLog({
      event: "ai_limit_checked",
      route: "/api/ai/generate-response",
      userId: user.id,
      status: "ok",
      metadata: { plan: planName || "sem_plano", used: usage.used, limit: usage.limit, cycle_source: usage.cycleSource }
    });

    if (usage.reachedLimit) {
      await logEvent("usage_limit_reached", {
        source: "dashboard",
        plan: planName || "sem_plano",
        used: usage.used,
        limit: usage.limit
      });
      await logEvent("ai_generation_blocked_by_limit", {
        source: "dashboard",
        reason: "monthly_limit",
        plan: planName || "sem_plano"
      });
      return NextResponse.json({ error: MONTHLY_LIMIT_EXCEEDED_MESSAGE, usage }, { status: 403 });
    }

    const requestedBusinessId = payload.data.businessData.id || payload.data.businessId;
    const { data: savedBusiness } = requestedBusinessId
      ? await supabase
          .from("businesses")
          .select("*")
          .eq("id", requestedBusinessId)
          .eq("user_id", user.id)
          .maybeSingle()
      : { data: null };

    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("business_name, business_type, tone, description")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!userProfile && !savedBusiness) {
      return NextResponse.json({ error: "Complete o onboarding antes de gerar respostas." }, { status: 403 });
    }

    const businessDataForAi = savedBusiness
      ? {
          ...payload.data.businessData,
          ...savedBusiness
        }
      : {
          ...payload.data.businessData,
          business_name: userProfile?.business_name || payload.data.businessData.business_name,
          business_type: userProfile?.business_type || payload.data.businessData.business_type,
          business_area: userProfile?.business_type || payload.data.businessData.business_area,
          brand_tone: userProfile?.tone || payload.data.businessData.brand_tone,
          description: userProfile?.description || payload.data.businessData.description
        };

    const { generatedAnswer, mode } = await generateCustomerResponseWithAi({
      customerQuestion: payload.data.customerQuestion,
      responseType: payload.data.responseType,
      businessData: businessDataForAi
    });

    const { data: savedResponse, error: insertError } = await supabase
      .from("generated_responses")
      .insert({
        user_id: user.id,
        business_id: savedBusiness?.id || null,
        customer_question: payload.data.customerQuestion,
        generated_answer: generatedAnswer,
        response_type: payload.data.responseType,
        business_type: businessDataForAi.business_type || businessDataForAi.business_area || null,
        brand_tone: businessDataForAi.brand_tone || null
      })
      .select("*")
      .single();

    if (insertError || !savedResponse) {
      serverLog({ level: "error", event: "ai_response_save_failed", route: "/api/ai/generate-response", userId: user.id, error: insertError });
      return NextResponse.json(
        {
          error: "Resposta gerada, mas nao conseguimos salvar no historico. Tente novamente antes de usar em producao.",
          response: generatedAnswer,
          generatedAnswer,
          savedResponseId: null
        },
        { status: 500 }
      );
    }

    const nextUsage = await incrementAiUsage(user.id, limit, usageMonth);
    if (nextUsage.nearLimit) {
      await logEvent("usage_limit_warning_viewed", {
        source: "dashboard",
        plan: planName || "sem_plano",
        used: nextUsage.used,
        limit: nextUsage.limit
      });
    }

    await logEvent("ai_generation_succeeded", {
      source: "dashboard",
      response_type: payload.data.responseType,
      mode,
      plan: planName || "sem_plano"
    });
    serverLog({ event: "ai_response_generated", route: "/api/ai/generate-response", userId: user.id, status: "ok", metadata: { response_type: payload.data.responseType, mode } });

    return NextResponse.json({
      response: generatedAnswer,
      generatedAnswer,
      mode,
      savedResponse,
      savedResponseId: savedResponse.id,
      usage: {
        ...nextUsage,
        count: nextUsage.used
      }
    });
  } catch (error) {
    await logEvent("ai_generation_failed", {
      source: "dashboard",
      error_name: error instanceof Error ? error.name : "unknown"
    });
    serverLog({ level: "warn", event: "ai_response_failed", route: "/api/ai/generate-response", userId, error });
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: TEMPORARY_AI_ERROR_MESSAGE }, { status: 500 });
  }
}
