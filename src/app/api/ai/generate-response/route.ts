import { NextResponse } from "next/server";
import { assertAiUsageAvailable, getCurrentUsageMonth, incrementAiUsage } from "@/lib/ai-usage";
import { generateCustomerResponseWithAi } from "@/lib/ai-response";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { AppError } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { serverLog } from "@/lib/logger";
import { generateResponseSchema } from "@/lib/mvp-validators";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { hasOpenAIConfigured } from "@/lib/server/openai";
import { getAuthenticatedSupabase } from "@/lib/supabase/authenticated";
import {
  MONTHLY_LIMIT_EXCEEDED_MESSAGE,
  TEMPORARY_AI_ERROR_MESSAGE,
  getSubscriptionPlanName,
  getSubscriptionStatus,
  getUsageLimit
} from "@/lib/usage-limits";

export const runtime = "nodejs";

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
    const limit = getUsageLimit(subscription);
    const effectivePlan = limit > 20 ? planName || "free" : "free";
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
      await trackServerAppEvent({
        user_id: user.id,
        event_name: "small_launch_usage_limit_reached",
        source: "dashboard",
        page: "/dashboard",
        plan: planName || "sem_plano",
        metadata: {
          source: "dashboard",
          plan: planName || "sem_plano",
          usage_count: usage.used,
          usage_limit: usage.limit
        }
      });
      await trackServerAppEvent({
        user_id: user.id,
        event_name: "post_mvp_usage_limit_reached",
        source: "dashboard",
        page: "/dashboard",
        plan: planName || "sem_plano",
        metadata: {
          source: "dashboard",
          plan: planName || "sem_plano",
          usage_count: usage.used,
          usage_limit: usage.limit
        }
      });
      await logEvent("ai_generation_blocked_by_limit", {
        source: "dashboard",
        reason: "monthly_limit",
        plan: planName || "sem_plano"
      });
      return NextResponse.json({ error: MONTHLY_LIMIT_EXCEEDED_MESSAGE, usage: { ...usage, count: usage.used, plan: effectivePlan } }, { status: 403 });
    }

    const { data: savedBusiness } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("business_name, business_type, tone, description")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!userProfile) {
      return NextResponse.json({ error: "Complete o onboarding antes de gerar respostas." }, { status: 403 });
    }

    const { data: previousResponse } = await supabase
      .from("generated_responses")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (!hasOpenAIConfigured()) {
      return NextResponse.json({ error: "A geracao de IA nao esta configurada neste ambiente." }, { status: 500 });
    }

    const businessDataForAi = savedBusiness
      ? {
          ...savedBusiness,
          business_name: userProfile?.business_name || savedBusiness.business_name,
          business_type: userProfile?.business_type || savedBusiness.business_type || savedBusiness.business_area,
          business_area: userProfile?.business_type || savedBusiness.business_area || savedBusiness.business_type,
          brand_tone: userProfile?.tone || savedBusiness.brand_tone,
          description: userProfile?.description || savedBusiness.description
        }
      : {
          business_name: userProfile?.business_name || "seu negocio",
          business_type: userProfile?.business_type || "atendimento",
          business_area: userProfile?.business_type || "atendimento",
          brand_tone: userProfile?.tone || "educado e profissional",
          description: userProfile?.description || "atendimento ao cliente pelo WhatsApp"
        };

    const { generatedAnswer, mode } = await generateCustomerResponseWithAi({
      customerQuestion: payload.data.customerMessage,
      responseType: payload.data.responseType,
      businessData: businessDataForAi
    });

    const { data: savedResponse, error: insertError } = await supabase
      .from("generated_responses")
      .insert({
        user_id: user.id,
        business_id: savedBusiness?.id || null,
        customer_question: payload.data.customerMessage,
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
    await trackServerAppEvent({
      user_id: user.id,
      event_name: "ai_response_generated",
      source: "dashboard",
      page: "/dashboard",
      plan: planName || "sem_plano",
      business_type: typeof businessDataForAi.business_type === "string" ? businessDataForAi.business_type : null,
      metadata: {
        source: "dashboard",
        plan: planName || "sem_plano",
        business_type: typeof businessDataForAi.business_type === "string" ? businessDataForAi.business_type : null,
        category: payload.data.responseType,
        response_length_range: generatedAnswer.length < 300 ? "short" : generatedAnswer.length < 900 ? "medium" : "long",
        usage_count: nextUsage.used,
        usage_limit: nextUsage.limit
      }
    });
    if (!previousResponse) {
      await trackServerAppEvent({
        user_id: user.id,
        event_name: "small_launch_first_response_generated",
        source: "dashboard",
        page: "/dashboard",
        plan: planName || "sem_plano",
        business_type: typeof businessDataForAi.business_type === "string" ? businessDataForAi.business_type : null,
        metadata: {
          source: "dashboard",
          plan: planName || "sem_plano",
          business_type: typeof businessDataForAi.business_type === "string" ? businessDataForAi.business_type : null,
          category: payload.data.responseType,
          response_length_range: generatedAnswer.length < 300 ? "short" : generatedAnswer.length < 900 ? "medium" : "long"
        }
      });
      await trackServerAppEvent({
        user_id: user.id,
        event_name: "post_mvp_first_response_generated",
        source: "dashboard",
        page: "/dashboard",
        plan: planName || "sem_plano",
        business_type: typeof businessDataForAi.business_type === "string" ? businessDataForAi.business_type : null,
        metadata: {
          source: "dashboard",
          plan: planName || "sem_plano",
          business_type: typeof businessDataForAi.business_type === "string" ? businessDataForAi.business_type : null,
          category: payload.data.responseType,
          response_length_range: generatedAnswer.length < 300 ? "short" : generatedAnswer.length < 900 ? "medium" : "long"
        }
      });
    }
    serverLog({ event: "ai_response_generated", route: "/api/ai/generate-response", userId: user.id, status: "ok", metadata: { response_type: payload.data.responseType, mode } });

    return NextResponse.json({
      response: generatedAnswer,
      generatedAnswer,
      mode,
      savedResponse,
      savedResponseId: savedResponse.id,
      usage: {
        ...nextUsage,
        count: nextUsage.used,
        plan: effectivePlan
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
