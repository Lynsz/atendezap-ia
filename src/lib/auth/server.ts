import "server-only";

import { createClient, type User } from "@supabase/supabase-js";
import { AppError } from "@/lib/errors";
import { requireSupabasePublicEnv } from "@/lib/server/env";

export function createSupabaseAuthClient(request: Request) {
  const { url, anonKey } = requireSupabasePublicEnv();
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    throw new AppError("Sessão não encontrada. Faça login novamente.", 401);
  }

  return createClient(url, anonKey, {
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
}

export async function requireUser(request: Request): Promise<User> {
  const supabase = createSupabaseAuthClient(request);
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AppError("Sessão inválida. Faça login novamente.", 401);
  }

  return user;
}
