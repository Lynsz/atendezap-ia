import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const hasUsableAnonKey = Boolean(supabaseAnonKey && supabaseAnonKey.length >= 40);

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

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurada.");
}

if (!supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export function isSupabaseBrowserConfigured() {
  return Boolean(supabaseUrl && hasUsableAnonKey);
}
