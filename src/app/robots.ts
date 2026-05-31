import type { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/dashboard", "/dashboard/", "/assinatura", "/assinatura/", "/api", "/api/", "/app", "/app/"]
      }
    ],
    sitemap: new URL("/sitemap.xml", appUrl).toString(),
    host: appUrl
  };
}
