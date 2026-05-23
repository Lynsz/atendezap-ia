import { createClient } from "@supabase/supabase-js";
import { AppError, errorResponse } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getAppUrl, getStripe } from "@/services/stripe";

export const runtime = "nodejs";

async function authenticateRequest(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const authorization = request.headers.get("authorization");

  if (!url || !anonKey) {
    throw new AppError("Supabase não configurado no servidor.", 500);
  }

  if (!authorization) {
    throw new AppError("Faça login para gerenciar sua assinatura.", 401);
  }

  const supabase = createClient(url, anonKey, {
    global: {
      headers: {
        Authorization: authorization
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AppError("Sessão inválida. Faça login novamente.", 401);
  }

  return user;
}

export async function POST(request: Request) {
  let userId: string | null = null;
  try {
    await enforceRateLimit({ request, route: "api:stripe-portal:ip", limit: 20, windowMs: 10 * 60_000 });
    const user = await authenticateRequest(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:stripe-portal:user", identifier: user.id, limit: 10, windowMs: 5 * 60_000 });
    const supabase = getSupabaseAdmin();
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("provider, provider_customer_id, stripe_customer_id")
      .eq("user_id", user.id)
      .eq("provider", "stripe")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const customerId =
      (subscription?.provider_customer_id as string | null | undefined) || (subscription?.stripe_customer_id as string | null | undefined);
    if (!customerId) {
      throw new AppError("Nenhuma assinatura Stripe encontrada para este usuário.", 404);
    }

    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${getAppUrl()}/assinatura`
    });

    serverLog({ event: "stripe_portal_created", route: "/api/stripe/create-portal-session", userId: user.id, status: "ok" });
    return Response.json({ ok: true, url: portalSession.url });
  } catch (error) {
    serverLog({ level: "warn", event: "stripe_portal_failed", route: "/api/stripe/create-portal-session", userId, error });
    return errorResponse(error);
  }
}
