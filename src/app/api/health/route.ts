export const runtime = "nodejs";

const appVersion = "1.0.0";

export function GET() {
  return Response.json({
    status: "ok",
    app: "AtendeZap IA",
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    version: appVersion,
    timestamp: new Date().toISOString()
  });
}
