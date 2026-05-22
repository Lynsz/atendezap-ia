"use client";

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmPayload = Partial<Record<UtmKey, string>>;

export type TrackingEventName =
  | "page_view"
  | "landing_view"
  | "hero_cta_click"
  | "demo_cta_click"
  | "ebook_cta_click"
  | "pricing_cta_click"
  | "plan_compare_view"
  | "faq_open"
  | "objection_section_view"
  | "final_cta_click"
  | "ebook_view"
  | "lead_submit"
  | "lead_success"
  | "lead_error"
  | "thank_you_view"
  | "thank_you_cta_click"
  | "demo_view"
  | "demo_example_click"
  | "demo_generate_click"
  | "demo_response_success"
  | "demo_response_error"
  | "demo_signup_cta_click"
  | "demo_pricing_cta_click"
  | "pricing_view"
  | "checkout_click"
  | "checkout_started"
  | "checkout_error"
  | "signup_started"
  | "signup_completed"
  | "onboarding_started"
  | "onboarding_completed"
  | "subscription_active"
  | "feedback_page_view"
  | "feedback_submit"
  | "feedback_success"
  | "feedback_error"
  | "support_cta_click";

export type TrackingProperties = Record<string, string | number | boolean | null | undefined>;

type GtagCommand = "config" | "event" | "js" | "set" | "consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: GtagCommand, target: string | Date, config?: Record<string, unknown>) => void;
    fbq?: {
      (command: "track" | "trackCustom", eventName: string, properties?: Record<string, unknown>): void;
      (command: "init", pixelId: string): void;
      (command: "consent", value: "grant" | "revoke"): void;
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      push?: Window["fbq"];
      loaded?: boolean;
      version?: string;
    };
  }
}

const UTM_STORAGE_KEY = "atendezap_ia_utm_attribution_v1";
const ATTRIBUTION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const FORBIDDEN_PROPERTY_PATTERN = /(password|senha|card|cartao|token|secret|key|private|question|answer|resposta|mensagem)/i;

type StoredAttribution = UtmPayload & {
  source?: string;
  funnel?: string;
  landing_path?: string;
  stored_at?: string;
};

const metaEventMap: Partial<Record<TrackingEventName, string>> = {
  page_view: "PageView",
  ebook_view: "ViewContent",
  demo_view: "ViewContent",
  lead_success: "Lead",
  demo_response_success: "Lead",
  checkout_started: "InitiateCheckout",
  signup_completed: "CompleteRegistration",
  subscription_active: "Subscribe"
};

const gaEventMap: Partial<Record<TrackingEventName, string>> = {
  checkout_started: "begin_checkout",
  signup_completed: "sign_up",
  subscription_active: "subscribe"
};

function canUseBrowser() {
  return typeof window !== "undefined";
}

function cleanValue(value: string) {
  return value.trim().slice(0, 160);
}

function sanitizeProperties(properties: TrackingProperties = {}) {
  return Object.entries(properties).reduce<Record<string, string | number | boolean>>((accumulator, [key, value]) => {
    if (value === undefined || value === null || FORBIDDEN_PROPERTY_PATTERN.test(key)) return accumulator;
    if (typeof value === "string") {
      const trimmed = cleanValue(value);
      if (trimmed) accumulator[key] = trimmed;
      return accumulator;
    }
    accumulator[key] = value;
    return accumulator;
  }, {});
}

function readStoredAttribution(): StoredAttribution {
  if (!canUseBrowser()) return {};

  try {
    const raw = window.localStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StoredAttribution;
    const storedAt = parsed.stored_at ? new Date(parsed.stored_at).getTime() : 0;
    if (!storedAt || Date.now() - storedAt > ATTRIBUTION_MAX_AGE_MS) {
      window.localStorage.removeItem(UTM_STORAGE_KEY);
      return {};
    }
    return parsed;
  } catch {
    return {};
  }
}

export function getCurrentUtms(): UtmPayload {
  if (!canUseBrowser()) return {};

  const params = new URLSearchParams(window.location.search);
  return UTM_KEYS.reduce<UtmPayload>((accumulator, key) => {
    const value = params.get(key);
    if (value) accumulator[key] = cleanValue(value);
    return accumulator;
  }, {});
}

export function getStoredUtms(): UtmPayload {
  const stored = readStoredAttribution();
  return UTM_KEYS.reduce<UtmPayload>((accumulator, key) => {
    const value = stored[key];
    if (value) accumulator[key] = value;
    return accumulator;
  }, {});
}

export function getAttribution() {
  const currentUtms = getCurrentUtms();
  const stored = readStoredAttribution();
  const utms = { ...getStoredUtms(), ...currentUtms };

  return {
    ...utms,
    source: stored.source || (canUseBrowser() && window.location.pathname.startsWith("/ebook") ? "ebook_page" : undefined),
    funnel: stored.funnel || (canUseBrowser() && window.location.pathname.startsWith("/ebook") ? "ebook" : undefined)
  };
}

export function captureUtmsFromLocation(options?: { source?: string; funnel?: string }) {
  if (!canUseBrowser()) return {};

  const currentUtms = getCurrentUtms();
  const hasNewUtms = Object.keys(currentUtms).length > 0;
  const stored = readStoredAttribution();
  const shouldUpdate = hasNewUtms || options?.source || options?.funnel;

  if (!shouldUpdate) return stored;

  const nextAttribution: StoredAttribution = {
    ...stored,
    ...currentUtms,
    source: options?.source || stored.source,
    funnel: options?.funnel || stored.funnel,
    landing_path: stored.landing_path || `${window.location.pathname}${window.location.search}`,
    stored_at: new Date().toISOString()
  };

  try {
    window.localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(nextAttribution));
  } catch {
    return nextAttribution;
  }

  return nextAttribution;
}

export function trackPageView(path?: string, title?: string) {
  if (!canUseBrowser()) return;

  const pagePath = path || `${window.location.pathname}${window.location.search}`;
  const pageTitle = title || document.title;
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (measurementId && typeof window.gtag === "function") {
    window.gtag("config", measurementId, {
      page_path: pagePath,
      page_title: pageTitle
    });
  }

  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
}

export function trackEvent(eventName: TrackingEventName, properties: TrackingProperties = {}) {
  if (!canUseBrowser()) return;

  const sanitizedProperties = sanitizeProperties({
    ...getAttribution(),
    ...properties
  });

  if (typeof window.gtag === "function") {
    window.gtag("event", gaEventMap[eventName] || eventName, sanitizedProperties);
  }

  if (typeof window.fbq === "function") {
    const metaEventName = metaEventMap[eventName];
    if (metaEventName) {
      window.fbq("track", metaEventName, sanitizedProperties);
    } else {
      window.fbq("trackCustom", eventName, sanitizedProperties);
    }
  }
}
