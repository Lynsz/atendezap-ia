"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, BadgeDollarSign, CalendarClock, CheckCircle2, CreditCard, RefreshCw, ShieldCheck, Wallet } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StripeCheckoutButton } from "@/components/checkout/StripeCheckoutButton";
import { PLAN_IDS, SAAS_PLANS, type PlanId } from "@/config/plans";
import { getPlanResponseLimit } from "@/lib/plan-limits";
import { isSupabaseBrowserConfigured, supabase } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";
import type { Subscription } from "@/types/mvp";

type BillingSubscription = Subscription & {
  monthly_limit?: number | null;
  provider_price_id?: string | null;
  last_payment_status?: string | null;
  first_month_price_applied?: boolean | null;
};

function normalizePlanId(planName?: string | null): PlanId | null {
  if (!planName) return null;
  const normalizedPlanName = planName.toLowerCase();
  return PLAN_IDS.find((planId) => planId === normalizedPlanName || SAAS_PLANS[planId].name.toLowerCase() === normalizedPlanName) ?? null;
}

function isActiveStatus(status?: string | null) {
  const normalizedStatus = status?.toLowerCase();
  return normalizedStatus === "active" || normalizedStatus === "trial" || normalizedStatus === "trialing";
}

function statusLabel(status?: string | null) {
  const normalizedStatus = status?.toLowerCase();
  if (normalizedStatus === "active") return "Ativa";
  if (normalizedStatus === "trial" || normalizedStatus === "trialing") return "Teste";
  if (normalizedStatus === "pending") return "Pendente";
  if (normalizedStatus === "past_due") return "Pagamento pendente";
  if (normalizedStatus === "canceled") return "Cancelada";
  if (normalizedStatus === "inactive") return "Inativa";
  return "Sem assinatura ativa";
}

function statusClass(status?: string | null) {
  const normalizedStatus = status?.toLowerCase();
  if (normalizedStatus === "active" || normalizedStatus === "trial" || normalizedStatus === "trialing") {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  }
  if (normalizedStatus === "pending") return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  if (normalizedStatus === "past_due") return "border-orange-400/30 bg-orange-400/10 text-orange-200";
  return "border-red-400/30 bg-red-500/10 text-red-200";
}

