import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function getSupabaseBrowserEnv() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return { url: supabaseUrl, anonKey: supabaseAnonKey };
}

export function isSupabaseBrowserConfigured() {
  const { url, anonKey } = getSupabaseBrowserEnv();
  return Boolean(url && anonKey);
}

export function getSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseBrowserEnv();

  if (!url || !anonKey) {
    throw new Error("Supabase nao configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
  }

  if (browserClient) return browserClient;

  browserClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  return browserClient;
}
