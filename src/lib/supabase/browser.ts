import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const hasUsableAnonKey = Boolean(supabaseAnonKey && supabaseAnonKey.length >= 40);
const fallbackSupabaseUrl = "https://supabase-not-configured.invalid";
const fallbackSupabaseAnonKey = "missing-supabase-anon-key-placeholder-0000000000";

export function getSupabasePublicDiagnostic() {
  return {
    hasUrl: Boolean(supabaseUrl),
    hasAnonKey: Boolean(supabaseAnonKey)
  };
}

export const supabaseEnv = getSupabasePublicDiagnostic();

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
