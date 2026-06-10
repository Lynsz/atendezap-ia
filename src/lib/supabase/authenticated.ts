import { createClient } from "@supabase/supabase-js";
import { AppError } from "@/lib/errors";
import { serverLog } from "@/lib/logger";

export async function getAuthenticatedSupabase(request: Request, route: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    serverLog({ level: "error", event: "authenticated_supabase_missing_config", route });
    throw new AppError("Supabase nao configurado no servidor. Revise as variaveis de ambiente.", 500);
  }

  const authorization = request.headers.get("authorization");
  if (!authorization) {
    throw new AppError("Voce precisa estar logado para gerar respostas.", 401);
  }

  const supabase = createClient(url, anonKey, {
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
