import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/browser";

function isSafeInternalPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//");
}

export async function getPostAuthRedirect(user: User, preferredPath = "/dashboard") {
  const safePreferredPath = isSafeInternalPath(preferredPath) && !preferredPath.startsWith("/login") && !preferredPath.startsWith("/cadastro") ? preferredPath : "/dashboard";

  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, business_name, business_type")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data?.business_name || !data?.business_type) {
    return "/onboarding";
  }

  return safePreferredPath === "/onboarding" ? "/dashboard" : safePreferredPath;
}
