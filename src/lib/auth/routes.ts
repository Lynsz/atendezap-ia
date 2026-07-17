export const AUTH_HINT_COOKIE = "atendezap_auth_hint";

const PUBLIC_PAGE_ROUTES = new Set([
  "/",
  "/acesso",
  "/cadastro",
  "/demo",
  "/ebook",
  "/ebook/guia",
  "/ebook/obrigado",
  "/feedback",
  "/login",
  "/obrigado",
  "/plans",
  "/precos",
  "/privacidade",
  "/suporte",
  "/termos"
]);

const PUBLIC_PAGE_PREFIXES = ["/gerar/", "/kit/"];

const PUBLIC_API_ROUTES = new Set([
  "/api/health",
  "/api/demo/generate-response",
  "/api/ebook-lead",
  "/api/feedback",
  "/api/kiwify/webhook",
  "/api/whatsapp/webhook",
  "/api/stripe/webhook",
  "/api/support"
]);

const PUBLIC_API_PREFIXES = ["/api/download/"];

const PRIVATE_PAGE_PREFIXES = [
  "/app",
  "/assinatura",
  "/atendezap",
  "/automacoes",
  "/base-conhecimento",
  "/biblioteca",
  "/configuracoes",
  "/dashboard",
  "/debug/supabase",
  "/integracoes",
  "/leads",
  "/onboarding",
  "/scripts",
  "/sistema/backend"
];

const PRIVATE_API_PREFIXES = ["/api/ai", "/api/generate-response", "/api/saved-responses", "/api/stripe/create-checkout-session", "/api/stripe/create-portal-session", "/api/whatsapp"];

const ADMIN_PREFIXES = ["/admin", "/api/admin"];

export function isStaticAssetPath(pathname: string) {
  return pathname.startsWith("/_next") || pathname === "/favicon.ico" || /\.[a-z0-9]+$/i.test(pathname);
}

export function isAdminRoute(pathname: string) {
  return ADMIN_PREFIXES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function isPublicRoute(pathname: string) {
  if (PUBLIC_PAGE_ROUTES.has(pathname) || PUBLIC_API_ROUTES.has(pathname)) return true;
  return PUBLIC_PAGE_PREFIXES.some((route) => pathname.startsWith(route)) || PUBLIC_API_PREFIXES.some((route) => pathname.startsWith(route));
}

export function isPrivateRoute(pathname: string) {
  if (isAdminRoute(pathname)) return true;
  return (
    PRIVATE_PAGE_PREFIXES.some((route) => pathname === route || pathname.startsWith(`${route}/`)) ||
    PRIVATE_API_PREFIXES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
  );
}

export function buildLoginRedirect(pathname: string, search = "") {
  const redirectTo = `${pathname}${search}`;
  return `/login?redirectTo=${encodeURIComponent(redirectTo)}`;
}
