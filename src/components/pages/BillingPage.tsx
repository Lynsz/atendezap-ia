"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BadgeDollarSign,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  History,
  Plug,
  RotateCcw,
  ShieldCheck,
  Wallet,
  XCircle
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserPlanBadge } from "@/components/auth/UserPlanBadge";
import { StripeCheckoutButton } from "@/components/checkout/StripeCheckoutButton";
import { CHECKOUT_PLANS } from "@/config/checkout";
import type { CheckoutPlanId } from "@/config/checkout";
import { cn } from "@/lib/utils";
import type { BillingEvent, SubscriptionStatus, UserSubscription } from "@/types/billing";
import {
  cancelLocalSubscription,
  createDefaultSubscription,
  getBillingEvents,
  getCurrentSubscription,
  reactivateLocalSubscription
} from "@/utils/billingStorage";

const planOrder: Record<CheckoutPlanId, number> = {
  starter: 1,
  pro: 2,
  premium: 3
};

const planFeatures: Record<CheckoutPlanId, string[]> = {
  starter: ["150 respostas com IA por mês", "Cadastro do negócio", "Dashboard", "Histórico básico"],
  pro: ["600 respostas com IA por mês", "Histórico completo", "Organização de clientes", "Respostas mais personalizadas"],
  premium: ["2.000 respostas com IA por mês", "Biblioteca premium", "Modelos avançados", "Suporte prioritário assíncrono"]
};

const statusLabels: Record<SubscriptionStatus, string> = {
  active: "Ativa",
  trial: "Teste",
  overdue: "Em atraso",
  past_due: "Em atraso",
  inactive: "Inativa",
  canceled: "Cancelada",
  pending: "Pendente"
};

const statusClasses: Record<SubscriptionStatus, string> = {
  active: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  trial: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  overdue: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  past_due: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  inactive: "border-slate-400/30 bg-slate-400/10 text-slate-200",
  canceled: "border-red-400/30 bg-red-500/10 text-red-200",
  pending: "border-slate-400/30 bg-slate-400/10 text-slate-200"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  return (
    <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-black", statusClasses[status])}>
      {statusLabels[status]}
    </span>
  );
}

