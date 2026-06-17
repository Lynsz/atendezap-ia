import { sanitizeLogMetadata, serverLog } from "@/lib/logger";

const FORBIDDEN_EVENT_METADATA_KEY_PATTERN =
  /(email|mail|phone|telefone|whatsapp|nome|name|message|mensagem|question|pergunta|answer|resposta|generated|content|conteudo|token|secret|key|password|senha|card|cartao|payment|pagamento|stripe|checkout_session|customer|subscription|payload|body)/i;

function sanitizeEventMetadata(metadata?: Record<string, unknown>) {
  const sanitized = sanitizeLogMetadata(metadata);
  if (!sanitized) return {};

  return Object.fromEntries(
    Object.entries(sanitized).filter(([key, value]) => {
      if (FORBIDDEN_EVENT_METADATA_KEY_PATTERN.test(key)) return false;
      if (typeof value === "string" && value.includes("[redacted]")) return false;
      return true;
    })
  );
}

export async function logEvent(eventName: string, metadata?: Record<string, unknown>) {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase/server");
    const supabase = getSupabaseAdmin();
    await supabase.from("events").insert({
      event_name: eventName,
      metadata: sanitizeEventMetadata(metadata)
    });
  } catch (error) {
    serverLog({
      level: "warn",
      event: "internal_event_log_failed",
      route: "src/lib/events",
      error,
      metadata: { event_name: eventName }
    });
  }
}
