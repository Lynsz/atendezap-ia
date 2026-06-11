import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { createCancellationFeedbackSchema } from "@/lib/cancellation-feedback";
import { AppError } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { requireSupabasePublicEnv } from "@/lib/server/env";

export const runtime = "nodejs";

async function getAuthenticatedSupabase(request: Request) {
  const { url, anonKey } = requireSupabasePublicEnv();
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    throw new AppError("Sessao nao encontrada. Faca login novamente.", 401);
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
    throw new AppError("Sessao invalida. Faca login novamente.", 401);
  }

  return { supabase, user };
}

function jsonError(error: unknown, userId: string | null) {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }
  serverLog({ level: "warn", event: "cancellation_feedback_failed", route: "/api/cancellation-feedback", userId, error });
  return NextResponse.json({ error: "Nao foi possivel enviar seu feedback agora." }, { status: 500 });
}

export async function POST(request: Request) {
  let userId: string | null = null;

  try {
    assertRequestSize(request, 2_048);
    await enforceRateLimit({
      request,
      route: "api:cancellation-feedback:create:ip",
      limit: 12,
      windowMs: 10 * 60_000
    });

    const { supabase, user } = await getAuthenticatedSupabase(request);
    userId = user.id;
    await enforceRateLimit({
      request,
      route: "api:cancellation-feedback:create:user",
      identifier: user.id,
      limit: 4,
      windowMs: 60 * 60_000,
      message: "Aguarde antes de enviar outro feedback de cancelamento."
    });

    const payload = createCancellationFeedbackSchema.parse(await request.json());
    const { data, error } = await supabase
      .from("cancellation_feedback")
      .insert({
        user_id: user.id,
        subscription_id: payload.subscriptionId || null,
        reason: payload.reason,
        comment: payload.comment?.trim() || null
      })
      .select("id, reason, created_at")
      .single();

    if (error || !data) {
      serverLog({ level: "warn", event: "cancellation_feedback_insert_failed", route: "/api/cancellation-feedback", userId: user.id, error });
      return NextResponse.json({ error: "Nao foi possivel salvar seu feedback agora." }, { status: 500 });
    }

    await logEvent("cancellation_feedback_submitted", {
      source: "billing_page",
      reason: payload.reason
    });
    serverLog({ event: "cancellation_feedback_created", route: "/api/cancellation-feedback", userId: user.id, status: "ok", metadata: { reason: payload.reason } });

    return NextResponse.json({ feedback: data }, { status: 201 });
  } catch (error) {
    return jsonError(error, userId);
  }
}
