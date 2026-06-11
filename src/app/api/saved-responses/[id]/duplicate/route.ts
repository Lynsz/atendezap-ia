import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { AppError } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { enforceRateLimit } from "@/lib/rate-limit";
import { buildDuplicateSavedResponseTitle, getSavedResponseSource } from "@/lib/saved-response-library";
import { ENV_ERROR_MESSAGES, requireSupabasePublicEnv } from "@/lib/server/env";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const idSchema = z.string().uuid("Resposta salva invalida.");

type SavedResponseForDuplicate = {
  id: string;
  response_id: string | null;
  source_template_id: string | null;
  source: "ai" | "ai_generated" | "template" | "manual" | null;
  title: string | null;
  content: string;
  category: string | null;
};

async function getAuthenticatedSupabase(request: Request) {
  let supabaseEnv: ReturnType<typeof requireSupabasePublicEnv>;

  try {
    supabaseEnv = requireSupabasePublicEnv();
  } catch {
    serverLog({ level: "error", event: "saved_response_duplicate_missing_supabase_config", route: "/api/saved-responses/[id]/duplicate" });
    return { response: NextResponse.json({ error: ENV_ERROR_MESSAGES.supabase }, { status: 500 }) };
  }

  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return { response: NextResponse.json({ error: "Você precisa estar logado para continuar." }, { status: 401 }) };
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
  serverLog({ level: "warn", event: "saved_response_duplicate_failed", route, userId, error });
  return NextResponse.json({ error: "Nao foi possivel duplicar a resposta salva agora." }, { status: 500 });
}

export async function POST(request: Request, context: RouteContext) {
  let userId: string | null = null;

  try {
    await enforceRateLimit({ request, route: "api:saved-responses:duplicate:ip", limit: 40, windowMs: 5 * 60_000 });

    const auth = await getAuthenticatedSupabase(request);
    if (auth.response) return auth.response;
    const { supabase, user } = auth;
    userId = user.id;

    await enforceRateLimit({ request, route: "api:saved-responses:duplicate:user", identifier: user.id, limit: 30, windowMs: 5 * 60_000 });

    const { id: rawId } = await context.params;
    const id = idSchema.parse(rawId);

    const { data: original, error: lookupError } = await supabase
      .from("saved_responses")
      .select("id, response_id, source_template_id, source, title, content, category")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (lookupError) {
      serverLog({ level: "warn", event: "saved_response_duplicate_lookup_failed", route: "/api/saved-responses/[id]/duplicate", userId: user.id, error: lookupError });
      return NextResponse.json({ error: "Nao foi possivel localizar a resposta salva agora." }, { status: 500 });
    }

    if (!original) {
      return NextResponse.json({ error: "Resposta salva nao encontrada para este usuario." }, { status: 404 });
    }

    const source = getSavedResponseSource(original as SavedResponseForDuplicate);
    const { data: savedResponse, error: insertError } = await supabase
      .from("saved_responses")
      .insert({
        user_id: user.id,
        response_id: null,
        source_template_id: null,
        source,
        title: buildDuplicateSavedResponseTitle((original as SavedResponseForDuplicate).title),
        content: (original as SavedResponseForDuplicate).content,
        category: (original as SavedResponseForDuplicate).category || null
      })
      .select("*")
      .single();

    if (insertError || !savedResponse) {
      serverLog({ level: "warn", event: "saved_response_duplicate_insert_failed", route: "/api/saved-responses/[id]/duplicate", userId: user.id, error: insertError });
      return NextResponse.json({ error: "Nao foi possivel duplicar a resposta salva agora." }, { status: 500 });
    }

    serverLog({ event: "saved_response_duplicated", route: "/api/saved-responses/[id]/duplicate", userId: user.id, status: "ok", metadata: { category: savedResponse.category || "sem_categoria", source } });
    return NextResponse.json({ savedResponse }, { status: 201 });
  } catch (error) {
    return jsonError(error, "/api/saved-responses/[id]/duplicate", userId);
  }
}
