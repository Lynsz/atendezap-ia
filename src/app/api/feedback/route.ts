import { createClient, type User } from "@supabase/supabase-js";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { AppError, errorResponse } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const feedbackTypes = ["bug", "duvida", "sugestao", "elogio", "dificuldade_uso"] as const;
const feedbackStatuses = ["new", "reviewing", "resolved", "ignored"] as const;

const feedbackSchema = z.object({
  name: z.string().trim().max(120, "Nome muito longo.").optional().default(""),
  email: z.string().trim().email("Informe um e-mail valido.").max(180, "E-mail muito longo.").optional().or(z.literal("")).default(""),
  type: z.enum(feedbackTypes, { required_error: "Escolha o tipo de feedback." }),
  message: z.string().trim().min(8, "Descreva o feedback com um pouco mais de detalhe.").max(2000, "Mensagem muito longa. Use ate 2000 caracteres."),
  page: z.string().trim().max(180, "Pagina muito longa.").optional().default(""),
  source: z.string().trim().max(80, "Origem muito longa.").optional().default("feedback_form"),
  context: z.string().trim().max(80, "Contexto muito longo.").optional().default(""),
  campaign: z.string().trim().max(160, "Campanha muito longa.").optional().default("")
});

const feedbackStatusSchema = z.object({
  id: z.string().uuid("Feedback invalido."),
  status: z.enum(feedbackStatuses)
});

async function getOptionalUser(request: Request): Promise<User | null> {
  const authorization = request.headers.get("authorization");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!authorization || !url || !anonKey) return null;

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
    data: { user }
  } = await supabase.auth.getUser();

  return user || null;
}

export async function POST(request: Request) {
  let userId: string | null = null;

  try {
    assertRequestSize(request, 16_384);
    await enforceRateLimit({
      request,
      route: "api:feedback",
      limit: 6,
      windowMs: 10 * 60_000,
      message: "Voce enviou muitos feedbacks rapidamente. Aguarde alguns minutos e tente novamente."
    });

    const payload = feedbackSchema.parse(await request.json());
    const user = await getOptionalUser(request);
    userId = user?.id || null;
    const email = (user?.email || payload.email || "").toLowerCase();
    const name = ((user?.user_metadata?.name as string | undefined) || payload.name || "").trim();

    if (!user && !email) {
      throw new AppError("Informe seu e-mail para conseguirmos responder seu feedback.", 400);
    }

    const supabase = getSupabaseAdmin();
    const userAgent = request.headers.get("user-agent")?.slice(0, 500) || null;
    const { data, error } = await supabase
      .from("user_feedback")
      .insert({
        user_id: user?.id || null,
        name: name || null,
        email: email || null,
        type: payload.type,
        message: payload.message,
        page: payload.page || null,
        source: payload.source || "feedback_form",
        context: payload.context || null,
        campaign: payload.campaign || null,
        user_agent: userAgent,
        status: "new"
      })
      .select("id")
      .single();

    if (error) {
      throw new AppError("Nao foi possivel salvar seu feedback agora. Tente novamente em instantes.", 500);
    }

    serverLog({
      event: "feedback_created",
      route: "/api/feedback",
      userId,
      status: "ok",
      metadata: { type: payload.type, page: payload.page || "not_informed", context: payload.context || "not_informed" }
    });
    return Response.json({
      ok: true,
      id: data?.id,
      message: "Feedback enviado. Obrigado por ajudar a melhorar o AtendeZap IA."
    });
  } catch (error) {
    serverLog({ level: "warn", event: "feedback_create_failed", route: "/api/feedback", userId, error });
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  let userId: string | null = null;

  try {
    assertRequestSize(request, 4096);
    await enforceRateLimit({
      request,
      route: "api:feedback-status",
      limit: 60,
      windowMs: 5 * 60_000
    });

    const { user, supabase } = await requireAdmin(request);
    userId = user.id;
    const payload = feedbackStatusSchema.parse(await request.json());
    const { error } = await supabase.from("user_feedback").update({ status: payload.status }).eq("id", payload.id);

    if (error) {
      throw new AppError("Nao foi possivel atualizar o feedback.", 500);
    }

    serverLog({ event: "feedback_status_updated", route: "/api/feedback", userId, status: "ok", metadata: { feedback_id: payload.id, feedback_status: payload.status } });
    return Response.json({ ok: true, status: payload.status });
  } catch (error) {
    serverLog({ level: "warn", event: "feedback_status_update_failed", route: "/api/feedback", userId, error });
    return errorResponse(error);
  }
}

export function GET() {
  return Response.json({ error: "Metodo nao permitido. Use POST." }, { status: 405 });
}
