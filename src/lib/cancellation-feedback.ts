import { z } from "zod";

export const cancellationFeedbackReasons = [
  "preco",
  "nao_entendi_produto",
  "usei_pouco",
  "respostas_nao_foram_boas",
  "faltou_integracao_whatsapp",
  "encontrei_outra_solucao",
  "problema_tecnico",
  "outro"
] as const;

export type CancellationFeedbackReason = (typeof cancellationFeedbackReasons)[number];

export const cancellationFeedbackReasonLabels: Record<CancellationFeedbackReason, string> = {
  preco: "Preço",
  nao_entendi_produto: "Não entendi o produto",
  usei_pouco: "Usei pouco",
  respostas_nao_foram_boas: "Respostas não foram boas",
  faltou_integracao_whatsapp: "Faltou integração com WhatsApp",
  encontrei_outra_solucao: "Encontrei outra solução",
  problema_tecnico: "Problema técnico",
  outro: "Outro"
};

export const createCancellationFeedbackSchema = z.object({
  subscriptionId: z.string().uuid().optional().nullable(),
  reason: z.enum(cancellationFeedbackReasons, {
    errorMap: () => ({ message: "Selecione um motivo valido." })
  }),
  comment: z.string().trim().max(500, "Use no maximo 500 caracteres.").optional().nullable()
}).strict();
