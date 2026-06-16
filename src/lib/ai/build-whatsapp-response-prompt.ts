import { formatBusinessTemplateForPrompt, getBusinessTemplate } from "@/lib/ai/business-templates";
import type { ResponseType } from "@/types/mvp";

export type BusinessDataForWhatsappResponse = {
  id?: string;
  business_name?: string | null;
  business_area?: string | null;
  business_type?: string | null;
  location?: string | null;
  description?: string | null;
  products_services?: string | null;
  common_questions?: string | null;
  important_info?: string | null;
  prices?: string | null;
  opening_hours?: string | null;
  main_channel?: string | null;
  response_goal?: string | null;
  address?: string | null;
  payment_methods?: string | null;
  booking_or_payment_link?: string | null;
  brand_tone?: string | null;
};

export type BuildWhatsappResponsePromptInput = {
  customerQuestion: string;
  responseType: ResponseType;
  businessData: BusinessDataForWhatsappResponse;
};

const responseTypeLabels: Record<ResponseType, string> = {
  atendimento: "atendimento",
  venda: "venda",
  orcamento: "orcamento",
  cliente_indeciso: "cliente indeciso",
  pos_venda: "pos-venda",
  recuperacao: "recuperacao de cliente sumido"
};

function safeText(value: string | null | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function line(label: string, value?: string | null) {
  return value?.trim() ? `- ${label}: ${value.trim()}` : "";
}

export function normalizeBusinessContextForPrompt(businessData: BusinessDataForWhatsappResponse) {
  return {
    ...businessData,
    business_name: safeText(businessData.business_name, "seu negocio"),
    business_type: safeText(businessData.business_type || businessData.business_area, "atendimento"),
    description: safeText(businessData.description, "atendimento ao cliente pelo WhatsApp"),
    brand_tone: safeText(businessData.brand_tone, "educado e profissional")
  };
}

export function buildWhatsappResponsePrompt(input: BuildWhatsappResponsePromptInput) {
  const businessData = normalizeBusinessContextForPrompt(input.businessData);
  const template = getBusinessTemplate(businessData.business_type || businessData.business_area);

  return `Mensagem do cliente:
${input.customerQuestion}

Tipo de resposta:
${responseTypeLabels[input.responseType]}

Contexto do negocio:
${[
  line("Nome do negocio", businessData.business_name),
  line("Tipo de negocio", businessData.business_type),
  line("Area", businessData.business_area),
  line("Cidade/estado", businessData.location),
  line("Descricao", businessData.description),
  line("Produtos/servicos", businessData.products_services),
  line("Perguntas comuns dos clientes", businessData.common_questions),
  line("Informacoes importantes", businessData.important_info),
  line("Precos", businessData.prices),
  line("Horario", businessData.opening_hours),
  line("Endereco", businessData.address),
  line("Formas de pagamento", businessData.payment_methods),
  line("Link de pagamento/agendamento", businessData.booking_or_payment_link),
  line("Canal principal", businessData.main_channel),
  line("Meta de resposta", businessData.response_goal),
  line("Tom", businessData.brand_tone)
]
  .filter(Boolean)
  .join("\n")}

Template do tipo de atuacao:
${formatBusinessTemplateForPrompt(template)}

Regras obrigatorias:
- Responda em portugues do Brasil.
- Escreva como uma mensagem curta, natural e util para WhatsApp.
- Use o tom definido pelo usuario e considere o tipo de negocio.
- Nao use markdown pesado, listas longas, aspas envolvendo a resposta ou assinatura longa.
- Nao diga que e uma IA.
- Nao prometa envio automatico e nao diga que a mensagem sera enviada automaticamente.
- Nao invente preco, prazo, disponibilidade, estoque, agenda, endereco, link, garantia, servico ou forma de pagamento.
- Nao confirme agendamento, reserva, entrega ou atendimento sem dados suficientes.
- Se o cliente pedir preco, prazo, estoque, disponibilidade, endereco, entrega ou agenda e essa informacao nao estiver no contexto do negocio, peca mais detalhes ou diga que vai verificar, sem inventar valores.
- Se faltar informacao para responder com seguranca, prefira uma resposta curta pedindo o detalhe necessario em vez de completar com suposicoes.
- Quando faltar informacao importante, peca o detalhe necessario de forma educada.
- Entregue apenas o texto final da resposta.`;
}
