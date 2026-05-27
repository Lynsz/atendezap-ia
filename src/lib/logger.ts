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

const SENSITIVE_KEY_PATTERN = /(token|secret|password|authorization|cookie|card|key|api_key|service_role|private)/i;
const CONTENT_KEY_PATTERN = /(content|message|prompt|answer|question|response|payload|body|html|text)/i;
const EMAIL_KEY_PATTERN = /email/i;
const EMAIL_VALUE_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function maskEmail(value: string) {
  const [local, domain] = value.split("@");
  if (!local || !domain) return "[email]";
  return `${local.slice(0, 2)}***@${domain}`;
}

function maskUserId(userId?: string | null) {
  if (!userId) return undefined;
  if (userId.length <= 12) return `${userId.slice(0, 4)}...`;
  return `${userId.slice(0, 8)}...${userId.slice(-4)}`;
}

function sanitizeString(key: string, value: string) {
  if (SENSITIVE_KEY_PATTERN.test(key)) return "[redacted]";
  if (CONTENT_KEY_PATTERN.test(key)) return `[omitted:${value.length}]`;
  if (EMAIL_KEY_PATTERN.test(key) || EMAIL_VALUE_PATTERN.test(value)) return maskEmail(value);
  return value.slice(0, 160);
}

export function sanitizeLogMetadata(metadata?: Record<string, unknown>) {
  if (!metadata) return undefined;

  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => {
      if (SENSITIVE_KEY_PATTERN.test(key)) return [key, "[redacted]"];
      if (typeof value === "string") return [key, sanitizeString(key, value)];
      if (typeof value === "number" || typeof value === "boolean" || value === null) return [key, value];
      if (Array.isArray(value)) return [key, `[array:${value.length}]`];
      return [key, "[omitted]"];
    })
  );
}

function summarizeError(error: unknown) {
  if (!error) return undefined;
  if (error instanceof Error) {
    return {
      name: error.name,
      message: sanitizeString("error_message", error.message).slice(0, 200)
    };
  }
  return { message: sanitizeString("error_message", String(error)).slice(0, 200) };
}

export function serverLog({ level = "info", event, route, userId, status, error, metadata }: ServerLogInput) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    route,
    user_id: maskUserId(userId),
    status,
    error: summarizeError(error),
    metadata: sanitizeLogMetadata(metadata)
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
