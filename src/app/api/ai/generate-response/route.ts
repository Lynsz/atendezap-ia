import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateCustomerResponseWithAi } from "@/lib/ai-response";
import { generateResponseSchema } from "@/lib/mvp-validators";
import { getPlanResponseLimit } from "@/lib/plan-limits";

export const runtime = "nodejs";

function getCurrentMonthStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export async function POST(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      return NextResponse.json({ error: "Supabase não configurado no servidor. Revise as variáveis de ambiente." }, { status: 500 });
    }

    const authorization = request.headers.get("authorization");
    if (!authorization) {
      return NextResponse.json({ error: "Sessão não encontrada. Faça login novamente." }, { status: 401 });
    }

    const payload = generateResponseSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json({ error: payload.error.issues[0]?.message || "Dados inválidos." }, { status: 400 });
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

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan_name, plan, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const limit = getPlanResponseLimit(subscription?.plan || subscription?.plan_name, subscription?.status);
    const monthStart = getCurrentMonthStart();
    const { count, error: countError } = await supabase
      .from("generated_responses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", monthStart);

    if (countError) {
      return NextResponse.json({ error: "Não foi possível verificar seu uso mensal agora. Tente novamente em instantes." }, { status: 500 });
    }

    const used = count ?? 0;
    if (used >= limit) {
      return NextResponse.json(
        {
          error: "Você atingiu o limite de respostas do seu plano neste mês. Faça upgrade para continuar usando.",
          usage: {
            used,
            limit,
            remaining: 0
          }
        },
        { status: 403 }
      );
    }

    const { generatedAnswer, mode } = await generateCustomerResponseWithAi({
      customerQuestion: payload.data.customerQuestion,
      responseType: payload.data.responseType,
      businessData: payload.data.businessData
    });

    const { data: savedResponse, error: insertError } = await supabase
      .from("generated_responses")
      .insert({
        user_id: user.id,
        business_id: payload.data.businessData.id || payload.data.businessId || null,
        customer_question: payload.data.customerQuestion,
        generated_answer: generatedAnswer,
        response_type: payload.data.responseType
      })
      .select("*")
      .single();

    if (insertError || !savedResponse) {
      return NextResponse.json(
        {
          error: "Resposta gerada, mas não conseguimos salvar no histórico. Tente novamente antes de usar em produção.",
          generatedAnswer,
          savedResponseId: null
        },
        { status: 500 }
      );
    }

    const nextUsed = used + 1;
    return NextResponse.json({
      generatedAnswer,
      mode,
      savedResponse,
      savedResponseId: savedResponse.id,
      usage: {
        used: nextUsed,
        limit,
        remaining: Math.max(limit - nextUsed, 0)
      }
    });
  } catch {
    return NextResponse.json({ error: "Não foi possível gerar a resposta agora. Tente novamente em instantes." }, { status: 500 });
  }
}
