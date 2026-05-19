export const runtime = "nodejs";

export function GET() {
  return Response.json({
    status: "ok",
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    timestamp: new Date().toISOString()
  });
}
