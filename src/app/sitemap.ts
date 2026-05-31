import type { MetadataRoute } from "next";
import { NICHE_SLUGS, NICHES } from "@/config/niches";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const publicRoutes = [
  "/",
  "/atendimento-whatsapp-ia",
  "/demo",
  "/ebook",
  "/ebook/guia",
  "/precos",
  "/cadastro",
  "/login",
  "/feedback",
  "/suporte",
  "/termos",
  "/privacidade",
  ...NICHE_SLUGS.map((slug) => NICHES[slug].route)
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: new URL(route, appUrl).toString(),
    lastModified,
    changeFrequency: route === "/" || route === "/precos" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/para/") ? 0.7 : 0.8
  }));
}
