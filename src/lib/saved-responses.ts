import { z } from "zod";

export const savedResponseCategories = [
  "geral",
  "Preco",
  "Agendamento",
  "Entrega",
  "Pagamento",
  "Horario",
  "Informacoes gerais",
  "Pos-venda",
  "Orcamento",
  "Confirmacao",
  "Cancelamento",
  "Outro"
] as const;

export type SavedResponseCategory = (typeof savedResponseCategories)[number];

export const savedResponseSources = ["ai", "ai_generated", "template", "manual"] as const;

export type SavedResponseSource = (typeof savedResponseSources)[number];

const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .optional()
    .transform((value) => value || undefined);

const editableText = (max: number, emptyMessage: string, maxMessage: string) =>
  z.string().trim().min(1, emptyMessage).max(max, maxMessage).optional();

export const savedResponseCategorySchema = z.string().trim().min(1, "Escolha uma categoria valida.").max(80, "Categoria muito longa. Use ate 80 caracteres.");

export const savedResponseSourceSchema = z.enum(savedResponseSources, {
  errorMap: () => ({ message: "Escolha uma origem valida." })
});

export const createSavedResponseSchema = z
  .object({
    response_id: z.string().uuid("Resposta original invalida.").optional(),
    source_template_id: optionalText(120, "Template invalido."),
    source: savedResponseSourceSchema.optional(),
    title: optionalText(120, "Titulo muito longo. Use ate 120 caracteres."),
    content: optionalText(5000, "Resposta muito longa. Use ate 5000 caracteres."),
    category: savedResponseCategorySchema.optional()
  })
  .strict()
  .refine((value) => Boolean(value.response_id || value.content), {
    message: "Informe uma resposta gerada ou o conteudo para salvar.",
    path: ["content"]
  });

export const updateSavedResponseSchema = z
  .object({
    title: editableText(120, "Informe o titulo da resposta salva.", "Titulo muito longo. Use ate 120 caracteres.").nullable(),
    content: editableText(5000, "Informe o conteudo da resposta salva.", "Resposta muito longa. Use ate 5000 caracteres."),
    category: savedResponseCategorySchema.optional().nullable(),
    is_favorite: z.boolean().optional(),
    copy_count_action: z.literal("increment").optional()
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Informe pelo menos um campo para atualizar."
  });

export function normalizeSavedResponseCategory(category?: string | null) {
  if (!category) return null;
  return category.trim().slice(0, 80) || null;
}

export function inferSavedResponseSource(input: { response_id?: string | null; source_template_id?: string | null; source?: SavedResponseSource }) {
  if (input.source === "ai_generated") return "ai";
  if (input.source) return input.source;
  if (input.source_template_id) return "template";
  if (input.response_id) return "ai";
  return "manual";
}
