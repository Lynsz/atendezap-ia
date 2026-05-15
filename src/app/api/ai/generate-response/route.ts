import { NextResponse } from "next/server";
import { generateResponseSchema } from "@/lib/mvp-validators";
import { generateCustomerResponse } from "@/services/ai";

export async function POST(request: Request) {
  try {
    const payload = generateResponseSchema.safeParse(await request.json());

    if (!payload.success) {
      return NextResponse.json({ error: payload.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
    }

    const generatedAnswer = await generateCustomerResponse({
      customerQuestion: payload.data.customerQuestion,
      responseType: payload.data.responseType,
      business: payload.data.businessData
    });

    return NextResponse.json({
      generatedAnswer,
      mode: process.env.OPENAI_API_KEY ? "placeholder_ready_for_openai" : "placeholder_without_openai_key"
    });
  } catch {
    return NextResponse.json({ error: "Nao conseguimos gerar a resposta agora." }, { status: 500 });
  }
}
