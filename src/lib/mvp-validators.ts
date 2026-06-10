import { z } from "zod";

export const responseTypes = ["atendimento", "venda", "orcamento", "cliente_indeciso", "pos_venda", "recuperacao"] as const;

export const customerStatuses = ["novo", "em_atendimento", "orcamento_enviado", "aguardando_resposta", "venda_concluida", "perdido"] as const;

const optionalText = (max: number, message: string, fallback = "") => z.string().trim().max(max, message).optional().default(fallback);

export const businessSchema = z.object({
  business_name: z.string().trim().min(2, "Informe o nome do negocio.").max(160, "Nome do negocio muito longo."),
  business_area: optionalText(120, "Area muito longa."),
  business_type: optionalText(120, "Tipo de negocio muito longo."),
  location: optionalText(160, "Localizacao muito longa."),
  description: optionalText(1200, "Descricao muito longa."),
  products_services: optionalText(1600, "Produtos ou servicos muito longos."),
  common_questions: optionalText(1600, "Perguntas comuns muito longas."),
  important_info: optionalText(1600, "Informacoes importantes muito longas."),
  prices: optionalText(1000, "Informacoes de preco muito longas."),
  opening_hours: optionalText(300, "Horario de atendimento muito longo."),
  main_channel: optionalText(80, "Canal principal muito longo.", "WhatsApp"),
  response_goal: optionalText(180, "Objetivo de resposta muito longo."),
  address: optionalText(300, "Endereco muito longo."),
  payment_methods: optionalText(300, "Formas de pagamento muito longas."),
  booking_or_payment_link: z.string().trim().url("Informe um link valido.").max(300).optional().or(z.literal("")).default(""),
  brand_tone: optionalText(120, "Tom de voz muito longo.", "profissional"),
  onboarding_completed: z.boolean().optional().default(false)
});

export const generateResponseSchema = z
  .object({
    customerMessage: z
      .string({ required_error: "Digite a mensagem do cliente para gerar uma resposta.", invalid_type_error: "Digite a mensagem do cliente para gerar uma resposta." })
      .trim()
      .min(1, "Digite a mensagem do cliente para gerar uma resposta.")
      .max(1200, "A mensagem esta muito longa. Tente resumir antes de gerar a resposta.")
      .optional(),
    customerQuestion: z
      .string({ invalid_type_error: "Digite a mensagem do cliente para gerar uma resposta." })
      .trim()
      .min(1, "Digite a mensagem do cliente para gerar uma resposta.")
      .max(1200, "A mensagem esta muito longa. Tente resumir antes de gerar a resposta.")
      .optional(),
    responseType: z.enum(responseTypes).optional().default("atendimento")
  })
  .strict()
  .transform((value) => ({
    customerMessage: value.customerMessage || value.customerQuestion || "",
    responseType: value.responseType
  }))
  .refine((value) => Boolean(value.customerMessage), {
    message: "Digite a mensagem do cliente para gerar uma resposta.",
    path: ["customerMessage"]
  });

export const customerSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do cliente.").max(160, "Nome do cliente muito longo."),
  phone: z.string().trim().max(40, "Telefone muito longo.").optional().default(""),
  status: z.enum(customerStatuses),
  notes: z.string().trim().max(1000, "Observacoes muito longas.").optional().default("")
});

export type GenerateResponseInput = z.infer<typeof generateResponseSchema>;
