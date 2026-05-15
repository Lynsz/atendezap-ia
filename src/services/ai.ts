import type { GenerateResponseInput } from "@/lib/mvp-validators";

type GenerateCustomerResponseInput = {
  customerQuestion: string;
  responseType: GenerateResponseInput["responseType"];
  business: GenerateResponseInput["businessData"];
};

const responseTypeLabels: Record<GenerateResponseInput["responseType"], string> = {
  atendimento: "atendimento",
  venda: "venda",
  orcamento: "orcamento",
  cliente_indeciso: "cliente indeciso",
  pos_venda: "pos-venda",
  recuperacao: "recuperacao"
};

export async function generateCustomerResponse({ customerQuestion, responseType, business }: GenerateCustomerResponseInput) {
  const details = [
    business.products_services ? `servicos/produtos: ${business.products_services}` : "",
    business.opening_hours ? `horario: ${business.opening_hours}` : "",
    business.payment_methods ? `formas de pagamento: ${business.payment_methods}` : "",
    business.booking_or_payment_link ? `link: ${business.booking_or_payment_link}` : ""
  ].filter(Boolean);

  return [
    `Ola! Sobre sua duvida: "${customerQuestion}".`,
    `Aqui e ${business.business_name}.`,
    details.length ? `No momento, posso te ajudar com estas informacoes do nosso negocio: ${details.join("; ")}.` : "Posso te ajudar com mais detalhes do nosso atendimento.",
    `Esta resposta foi preparada para ${responseTypeLabels[responseType]}. Se quiser, me envie mais detalhes para eu orientar melhor.`
  ].join(" ");
}

// A integracao real com OpenAI deve entrar no backend/route handler,
// usando OPENAI_API_KEY apenas no servidor e mantendo este contrato.
