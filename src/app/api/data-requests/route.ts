import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { createDataRequestSchema } from "@/lib/data-requests";
import { AppError } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { ENV_ERROR_MESSAGES, requireSupabasePublicEnv } from "@/lib/server/env";

export const runtime = "nodejs";

async function getAuthenticatedSupabase(request: Request) {
  let supabaseEnv: ReturnType<typeof requireSupabasePublicEnv>;

  try {
    supabaseEnv = requireSupabasePublicEnv();
  } catch {
    serverLog({ level: "error", event: "data_requests_missing_supabase_config", route: "/api/data-requests" });
    return { response: NextResponse.json({ error: ENV_ERROR_MESSAGES.supabase }, { status: 500 }) };
  }

  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return { response: NextResponse.json({ error: "Sessao nao encontrada. Faca login novamente." }, { status: 401 }) };
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
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { response: NextResponse.json({ error: "Sessao invalida. Faca login novamente." }, { status: 401 }) };
  }

  return { supabase, user };
}

function jsonError(error: unknown, route: string, userId: string | null) {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }
  serverLog({ level: "warn", event: "data_requests_failed", route, userId, error });
  return NextResponse.json({ error: "Nao foi possivel processar sua solicitacao de dados agora." }, { status: 500 });
}

export async function GET(request: Request) {
  let userId: string | null = null;

  try {
    await enforceRateLimit({ request, route: "api:data-requests:list:ip", limit: 60, windowMs: 5 * 60_000 });
    const auth = await getAuthenticatedSupabase(request);
    if (auth.response) return auth.response;
    const { supabase, user } = auth;
    userId = user.id;

    await enforceRateLimit({ request, route: "api:data-requests:list:user", identifier: user.id, limit: 60, windowMs: 5 * 60_000 });

    const { data, error } = await supabase
      .from("data_requests")
      .select("id, user_id, type, status, notes, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      serverLog({ level: "warn", event: "data_requests_list_failed", route: "/api/data-requests", userId: user.id, error });
      return NextResponse.json({ error: "Nao foi possivel carregar suas solicitacoes agora." }, { status: 500 });
    }

    serverLog({ event: "data_requests_listed", route: "/api/data-requests", userId: user.id, status: "ok" });
    return NextResponse.json({ dataRequests: data || [] });
  } catch (error) {
    return jsonError(error, "/api/data-requests", userId);
  }
}

export async function POST(request: Request) {
  let userId: string | null = null;

  try {
    assertRequestSize(request, 2048);
    await enforceRateLimit({
      request,
      route: "api:data-requests:create:ip",
      limit: 12,
      windowMs: 10 * 60_000,
      message: "Voce enviou muitas solicitacoes rapidamente. Tente novamente em instantes."
    });

    const auth = await getAuthenticatedSupabase(request);
    if (auth.response) return auth.response;
    const { supabase, user } = auth;
    userId = user.id;

    await enforceRateLimit({
      request,
      route: "api:data-requests:create:user",
      identifier: user.id,
      limit: 4,
      windowMs: 60 * 60_000,
      message: "Aguarde antes de criar uma nova solicitacao de dados."
    });

    const payload = createDataRequestSchema.parse(await request.json());
    const { data: existingPending, error: existingError } = await supabase
      .from("data_requests")
      .select("id, user_id, type, status, notes, created_at, updated_at")
      .eq("user_id", user.id)
      .eq("type", payload.type)
      .in("status", ["pending", "processing"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingError) {
      serverLog({ level: "warn", event: "data_request_existing_lookup_failed", route: "/api/data-requests", userId: user.id, error: existingError });
      return NextResponse.json({ error: "Nao foi possivel verificar solicitacoes existentes agora." }, { status: 500 });
    }

    if (existingPending) {
      return NextResponse.json({ dataRequest: existingPending, alreadyPending: true });
    }

    const { data: dataRequest, error: insertError } = await supabase
      .from("data_requests")
      .insert({
        user_id: user.id,
        type: payload.type,
        status: "pending",
        notes: null
      })
      .select("id, user_id, type, status, notes, created_at, updated_at")
      .single();

    if (insertError || !dataRequest) {
      serverLog({ level: "error", event: "data_request_create_failed", route: "/api/data-requests", userId: user.id, error: insertError });
      return NextResponse.json({ error: "Nao foi possivel criar sua solicitacao agora." }, { status: 500 });
    }

    await logEvent("data_request_created", {
      source: "dashboard_privacy",
      type: payload.type
    });
    serverLog({ event: "data_request_created", route: "/api/data-requests", userId: user.id, status: "ok", metadata: { type: payload.type } });
    return NextResponse.json({ dataRequest, alreadyPending: false }, { status: 201 });
  } catch (error) {
    return jsonError(error, "/api/data-requests", userId);
  }
}
