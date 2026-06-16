import { AppError } from "@/lib/errors";

export const ENV_ERROR_MESSAGES = {
  openai: "A geracao de IA nao esta configurada neste ambiente.",
  stripe: "Stripe ainda não está configurado neste ambiente.",
  supabase: "Supabase não está configurado corretamente."
} as const;

export const BASIC_ENV_NAMES = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_APP_URL"
] as const;

export const OPENAI_ENV_NAMES = ["OPENAI_API_KEY"] as const;

export const STRIPE_ENV_NAMES = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_PRICE_STARTER",
  "STRIPE_PRICE_PRO",
  "STRIPE_PRICE_PREMIUM"
] as const;

type EnvName = (typeof BASIC_ENV_NAMES | typeof OPENAI_ENV_NAMES | typeof STRIPE_ENV_NAMES)[number] | "SUPABASE_SERVICE_ROLE_KEY";

export function readServerEnv(name: EnvName) {
  return process.env[name]?.trim() || "";
}

function missingEnv(names: readonly EnvName[]) {
  return names.filter((name) => !readServerEnv(name));
}

export function getServerEnvStatus() {
  return {
    basic: missingEnv(BASIC_ENV_NAMES),
    openai: missingEnv(OPENAI_ENV_NAMES),
    stripe: missingEnv(STRIPE_ENV_NAMES),
    supabaseAdmin: missingEnv(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"])
  };
}

export function requireSupabasePublicEnv() {
  const url = readServerEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = readServerEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    throw new AppError(ENV_ERROR_MESSAGES.supabase, 500);
  }

  return { url, anonKey };
}

export function requireSupabaseAdminEnv() {
  const url = readServerEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = readServerEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceKey) {
    throw new AppError(ENV_ERROR_MESSAGES.supabase, 500);
  }

  return { url, serviceKey };
}

export function requireOpenAiEnv() {
  const apiKey = readServerEnv("OPENAI_API_KEY");

  if (!apiKey) {
    throw new AppError(ENV_ERROR_MESSAGES.openai, 500);
  }

  return { apiKey };
}

export function requireStripeSecretKey() {
  const secretKey = readServerEnv("STRIPE_SECRET_KEY");

  if (!secretKey) {
    throw new AppError(ENV_ERROR_MESSAGES.stripe, 503);
  }

  return secretKey;
}

export function requireStripeWebhookSecret() {
  const webhookSecret = readServerEnv("STRIPE_WEBHOOK_SECRET");

  if (!webhookSecret) {
    throw new AppError(ENV_ERROR_MESSAGES.stripe, 503);
  }

  return webhookSecret;
}

export function requireStripePriceId(priceId: string | null | undefined) {
  const normalizedPriceId = priceId?.trim();

  if (!normalizedPriceId) {
    throw new AppError(ENV_ERROR_MESSAGES.stripe, 503);
  }

  return normalizedPriceId;
}
