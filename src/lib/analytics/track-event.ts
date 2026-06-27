export const safeAppEventNames = [
  "signup_completed",
  "onboarding_completed",
  "dashboard_viewed",
  "first_response_generated",
  "response_copied",
  "response_saved",
  "template_copied",
  "template_saved",
  "library_viewed",
  "pricing_viewed",
  "checkout_started",
  "usage_limit_reached",
  "support_request_created",
  "ai_feedback_submitted",
  "beta_signup_completed",
  "beta_onboarding_completed",
  "beta_first_response_generated",
  "beta_response_copied",
  "beta_response_saved",
  "beta_template_used",
  "beta_pricing_viewed",
  "beta_feedback_submitted",
  "beta_support_request_created",
  "small_launch_signup_completed",
  "small_launch_onboarding_completed",
  "small_launch_first_response_generated",
  "small_launch_response_copied",
  "small_launch_response_saved",
  "small_launch_template_used",
  "small_launch_pricing_viewed",
  "small_launch_checkout_started",
  "small_launch_feedback_submitted",
  "small_launch_support_request_created",
  "small_launch_usage_limit_reached",
  "post_mvp_signup_completed",
  "post_mvp_onboarding_completed",
  "post_mvp_first_response_generated",
  "post_mvp_response_copied",
  "post_mvp_response_saved",
  "post_mvp_template_used",
  "post_mvp_pricing_viewed",
  "post_mvp_checkout_started",
  "post_mvp_feedback_submitted",
  "post_mvp_support_request_created",
  "post_mvp_usage_limit_reached",
  "post_mvp_error_occurred"
] as const;

export type SafeAppEventName = (typeof safeAppEventNames)[number];

export type SafeAppEventInput = {
  event_name: string;
  page?: string | null;
  source?: string | null;
  plan?: string | null;
  business_type?: string | null;
  metadata?: Record<string, unknown>;
};

const eventAliasMap: Record<string, SafeAppEventName> = {
  activation_response_copied: "response_copied",
  saved_response_copy: "response_copied",
  template_copy: "template_copied",
  template_save: "template_saved",
  activation_template_saved: "template_saved",
  saved_response_create: "response_saved",
  saved_response_create_manual: "response_saved",
  activation_response_saved: "response_saved",
  saved_responses_view: "library_viewed",
  pricing_page_view: "pricing_viewed",
  pricing_view: "pricing_viewed",
  activation_pricing_viewed: "pricing_viewed"
};

const allowedMetadataKeys = new Set([
  "plan",
  "business_type",
  "source",
  "page",
  "category",
  "template_niche",
  "response_length_range",
  "usage_count",
  "usage_limit",
  "error_type"
]);

const forbiddenKeyPattern = /(email|mail|phone|telefone|whatsapp|nome|name|message|mensagem|question|pergunta|answer|resposta|generated|content|conteudo|token|secret|key|password|senha|card|cartao|payment|pagamento|stripe|checkout_session|customer|subscription)/i;
const emailValuePattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const longDigitPattern = /\d{8,}/;

function normalizeEventName(eventName: string): SafeAppEventName | null {
  if ((safeAppEventNames as readonly string[]).includes(eventName)) return eventName as SafeAppEventName;
  return eventAliasMap[eventName] || null;
}

function normalizeKey(key: string) {
  if (key === "businessType") return "business_type";
  if (key === "templateNiche") return "template_niche";
  if (key === "responseLengthRange") return "response_length_range";
  if (key === "usageCount" || key === "used") return "usage_count";
  if (key === "usageLimit" || key === "limit") return "usage_limit";
  return key;
}

function cleanString(value: string) {
  return value.trim().slice(0, 120);
}

function isSafePrimitive(value: unknown): value is string | number | boolean {
  if (typeof value === "string") {
    const cleaned = cleanString(value);
    return Boolean(cleaned) && !emailValuePattern.test(cleaned) && !longDigitPattern.test(cleaned);
  }
  return typeof value === "number" || typeof value === "boolean";
}

function sanitizeMetadata(metadata: Record<string, unknown> = {}) {
  return Object.entries(metadata).reduce<Record<string, string | number | boolean>>((accumulator, [rawKey, value]) => {
    const key = normalizeKey(rawKey);
    if (!allowedMetadataKeys.has(key) || forbiddenKeyPattern.test(rawKey) || !isSafePrimitive(value)) return accumulator;
    accumulator[key] = typeof value === "string" ? cleanString(value) : value;
    return accumulator;
  }, {});
}

export function sanitizeAppEvent(input: SafeAppEventInput) {
  const eventName = normalizeEventName(input.event_name);
  if (!eventName) return null;

  const metadata = sanitizeMetadata({
    ...input.metadata,
    plan: input.plan ?? input.metadata?.plan,
    business_type: input.business_type ?? input.metadata?.business_type ?? input.metadata?.businessType,
    source: input.source ?? input.metadata?.source,
    page: input.page ?? input.metadata?.page
  });

  return {
    event_name: eventName,
    page: typeof metadata.page === "string" ? metadata.page : input.page || null,
    source: typeof metadata.source === "string" ? metadata.source : input.source || null,
    plan: typeof metadata.plan === "string" ? metadata.plan : input.plan || null,
    business_type: typeof metadata.business_type === "string" ? metadata.business_type : input.business_type || null,
    metadata
  };
}

export function trackSafeAppEvent(input: SafeAppEventInput) {
  if (typeof window === "undefined") return;

  const event = sanitizeAppEvent({
    ...input,
    page: input.page || window.location.pathname
  });
  if (!event) return;

  const body = JSON.stringify(event);
  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/events", blob)) return;
    }
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    }).catch(() => undefined);
  } catch {
    // Tracking must never block the product flow.
  }
}
