type LogLevel = "info" | "warn" | "error";

type ServerLogInput = {
  level?: LogLevel;
  event: string;
  route?: string;
  userId?: string | null;
  status?: string | number;
  error?: unknown;
  metadata?: Record<string, unknown>;
};

const SENSITIVE_KEY_PATTERN = /(token|secret|password|authorization|cookie|card|key|api_key|service_role)/i;

function sanitizeMetadata(metadata?: Record<string, unknown>) {
  if (!metadata) return undefined;

  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => {
      if (SENSITIVE_KEY_PATTERN.test(key)) return [key, "[redacted]"];
      if (typeof value === "string") return [key, value.slice(0, 180)];
      if (typeof value === "number" || typeof value === "boolean" || value === null) return [key, value];
      return [key, "[omitted]"];
    })
  );
}

function summarizeError(error: unknown) {
  if (!error) return undefined;
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message.slice(0, 240)
    };
  }
  return { message: String(error).slice(0, 240) };
}

export function serverLog({ level = "info", event, route, userId, status, error, metadata }: ServerLogInput) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    route,
    user_id: userId || undefined,
    status,
    error: summarizeError(error),
    metadata: sanitizeMetadata(metadata)
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(entry));
    return;
  }

  console.info(JSON.stringify(entry));
}
