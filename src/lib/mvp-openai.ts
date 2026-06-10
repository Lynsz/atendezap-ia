import OpenAI from "openai";
import type { responseTypes } from "@/lib/mvp-validators";

type LegacyGenerateResponseInput = {
  customerQuestion: string;
  responseType: (typeof responseTypes)[number];
  businessData: {
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
};

const responseTypeLabels: Record<LegacyGenerateResponseInput["responseType"], string> = {
  atendimento: "atendimento inicial",
  venda: "venda",
  orcamento: "orçamento",
  cliente_indeciso: "cliente indeciso",
  pos_venda: "pos-venda",
  recuperacao: "recuperação de cliente sumido"
};

export function buildResponsePrompt(input: LegacyGenerateResponseInput) {
  const business = input.businessData;

  return `Você é uma assistente comercial para WhatsApp de pequenos negócios no Brasil.

Crie uma resposta pronta para copiar e colar no WhatsApp.

Pergunta do cliente:
${input.customerQuestion}

Tipo de resposta desejado: ${responseTypeLabels[input.responseType]}

Dados cadastrados do negócio:
- Nome: ${business.business_name}
- Área: ${business.business_area || "não informado"}
- Descrição: ${business.description || "não informado"}
- Produtos/serviços: ${business.products_services || "não informado"}
- Preços: ${business.prices || "não informado"}
- Horário: ${business.opening_hours || "não informado"}
- Endereço: ${business.address || "não informado"}
- Formas de pagamento: ${business.payment_methods || "não informado"}
- Link de pagamento/agendamento: ${business.booking_or_payment_link || "não informado"}
- Tom de voz: ${business.brand_tone || "profissional"}

Regras:
- Responder em português do Brasil.
- Ser natural, profissional, objetivo e persuasivo sem forçar.
- Adaptar a resposta ao negócio cadastrado.
- Não inventar informações ausentes.
- Se faltar informação, pedir o dado de forma útil.
- Não prometer resultado financeiro garantido.
- Retornar apenas a mensagem final, sem título e sem explicações.`;
}

export async function generateWhatsAppResponse(input: LegacyGenerateResponseInput) {
  if (!process.env.OPENAI_API_KEY) {
    return `Olá! Obrigado pelo contato com ${input.businessData.business_name}. ${input.businessData.products_services ? `Trabalhamos com ${input.businessData.products_services}. ` : ""}${input.businessData.opening_hours ? `Nosso horário de atendimento é ${input.businessData.opening_hours}. ` : ""}Para te orientar melhor, pode me confirmar mais detalhes do que você precisa?`;
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.chat.completions.create(
    {
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: buildResponsePrompt(input) }],
      temperature: 0.7,
      max_tokens: 450
    },
    { timeout: 45_000 }
  );

  const answer = completion.choices[0]?.message?.content?.trim();
  if (!answer) {
    throw new Error("A IA não retornou uma resposta. Tente novamente.");
  }

  return answer;
}
