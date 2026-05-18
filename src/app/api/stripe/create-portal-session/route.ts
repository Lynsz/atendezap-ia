import { createClient } from "@supabase/supabase-js";
import { AppError, errorResponse } from "@/lib/errors";
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
  try {
    const user = await authenticateRequest(request);
    const supabase = getSupabaseAdmin();
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("provider, provider_customer_id")
      .eq("user_id", user.id)
      .eq("provider", "stripe")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const customerId = subscription?.provider_customer_id as string | null | undefined;
    if (!customerId) {
      throw new AppError("Nenhuma assinatura Stripe encontrada para este usuário.", 404);
    }

    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${getAppUrl()}/dashboard`
    });

    return Response.json({ ok: true, url: portalSession.url });
  } catch (error) {
    return errorResponse(error);
  }
}
