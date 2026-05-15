"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  CreditCard,
  Database,
  DollarSign,
  LayoutDashboard,
  Lightbulb,
  MessageCircle,
  Plug,
  Settings,
  Smartphone,
  Target,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserPlanBadge } from "@/components/auth/UserPlanBadge";
import { cn } from "@/lib/utils";
import type {
  AutomationMetric,
  ConversationMetric,
  DashboardInsight,
  DashboardMetric,
  LeadStageMetric,
  RevenuePoint
} from "@/types/dashboard";
import {
  getAutomationPerformanceData,
  getConversationStatusData,
  getDashboardInsights,
  getDashboardMetrics,
  getLeadStageData,
  getRevenueData,
  hasLocalDashboardData
} from "@/utils/dashboardAnalytics";
import { getCurrentSession } from "@/utils/authStorage";
import { getCurrentSubscription } from "@/utils/billingStorage";
import { getBusinessProfile } from "@/utils/onboardingStorage";

type DashboardSnapshot = {
  metrics: DashboardMetric[];
  revenue: RevenuePoint[];
  leadStages: LeadStageMetric[];
  conversations: ConversationMetric[];
  automations: AutomationMetric[];
  insights: DashboardInsight[];
  hasLocalData: boolean;
  userName: string;
  businessName: string;
  aiTone: string;
  planId: "basic" | "starter" | "premium";
  planName: string;
};

const metricIcons: Record<DashboardMetric["icon"], LucideIcon> = {
  users: Users,
  message: MessageCircle,
  conversion: Target,
  revenue: DollarSign,
  automation: Zap,
  billing: CreditCard
};

const insightIcons: Record<DashboardInsight["type"], LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Lightbulb,
  danger: AlertTriangle
};

const quickLinks = [
  {
    href: "/atendezap",
    title: "Atendimento",
    description: "Abrir conversas e sugestões IA.",
    icon: MessageCircle
  },
  {
    href: "/leads",
    title: "Clientes & Leads",
    description: "Gerenciar funil comercial.",
    icon: Users
  },
  {
    href: "/automacoes",
    title: "Automações IA",
    description: "Simular ações inteligentes.",
    icon: Bot
  },
  {
    href: "/assinatura",
    title: "Minha Assinatura",
    description: "Ver plano e upgrade.",
    icon: CreditCard
  },
  {
    href: "/integracoes/kiwify",
    title: "Kiwify",
    description: "Status e simulação de webhook.",
    icon: Plug
  },
  {
    href: "/integracoes/whatsapp",
    title: "WhatsApp",
    description: "Conexao demo do canal.",
    icon: Smartphone
  },
  {
    href: "/configuracoes",
    title: "Configurações",
    description: "Editar empresa e tom da IA.",
    icon: Settings
  },
  {
    href: "/sistema/backend",
    title: "Backend",
    description: "Preparação Supabase.",
    icon: Database
  }
];

function subscribeDashboard(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("atendezap-auth-change", callback);
  window.addEventListener("atendezap-billing-change", callback);
  window.addEventListener("atendezap-onboarding-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("atendezap-auth-change", callback);
    window.removeEventListener("atendezap-billing-change", callback);
    window.removeEventListener("atendezap-onboarding-change", callback);
  };
}

function createDashboardSnapshot(): DashboardSnapshot {
  const session = getCurrentSession();
  const subscription = getCurrentSubscription();
  const businessProfile = getBusinessProfile();

  return {
    metrics: getDashboardMetrics(),
    revenue: getRevenueData(),
    leadStages: getLeadStageData(),
    conversations: getConversationStatusData(),
    automations: getAutomationPerformanceData(),
    insights: getDashboardInsights(),
    hasLocalData: hasLocalDashboardData(),
    userName: session?.user.name || "cliente",
    businessName: businessProfile?.businessName || "AtendeZap IA",
    aiTone: businessProfile?.aiTone || "profissional",
    planId: subscription?.planId || session?.user.plan || "starter",
    planName: subscription?.planName || "Plano Starter"
  };
}

function getSnapshot() {
  return JSON.stringify(createDashboardSnapshot());
}

function getServerSnapshot() {
  return JSON.stringify(createDashboardSnapshot());
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value);
}

function MetricCard({ metric }: { metric: DashboardMetric }) {
  const Icon = metricIcons[metric.icon];
  const positive = metric.trend >= 0;

  return (
    <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-300">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs font-black",
            positive ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-amber-400/30 bg-amber-400/10 text-amber-200"
          )}
        >
          {metric.trendLabel}
        </span>
      </div>
      <p className="text-sm font-bold text-slate-400">{metric.title}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-white">{metric.value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{metric.description}</p>
    </article>
  );
}

