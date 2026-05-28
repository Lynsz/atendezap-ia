import { z } from "zod";

export const dataRequestTypes = ["export", "deletion"] as const;
export const dataRequestStatuses = ["pending", "processing", "completed", "rejected"] as const;

export type DataRequestType = (typeof dataRequestTypes)[number];
export type DataRequestStatus = (typeof dataRequestStatuses)[number];

export const createDataRequestSchema = z
  .object({
    type: z.enum(dataRequestTypes, { errorMap: () => ({ message: "Tipo de solicitacao invalido." }) })
  })
  .strict();

export const updateDataRequestSchema = z
  .object({
    status: z.enum(dataRequestStatuses, { errorMap: () => ({ message: "Status de solicitacao invalido." }) }),
    notes: z.string().trim().max(1000, "Nota muito longa. Use ate 1000 caracteres.").optional().nullable()
  })
  .strict();

export function getDataRequestTypeLabel(type: DataRequestType | string) {
  if (type === "export") return "Exportacao";
  if (type === "deletion") return "Exclusao";
  return type;
}

export function getDataRequestStatusLabel(status: DataRequestStatus | string) {
  if (status === "pending") return "Pendente";
  if (status === "processing") return "Em processamento";
  if (status === "completed") return "Concluida";
  if (status === "rejected") return "Rejeitada";
  return status;
}
