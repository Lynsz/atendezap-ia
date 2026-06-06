import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateCustomerResponseWithAi } from "@/lib/ai-response";
import { AppError } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { serverLog } from "@/lib/logger";
import { generateResponseSchema } from "@/lib/mvp-validators";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import {
  MONTHLY_LIMIT_EXCEEDED_MESSAGE,
  TEMPORARY_AI_ERROR_MESSAGE,
  getSubscriptionPlanName,
  getSubscriptionStatus,
  getUsageCycle,
  getUsageLimit,
  getUsageSnapshot
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
  return "Sua assinatura não está ativa no momento.";
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
      message: "Você enviou muitas solicitações rapidamente. Tente de novo em instantes."
    });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      serverLog({ level: "error", event: "ai_generate_missing_supabase_config", route: "/api/ai/generate-response" });
      return NextResponse.json({ error: "Supabase não configurado no servidor. Revise as variáveis de ambiente." }, { status: 500 });
    }

    const authorization = request.headers.get("authorization");
    if (!authorization) {
      return NextResponse.json({ error: "Sessão não encontrada. Faça login novamente." }, { status: 401 });
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
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Sessão inválida. Faça login novamente." }, { status: 401 });
    }

    userId = user.id;
    await enforceRateLimit({
      request,
      route: "api:ai-generate-response:user",
      identifier: user.id,
      limit: 8,
      windowMs: 60_000,
      message: "Você enviou muitas solicitações rapidamente. Tente de novo em instantes."
    });

    const payload = generateResponseSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json({ error: payload.error.issues[0]?.message || "Dados inválidos." }, { status: 400 });
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("id, plan_name, plan, status, subscription_status, monthly_limit, current_period_start, current_period_end")
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
    const cycle = getUsageCycle(subscription);
    const { count, error: countError } = await supabase
      .from("generated_responses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", cycle.periodStart)
      .lt("created_at", cycle.periodEnd);

    if (countError) {
      serverLog({ level: "warn", event: "ai_usage_count_failed", route: "/api/ai/generate-response", userId: user.id, error: countError });
      return NextResponse.json({ error: "Não foi possível verificar seu uso mensal agora. Tente novamente em instantes." }, { status: 500 });
    }

    const used = count ?? 0;
    const usage = getUsageSnapshot(used, limit, cycle);
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
      serverLog({
        level: "warn",
        event: "ai_limit_exceeded",
        route: "/api/ai/generate-response",
        userId: user.id,
        status: 403,
        metadata: { plan: planName || "sem_plano", used: usage.used, limit: usage.limit }
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
    const businessDataForAi = savedBusiness
      ? {
          ...payload.data.businessData,
          ...savedBusiness
        }
      : payload.data.businessData;

    const { generatedAnswer, mode } = await generateCustomerResponseWithAi({
      customerQuestion: payload.data.customerQuestion,
      responseType: payload.data.responseType,
      businessData: businessDataForAi
    });

    const { data: savedResponse, error: insertError } = await supabase
      .from("generated_responses")
      .insert({
        user_id: user.id,
        business_id: businessDataForAi.id || requestedBusinessId || null,
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
          error: "Resposta gerada, mas não conseguimos salvar no histórico. Tente novamente antes de usar em produção.",
          generatedAnswer,
          savedResponseId: null
        },
        { status: 500 }
      );
    }

    const nextUsage = getUsageSnapshot(used + 1, limit, cycle);
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
      generatedAnswer,
      mode,
      savedResponse,
      savedResponseId: savedResponse.id,
      usage: nextUsage
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
