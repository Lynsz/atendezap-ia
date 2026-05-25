import OpenAI from "openai";
import { formatBusinessTemplateForPrompt, getBusinessTemplate } from "@/lib/ai/business-templates";
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

const responseTypeLabels: Record<ResponseType, string> = {
  atendimento: "atendimento",
  venda: "venda",
  orcamento: "orcamento",
  cliente_indeciso: "cliente indeciso",
  pos_venda: "pos-venda",
  recuperacao: "recuperacao de cliente sumido"
};

function line(label: string, value?: string | null) {
  return value?.trim() ? `- ${label}: ${value.trim()}` : "";
}

export function generateFallbackCustomerResponse({ customerQuestion, responseType, businessData }: GenerateAiResponseInput) {
  const template = getBusinessTemplate(businessData.business_type || businessData.business_area);
  const details = [
    businessData.products_services ? `trabalhamos com ${businessData.products_services}` : "",
    businessData.opening_hours ? `nosso atendimento funciona em ${businessData.opening_hours}` : "",
    businessData.main_channel ? `o canal principal de atendimento e ${businessData.main_channel}` : "",
    businessData.payment_methods ? `aceitamos ${businessData.payment_methods}` : "",
    businessData.booking_or_payment_link ? `voce tambem pode acessar este link: ${businessData.booking_or_payment_link}` : ""
  ].filter(Boolean);

  return [
    `Ola! Obrigada pelo contato. Sobre sua duvida: ${customerQuestion.trim()}.`,
    `Aqui no ${businessData.business_name}, ${details.length ? details.join(", ") : "posso te ajudar com mais informacoes do nosso atendimento"}.`,
    responseType === "venda" || responseType === "cliente_indeciso"
      ? "Me chama por aqui que eu te ajudo a escolher a melhor opcao."
      : "Posso te ajudar com mais detalhes por aqui.",
    template.importantCare.length ? "Se faltar alguma informacao, me mande mais detalhes para eu confirmar antes de te passar prazo, valor ou disponibilidade." : ""
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildCustomerResponsePrompt({ customerQuestion, responseType, businessData }: GenerateAiResponseInput) {
  const template = getBusinessTemplate(businessData.business_type || businessData.business_area);

  return `Pergunta do cliente:
${customerQuestion}

Tipo de resposta:
${responseTypeLabels[responseType]}

Dados do negocio:
${[
  line("Nome", businessData.business_name),
  line("Area", businessData.business_area),
  line("Tipo de atuacao", businessData.business_type),
  line("Cidade/estado", businessData.location),
  line("Descricao", businessData.description),
  line("Produtos/servicos", businessData.products_services),
  line("Perguntas comuns dos clientes", businessData.common_questions),
  line("Informacoes importantes para a IA", businessData.important_info),
  line("Precos", businessData.prices),
  line("Canal principal", businessData.main_channel),
  line("Horario", businessData.opening_hours),
  line("Meta de tempo de resposta", businessData.response_goal),
  line("Endereco", businessData.address),
  line("Formas de pagamento", businessData.payment_methods),
  line("Link de pagamento/agendamento", businessData.booking_or_payment_link),
  line("Tom de voz", businessData.brand_tone)
]
  .filter(Boolean)
  .join("\n")}

Template do tipo de atuacao:
${formatBusinessTemplateForPrompt(template)}

Regras obrigatorias:
- Gerar uma resposta pronta para WhatsApp, curta, clara e natural.
- Adaptar a resposta ao tipo de atuacao, ao tom de voz e aos dados do negocio.
- Usar apenas precos, prazos, horarios, disponibilidade, endereco, links e formas de pagamento informados nos dados.
- Nao inventar preco, prazo, disponibilidade, estoque, garantia, endereco, link ou forma de pagamento.
- Nao confirmar agendamento, reserva, entrega, avaliacao ou atendimento sem dados suficientes.
- Nao dizer que a mensagem foi enviada automaticamente.
- Se faltar informacao, pedir os detalhes necessarios de forma educada.
- Nao usar markdown, listas longas ou aspas envolvendo a resposta final.`;
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