function BillingContent() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [events, setEvents] = useState<BillingEvent[]>([]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const currentSubscription = getCurrentSubscription() || createDefaultSubscription("starter");
      setSubscription(currentSubscription);
      setEvents(getBillingEvents());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const currentPlan = useMemo(() => {
    if (!subscription) return CHECKOUT_PLANS.starter;
    return CHECKOUT_PLANS[subscription.planId];
  }, [subscription]);

  function refreshBillingState(nextSubscription?: UserSubscription | null) {
    setSubscription(nextSubscription ?? getCurrentSubscription());
    setEvents(getBillingEvents());
  }

  function handleCancelLocal() {
    refreshBillingState(cancelLocalSubscription());
  }

  function handleReactivateLocal() {
    refreshBillingState(reactivateLocalSubscription());
  }

  function scrollToPlans() {
    document.getElementById("planos-assinatura")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Minha Assinatura</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Gerencie seu plano mensal do AtendeZap IA, compare opções e inicie a cobrança recorrente pela Stripe.
              </p>
            </div>
            {subscription ? <UserPlanBadge plan={subscription.planId} /> : null}
          </div>
        </header>

        <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-lg border border-emerald-400/20 bg-[#101821] p-6 shadow-2xl shadow-black/25">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 text-sm font-black text-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                  Plano atual
                </p>
                <h2 className="text-3xl font-black text-white">{currentPlan.name}</h2>
                <p className="mt-2 text-4xl font-black tracking-tight text-emerald-300">{currentPlan.price}</p>
              </div>
              {subscription ? <StatusBadge status={subscription.status} /> : null}
            </div>

            {subscription ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Ciclo</p>
                  <p className="mt-2 font-black text-white">Mensal</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Valor mensal</p>
                  <p className="mt-2 font-black text-white">{subscription.price}</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Data de início</p>
                  <p className="mt-2 font-black text-white">{formatDate(subscription.startedAt)}</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Próxima cobrança simulada</p>
                  <p className="mt-2 font-black text-white">{formatDate(subscription.nextBillingAt)}</p>
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={scrollToPlans}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
              >
                <CreditCard className="h-4 w-4" />
                Trocar de plano
              </button>
              {subscription?.status === "canceled" ? (
                <button
                  type="button"
                  onClick={handleReactivateLocal}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 text-sm font-bold text-emerald-200 transition hover:bg-emerald-400/15"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reativar localmente
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancelLocal}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-red-400/30 bg-red-500/10 px-5 py-2.5 text-sm font-bold text-red-200 transition hover:bg-red-500/15"
                >
                  <XCircle className="h-4 w-4" />
                  Cancelar localmente
                </button>
              )}
            </div>
          </article>

          <aside className="grid gap-4">
            <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 p-5">
              <AlertCircle className="mb-3 h-5 w-5 text-amber-200" />
              <p className="text-sm leading-6 text-amber-100">
                Os pagamentos recorrentes do SaaS são processados pela Stripe. O dashboard libera recursos a partir do status salvo no Supabase.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#101821] p-5">
              <CalendarClock className="mb-3 h-5 w-5 text-emerald-300" />
              <p className="text-sm leading-6 text-slate-300">
                Para cancelar, alterar forma de pagamento ou gerenciar cobranças reais, use o portal do cliente da Stripe.
              </p>
            </div>
            <div className="rounded-lg border border-sky-400/20 bg-sky-400/10 p-5">
              <Plug className="mb-3 h-5 w-5 text-sky-200" />
              <p className="text-sm leading-6 text-sky-100">
                A Kiwify fica posicionada como funil de aquisição. A assinatura real do SaaS deve ser sincronizada pelo webhook da Stripe.
              </p>
              <Link
                href="/integracoes/kiwify"
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md bg-sky-300 px-4 text-sm font-black text-slate-950 transition hover:bg-sky-200"
              >
                Ver integração Kiwify
              </Link>
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
            {(Object.keys(CHECKOUT_PLANS) as CheckoutPlanId[]).map((planId) => {
              const plan = CHECKOUT_PLANS[planId];
              const isCurrentPlan = subscription?.planId === planId;
              const isUpgrade = subscription ? planOrder[planId] > planOrder[subscription.planId] : planId !== "starter";
              const actionLabel = isCurrentPlan ? "Plano atual" : isUpgrade ? "Fazer upgrade" : "Alterar plano";

              return (
                <article
                  className={cn(
                    "flex h-full flex-col rounded-lg border bg-white/[0.04] p-5",
                    isCurrentPlan && "border-emerald-300 bg-emerald-400/10",
                    planId === "premium" && !isCurrentPlan && "border-violet-400/40 bg-violet-400/10",
                    !isCurrentPlan && planId !== "premium" && "border-white/10"
                  )}
                  key={plan.id}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-white">{plan.name}</h3>
                      <p className="mt-2 text-3xl font-black text-emerald-300">{plan.price}</p>
                    </div>
                    {isCurrentPlan ? <StatusBadge status={subscription.status} /> : null}
                  </div>

                  <ul className="flex flex-1 flex-col gap-3 text-sm text-slate-200">
                    {planFeatures[planId].map((feature) => (
                      <li className="flex gap-2" key={feature}>
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <StripeCheckoutButton
                    planId={planId}
                    label={actionLabel}
                    disabled={isCurrentPlan}
                    className={cn(
                      "mt-6",
                      isCurrentPlan && "bg-white/10 text-slate-200 hover:bg-white/10"
                    )}
                    recommended={planId === "pro"}
                  />
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/25">
          <div className="mb-5 flex items-center gap-2">
            <History className="h-5 w-5 text-emerald-300" />
            <h2 className="text-xl font-black text-white">Histórico de eventos de cobrança</h2>
          </div>

          {events.length ? (
            <div className="grid gap-3">
              {events.map((event) => (
                <article className="rounded-md border border-white/10 bg-white/[0.04] p-4" key={event.id}>
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <h3 className="font-black text-white">{event.title}</h3>
                    <span className="text-xs font-bold text-slate-500">{formatDateTime(event.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{event.description}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-md border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-400">
              Nenhum evento de cobrança local registrado ainda.
            </p>
          )}
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
