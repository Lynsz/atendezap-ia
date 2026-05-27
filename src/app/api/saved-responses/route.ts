import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { AppError } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { createSavedResponseSchema } from "@/lib/saved-responses";

export const runtime = "nodejs";

type GeneratedResponseForSave = {
  id: string;
  customer_question: string | null;
  generated_answer: string;
  response_type: string | null;
};

async function getAuthenticatedSupabase(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    serverLog({ level: "error", event: "saved_responses_missing_supabase_config", route: "/api/saved-responses" });
    return { response: NextResponse.json({ error: "Supabase nao configurado no servidor. Revise as variaveis de ambiente." }, { status: 500 }) };
  }

  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return { response: NextResponse.json({ error: "Sessao nao encontrada. Faca login novamente." }, { status: 401 }) };
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
  serverLog({ level: "warn", event: "saved_responses_failed", route, userId, error });
  return NextResponse.json({ error: "Nao foi possivel processar suas respostas salvas agora." }, { status: 500 });
}

function defaultTitleFromGeneratedResponse(response: GeneratedResponseForSave) {
  const question = response.customer_question?.trim();
  if (!question) return "Resposta salva";
  return question.length > 90 ? `${question.slice(0, 87)}...` : question;
}

export async function GET(request: Request) {
  let userId: string | null = null;

  try {
    await enforceRateLimit({ request, route: "api:saved-responses:list:ip", limit: 60, windowMs: 5 * 60_000 });
    const auth = await getAuthenticatedSupabase(request);
    if (auth.response) return auth.response;
    const { supabase, user } = auth;
    userId = user.id;

    await enforceRateLimit({ request, route: "api:saved-responses:list:user", identifier: user.id, limit: 60, windowMs: 5 * 60_000 });

    const { data, error } = await supabase
      .from("saved_responses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      serverLog({ level: "warn", event: "saved_responses_list_failed", route: "/api/saved-responses", userId: user.id, error });
      return NextResponse.json({ error: "Nao foi possivel carregar sua biblioteca agora." }, { status: 500 });
    }

    serverLog({ event: "saved_responses_listed", route: "/api/saved-responses", userId: user.id, status: "ok" });
    return NextResponse.json({ savedResponses: data || [] });
  } catch (error) {
    return jsonError(error, "/api/saved-responses", userId);
  }
}

export async function POST(request: Request) {
  let userId: string | null = null;

  try {
    assertRequestSize(request, 12_288);
    await enforceRateLimit({
      request,
      route: "api:saved-responses:create:ip",
      limit: 40,
      windowMs: 5 * 60_000,
      message: "Voce salvou muitas respostas rapidamente. Tente de novo em instantes."
    });

    const auth = await getAuthenticatedSupabase(request);
    if (auth.response) return auth.response;
    const { supabase, user } = auth;
    userId = user.id;

    await enforceRateLimit({
      request,
      route: "api:saved-responses:create:user",
      identifier: user.id,
      limit: 30,
      windowMs: 5 * 60_000,
      message: "Voce salvou muitas respostas rapidamente. Tente de novo em instantes."
    });

    const payload = createSavedResponseSchema.parse(await request.json());
    let generatedResponse: GeneratedResponseForSave | null = null;

    if (payload.response_id) {
      const { data: existingSaved, error: existingSavedError } = await supabase
        .from("saved_responses")
        .select("*")
        .eq("user_id", user.id)
        .eq("response_id", payload.response_id)
        .maybeSingle();

      if (existingSavedError) {
        serverLog({ level: "warn", event: "saved_response_existing_lookup_failed", route: "/api/saved-responses", userId: user.id, error: existingSavedError });
        return NextResponse.json({ error: "Nao foi possivel verificar se a resposta ja estava salva." }, { status: 500 });
      }

      if (existingSaved) {
        return NextResponse.json({ savedResponse: existingSaved, alreadySaved: true });
      }

      const { data, error } = await supabase
        .from("generated_responses")
        .select("id, customer_question, generated_answer, response_type")
        .eq("id", payload.response_id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        serverLog({ level: "warn", event: "saved_response_source_lookup_failed", route: "/api/saved-responses", userId: user.id, error });
        return NextResponse.json({ error: "Nao foi possivel validar a resposta original agora." }, { status: 500 });
      }

      if (!data) {
        return NextResponse.json({ error: "Resposta original nao encontrada para este usuario." }, { status: 404 });
      }

      generatedResponse = data as GeneratedResponseForSave;
    }

    if (payload.source_template_id) {
      const { data: existingSavedTemplate, error: existingSavedTemplateError } = await supabase
        .from("saved_responses")
        .select("*")
        .eq("user_id", user.id)
        .eq("source_template_id", payload.source_template_id)
        .maybeSingle();

      if (existingSavedTemplateError) {
        serverLog({ level: "warn", event: "saved_template_existing_lookup_failed", route: "/api/saved-responses", userId: user.id, error: existingSavedTemplateError });
        return NextResponse.json({ error: "Nao foi possivel verificar se o template ja estava salvo." }, { status: 500 });
      }

      if (existingSavedTemplate) {
        return NextResponse.json({ savedResponse: existingSavedTemplate, alreadySaved: true });
      }
    }

    const content = payload.content || generatedResponse?.generated_answer;
    if (!content) {
      return NextResponse.json({ error: "Informe o conteudo da resposta para salvar." }, { status: 400 });
    }

    const { data: savedResponse, error: insertError } = await supabase
      .from("saved_responses")
      .insert({
        user_id: user.id,
        response_id: payload.response_id || null,
        source_template_id: payload.source_template_id || null,
        title: payload.title || (generatedResponse ? defaultTitleFromGeneratedResponse(generatedResponse) : "Resposta salva"),
        content,
        category: payload.category || null
      })
      .select("*")
      .single();

    if (insertError || !savedResponse) {
      serverLog({ level: "error", event: "saved_response_create_failed", route: "/api/saved-responses", userId: user.id, error: insertError });
      return NextResponse.json({ error: "Nao foi possivel salvar a resposta agora." }, { status: 500 });
    }

    serverLog({ event: "saved_response_created", route: "/api/saved-responses", userId: user.id, status: "ok", metadata: { category: payload.category || "sem_categoria" } });
    return NextResponse.json({ savedResponse, alreadySaved: false }, { status: 201 });
  } catch (error) {
    return jsonError(error, "/api/saved-responses", userId);
  }
}
