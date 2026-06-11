import "server-only";

import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAdminEnv } from "@/lib/server/env";

export function getSupabaseAdmin() {
  const { url, serviceKey } = requireSupabaseAdminEnv();

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
