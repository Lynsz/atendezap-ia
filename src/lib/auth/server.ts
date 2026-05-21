import "server-only";

import { createClient, type User } from "@supabase/supabase-js";
import { AppError } from "@/lib/errors";

export function createSupabaseAuthClient(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const authorization = request.headers.get("authorization");

  if (!url || !anonKey) {
    throw new AppError("Supabase não configurado no servidor.", 500);
  }

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
