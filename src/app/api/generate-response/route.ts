import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateResponseSchema } from "@/lib/mvp-validators";
import { generateWhatsAppResponse } from "@/lib/mvp-openai";

export async function POST(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      return NextResponse.json({ error: "Supabase nao configurado no servidor." }, { status: 500 });
    }

    const authorization = request.headers.get("authorization");
    if (!authorization) {
      return NextResponse.json({ error: "Sessao nao encontrada. Faca login novamente." }, { status: 401 });
    }

    const payload = generateResponseSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json({ error: payload.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
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
      return NextResponse.json({ error: "Sessao invalida. Faca login novamente." }, { status: 401 });
    }

    const generatedAnswer = await generateWhatsAppResponse(payload.data);

    const { data: saved, error: insertError } = await supabase
      .from("generated_responses")
      .insert({
        user_id: user.id,
        business_id: payload.data.businessId || null,
        customer_question: payload.data.customerQuestion,
        generated_answer: generatedAnswer,
        response_type: payload.data.responseType
      })
      .select("*")
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "Resposta gerada, mas nao conseguimos salvar no historico.", generatedAnswer },
        { status: 500 }
      );
    }

    return NextResponse.json({ generatedAnswer, saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao conseguimos gerar a resposta agora.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