function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const maxRevenue = Math.max(...data.map((point) => point.revenue), 1);
  const maxLeads = Math.max(...data.map((point) => point.leads), 1);

  return (
    <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20 lg:col-span-2">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
            <TrendingUp className="h-4 w-4" />
            Evolução comercial
          </p>
          <h2 className="text-xl font-black text-white">Receita potencial e leads</h2>
        </div>
        <p className="text-xs font-bold text-slate-500">Simulado a partir dos dados locais do CRM.</p>
      </div>

      <div className="flex h-72 items-end gap-3 border-b border-white/10 pb-4">
        {data.map((point) => {
          const revenueHeight = Math.max(8, (point.revenue / maxRevenue) * 100);
          const leadsHeight = Math.max(8, (point.leads / maxLeads) * 100);

          return (
            <div className="flex min-w-0 flex-1 flex-col items-center gap-3" key={point.month}>
              <div className="flex h-52 w-full items-end justify-center gap-1.5">
                <div
                  className="w-5 rounded-t-md bg-emerald-400 shadow-lg shadow-emerald-950/30"
                  title={`Receita: ${formatCompactCurrency(point.revenue)}`}
                  style={{ height: `${revenueHeight}%` }}
                />
                <div
                  className="w-5 rounded-t-md bg-sky-400/80 shadow-lg shadow-sky-950/30"
                  title={`Leads: ${point.leads}`}
                  style={{ height: `${leadsHeight}%` }}
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-white">{point.month}</p>
                <p className="mt-1 text-[11px] text-slate-500">{point.conversions} conv.</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-emerald-400" />
          Receita potencial
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-sky-400" />
          Leads
        </span>
      </div>
    </article>
  );
}

function LeadStageChart({ data }: { data: LeadStageMetric[] }) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
      <h2 className="text-xl font-black text-white">Leads por etapa</h2>
      <div className="mt-5 grid gap-4">
        {data.map((stage) => (
          <div key={stage.stage}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-bold text-slate-300">{stage.stage}</span>
              <span className="font-black text-white">{stage.total}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: `${Math.max(stage.percentage, 4)}%` }} />
            </div>
            <p className="mt-1 text-xs text-slate-500">{stage.percentage}% do funil</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function ConversationStatusCard({ data }: { data: ConversationMetric[] }) {
  const maxTotal = Math.max(...data.map((item) => item.total), 1);

  return (
    <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
      <h2 className="text-xl font-black text-white">Conversas por status</h2>
      <div className="mt-5 grid gap-3">
        {data.map((item) => (
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-3" key={item.status}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-300">{item.status}</span>
              <span className="font-black text-white">{item.total}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-sky-400" style={{ width: `${Math.max((item.total / maxTotal) * 100, 4)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function AutomationPerformanceCard({ data }: { data: AutomationMetric[] }) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
      <h2 className="text-xl font-black text-white">Automações em destaque</h2>
      <div className="mt-5 grid gap-3">
        {data.map((automation) => (
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-3" key={automation.name}>
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-white">{automation.name}</p>
                <p className="mt-1 text-xs text-slate-500">{automation.runs} execuções</p>
              </div>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-xs font-black text-emerald-200">
                {automation.successRate}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-violet-400" style={{ width: `${automation.successRate}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function InsightCard({ insight }: { insight: DashboardInsight }) {
  const Icon = insightIcons[insight.type];
  const toneClass = {
    success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    warning: "border-amber-400/25 bg-amber-400/10 text-amber-200",
    info: "border-sky-400/25 bg-sky-400/10 text-sky-200",
    danger: "border-red-400/25 bg-red-500/10 text-red-200"
  }[insight.type];

  return (
    <article className={cn("rounded-lg border p-4", toneClass)}>
      <Icon className="mb-3 h-5 w-5" />
      <h3 className="font-black text-white">{insight.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{insight.description}</p>
    </article>
  );
}

function DashboardContent() {
  const snapshot = useSyncExternalStore(subscribeDashboard, getSnapshot, getServerSnapshot);
  const data = useMemo(() => JSON.parse(snapshot) as DashboardSnapshot, [snapshot]);

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-8 text-slate-100">
      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard executivo
              </p>
              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Olá, {data.userName}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Visão geral do atendimento, funil comercial, automações e assinatura do AtendeZap IA.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-200">{data.businessName}</span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-emerald-200">
                  Tom IA: {data.aiTone}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <UserPlanBadge plan={data.planId} />
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-slate-300">
                {data.planName}
              </span>
            </div>
          </div>
        </header>

        {!data.hasLocalData ? (
          <div className="mb-6 rounded-lg border border-sky-400/20 bg-sky-400/10 p-4 text-sm leading-6 text-sky-100">
            Dados simulados para demonstração. Eles serão atualizados conforme você usa o painel.
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.metrics.map((metric) => (
            <MetricCard metric={metric} key={metric.id} />
          ))}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <RevenueChart data={data.revenue} />
          <LeadStageChart data={data.leadStages} />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <ConversationStatusCard data={data.conversations} />
          <AutomationPerformanceCard data={data.automations} />
        </section>

        <section className="mt-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/25">
          <div className="mb-5 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-emerald-300" />
            <h2 className="text-xl font-black text-white">Insights da IA</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {data.insights.map((insight) => (
              <InsightCard insight={insight} key={insight.id} />
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/25">
          <h2 className="text-xl font-black text-white">Atalhos rápidos</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  href={item.href}
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-emerald-400/50 hover:bg-emerald-400/10"
                  key={item.href}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-black text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                </Link>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
