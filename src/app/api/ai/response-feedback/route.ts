import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { AppError } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { ENV_ERROR_MESSAGES, requireSupabasePublicEnv } from "@/lib/server/env";

export const runtime = "nodejs";

const responseFeedbackSchema = z
  .object({
    responseId: z.string().uuid("Resposta invalida."),
    rating: z.enum(["positive", "negative"], { errorMap: () => ({ message: "Escolha uma avaliacao valida." }) }),
    comment: z.string().trim().max(500, "Comentario muito longo. Use ate 500 caracteres.").optional()
  })
  .strict();

export async function POST(request: Request) {
  let userId: string | null = null;

  try {
    assertRequestSize(request, 8_192);
    await enforceRateLimit({
      request,
      route: "api:ai-response-feedback:ip",
      limit: 30,
      windowMs: 5 * 60_000,
      message: "Voce enviou muitas avaliacoes rapidamente. Tente de novo em instantes."
    });

    let supabaseEnv: ReturnType<typeof requireSupabasePublicEnv>;

    try {
      supabaseEnv = requireSupabasePublicEnv();
    } catch {
      serverLog({ level: "error", event: "ai_feedback_missing_supabase_config", route: "/api/ai/response-feedback" });
      return NextResponse.json({ error: ENV_ERROR_MESSAGES.supabase }, { status: 500 });
    }

    const authorization = request.headers.get("authorization");
    if (!authorization) {
      return NextResponse.json({ error: "Sessao nao encontrada. Faca login novamente." }, { status: 401 });
    }

    const supabase = createClient(supabaseEnv.url, supabaseEnv.anonKey, {
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
      return NextResponse.json({ error: "Sessao invalida. Faca login novamente." }, { status: 401 });
    }

    userId = user.id;
    await enforceRateLimit({
      request,
      route: "api:ai-response-feedback:user",
      identifier: user.id,
      limit: 20,
      windowMs: 5 * 60_000,
      message: "Voce enviou muitas avaliacoes rapidamente. Tente de novo em instantes."
    });

    const payload = responseFeedbackSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json({ error: payload.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
    }

    const { data: generatedResponse, error: responseError } = await supabase
      .from("generated_responses")
      .select("id, business_type")
      .eq("id", payload.data.responseId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (responseError) {
      serverLog({ level: "warn", event: "ai_feedback_response_lookup_failed", route: "/api/ai/response-feedback", userId: user.id, error: responseError });
      return NextResponse.json({ error: "Nao foi possivel validar a resposta agora." }, { status: 500 });
    }

    if (!generatedResponse) {
      return NextResponse.json({ error: "Resposta nao encontrada para este usuario." }, { status: 404 });
    }

    const { data: feedback, error: upsertError } = await supabase
      .from("ai_response_feedback")
      .upsert(
        {
          user_id: user.id,
          response_id: payload.data.responseId,
          rating: payload.data.rating,
          comment: payload.data.comment || null,
          business_type: typeof generatedResponse.business_type === "string" ? generatedResponse.business_type : null
        },
        { onConflict: "user_id,response_id" }
      )
      .select("*")
      .single();

    await trackServerAppEvent({
      user_id: user.id,
      event_name: "ai_feedback_submitted",
      source: "dashboard",
      page: "/dashboard",
      business_type: typeof generatedResponse.business_type === "string" ? generatedResponse.business_type : null,
      metadata: {
        source: "dashboard",
        business_type: typeof generatedResponse.business_type === "string" ? generatedResponse.business_type : null,
        category: payload.data.rating
      }
    });
    await trackServerAppEvent({
      user_id: user.id,
      event_name: "small_launch_feedback_submitted",
      source: "dashboard",
      page: "/dashboard",
      business_type: typeof generatedResponse.business_type === "string" ? generatedResponse.business_type : null,
      metadata: {
        source: "dashboard",
        business_type: typeof generatedResponse.business_type === "string" ? generatedResponse.business_type : null,
        category: payload.data.rating
      }
    });
    await trackServerAppEvent({
      user_id: user.id,
      event_name: "post_mvp_feedback_submitted",
      source: "dashboard",
      page: "/dashboard",
      business_type: typeof generatedResponse.business_type === "string" ? generatedResponse.business_type : null,
      metadata: {
        source: "dashboard",
        business_type: typeof generatedResponse.business_type === "string" ? generatedResponse.business_type : null,
        category: payload.data.rating
      }
    });

    if (upsertError || !feedback) {
      serverLog({ level: "error", event: "ai_feedback_save_failed", route: "/api/ai/response-feedback", userId: user.id, error: upsertError });
      return NextResponse.json({ error: "Nao foi possivel salvar a avaliacao agora." }, { status: 500 });
    }

    serverLog({ event: "ai_response_feedback_saved", route: "/api/ai/response-feedback", userId: user.id, status: "ok", metadata: { rating: payload.data.rating } });
    return NextResponse.json({ feedback });
  } catch (error) {
    serverLog({ level: "warn", event: "ai_feedback_failed", route: "/api/ai/response-feedback", userId, error });
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Nao foi possivel salvar a avaliacao agora. Tente novamente em instantes." }, { status: 500 });
  }
}
