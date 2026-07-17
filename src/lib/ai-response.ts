import { getBusinessTemplate } from "@/lib/ai/business-templates";
import { buildWhatsappResponsePrompt, normalizeBusinessContextForPrompt } from "@/lib/ai/build-whatsapp-response-prompt";
import { AppError } from "@/lib/errors";
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
          "Voce e uma assistente comercial especialista em atendimento por WhatsApp para pequenos negocios brasileiros. Sua funcao e criar respostas prontas para copiar, ajustar e enviar manualmente. Responda de forma natural, objetiva, educada e util. Use apenas as informacoes fornecidas sobre o negocio, o template e a orientacao do nicho. Normalmente use de 1 a 4 frases curtas. Nao invente preco, desconto, prazo, disponibilidade, estoque, garantia, endereco, entrega, link, forma de pagamento, horario, agenda ou servico. Nao confirme pedido, pagamento, agendamento, reserva ou entrega sem dados suficientes. Se uma informacao comercial estiver ausente, peca o detalhe necessario ou diga que sera verificado. Nao use markdown. Nao use aspas envolvendo a resposta final."
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
  if (!generatedAnswer) {
    throw new AppError("Nao foi possivel gerar a resposta agora. Tente novamente em instantes.", 502);
  }

  return {
    generatedAnswer,
    mode: "openai" as const
  };
}

export async function generateWhatsAppConversationReplyWithAi(input: {
  businessData: BusinessDataForResponse;
  history: Array<{ direction: "inbound" | "outbound"; body: string }>;
}) {
  const openai = getOpenAIClient();
  const business = normalizeBusinessContextForPrompt(input.businessData);
  const history = input.history
    .slice(-12)
    .map((item) => `${item.direction === "inbound" ? "Cliente" : "Atendente"}: ${item.body.slice(0, 1200)}`)
    .join("\n");
  const completion = await openai.chat.completions.create({
    model: getOpenAIModel(),
    messages: [
      {
        role: "system",
        content:
          "Crie somente uma sugestão curta de resposta para um atendente humano revisar e enviar manualmente pelo WhatsApp. Use apenas o contexto fornecido. Não invente preço, prazo, estoque, pagamento, agenda, link ou política. Se faltar dado, peça a informação necessária. Não diga que a mensagem já foi enviada. Use português brasileiro natural, sem markdown e em no máximo 4 frases curtas."
      },
      {
        role: "user",
        content: [
          `Negócio: ${business.business_name}.`,
          `Tipo: ${business.business_type || business.business_area || "atendimento"}.`,
          `Tom: ${business.brand_tone || "educado e profissional"}.`,
          business.description ? `Descrição: ${business.description}.` : "",
          "Conversa recente:",
          history
        ]
          .filter(Boolean)
          .join("\n")
      }
    ],
    temperature: 0.4,
    max_tokens: 240
  });

  const body = completion.choices[0]?.message?.content?.trim();
  if (!body) throw new AppError("Não foi possível sugerir uma resposta agora. Tente novamente em instantes.", 502);
  return body.slice(0, 4096);
}
