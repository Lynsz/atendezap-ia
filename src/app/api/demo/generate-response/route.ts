import OpenAI from "openai";
import { z } from "zod";
import { businessTypeOptions, formatBusinessTemplateForPrompt, getBusinessTemplate } from "@/lib/ai/business-templates";
import { AppError, errorResponse } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const toneOptions = ["Profissional", "Simpatico", "Direto", "Vendedor", "Acolhedor"] as const;

const demoSchema = z
  .object({
    question: z.string().trim().min(3, "Digite uma pergunta de cliente.").max(280, "Pergunta muito longa. Use ate 280 caracteres."),
    businessType: z.enum(businessTypeOptions, { errorMap: () => ({ message: "Escolha um tipo de atuacao valido." }) }),
    tone: z.enum(toneOptions, { errorMap: () => ({ message: "Escolha um tom de voz valido." }) })
  })
  .strict();

export function fallbackDemoResponse(question: string, businessType: string, tone: string) {
  const template = getBusinessTemplate(businessType);
  const tonePrefix = tone === "Direto" ? "Oi! Vamos la:" : tone === "Acolhedor" ? "Oi! Claro, vou te ajudar com isso." : "Ola! Claro, posso te ajudar.";
  const context = template.expectedResponseExamples[0] || "Me envie mais detalhes sobre o que voce precisa para eu te orientar melhor.";

  return `${tonePrefix} Sobre "${question.trim()}", ${context} Se faltar valor, prazo ou disponibilidade, eu confirmo antes de te passar uma resposta final.`;
}

export function buildDemoPrompt(question: string, businessType: string, tone: string) {
  const template = getBusinessTemplate(businessType);

  return `Crie uma resposta curta para WhatsApp.

Contexto:
- Tipo de atuacao: ${businessType}
- Tom de voz: ${tone}
- Pergunta do cliente: ${question}

Template do nicho:
${formatBusinessTemplateForPrompt(template)}

Regras:
- Responda em portugues do Brasil.
- Seja claro, natural e profissional.
- Nao invente preco, horario, endereco, prazo, disponibilidade, estoque, garantia ou politica.
- Nao confirme agendamento, reserva, entrega ou atendimento sem dados suficientes.
- Nao diga que enviou mensagem automaticamente.
- Se faltar informacao, peca o detalhe necessario de forma util.
- Maximo de 650 caracteres.
- Nao use markdown, aspas, listas longas ou assinatura.`;
}

export async function POST(request: Request) {
  try {
    assertRequestSize(request, 8_192);
    const rate = await enforceRateLimit({
      request,
      route: "api:demo-generate-response",
      limit: 6,
      windowMs: 10 * 60_000,
      message: "Voce gerou muitas respostas em pouco tempo. Aguarde alguns minutos e tente novamente."
    });

    const body = demoSchema.parse(await request.json());

    if (!process.env.OPENAI_API_KEY) {
      const answer = fallbackDemoResponse(body.question, body.businessType, body.tone);
      serverLog({
        event: "demo_response_generated",
        route: "/api/demo/generate-response",
        status: "fallback",
        metadata: { ip: rate.ip, business_type: body.businessType, tone: body.tone }
      });
      return Response.json({ answer, mode: "fallback_without_openai_key" });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Voce cria respostas comerciais curtas para WhatsApp para pequenos negocios brasileiros. Nao invente informacoes ausentes. O usuario final deve revisar antes de enviar."
        },
        {
          role: "user",
          content: buildDemoPrompt(body.question, body.businessType, body.tone)
        }
      ],
      temperature: 0.6,
      max_tokens: 220
    });

    const answer = completion.choices[0]?.message?.content?.trim() || fallbackDemoResponse(body.question, body.businessType, body.tone);
    serverLog({
      event: "demo_response_generated",
      route: "/api/demo/generate-response",
      status: "ok",
      metadata: { ip: rate.ip, business_type: body.businessType, tone: body.tone, mode: completion.choices[0]?.message?.content ? "openai" : "fallback_empty_openai_response" }
    });
    return Response.json({
      answer,
      mode: completion.choices[0]?.message?.content ? "openai" : "fallback_empty_openai_response"
    });
  } catch (error) {
    serverLog({ level: "warn", event: "demo_response_failed", route: "/api/demo/generate-response", error });
    if (error instanceof AppError) return errorResponse(error);
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues[0]?.message || "Dados invalidos. Revise a pergunta e tente novamente." }, { status: 400 });
    }
    return Response.json({ error: "Nao foi possivel gerar a resposta agora. Tente novamente em instantes." }, { status: 500 });
  }
}
