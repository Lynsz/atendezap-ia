import { NextResponse, type NextRequest } from "next/server";
import { AUTH_HINT_COOKIE, buildLoginRedirect, isPrivateRoute, isPublicRoute, isStaticAssetPath } from "@/lib/auth/routes";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isStaticAssetPath(pathname) || isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (!isPrivateRoute(pathname)) {
    return NextResponse.next();
  }

  const hasAuthHint = request.cookies.get(AUTH_HINT_COOKIE)?.value === "1";

  if (hasAuthHint) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Sessao nao encontrada. Faca login novamente." }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = new URL(buildLoginRedirect(pathname, search), request.url).search;
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"]
};
