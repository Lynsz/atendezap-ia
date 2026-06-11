import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { AppError, errorResponse } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { sendTransactionalEmail } from "@/lib/email";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { requireSupabasePublicEnv } from "@/lib/server/env";
import { createSupportRequestSchema, inferSupportPriority } from "@/lib/support";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

async function getOptionalUser(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization) return null;

  let supabaseEnv: ReturnType<typeof requireSupabasePublicEnv>;
  try {
    supabaseEnv = requireSupabasePublicEnv();
  } catch {
    return null;
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
    data: { user }
  } = await supabase.auth.getUser();

  return user || null;
}

async function requireAuthenticatedSupabase(request: Request) {
  const authorization = request.headers.get("authorization");
  const { url, anonKey } = requireSupabasePublicEnv();

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

async function notifySupportTeam(input: { category: string; subject: string; requestId?: string | null }) {
  const supportEmail = process.env.SUPPORT_EMAIL?.trim();
  if (!supportEmail) return;

  const result = await sendTransactionalEmail({
    to: supportEmail,
    subject: `[AtendeZap IA] Nova solicitacao de suporte: ${input.category}`,
    text: `Nova solicitacao de suporte criada.

Categoria: ${input.category}
Assunto: ${input.subject}
ID: ${input.requestId || "sem_id"}

Acesse o admin protegido para analisar.`
  });

  if (result.status === "failed") {
    serverLog({ level: "warn", event: "support_notification_failed", route: "/api/support", metadata: { category: input.category } });
  }
}

function jsonError(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }
  return errorResponse(error);
}

function toUserSupportRequest(row: Record<string, unknown>) {
  return {
    id: row.id,
    user_id: row.user_id,
    email: row.email,
    category: row.category,
    subject: row.subject,
    message: row.message,
    status: row.status,
    priority: row.priority,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

export async function GET(request: Request) {
  let userId: string | null = null;

  try {
    await enforceRateLimit({ request, route: "api:support-list:ip", limit: 60, windowMs: 5 * 60_000 });
    const { supabase, user } = await requireAuthenticatedSupabase(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:support-list:user", identifier: user.id, limit: 60, windowMs: 5 * 60_000 });

    const { data, error } = await supabase
      .from("support_requests")
      .select("id, user_id, email, category, subject, message, status, priority, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      serverLog({ level: "warn", event: "support_requests_list_failed", route: "/api/support", userId: user.id, error });
      return NextResponse.json({ error: "Nao foi possivel carregar suas solicitacoes agora." }, { status: 500 });
    }

    serverLog({ event: "support_requests_listed", route: "/api/support", userId: user.id, status: "ok" });
    return NextResponse.json({ supportRequests: (data || []).map((item) => toUserSupportRequest(item as Record<string, unknown>)) });
  } catch (error) {
    serverLog({ level: "warn", event: "support_requests_list_failed", route: "/api/support", userId, error });
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  let userId: string | null = null;

  try {
    assertRequestSize(request, 12_288);
    await enforceRateLimit({
      request,
      route: "api:support-create:ip",
      limit: 8,
      windowMs: 10 * 60_000,
      message: "Muitas mensagens enviadas. Aguarde alguns minutos."
    });

    const body = createSupportRequestSchema.parse(await request.json());
    const user = await getOptionalUser(request);
    userId = user?.id || null;
    const normalizedEmail = (user?.email || body.email || "").trim().toLowerCase();

    if (!user && !normalizedEmail) {
      throw new AppError("Informe seu e-mail para conseguirmos responder sua solicitacao.", 400);
    }

    if (user) {
      await enforceRateLimit({
        request,
        route: "api:support-create:user",
        identifier: user.id,
        limit: 10,
        windowMs: 60 * 60_000,
        message: "Aguarde antes de enviar uma nova solicitacao de suporte."
      });
    }

    const priority = inferSupportPriority(body.category);
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("support_requests")
      .insert({
        user_id: user?.id || null,
        email: normalizedEmail || null,
        category: body.category,
        subject: body.subject,
        message: body.message,
        status: "pending",
        priority,
        admin_notes: null,
        metadata: {
          source: body.source || "support_form",
          authenticated: Boolean(user)
        }
      })
      .select("id, user_id, email, category, subject, message, status, priority, created_at, updated_at")
      .single();

    if (error || !data) {
      throw new AppError("Nao foi possivel salvar sua solicitacao.", 500);
    }

    await notifySupportTeam({ category: body.category, subject: body.subject, requestId: data.id as string });
    await logEvent("support_request_created", {
      source: body.source || "support_form",
      category: body.category,
      status: "pending"
    });
    serverLog({ event: "support_request_created", route: "/api/support", userId, status: "ok", metadata: { category: body.category, priority } });
    return Response.json({ ok: true, supportRequest: toUserSupportRequest(data as Record<string, unknown>) }, { status: 201 });
  } catch (error) {
    await logEvent("support_request_failed", {
      source: "api",
      error_name: error instanceof Error ? error.name : "unknown"
    });
    serverLog({ level: "warn", event: "support_request_failed", route: "/api/support", userId, error });
    return jsonError(error);
  }
}
