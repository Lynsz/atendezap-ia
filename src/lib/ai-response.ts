import OpenAI from "openai";
import type { ResponseType } from "@/types/mvp";

export type BusinessDataForResponse = {
  business_name: string;
  business_area?: string;
  business_type?: string;
  location?: string;
  description?: string;
  products_services?: string;
  common_questions?: string;
  important_info?: string;
  prices?: string;
  opening_hours?: string;
  main_channel?: string;
  response_goal?: string;
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
  orcamento: "orçamento",
  cliente_indeciso: "cliente indeciso",
  pos_venda: "pos-venda",
  recuperacao: "recuperação de cliente sumido"
};

function line(label: string, value?: string) {
  return value?.trim() ? `- ${label}: ${value.trim()}` : "";
}

export function generateFallbackCustomerResponse({ customerQuestion, responseType, businessData }: GenerateAiResponseInput) {
  const details = [
    businessData.products_services ? `trabalhamos com ${businessData.products_services}` : "",
    businessData.opening_hours ? `nosso atendimento funciona em ${businessData.opening_hours}` : "",
    businessData.main_channel ? `o canal principal de atendimento é ${businessData.main_channel}` : "",
    businessData.payment_methods ? `aceitamos ${businessData.payment_methods}` : "",
    businessData.booking_or_payment_link ? `você também pode acessar este link: ${businessData.booking_or_payment_link}` : ""
  ].filter(Boolean);

  return [
    `Olá! Obrigada pelo contato. Sobre sua dúvida: ${customerQuestion.trim()}.`,
    `Aqui no ${businessData.business_name}, ${details.length ? details.join(", ") : "posso te ajudar com mais informações do nosso atendimento"}.`,
    responseType === "venda" || responseType === "cliente_indeciso"
      ? "Me chama por aqui que eu te ajudo a escolher a melhor opção."
      : "Posso te ajudar com mais detalhes por aqui."
  ].join(" ");
}

export function buildCustomerResponsePrompt({ customerQuestion, responseType, businessData }: GenerateAiResponseInput) {
  return `Pergunta do cliente:
${customerQuestion}

Tipo de resposta:
${responseTypeLabels[responseType]}

Dados do negócio:
${[
  line("Nome", businessData.business_name),
  line("Área", businessData.business_area),
  line("Tipo de atuação", businessData.business_type),
  line("Cidade/estado", businessData.location),
  line("Descrição", businessData.description),
  line("Produtos/serviços", businessData.products_services),
  line("Perguntas comuns dos clientes", businessData.common_questions),
  line("Informações importantes para a IA", businessData.important_info),
  line("Preços", businessData.prices),
  line("Canal principal", businessData.main_channel),
  line("Horário", businessData.opening_hours),
  line("Meta de tempo de resposta", businessData.response_goal),
  line("Endereço", businessData.address),
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
          "Você é uma assistente comercial especialista em atendimento por WhatsApp para pequenos negócios brasileiros. Sua função é criar respostas prontas para copiar e colar no WhatsApp. Responda de forma natural, objetiva, educada e persuasiva. Use apenas as informações fornecidas sobre o negócio. Não invente preços, horários, endereço, links, formas de pagamento ou serviços. Se uma informação estiver ausente, responda de forma útil sem criar dados falsos. A resposta deve parecer humana e profissional. Evite textos longos demais. Não use markdown. Não use aspas envolvendo a resposta final."
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
