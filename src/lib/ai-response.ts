import { getBusinessTemplate } from "@/lib/ai/business-templates";
import { buildWhatsappResponsePrompt, normalizeBusinessContextForPrompt } from "@/lib/ai/build-whatsapp-response-prompt";
import { getOpenAIClient, getOpenAIModel } from "@/lib/server/openai";
import type { ResponseType } from "@/types/mvp";

export type BusinessDataForResponse = {
  id?: string;
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

export function generateFallbackCustomerResponse({ customerQuestion, responseType, businessData }: GenerateAiResponseInput) {
  const safeBusinessData = normalizeBusinessContextForPrompt(businessData);
  const template = getBusinessTemplate(safeBusinessData.business_type || safeBusinessData.business_area);
  const details = [
    safeBusinessData.products_services ? `trabalhamos com ${safeBusinessData.products_services}` : "",
    safeBusinessData.opening_hours ? `nosso atendimento funciona em ${safeBusinessData.opening_hours}` : "",
    safeBusinessData.main_channel ? `o canal principal de atendimento e ${safeBusinessData.main_channel}` : "",
    safeBusinessData.payment_methods ? `aceitamos ${safeBusinessData.payment_methods}` : "",
    safeBusinessData.booking_or_payment_link ? `voce tambem pode acessar este link: ${safeBusinessData.booking_or_payment_link}` : ""
  ].filter(Boolean);

  return [
    `Ola! Obrigada pelo contato. Sobre sua duvida: ${customerQuestion.trim()}.`,
    `Aqui no ${safeBusinessData.business_name}, ${details.length ? details.join(", ") : "posso te ajudar com mais informacoes do nosso atendimento"}.`,
    responseType === "venda" || responseType === "cliente_indeciso"
      ? "Me chama por aqui que eu te ajudo a escolher a melhor opcao."
      : "Posso te ajudar com mais detalhes por aqui.",
    template.importantCare.length ? "Se faltar alguma informacao, me mande mais detalhes para eu confirmar antes de te passar prazo, valor ou disponibilidade." : ""
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildCustomerResponsePrompt({ customerQuestion, responseType, businessData }: GenerateAiResponseInput) {
  return buildWhatsappResponsePrompt({ customerQuestion, responseType, businessData });
}

export async function generateCustomerResponseWithAi(input: GenerateAiResponseInput) {
  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: getOpenAIModel(),
    messages: [
      {
        role: "system",
        content:
          "Voce e uma assistente comercial especialista em atendimento por WhatsApp para pequenos negocios brasileiros. Sua funcao e criar respostas prontas para copiar, ajustar e enviar manualmente. Responda de forma natural, objetiva, educada e util. Use apenas as informacoes fornecidas sobre o negocio e o template do nicho. Nao invente preco, prazo, disponibilidade, estoque, garantia, endereco, link, forma de pagamento, horario ou servico. Nao confirme agendamento, reserva ou entrega sem dados suficientes. Se uma informacao estiver ausente, peca o detalhe necessario. A resposta deve parecer humana e profissional, curta o bastante para WhatsApp. Nao use markdown. Nao use aspas envolvendo a resposta final."
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
