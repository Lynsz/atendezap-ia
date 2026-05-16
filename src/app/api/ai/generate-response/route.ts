import { NextResponse } from "next/server";
import { z } from "zod";
import { generateCustomerResponseWithAi } from "@/lib/ai-response";
import type { ResponseType } from "@/types/mvp";

export const runtime = "nodejs";

const responseTypeMap: Record<string, ResponseType> = {
  atendimento: "atendimento",
  venda: "venda",
  orcamento: "orcamento",
  "orçamento": "orcamento",
  cliente_indeciso: "cliente_indeciso",
  "cliente indeciso": "cliente_indeciso",
  pos_venda: "pos_venda",
  "pós-venda": "pos_venda",
  "pos-venda": "pos_venda",
  recuperacao: "recuperacao",
  recuperação: "recuperacao",
  "recuperação de cliente sumido": "recuperacao",
  "recuperacao de cliente sumido": "recuperacao"
};

const boundedText = z.string().trim().max(2000, "Campo muito longo.").optional().default("");

const aiRequestSchema = z.object({
  customerQuestion: z.string().trim().min(1, "Informe a pergunta do cliente.").max(1500, "A pergunta deve ter no maximo 1500 caracteres."),
  responseType: z.string().trim().optional().default("atendimento"),
  businessData: z.object({
    business_name: z.string().trim().min(1, "Informe o nome do negocio.").max(2000, "Nome do negocio muito longo."),
    business_area: boundedText,
    description: boundedText,
    products_services: boundedText,
    prices: boundedText,
    opening_hours: boundedText,
    address: boundedText,
    payment_methods: boundedText,
    booking_or_payment_link: boundedText,
    brand_tone: boundedText
  })
});

function normalizeResponseType(value: string): ResponseType {
  return responseTypeMap[value.toLowerCase()] || "atendimento";
}

export async function POST(request: Request) {
  try {
    const payload = aiRequestSchema.safeParse(await request.json());

    if (!payload.success) {
      return NextResponse.json({ error: payload.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
    }

    const { generatedAnswer, mode } = await generateCustomerResponseWithAi({
      customerQuestion: payload.data.customerQuestion,
      responseType: normalizeResponseType(payload.data.responseType),
      businessData: payload.data.businessData
    });

    return NextResponse.json({ generatedAnswer, mode });
  } catch {
    return NextResponse.json({ error: "Nao foi possivel gerar a resposta agora." }, { status: 500 });
  }
}
