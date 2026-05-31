import { describe, expect, it, vi } from "vitest";
import robots from "./robots";
import sitemap from "./sitemap";

vi.mock("@/config/niches", () => ({
  NICHE_SLUGS: ["delivery", "estetica"],
  NICHES: {
    delivery: { route: "/para/delivery" },
    estetica: { route: "/para/estetica" }
  }
}));

describe("rotas tecnicas de SEO", () => {
  it("gera sitemap somente com paginas publicas", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("http://localhost:3000/");
    expect(urls).toContain("http://localhost:3000/demo");
    expect(urls).toContain("http://localhost:3000/para/delivery");
    expect(urls.join("\n")).not.toContain("/dashboard");
    expect(urls.join("\n")).not.toContain("/admin");
    expect(urls.join("\n")).not.toContain("/assinatura");
    expect(urls.join("\n")).not.toContain("/api");
  });

  it("bloqueia areas privadas no robots", () => {
    const config = robots();
    const rule = Array.isArray(config.rules) ? config.rules[0] : config.rules;
    const disallow = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];

    expect(disallow).toEqual(expect.arrayContaining(["/admin", "/dashboard", "/assinatura", "/api"]));
    expect(config.sitemap).toBe("http://localhost:3000/sitemap.xml");
  });
});
