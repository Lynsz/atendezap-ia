import { ZodError } from "zod";

export class AppError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AppError";
    this.status = status;
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof AppError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof ZodError) {
    return Response.json(
      {
        error: "Dados inválidos. Revise as informações preenchidas e tente novamente.",
        details: error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  console.error("Erro inesperado:", error instanceof Error ? error.message : "unknown");
  return Response.json({ error: "Não foi possível concluir a solicitação. Tente novamente em instantes." }, { status: 500 });
}
