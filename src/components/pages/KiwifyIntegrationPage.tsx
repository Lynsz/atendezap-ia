"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  History,
  Plug,
  RotateCcw,
  Server,
  ShieldCheck,
  Webhook,
  XCircle
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { IntegrationStatusBadge } from "@/components/integrations/IntegrationStatusBadge";
import type { CheckoutPlanId } from "@/config/checkout";
import type { KiwifyEventType, KiwifyWebhookEvent } from "@/types/kiwify";
import {
  clearKiwifyWebhookEvents,
  getKiwifyWebhookEvents,
  processKiwifyWebhookEvent,
  simulateKiwifyEvent
} from "@/utils/kiwifyWebhookSimulator";

const eventLabels: Record<KiwifyEventType, string> = {
  order_paid: "Compra aprovada",
  order_refunded: "Compra reembolsada",
  subscription_created: "Assinatura criada",
  subscription_renewed: "Assinatura renovada",
  subscription_late: "Assinatura em atraso",
  subscription_canceled: "Assinatura cancelada",
  subscription_expired: "Assinatura expirada"
};

const paymentMethodLabels = {
  credit_card: "Cartão de crédito",
  pix: "Pix",
  boleto: "Boleto"
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function processedStatus(event: KiwifyWebhookEvent) {
  if (event.type === "subscription_late") return "Em atraso";
  if (["subscription_canceled", "subscription_expired", "order_refunded"].includes(event.type)) return "Cancelado";
  return "Ativo";
}

function SimulationButton({
  label,
  type,
  planId,
  onSimulate
}: {
  label: string;
  type: KiwifyEventType;
  planId: CheckoutPlanId;
  onSimulate: (type: KiwifyEventType, planId: CheckoutPlanId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSimulate(type, planId)}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm font-black text-slate-200 transition hover:border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-100"
    >
      <Webhook className="h-4 w-4" />
      {label}
    </button>
  );
}

function KiwifyIntegrationContent() {
  const [events, setEvents] = useState<KiwifyWebhookEvent[]>(() => getKiwifyWebhookEvents());
  const [feedback, setFeedback] = useState("");

  function refresh() {
    setEvents(getKiwifyWebhookEvents());
  }

  function handleSimulate(type: KiwifyEventType, planId: CheckoutPlanId) {
    const simulation = simulateKiwifyEvent(type, planId);
    setFeedback(simulation.result.message);
    refresh();
  }

  function handleReprocess(event: KiwifyWebhookEvent) {
    const result = processKiwifyWebhookEvent(event);
    setFeedback(result.message);
  }

  function handleClear() {
    clearKiwifyWebhookEvents();
    setEvents([]);
    setFeedback("Histórico local de eventos Kiwify limpo.");
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-8 text-slate-100">
      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                <Plug className="h-4 w-4" />
                Integrações
              </p>
              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Integração Kiwify</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Use a Kiwify como funil de aquisição para ebook, order bump e origem do lead. A assinatura recorrente do SaaS fica na Stripe.
              </p>
            </div>
            <IntegrationStatusBadge status="simulated" />
          </div>
        </header>

        {feedback ? (
          <div className="mb-6 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-200">
            {feedback}
          </div>
        ) : null}

        <section className="mb-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-sky-400/15 text-sky-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-400">Status atual</p>
            <div className="mt-3">
              <IntegrationStatusBadge status="simulated" />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">Os eventos são gerados e processados no localStorage deste navegador.</p>
          </article>

          <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-amber-400/15 text-amber-300">
              <Server className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-400">Webhook de aquisição</p>
            <div className="mt-3">
              <IntegrationStatusBadge status="pending" />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">O endpoint registra eventos de funil, sem liberar assinatura recorrente.</p>
          </article>

          <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-300">
              <CreditCard className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-400">Ambiente</p>
            <p className="mt-3 text-2xl font-black text-white">Front-end demo</p>
            <p className="mt-3 text-sm leading-6 text-slate-500">Nenhuma chamada real para Kiwify é feita nesta versão.</p>
          </article>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-white">
              <AlertTriangle className="h-5 w-5 text-amber-300" />
              Responsabilidade da Kiwify
            </h2>
            <ol className="grid gap-3 text-sm leading-6 text-slate-300">
              <li className="rounded-md bg-white/[0.04] p-3">1. Capturar lead via ebook ou produto de entrada.</li>
              <li className="rounded-md bg-white/[0.04] p-3">2. Registrar origem `acquisition_source = kiwify` e `funnel_source = ebook`.</li>
              <li className="rounded-md bg-white/[0.04] p-3">3. Aceitar order bump do primeiro mês do Pro por R$ 29 quando fizer sentido.</li>
              <li className="rounded-md bg-white/[0.04] p-3">4. Orientar o usuário a criar conta no AtendeZap IA.</li>
              <li className="rounded-md bg-white/[0.04] p-3">5. Deixar a liberação recorrente do SaaS para a Stripe e Supabase.</li>
            </ol>
          </article>

          <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-white">
              <Webhook className="h-5 w-5 text-emerald-300" />
              Eventos simulados
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <SimulationButton label="Simular compra Starter" type="order_paid" planId="starter" onSimulate={handleSimulate} />
              <SimulationButton label="Simular compra Pro" type="order_paid" planId="pro" onSimulate={handleSimulate} />
              <SimulationButton label="Simular compra Starter" type="order_paid" planId="starter" onSimulate={handleSimulate} />
              <SimulationButton label="Simular compra Premium" type="order_paid" planId="premium" onSimulate={handleSimulate} />
              <SimulationButton label="Simular renovação" type="subscription_renewed" planId="starter" onSimulate={handleSimulate} />
              <SimulationButton label="Simular atraso" type="subscription_late" planId="starter" onSimulate={handleSimulate} />
              <SimulationButton label="Simular cancelamento" type="subscription_canceled" planId="starter" onSimulate={handleSimulate} />
            </div>
          </article>
        </section>

        <section className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/25">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-black text-white">
                <History className="h-5 w-5 text-emerald-300" />
                Histórico de eventos
              </h2>
              <p className="mt-2 text-sm text-slate-500">Eventos gerados localmente para testar o comportamento futuro do webhook.</p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-red-400/30 bg-red-500/10 px-4 text-sm font-black text-red-200 transition hover:bg-red-500/15"
            >
              <XCircle className="h-4 w-4" />
              Limpar histórico
            </button>
          </div>

          {events.length ? (
            <div className="grid gap-3">
              {events.map((event) => (
                <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={event.id}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <IntegrationStatusBadge status="simulated" />
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-slate-300">
                          {eventLabels[event.type]}
                        </span>
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200">
                          {processedStatus(event)}
                        </span>
                      </div>
                      <h3 className="mt-3 font-black text-white">{event.order.customer.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">{event.order.customer.email}</p>
                    </div>
                    <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2 lg:min-w-[520px] lg:grid-cols-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Plano</p>
                        <p className="mt-1 font-black text-white">{event.order.plan.name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Valor</p>
                        <p className="mt-1 font-black text-white">{event.order.plan.price}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Pagamento</p>
                        <p className="mt-1 font-black text-white">{paymentMethodLabels[event.order.paymentMethod]}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Data</p>
                        <p className="mt-1 font-black text-white">{formatDateTime(event.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleReprocess(event)}
                      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 text-xs font-black text-slate-200 transition hover:bg-white/10"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reprocessar localmente
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-emerald-300" />
              <p className="font-black text-white">Nenhum evento simulado ainda.</p>
              <p className="mt-2 text-sm text-slate-500">Use os botões acima para gerar eventos de teste.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default function KiwifyIntegrationPage() {
  return (
    <ProtectedRoute>
      <KiwifyIntegrationContent />
    </ProtectedRoute>
  );
}
