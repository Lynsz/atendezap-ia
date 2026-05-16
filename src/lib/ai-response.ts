import OpenAI from "openai";
import type { ResponseType } from "@/types/mvp";

export type BusinessDataForResponse = {
  business_name: string;
  business_area?: string;
  description?: string;
  products_services?: string;
  prices?: string;
  opening_hours?: string;
  address?: string;
  payment_methods?: string;
  booking_or_payment_link?: string;
  brand_tone?: string;
};

export type GenerateAiResponseInput = {
  customerQuestion: string;
  responseType: ResponseType;
  businessData: BusinessDataForResponse;
};

const responseTypeLabels: Record<ResponseType, string> = {
  atendimento: "atendimento",
  venda: "venda",
  orcamento: "orcamento",
  cliente_indeciso: "cliente indeciso",
  pos_venda: "pos-venda",
  recuperacao: "recuperacao de cliente sumido"
};

function line(label: string, value?: string) {
  return value?.trim() ? `- ${label}: ${value.trim()}` : "";
}

export function generateFallbackCustomerResponse({ customerQuestion, responseType, businessData }: GenerateAiResponseInput) {
  const details = [
    businessData.products_services ? `trabalhamos com ${businessData.products_services}` : "",
    businessData.opening_hours ? `nosso atendimento funciona em ${businessData.opening_hours}` : "",
    businessData.payment_methods ? `aceitamos ${businessData.payment_methods}` : "",
    businessData.booking_or_payment_link ? `voce tambem pode acessar este link: ${businessData.booking_or_payment_link}` : ""
  ].filter(Boolean);

  return [
    `Ola! Obrigada pelo contato. Sobre sua duvida: ${customerQuestion.trim()}.`,
    `Aqui no ${businessData.business_name}, ${details.length ? details.join(", ") : "posso te ajudar com mais informacoes do nosso atendimento"}.`,
    responseType === "venda" || responseType === "cliente_indeciso"
      ? "Me chama por aqui que eu te ajudo a escolher a melhor opcao."
      : "Posso te ajudar com mais detalhes por aqui."
  ].join(" ");
}

export function buildCustomerResponsePrompt({ customerQuestion, responseType, businessData }: GenerateAiResponseInput) {
  return `Pergunta do cliente:
${customerQuestion}

Tipo de resposta:
${responseTypeLabels[responseType]}

Dados do negocio:
${[
  line("Nome", businessData.business_name),
  line("Area", businessData.business_area),
  line("Descricao", businessData.description),
  line("Produtos/servicos", businessData.products_services),
  line("Precos", businessData.prices),
  line("Horario", businessData.opening_hours),
  line("Endereco", businessData.address),
  line("Formas de pagamento", businessData.payment_methods),
  line("Link de pagamento/agendamento", businessData.booking_or_payment_link),
  line("Tom de voz", businessData.brand_tone)
].filter(Boolean).join("\n")}`;
}

export async function generateCustomerResponseWithAi(input: GenerateAiResponseInput) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      generatedAnswer: generateFallbackCustomerResponse(input),
      mode: "fallback_without_openai_key" as const
    };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Voce e uma assistente comercial especialista em atendimento por WhatsApp para pequenos negocios brasileiros. Sua funcao e criar respostas prontas para copiar e colar no WhatsApp. Responda de forma natural, objetiva, educada e persuasiva. Use apenas as informacoes fornecidas sobre o negocio. Nao invente precos, horarios, endereco, links, formas de pagamento ou servicos. Se uma informacao estiver ausente, responda de forma util sem criar dados falsos. A resposta deve parecer humana e profissional. Evite textos longos demais. Nao use markdown. Nao use aspas envolvendo a resposta final."
      },
      {
        role: "user",
        content: buildCustomerResponsePrompt(input)
      }
    ],
    temperature: 0.6,
    max_tokens: 350
  });

  const generatedAnswer = completion.choices[0]?.message?.content?.trim();

  return {
    generatedAnswer: generatedAnswer || generateFallbackCustomerResponse(input),
    mode: generatedAnswer ? ("openai" as const) : ("fallback_empty_openai_response" as const)
  };
}
