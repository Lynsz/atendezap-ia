import "server-only";

import { createHash } from "node:crypto";
import { enforceRateLimit } from "@/lib/rate-limit";
import { WhatsAppProviderError, WhatsAppSendError } from "@/lib/server/whatsapp-errors";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export function createWhatsAppContentFingerprint(input: string) {
  return createHash("sha256").update(input.trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR")).digest("hex");
}

export async function enforceWhatsAppSendLimits(input: { request: Request; userId: string; conversationId: string; messageType: "text" | "template" | "media" }) {
  try {
    await enforceRateLimit({ request: input.request, route: "api:whatsapp-send:user", identifier: input.userId, limit: 20, windowMs: 60_000 });
    await enforceRateLimit({ request: input.request, route: "api:whatsapp-send:conversation", identifier: `${input.userId}:${input.conversationId}`, limit: 6, windowMs: 60_000 });
    if (input.messageType === "template") {
      await enforceRateLimit({ request: input.request, route: "api:whatsapp-send:template", identifier: `${input.userId}:${input.conversationId}`, limit: 3, windowMs: 10 * 60_000 });
    }
  } catch {
    throw new WhatsAppSendError("Muitos envios em pouco tempo. Aguarde antes de tentar novamente.", 429, "rate_limit", true);
  }
}

type AttemptInput = {
  userId: string;
  conversationId: string;
  requestKey: string;
  fingerprint: string;
  messageType: "text" | "template" | "media";
  suggestedReplyId?: string;
  templateId?: string;
  mediaId?: string;
};

export async function createWhatsAppSendAttempt(input: AttemptInput) {
  const supabase = getSupabaseAdmin();
  const { data: existing, error: existingError } = await supabase
    .from("whatsapp_send_attempts")
    .select("id,status,whatsapp_message_id,error_type,retryable,attempts")
    .eq("user_id", input.userId)
    .eq("conversation_id", input.conversationId)
    .eq("request_key", input.requestKey)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existing) return { acquired: false, attempt: existing } as const;

  const recentCutoff = new Date(Date.now() - 2 * 60_000).toISOString();
  const { data: recent, error: recentError } = await supabase
    .from("whatsapp_send_attempts")
    .select("id")
    .eq("user_id", input.userId)
    .eq("conversation_id", input.conversationId)
    .eq("content_fingerprint", input.fingerprint)
    .eq("status", "sent")
    .gte("created_at", recentCutoff)
    .limit(1)
    .maybeSingle();
  if (recentError) throw recentError;
  if (recent) throw new WhatsAppSendError("Uma mensagem idêntica já foi enviada há poucos instantes.", 409, "recent_duplicate");

  const { data, error } = await supabase
    .from("whatsapp_send_attempts")
    .insert({
      user_id: input.userId,
      conversation_id: input.conversationId,
      request_key: input.requestKey,
      content_fingerprint: input.fingerprint,
      message_type: input.messageType,
      suggested_reply_id: input.suggestedReplyId || null,
      template_id: input.templateId || null,
      media_id: input.mediaId || null,
      status: "pending"
    })
    .select("id,status,attempts")
    .single();
  if (!error && data) return { acquired: true, attempt: data } as const;
  if ((error as { code?: string } | null)?.code !== "23505") throw error;

  const { data: raced, error: racedError } = await supabase
    .from("whatsapp_send_attempts")
    .select("id,status,whatsapp_message_id,error_type,retryable,attempts")
    .eq("user_id", input.userId)
    .eq("conversation_id", input.conversationId)
    .eq("request_key", input.requestKey)
    .single();
  if (racedError) throw racedError;
  return { acquired: false, attempt: raced } as const;
}

export async function updateWhatsAppSendAttempt(input: {
  attemptId: string;
  status: "sent" | "failed" | "blocked_duplicate" | "blocked_rate_limit" | "blocked_policy";
  whatsappMessageId?: string | null;
  errorType?: string | null;
  retryable?: boolean;
  attempts?: number;
}) {
  const { error } = await getSupabaseAdmin()
    .from("whatsapp_send_attempts")
    .update({
      status: input.status,
      whatsapp_message_id: input.whatsappMessageId || null,
      error_type: input.errorType || null,
      retryable: input.retryable || false,
      ...(input.attempts ? { attempts: input.attempts } : {}),
      updated_at: new Date().toISOString()
    })
    .eq("id", input.attemptId);
  if (error) throw error;
}

export async function sendWithControlledRetry<T>(operation: () => Promise<T>) {
  let attempts = 0;
  while (attempts < 2) {
    attempts += 1;
    try {
      return { value: await operation(), attempts };
    } catch (error) {
      if (!(error instanceof WhatsAppProviderError) || !error.retryable || attempts >= 2) throw Object.assign(error as object, { attempts });
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
  throw new WhatsAppSendError("O envio não pôde ser concluído.", 503, "retry_exhausted", true);
}
