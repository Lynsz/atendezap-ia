import { AUTH_HINT_COOKIE } from "@/lib/auth/routes";

const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

export function writeAuthSessionHint(isAuthenticated: boolean) {
  if (typeof document === "undefined") return;

  if (isAuthenticated) {
    document.cookie = `${AUTH_HINT_COOKIE}=1; Path=/; Max-Age=${ONE_WEEK_SECONDS}; SameSite=Lax`;
    return;
  }

  document.cookie = `${AUTH_HINT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
