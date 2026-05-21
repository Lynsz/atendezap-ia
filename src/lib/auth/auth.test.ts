import { describe, expect, it } from "vitest";
import { getAdminEmailsFromEnv, isAdminEmailAllowed } from "@/lib/auth/admin-emails";
import { buildLoginRedirect, isAdminRoute, isPrivateRoute, isPublicRoute, isStaticAssetPath } from "@/lib/auth/routes";

describe("auth route guards", () => {
  it("mantem rotas publicas e webhook Stripe fora do bloqueio de middleware", () => {
    expect(isPublicRoute("/")).toBe(true);
    expect(isPublicRoute("/ebook")).toBe(true);
    expect(isPublicRoute("/api/health")).toBe(true);
    expect(isPublicRoute("/api/stripe/webhook")).toBe(true);
  });

  it("classifica rotas privadas e admin", () => {
    expect(isPrivateRoute("/dashboard")).toBe(true);
    expect(isPrivateRoute("/assinatura")).toBe(true);
    expect(isPrivateRoute("/onboarding")).toBe(true);
    expect(isPrivateRoute("/api/ai/generate-response")).toBe(true);
    expect(isAdminRoute("/admin")).toBe(true);
    expect(isAdminRoute("/api/admin/overview")).toBe(true);
  });

  it("ignora assets estaticos e preserva redirectTo no login", () => {
    expect(isStaticAssetPath("/_next/static/chunk.js")).toBe(true);
    expect(isStaticAssetPath("/logo.png")).toBe(true);
    expect(buildLoginRedirect("/assinatura", "?plan=pro")).toBe("/login?redirectTo=%2Fassinatura%3Fplan%3Dpro");
  });
});

describe("admin emails", () => {
  it("normaliza multiplos emails do ADMIN_EMAILS", () => {
    const admins = getAdminEmailsFromEnv(" Admin@Exemplo.com, segundo@site.com , ");

    expect(admins).toEqual(["admin@exemplo.com", "segundo@site.com"]);
    expect(isAdminEmailAllowed("ADMIN@EXEMPLO.COM", admins)).toBe(true);
    expect(isAdminEmailAllowed("usuario@site.com", admins)).toBe(false);
  });
});
