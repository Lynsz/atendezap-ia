import { z } from "zod";

export const supportCategories = ["problema tecnico", "duvida sobre assinatura", "duvida sobre IA", "sugestao", "outro"] as const;
export const legacySupportCategories = ["Duvida", "Bug", "Assinatura", "Cobranca", "Geracao de resposta", "Conta/Login", "Sugestao", "Outro"] as const;
const acceptedSupportCategories = [...supportCategories, ...legacySupportCategories] as const;
export const supportStatuses = ["pending", "in_progress", "resolved", "rejected"] as const;
export const supportPriorities = ["low", "medium", "high"] as const;

export type SupportCategory = (typeof supportCategories)[number];
export type AcceptedSupportCategory = (typeof acceptedSupportCategories)[number];
export type SupportStatus = (typeof supportStatuses)[number];
export type SupportPriority = (typeof supportPriorities)[number];

export const createSupportRequestSchema = z
  .object({
    email: z.string().trim().email("Informe um e-mail valido.").max(180, "E-mail muito longo.").optional().or(z.literal("")).default(""),
    category: z.enum(acceptedSupportCategories, { errorMap: () => ({ message: "Categoria invalida." }) }),
    subject: z.string().trim().min(3, "Informe um assunto.").max(140, "Assunto muito longo."),
    message: z.string().trim().min(10, "Descreva sua solicitacao.").max(3000, "Mensagem muito longa. Use ate 3000 caracteres."),
    source: z.string().trim().max(80).optional().default("support_form")
  })
  .strict();

export const updateSupportRequestSchema = z
  .object({
    status: z.enum(supportStatuses, { errorMap: () => ({ message: "Status invalido." }) }).optional(),
    priority: z.enum(supportPriorities, { errorMap: () => ({ message: "Prioridade invalida." }) }).optional(),
    admin_notes: z.string().trim().max(1000, "Nota muito longa. Use ate 1000 caracteres.").optional().nullable()
  })
  .strict()
  .refine((value) => value.status || value.priority || Object.prototype.hasOwnProperty.call(value, "admin_notes"), {
    message: "Informe ao menos um campo para atualizar."
  });

export function supportStatusLabel(status: SupportStatus | string) {
  if (status === "pending") return "Pendente";
  if (status === "in_progress") return "Em andamento";
  if (status === "resolved") return "Resolvido";
  if (status === "rejected") return "Rejeitado";
  return status;
}

export function supportPriorityLabel(priority: SupportPriority | string) {
  if (priority === "low") return "Baixa";
  if (priority === "medium") return "Media";
  if (priority === "high") return "Alta";
  return priority;
}

export function inferSupportPriority(category: AcceptedSupportCategory): SupportPriority {
  if (["duvida sobre assinatura", "duvida sobre IA", "Assinatura", "Cobranca", "Geracao de resposta", "Conta/Login"].includes(category)) return "high";
  if (["problema tecnico", "Bug", "Duvida"].includes(category)) return "medium";
  return "low";
}
