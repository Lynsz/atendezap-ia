import OpenAI from "openai";
import { AppError } from "@/lib/errors";
import type { KitFormData } from "@/lib/validators";

export const kitJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    welcome_message: { type: "string" },
    away_message: { type: "string" },
    quick_replies: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          message: { type: "string" }
        },
        required: ["title", "message"]
      }
    },
    qualification_questions: { type: "array", items: { type: "string" } },
    follow_ups: { type: "array", items: { type: "string" } },
    lost_customer_messages: { type: "array", items: { type: "string" } },
    post_sale_messages: { type: "array", items: { type: "string" } },
    status_phrases: { type: "array", items: { type: "string" } },
    labels: { type: "array", items: { type: "string" } },
    service_flow: { type: "array", items: { type: "string" } },
    usage_manual: { type: "array", items: { type: "string" } }
  },
  required: [
    "welcome_message",
    "away_message",
    "quick_replies",
    "qualification_questions",
    "follow_ups",
    "lost_customer_messages",
    "post_sale_messages",
    "status_phrases",
    "labels",
    "service_flow",
    "usage_manual"
  ]
} as const;

export function buildKitPrompt(formData: KitFormData) {
  return `Você é um especialista em atendimento comercial pelo WhatsApp Business para pequenos negócios.

Crie um kit de atendimento personalizado com base nos dados abaixo:

Nome do negócio: ${formData.businessName}
Nicho: ${formData.niche}
Cidade: ${formData.city}
Produtos ou serviços: ${formData.productsOrServices}
Horário de atendimento: ${formData.businessHours}
Perguntas frequentes: ${formData.frequentlyAskedQuestions}
Faixa de preço: ${formData.priceRange}
Formas de pagamento: ${formData.paymentMethods}
Como o cliente agenda ou compra: ${formData.purchaseProcess}
Tom de voz: ${formData.toneOfVoice}
WhatsApp: ${formData.whatsapp}
Instagram: ${formData.instagram || "Não informado"}

Entregue em português do Brasil, em JSON válido, seguindo exatamente esta estrutura:

{
  "welcome_message": "",
  "away_message": "",
  "quick_replies": [
    {
      "title": "",
      "message": ""
    }
  ],
  "qualification_questions": [],
  "follow_ups": [],
  "lost_customer_messages": [],
  "post_sale_messages": [],
  "status_phrases": [],
  "labels": [],
  "service_flow": [],
  "usage_manual": []
}

Regras:
- Não prometer venda garantida.
- Não usar pressão excessiva.
- Não inventar preços exatos se o cliente não forneceu.
- Usar linguagem natural, clara e comercial.
- Adaptar tudo ao nicho informado.
- Criar conteúdo pronto para copiar e colar.
- Responder apenas com JSON válido.`;
}

export async function generateKitWithOpenAI(formData: KitFormData) {
  if (!process.env.OPENAI_API_KEY) {
    throw new AppError("OpenAI não configurada. Defina OPENAI_API_KEY.", 500);
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const completion = await openai.chat.completions.create(
    {
      model,
      messages: [{ role: "user", content: buildKitPrompt(formData) }],
      temperature: 0.6,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "atendezap_kit",
          strict: true,
          schema: kitJsonSchema
        }
      }
    },
    { timeout: 60_000 }
  );

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new AppError("A IA não retornou conteúdo. Tente novamente.", 502);
  }

  try {
    return JSON.parse(content) as Record<string, unknown>;
  } catch {
    throw new AppError("A IA retornou um formato inválido. Tente novamente.", 502);
  }
}
