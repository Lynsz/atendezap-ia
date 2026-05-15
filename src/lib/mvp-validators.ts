import { z } from "zod";

export const responseTypes = ["atendimento", "venda", "orcamento", "cliente_indeciso", "pos_venda", "recuperacao"] as const;

export const customerStatuses = ["novo", "em_atendimento", "orcamento_enviado", "aguardando_resposta", "venda_concluida", "perdido"] as const;

export const businessSchema = z.object({
  business_name: z.string().trim().min(2, "Informe o nome do negocio."),
  business_area: z.string().trim().optional().default(""),
  description: z.string().trim().optional().default(""),
  products_services: z.string().trim().optional().default(""),
  prices: z.string().trim().optional().default(""),
  opening_hours: z.string().trim().optional().default(""),
  address: z.string().trim().optional().default(""),
  payment_methods: z.string().trim().optional().default(""),
  booking_or_payment_link: z.string().trim().optional().default(""),
  brand_tone: z.string().trim().optional().default("profissional")
});

export const generateResponseSchema = z.object({
  customerQuestion: z.string().trim().min(3, "Cole a pergunta do cliente."),
  responseType: z.enum(responseTypes),
  businessData: businessSchema.extend({
    id: z.string().uuid().optional()
  }),
  businessId: z.string().uuid().optional()
});

export const customerSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do cliente."),
  phone: z.string().trim().optional().default(""),
  status: z.enum(customerStatuses),
  notes: z.string().trim().optional().default("")
});

export type GenerateResponseInput = z.infer<typeof generateResponseSchema>;
