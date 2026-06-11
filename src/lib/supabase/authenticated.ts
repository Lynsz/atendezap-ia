import { createClient } from "@supabase/supabase-js";
import { AppError } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { ENV_ERROR_MESSAGES, requireSupabasePublicEnv } from "@/lib/server/env";

export async function getAuthenticatedSupabase(request: Request, route: string) {
  let supabaseEnv: ReturnType<typeof requireSupabasePublicEnv>;

  try {
    supabaseEnv = requireSupabasePublicEnv();
  } catch {
    serverLog({ level: "error", event: "authenticated_supabase_missing_config", route });
    throw new AppError(ENV_ERROR_MESSAGES.supabase, 500);
  }

  const authorization = request.headers.get("authorization");
  if (!authorization) {
    throw new AppError("Voce precisa estar logado para gerar respostas.", 401);
  }

  const supabase = createClient(supabaseEnv.url, supabaseEnv.anonKey, {
    global: {
      headers: {
        Authorization: authorization
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AppError("Voce precisa estar logado para gerar respostas.", 401);
  }

  return { supabase, user };
}
