import "server-only";

import { AppError } from "@/lib/errors";

type MetaErrorBody = { error?: { code?: number; error_subcode?: number; type?: string } } | null;
const retryableCodes = new Set([1, 2, 4, 17, 32, 613, 131000, 131016]);

export class WhatsAppProviderError extends AppError {
  errorType: string;
  retryable: boolean;

  constructor(message: string, status: number, errorType: string, retryable: boolean) {
    super(message, status);
    this.name = "WhatsAppProviderError";
    this.errorType = errorType;
    this.retryable = retryable;
  }
}

export class WhatsAppSendError extends AppError {
  errorType: string;
  retryable: boolean;

  constructor(message: string, status: number, errorType: string, retryable = false) {
    super(message, status);
    this.name = "WhatsAppSendError";
    this.errorType = errorType;
    this.retryable = retryable;
  }
}

export function normalizeWhatsAppProviderError(status: number, body: MetaErrorBody) {
  const code = body?.error?.code;
  const retryable = status === 429 || status >= 500 || (typeof code === "number" && retryableCodes.has(code));
  if (retryable) {
    return new WhatsAppProviderError(
      "O WhatsApp está temporariamente indisponível. Tente novamente em instantes.",
      503,
      status === 429 || code === 4 || code === 613 ? "provider_rate_limited" : "provider_transient",
      true
    );
  }
  if (status === 401 || status === 403 || code === 190) {
    return new WhatsAppProviderError("A conexão com o WhatsApp precisa ser revisada antes de novos envios.", 409, "provider_authentication", false);
  }
  if (code === 131026) {
    return new WhatsAppProviderError("O WhatsApp não conseguiu entregar a mensagem a este contato.", 422, "recipient_unavailable", false);
  }
  if (code === 132001 || code === 132015 || code === 132016) {
    return new WhatsAppProviderError("O template não está aprovado ou disponível para este envio.", 409, "template_not_available", false);
  }
  return new WhatsAppProviderError("O WhatsApp não aceitou o envio. Revise a conexão e tente novamente.", 502, "provider_rejected", false);
}

export function toWhatsAppProviderError(error: unknown) {
  if (error instanceof WhatsAppProviderError) return error;
  return new WhatsAppProviderError("Não foi possível acessar o WhatsApp agora. Tente novamente em instantes.", 503, "provider_network", true);
}
