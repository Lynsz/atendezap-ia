import OpenAI from "openai";
import type { GenerateResponseInput } from "@/lib/mvp-validators";

const responseTypeLabels: Record<GenerateResponseInput["responseType"], string> = {
  atendimento: "atendimento inicial",
  venda: "venda",
  orcamento: "orcamento",
  cliente_indeciso: "cliente indeciso",
  pos_venda: "pos-venda",
  recuperacao: "recuperacao de cliente sumido"
};

export function buildResponsePrompt(input: GenerateResponseInput) {
  const business = input.businessData;

  return `Voce e uma assistente comercial para WhatsApp de pequenos negocios no Brasil.

Crie uma resposta pronta para copiar e colar no WhatsApp.

Pergunta do cliente:
${input.customerQuestion}

Tipo de resposta desejado: ${responseTypeLabels[input.responseType]}

Dados cadastrados do negocio:
- Nome: ${business.business_name}
- Area: ${business.business_area || "nao informado"}
- Descricao: ${business.description || "nao informado"}
- Produtos/servicos: ${business.products_services || "nao informado"}
- Precos: ${business.prices || "nao informado"}
- Horario: ${business.opening_hours || "nao informado"}
- Endereco: ${business.address || "nao informado"}
- Formas de pagamento: ${business.payment_methods || "nao informado"}
- Link de pagamento/agendamento: ${business.booking_or_payment_link || "nao informado"}
- Tom de voz: ${business.brand_tone || "profissional"}

Regras:
- Responder em portugues do Brasil.
- Ser natural, profissional, objetivo e persuasivo sem forcar.
- Adaptar a resposta ao negocio cadastrado.
- Nao inventar informacoes ausentes.
- Se faltar informacao, pedir o dado de forma util.
- Nao prometer resultado financeiro garantido.
- Retornar apenas a mensagem final, sem titulo e sem explicacoes.`;
}

export async function generateWhatsAppResponse(input: GenerateResponseInput) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI nao configurada. Defina OPENAI_API_KEY no ambiente do servidor.");
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
    throw new Error("A IA nao retornou uma resposta. Tente novamente.");
  }

  return answer;
}
