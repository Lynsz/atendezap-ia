import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

describe("proxy auth guard", () => {
  it("redireciona paginas privadas sem hint de sessao para login", () => {
    const response = proxy(new NextRequest("https://app.example.test/dashboard"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://app.example.test/login?redirectTo=%2Fdashboard");
  });

  it("permite rotas publicas sem sessao", () => {
    const response = proxy(new NextRequest("https://app.example.test/demo"));

    expect(response.status).toBe(200);
  });

  it("retorna 401 para APIs privadas sem sessao", async () => {
    const response = proxy(new NextRequest("https://app.example.test/api/ai/generate-response"));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toContain("Sessao");
  });
});
