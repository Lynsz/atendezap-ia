export const runtime = "nodejs";

function isConfigured(value?: string) {
  return Boolean(value?.trim());
}

export function GET() {
  return Response.json({
    status: "ok",
    app: "AtendeZap IA",
    services: {
      supabase: isConfigured(process.env.NEXT_PUBLIC_SUPABASE_URL) && isConfigured(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      openai: isConfigured(process.env.OPENAI_API_KEY),
      stripe: isConfigured(process.env.STRIPE_SECRET_KEY),
      resend: isConfigured(process.env.RESEND_API_KEY)
    }
  });
}