function formatShortDate(value?: string | null) {
  if (!value) return "Não informado";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

function BillingContent() {
  const [subscription, setSubscription] = useState<BillingSubscription | null>(null);
  const [monthlyUsage, setMonthlyUsage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState("");

  const currentPlanId = normalizePlanId(subscription?.plan || subscription?.plan_name);
  const currentPlan = currentPlanId ? SAAS_PLANS[currentPlanId] : null;
  const monthlyLimit = subscription?.monthly_limit || getPlanResponseLimit(subscription?.plan || subscription?.plan_name, subscription?.status);
  const monthlyRemaining = Math.max(monthlyLimit - monthlyUsage, 0);
  const usagePercent = monthlyLimit > 0 ? Math.min(100, Math.round((monthlyUsage / monthlyLimit) * 100)) : 0;
  const activeSubscription = isActiveStatus(subscription?.status);
  const canManageStripeSubscription =
    subscription?.provider === "stripe" && Boolean(subscription.provider_customer_id || subscription.stripe_customer_id);

  const planCards = useMemo(() => PLAN_IDS.map((planId) => SAAS_PLANS[planId]), []);

  const loadBilling = useCallback(async () => {
    setError("");
    setLoading(true);

    if (!isSupabaseBrowserConfigured()) {
      setError("Supabase não está configurado. Revise as variáveis de ambiente.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Sessão não encontrada. Faça login novamente.");
      setLoading(false);
      return;
    }

    const currentMonthStart = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)).toISOString();
    const [{ data: subscriptionData, error: subscriptionError }, { count: responseCount, error: usageError }] = await Promise.all([
      supabase.from("subscriptions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("generated_responses").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", currentMonthStart)
    ]);

    if (subscriptionError || usageError) {
      setError("Não foi possível carregar sua assinatura agora. Tente novamente em instantes.");
    }

    setSubscription((subscriptionData as BillingSubscription | null) || null);
    setMonthlyUsage(responseCount || 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadBilling();
    });
  }, [loadBilling]);

  async function openStripePortal() {
    setError("");
    setPortalLoading(true);

    try {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError("Sessão não encontrada. Faça login novamente.");
        return;
      }

      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      const result = (await response.json().catch(() => ({}))) as { url?: string; error?: string };

      if (!response.ok || !result.url) {
        setError(result.error || "Não foi possível abrir o portal da Stripe agora.");
        return;
      }

      window.location.href = result.url;
    } catch {
      setError("Não foi possível abrir o portal da Stripe agora.");
    } finally {
      setPortalLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090d12] px-4 text-white">
        <div className="rounded-lg border border-white/10 bg-[#101821] p-6 text-center shadow-2xl shadow-black/30">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-emerald-400" />
          <h1 className="text-lg font-black">Carregando assinatura...</h1>
          <p className="mt-2 text-sm text-slate-400">Buscando dados reais no Supabase.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-8 text-slate-100">
      <section className="mx-auto max-w-6xl">
        <header className="mb-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                <Wallet className="h-4 w-4" />
                Cobrança mensal
              </p>
              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Minha assinatura</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Esta página usa a assinatura real salva no Supabase e o portal da Stripe para gerenciamento de cobrança.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadBilling()}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-black text-slate-950 hover:bg-slate-100"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </button>
          </div>
        </header>

        {error ? <div className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm font-bold text-red-200">{error}</div> : null}

        <div className="mb-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-lg border border-emerald-400/20 bg-[#101821] p-6 shadow-2xl shadow-black/25">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 text-sm font-black text-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                  Plano atual
                </p>
                <h2 className="text-3xl font-black text-white">{activeSubscription && currentPlan ? currentPlan.name : "Sem plano ativo"}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {currentPlan ? currentPlan.description : "Assine um plano para aumentar seu limite mensal de respostas com IA."}
                </p>
              </div>
              <span className={cn("inline-flex w-fit rounded-full border px-3 py-1 text-xs font-black", statusClass(subscription?.status))}>
                {statusLabel(subscription?.status)}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Uso mensal</p>
                <p className="mt-2 font-black text-white">{monthlyUsage} / {monthlyLimit}</p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Restantes</p>
                <p className="mt-2 font-black text-white">{monthlyRemaining}</p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Renovação</p>
                <p className="mt-2 font-black text-white">{formatShortDate(subscription?.current_period_end)}</p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Pagamento</p>
                <p className="mt-2 font-black text-white">{subscription?.last_payment_status || "Não informado"}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-3 text-sm">
                <p className="font-bold text-slate-300">Uso do ciclo atual</p>
                <p className="font-black text-emerald-300">{usagePercent}%</p>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                <div className={cn("h-full rounded-full", usagePercent >= 100 ? "bg-red-400" : usagePercent >= 80 ? "bg-amber-300" : "bg-emerald-400")} style={{ width: `${usagePercent}%` }} />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {canManageStripeSubscription ? (
                <button
                  type="button"
                  onClick={openStripePortal}
                  disabled={portalLoading}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CreditCard className="h-4 w-4" />
                  {portalLoading ? "Abrindo..." : "Gerenciar no portal Stripe"}
                </button>
              ) : (
                <Link
                  href="/precos"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
                >
                  <CreditCard className="h-4 w-4" />
                  Ver planos
                </Link>
              )}
              <Link
                href="/dashboard"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/10"
              >
                Voltar ao dashboard
              </Link>
            </div>
          </article>

          <aside className="grid gap-4">
            <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 p-5">
              <AlertCircle className="mb-3 h-5 w-5 text-amber-200" />
              <p className="text-sm leading-6 text-amber-100">
                Cancelamento, troca de cartão e alteração de cobrança real devem ser feitos pelo portal da Stripe.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#101821] p-5">
              <CalendarClock className="mb-3 h-5 w-5 text-emerald-300" />
              <p className="text-sm leading-6 text-slate-300">
                O dashboard e esta página leem a mesma assinatura em `subscriptions`, sincronizada pelo webhook da Stripe.
              </p>
            </div>
          </aside>
        </div>

        <section id="planos-assinatura" className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/25">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                <BadgeDollarSign className="h-4 w-4" />
                Planos mensais
              </p>
              <h2 className="text-2xl font-black text-white">Comparação dos planos</h2>
            </div>
            <p className="text-sm text-slate-400">Cobrança recorrente mensal pela Stripe, com liberação via Supabase.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {planCards.map((plan) => {
              const isCurrentActivePlan = currentPlanId === plan.id && activeSubscription;
              const label = isCurrentActivePlan ? "Plano atual" : plan.id === "pro" ? "Assinar Pro por R$ 29 no primeiro mês" : `Assinar ${plan.name}`;

              return (
                <article
                  className={cn(
                    "flex h-full flex-col rounded-lg border bg-white/[0.04] p-5",
                    isCurrentActivePlan && "border-emerald-300 bg-emerald-400/10",
                    plan.recommended && !isCurrentActivePlan && "border-emerald-400/40"
                  )}
                  key={plan.id}
                >
                  <div className="mb-4">
                    {plan.recommended ? <p className="mb-3 w-fit rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-slate-950">Mais recomendado</p> : null}
                    <h3 className="text-xl font-black text-white">{plan.name}</h3>
                    <p className="mt-2 text-3xl font-black text-emerald-300">{plan.firstMonthPriceLabel || plan.monthlyPriceLabel}</p>
                    {plan.recurringPriceLabel ? <p className="mt-1 text-xs font-bold text-slate-400">{plan.recurringPriceLabel}</p> : null}
                  </div>

                  <ul className="flex flex-1 flex-col gap-3 text-sm text-slate-200">
                    {plan.features.slice(0, 5).map((feature) => (
                      <li className="flex gap-2" key={feature}>
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <StripeCheckoutButton
                    planId={plan.id}
                    label={label}
                    disabled={isCurrentActivePlan}
                    className="mt-6"
                    recommended={plan.recommended}
                  />
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}

export default function BillingPage() {
  return (
    <ProtectedRoute>
      <BillingContent />
    </ProtectedRoute>
  );
}
