import { z } from "zod";

const requiredText = (label: string, max = 2000) =>
  z
    .string({ required_error: `${label} e obrigatorio.` })
    .trim()
    .min(2, `${label} e obrigatorio.`)
    .max(max, `${label} esta muito longo.`);

export const toneOptions = ["profissional", "simpático", "direto", "elegante", "popular"] as const;

export const kitFormSchema = z.object({
  businessName: requiredText("Nome do negocio", 160),
  niche: requiredText("Nicho", 120),
  city: requiredText("Cidade", 120),
  productsOrServices: requiredText("Produtos ou servicos vendidos"),
  businessHours: requiredText("Horario de atendimento", 300),
  frequentlyAskedQuestions: requiredText("Perguntas frequentes dos clientes"),
  priceRange: requiredText("Faixa de preco ou observacao sobre precos", 500),
  paymentMethods: requiredText("Formas de pagamento", 500),
  purchaseProcess: requiredText("Como o cliente agenda ou compra", 700),
  toneOfVoice: z.enum(toneOptions, { required_error: "Escolha um tom de voz." }),
  whatsapp: requiredText("WhatsApp do negocio", 80),
  instagram: z.string().trim().max(120, "Instagram esta muito longo.").optional().or(z.literal(""))
});

export const generateKitSchema = z.object({
  token: z.string().trim().min(20, "Token invalido."),
  formData: kitFormSchema
});

export const supportSchema = z.object({
  email: z.string().trim().email("Informe um e-mail valido.").max(180),
  message: z.string().trim().min(10, "Descreva sua solicitacao.").max(3000)
});

export const ebookLeadSchema = z.object({
  name: requiredText("Nome", 160),
  email: z.string().trim().email("Informe um e-mail valido.").max(180),
  whatsapp: z.string().trim().max(40, "WhatsApp esta muito longo.").optional().default(""),
  business_type: z.string().trim().min(2, "Escolha o tipo de atuacao.").max(80).default("Autonomo"),
  source: z.string().trim().max(80).optional().default("ebook_page"),
  utm_source: z.string().trim().max(160).optional().default(""),
  utm_medium: z.string().trim().max(160).optional().default(""),
  utm_campaign: z.string().trim().max(160).optional().default(""),
  utm_content: z.string().trim().max(160).optional().default(""),
  utm_term: z.string().trim().max(160).optional().default("")
});

export type KitFormData = z.infer<typeof kitFormSchema>;
export type GenerateKitBody = z.infer<typeof generateKitSchema>;
export type EbookLeadBody = z.infer<typeof ebookLeadSchema>;
