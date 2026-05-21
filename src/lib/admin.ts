import "server-only";

import { AppError } from "@/lib/errors";
import { getAdminEmailsFromEnv, isAdminEmailAllowed } from "@/lib/auth/admin-emails";
import { requireUser } from "@/lib/auth/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export function getAdminEmails() {
  return getAdminEmailsFromEnv();
}

export function isAdminEmail(email?: string | null) {
  return isAdminEmailAllowed(email);
}

export async function requireAdmin(request: Request) {
  const user = await requireUser(request);

  if (!isAdminEmail(user.email)) {
    throw new AppError("Acesso restrito a administradores.", 403);
  }

  return {
    user,
    supabase: getSupabaseAdmin()
  };
}
