import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const hasUsableAnonKey = Boolean(supabaseAnonKey && supabaseAnonKey.length >= 40);
const fallbackSupabaseUrl = "https://supabase-not-configured.invalid";
const fallbackSupabaseAnonKey = "missing-supabase-anon-key-placeholder-0000000000";

export function getSupabasePublicDiagnostic() {
  return {
    hasUrl: Boolean(supabaseUrl),
    url: supabaseUrl ?? "",
    hasAnonKey: Boolean(supabaseAnonKey),
    anonKeyLength: supabaseAnonKey?.length ?? 0
  };
}

export const supabaseEnv = getSupabasePublicDiagnostic();

if (typeof window !== "undefined") {
  console.info("[Supabase diagnostic]", supabaseEnv);
}

export const supabase = createClient(supabaseUrl || fallbackSupabaseUrl, supabaseAnonKey || fallbackSupabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export function isSupabaseBrowserConfigured() {
  return Boolean(supabaseUrl && hasUsableAnonKey);
}
