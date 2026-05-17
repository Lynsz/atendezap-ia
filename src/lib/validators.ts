import { z } from "zod";

const requiredText = (label: string, max = 2000) =>
  z
    .string({ required_error: `${label} é obrigatório.` })
    .trim()
    .min(2, `${label} é obrigatório.`)
    .max(max, `${label} está muito longo.`);

export const toneOptions = ["profissional", "simpático", "direto", "elegante", "popular"] as const;

export const kitFormSchema = z.object({
  businessName: requiredText("Nome do negócio", 160),
  niche: requiredText("Nicho", 120),
  city: requiredText("Cidade", 120),
  productsOrServices: requiredText("Produtos ou serviços vendidos"),
  businessHours: requiredText("Horário de atendimento", 300),
  frequentlyAskedQuestions: requiredText("Perguntas frequentes dos clientes"),
  priceRange: requiredText("Faixa de preço ou observação sobre preços", 500),
  paymentMethods: requiredText("Formas de pagamento", 500),
  purchaseProcess: requiredText("Como o cliente agenda ou compra", 700),
  toneOfVoice: z.enum(toneOptions, { required_error: "Escolha um tom de voz." }),
  whatsapp: requiredText("WhatsApp do negócio", 80),
  instagram: z.string().trim().max(120, "Instagram está muito longo.").optional().or(z.literal(""))
});

export const generateKitSchema = z.object({
  token: z.string().trim().min(20, "Token inválido."),
  formData: kitFormSchema
});

export const supportSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido.").max(180),
  message: z.string().trim().min(10, "Descreva sua solicitação.").max(3000)
});

export const ebookLeadSchema = z.object({
  name: requiredText("Nome", 160),
  email: z.string().trim().email("Informe um e-mail válido.").max(180),
  whatsapp: requiredText("WhatsApp", 40),
  source: z.string().trim().max(80).optional().default("ebook_page")
});

export type KitFormData = z.infer<typeof kitFormSchema>;
export type GenerateKitBody = z.infer<typeof generateKitSchema>;
export type EbookLeadBody = z.infer<typeof ebookLeadSchema>;
