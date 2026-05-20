import OpenAI from "openai";
import { z } from "zod";
import { AppError, errorResponse } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const businessTypes = ["Autônomo", "Prestador de serviço", "Loja", "Delivery", "Estética", "Restaurante", "Assistência técnica", "Outro"] as const;
const toneOptions = ["Profissional", "Simpático", "Direto", "Vendedor", "Acolhedor"] as const;

const demoSchema = z
  .object({
    question: z.string().trim().min(3, "Digite uma pergunta de cliente.").max(280, "Pergunta muito longa. Use ate 280 caracteres."),
    businessType: z.enum(businessTypes, { errorMap: () => ({ message: "Escolha um tipo de atuacao valido." }) }),
    tone: z.enum(toneOptions, { errorMap: () => ({ message: "Escolha um tom de voz valido." }) })
  })
  .strict();

function fallbackDemoResponse(question: string, businessType: string, tone: string) {
  const tonePrefix = tone === "Direto" ? "Oi! Vamos lá:" : tone === "Acolhedor" ? "Oi! Claro, vou te ajudar com isso." : "Olá! Claro, posso te ajudar.";
  const context =
    businessType === "Delivery"
      ? "Para te passar a melhor opção, me diga seu bairro e o que você gostaria de pedir."
      : businessType === "Restaurante"
        ? "Posso te enviar as opções disponíveis e tirar suas dúvidas por aqui."
        : businessType === "Loja"
          ? "Me diga qual produto você procura que eu te passo disponibilidade, formas de pagamento e próximos passos."
          : "Me envie mais detalhes sobre o que você precisa e já te passo as informações certinhas.";

  return `${tonePrefix} Sobre "${question.trim()}", ${context} Se preferir, posso continuar o atendimento por aqui e te orientar no próximo passo.`;
}

function buildDemoPrompt(question: string, businessType: string, tone: string) {
  return `Crie uma resposta curta para WhatsApp.

Contexto:
- Tipo de atuação: ${businessType}
- Tom de voz: ${tone}
- Pergunta do cliente: ${question}

Regras:
- Responda em portugues do Brasil.
- Seja claro, natural e profissional.
- Nao invente preco, horario, endereco, prazo, disponibilidade ou politica.
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
      message: "Você gerou muitas respostas em pouco tempo. Aguarde alguns minutos e tente novamente."
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
    return Response.json({ error: "Não foi possível gerar a resposta agora. Tente novamente em instantes." }, { status: 500 });
  }
}
