import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const hasUsableAnonKey = Boolean(supabaseAnonKey && supabaseAnonKey.length >= 40);

if (typeof window !== "undefined") {
  console.info("[Supabase diagnostic]", {
    hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length ?? 0
  });
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
