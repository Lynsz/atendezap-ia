import "server-only";

import { createClient } from "@supabase/supabase-js";
import { AppError } from "@/lib/errors";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}

export async function requireAdmin(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    throw new AppError("Sessão não encontrada.", 401);
  }

  if (!url || !anonKey) {
    throw new AppError("Supabase não configurado no servidor.", 500);
  }

  const authClient = createClient(url, anonKey, {
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
  } = await authClient.auth.getUser();

  if (error || !user) {
    throw new AppError("Sessão inválida.", 401);
  }

  if (!isAdminEmail(user.email)) {
    throw new AppError("Acesso restrito a administradores.", 403);
  }

  return {
    user,
    supabase: getSupabaseAdmin()
  };
}
