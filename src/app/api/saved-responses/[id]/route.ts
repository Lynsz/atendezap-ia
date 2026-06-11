import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { AppError } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { updateSavedResponseSchema } from "@/lib/saved-responses";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const idSchema = z.string().uuid("Resposta salva invalida.");

async function getAuthenticatedSupabase(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    serverLog({ level: "error", event: "saved_response_missing_supabase_config", route: "/api/saved-responses/[id]" });
    return { response: NextResponse.json({ error: "Supabase nao configurado no servidor. Revise as variaveis de ambiente." }, { status: 500 }) };
  }

  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return { response: NextResponse.json({ error: "Você precisa estar logado para continuar." }, { status: 401 }) };
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
  serverLog({ level: "warn", event: "saved_response_mutation_failed", route, userId, error });
  return NextResponse.json({ error: "Nao foi possivel atualizar sua biblioteca agora." }, { status: 500 });
}

export async function PATCH(request: Request, context: RouteContext) {
  let userId: string | null = null;

  try {
    assertRequestSize(request, 12_288);
    await enforceRateLimit({ request, route: "api:saved-responses:update:ip", limit: 40, windowMs: 5 * 60_000 });

    const auth = await getAuthenticatedSupabase(request);
    if (auth.response) return auth.response;
    const { supabase, user } = auth;
    userId = user.id;

    await enforceRateLimit({ request, route: "api:saved-responses:update:user", identifier: user.id, limit: 30, windowMs: 5 * 60_000 });

    const { id: rawId } = await context.params;
    const id = idSchema.parse(rawId);
    const payload = updateSavedResponseSchema.parse(await request.json());
    const shouldIncrementCopyCount = payload.copy_count_action === "increment";
    let nextCopyCount: number | null = null;

    if (shouldIncrementCopyCount) {
      const { data: existingSavedResponse, error: lookupError } = await supabase
        .from("saved_responses")
        .select("copy_count")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (lookupError) {
        serverLog({ level: "warn", event: "saved_response_copy_lookup_failed", route: "/api/saved-responses/[id]", userId: user.id, error: lookupError });
        return NextResponse.json({ error: "Nao foi possivel registrar a copia agora." }, { status: 500 });
      }

      if (!existingSavedResponse) {
        return NextResponse.json({ error: "Resposta salva nao encontrada para este usuario." }, { status: 404 });
      }

      nextCopyCount = Number((existingSavedResponse as { copy_count?: number | null }).copy_count || 0) + 1;
    }

    const updates = {
      ...(Object.prototype.hasOwnProperty.call(payload, "title") ? { title: payload.title || null } : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, "content") ? { content: payload.content } : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, "category") ? { category: payload.category || null } : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, "is_favorite") ? { is_favorite: payload.is_favorite } : {}),
      ...(shouldIncrementCopyCount ? { copy_count: nextCopyCount, last_copied_at: new Date().toISOString() } : {})
    };

    const { data: savedResponse, error } = await supabase
      .from("saved_responses")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*")
      .maybeSingle();

    if (error) {
      serverLog({ level: "warn", event: "saved_response_update_failed", route: "/api/saved-responses/[id]", userId: user.id, error });
      return NextResponse.json({ error: "Nao foi possivel atualizar a resposta salva agora." }, { status: 500 });
    }

    if (!savedResponse) {
      return NextResponse.json({ error: "Resposta salva nao encontrada para este usuario." }, { status: 404 });
    }

    serverLog({ event: "saved_response_updated", route: "/api/saved-responses/[id]", userId: user.id, status: "ok" });
    return NextResponse.json({ savedResponse });
  } catch (error) {
    return jsonError(error, "/api/saved-responses/[id]", userId);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  let userId: string | null = null;

  try {
    await enforceRateLimit({ request, route: "api:saved-responses:delete:ip", limit: 40, windowMs: 5 * 60_000 });

    const auth = await getAuthenticatedSupabase(request);
    if (auth.response) return auth.response;
    const { supabase, user } = auth;
    userId = user.id;

    await enforceRateLimit({ request, route: "api:saved-responses:delete:user", identifier: user.id, limit: 30, windowMs: 5 * 60_000 });

    const { id: rawId } = await context.params;
    const id = idSchema.parse(rawId);
    const { data: savedResponse, error } = await supabase
      .from("saved_responses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id, response_id")
      .maybeSingle();

    if (error) {
      serverLog({ level: "warn", event: "saved_response_delete_failed", route: "/api/saved-responses/[id]", userId: user.id, error });
      return NextResponse.json({ error: "Nao foi possivel remover a resposta salva agora." }, { status: 500 });
    }

    if (!savedResponse) {
      return NextResponse.json({ error: "Resposta salva nao encontrada para este usuario." }, { status: 404 });
    }

    serverLog({ event: "saved_response_deleted", route: "/api/saved-responses/[id]", userId: user.id, status: "ok" });
    return NextResponse.json({ deleted: true, savedResponse });
  } catch (error) {
    return jsonError(error, "/api/saved-responses/[id]", userId);
  }
}
