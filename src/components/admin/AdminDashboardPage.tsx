"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { BarChart3, CheckCircle2, Download, Filter, Lock, Mail, MessageSquare, RefreshCw, Search, Users } from "lucide-react";
import { supabase } from "@/lib/supabase/browser";

type PeriodFilter = "today" | "7d" | "30d" | "all";

type AdminLead = {
  id: string;
  name: string | null;
  email: string | null;
  whatsapp: string | null;
  business_type: string | null;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  created_at: string;
  email_status: string;
  email_sent_at: string | null;
};

type AdminSubscription = {
  id: string;
  user_id: string;
  email: string | null;
  name: string | null;
  plan_name: string | null;
  plan: string | null;
  status: string | null;
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  monthly_limit: number | null;
  monthly_usage: number;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

type AdminFeedback = {
  id: string;
  user_id: string | null;
  name: string | null;
  email: string | null;
  type: string;
  message: string;
  page: string | null;
  status: string;
  created_at: string;
};

type AdminPayload = {
  metrics: {
    totalLeads: number;
    leadsLast7Days: number;
    leadsLast30Days: number;
    totalUsers: number;
    activeSubscriptions: number;
    canceledSubscriptions: number;
    mostUsedPlan: string;
    emailSentSuccess: number;
    emailSentFailed: number;
    leadToSignupRate: number;
    signupToSubscriptionRate: number;
    leadToSubscriptionRate: number;
  };
  leads: AdminLead[];
  subscriptions: AdminSubscription[];
  feedback: AdminFeedback[];
  filterOptions: {
    businessTypes: string[];
    utmSources: string[];
    utmCampaigns: string[];
  };
  notes: {
    conversion: string;
  };
};

type ProductMetricsPayload = {
  period: { value: PeriodFilter; label: string; start: string | null };
  funnel: {
    totalLeads: number;
    periodLeads: number;
    totalUsers: number;
    completedOnboardingUsers: number;
    usersWithFirstResponse: number;
    activatedUsers: number;
    checkoutStartedUsers: number;
    activeSubscriptions: number;
    leadToSignupRate: number;
    signupToOnboardingRate: number;
    onboardingToFirstResponseRate: number;
    signupToActiveSubscriptionRate: number;
    activationRate: number;
  };
  activation: {
    definition: string;
    activatedUsers: number;
    activationRate: number;
    averageHoursToActivation: number | null;
  };
  usage: {
    totalResponses: number;
    averageResponsesPerUser: number;
    responsesToday: number;
    responsesLast7Days: number;
    responsesLast30Days: number;
    activeUsersLast7Days: number;
    activeUsersLast30Days: number;
  };
  feedback: {
    totalFeedbacks: number;
    periodFeedbacks: number;
    newFeedbacks: number;
    unresolvedFeedbacks: number;
    byType: {
      bug: number;
      duvida: number;
      sugestao: number;
      elogio: number;
      dificuldade_uso: number;
    };
  };
  campaign: {
    leadsByUtmSource: Array<{ label: string; count: number }>;
    leadsByUtmCampaign: Array<{ label: string; count: number }>;
    signupsByUtmCampaign: Array<{ campaign: string; leads: number; signups: number }>;
    activeSubscriptionsByCampaign: Array<{ label: string; count: number }>;
    checkoutStartedByCampaign: Array<{ label: string; count: number }>;
  };
  notes: {
    leadToSignup: string;
    checkoutStarted: string;
    campaign: string;
    timeToActivation: string;
  };
};

type Filters = {
  search: string;
  business_type: string;
  utm_source: string;
  utm_campaign: string;
  period: PeriodFilter;
};

const initialFilters: Filters = {
  search: "",
  business_type: "",
  utm_source: "",
  utm_campaign: "",
  period: "30d"
};

const periods: Array<{ value: PeriodFilter; label: string }> = [
  { value: "today", label: "Hoje" },
  { value: "7d", label: "Ultimos 7 dias" },
  { value: "30d", label: "Ultimos 30 dias" },
  { value: "all", label: "Todos" }
];

function formatDate(value?: string | null) {
  if (!value) return "Não informado";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function statusClass(status?: string | null) {
  const normalized = status?.toLowerCase();
  if (normalized === "active" || normalized === "trial" || normalized === "trialing" || normalized === "sent") {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  }
  if (normalized === "failed" || normalized === "canceled") {
    return "border-red-400/30 bg-red-500/10 text-red-200";
  }
  if (normalized === "pending" || normalized === "past_due" || normalized === "skipped") {
    return "border-amber-400/30 bg-amber-400/10 text-amber-100";
  }
  return "border-slate-400/20 bg-white/[0.04] text-slate-300";
}

function feedbackTypeLabel(type: string) {
  const labels: Record<string, string> = {
    bug: "Bug",
    duvida: "Dúvida",
    sugestao: "Sugestão",
    elogio: "Elogio",
    dificuldade_uso: "Dificuldade de uso"
  };
  return labels[type] || type;
}

function feedbackStatusLabel(status: string) {
  const labels: Record<string, string> = {
    new: "Novo",
    reviewing: "Em análise",
    resolved: "Resolvido",
    ignored: "Ignorado"
  };
  return labels[status] || status;
}

function summarizeMessage(message: string) {
  return message.length > 180 ? `${message.slice(0, 180)}...` : message;
}

function csvEscape(value: string | number | null | undefined) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function exportLeadsCsv(leads: AdminLead[]) {
  const headers = ["name", "email", "whatsapp", "business_type", "source", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "created_at"];
  const rows = leads.map((lead) =>
    [
      lead.name,
      lead.email,
      lead.whatsapp,
      lead.business_type,
      lead.source,
      lead.utm_source,
      lead.utm_medium,
      lead.utm_campaign,
      lead.utm_content,
      lead.utm_term,
      lead.created_at
    ]
      .map(csvEscape)
      .join(",")
  );
  const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `atendezap-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminPayload | null>(null);
  const [productMetrics, setProductMetrics] = useState<ProductMetricsPayload | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [updatingFeedbackId, setUpdatingFeedbackId] = useState("");

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError("");
    setAccessDenied(false);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setAccessDenied(true);
        setError("Faça login com um e-mail administrador para acessar esta área.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      const [response, metricsResponse] = await Promise.all([
        fetch(`/api/admin/overview?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        fetch(`/api/admin/metrics?period=${appliedFilters.period}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ]);
      const payload = (await response.json().catch(() => ({}))) as AdminPayload & { error?: string };
      const metricsPayload = (await metricsResponse.json().catch(() => ({}))) as ProductMetricsPayload & { error?: string };

      if (!response.ok) {
        setAccessDenied(response.status === 401 || response.status === 403);
        setError(payload.error || "Não foi possível carregar a área admin.");
        return;
      }

      if (!metricsResponse.ok) {
        setAccessDenied(metricsResponse.status === 401 || metricsResponse.status === 403);
        setError(metricsPayload.error || "NÃ£o foi possÃ­vel carregar as mÃ©tricas do produto.");
        return;
      }

      setData(payload);
      setProductMetrics(metricsPayload);
    } catch {
      setError("Não foi possível carregar a área admin agora.");
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadAdminData();
    });
  }, [loadAdminData]);

  const metrics = data?.metrics;
  const subscriptionGroups = useMemo(() => {
    const subscriptions = data?.subscriptions || [];
    return {
      active: subscriptions.filter((subscription) => ["active", "trial", "trialing"].includes(subscription.status?.toLowerCase() || "")),
      canceled: subscriptions.filter((subscription) => subscription.status?.toLowerCase() === "canceled"),
      pending: subscriptions.filter((subscription) => ["pending", "past_due", "unpaid", "incomplete"].includes(subscription.status?.toLowerCase() || ""))
    };
  }, [data]);

  function handleApplyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedFilters(filters);
  }

  async function updateFeedbackStatus(feedbackId: string, status: "reviewing" | "resolved") {
    setUpdatingFeedbackId(feedbackId);
    setError("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setAccessDenied(true);
        setError("Faça login com um e-mail administrador para atualizar feedbacks.");
        return;
      }

      const response = await fetch("/api/feedback", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: feedbackId, status })
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setError(result.error || "Não foi possível atualizar o feedback.");
        return;
      }

      setData((current) =>
        current
          ? {
              ...current,
              feedback: current.feedback.map((item) => (item.id === feedbackId ? { ...item, status } : item))
            }
          : current
      );
    } catch {
      setError("Não foi possível atualizar o feedback agora.");
    } finally {
      setUpdatingFeedbackId("");
    }
  }

  if (loading && !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090d12] px-4 text-white">
        <div className="rounded-lg border border-white/10 bg-[#101821] p-6 text-center shadow-2xl shadow-black/30">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-emerald-400" />
          <h1 className="text-lg font-black">Carregando admin...</h1>
          <p className="mt-2 text-sm text-slate-400">Verificando permissão e buscando dados do funil.</p>
        </div>
      </main>
    );
  }

  if (accessDenied) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090d12] px-4 text-white">
        <div className="max-w-md rounded-lg border border-red-400/30 bg-[#101821] p-6 text-center shadow-2xl shadow-black/30">
          <Lock className="mx-auto mb-4 h-10 w-10 text-red-200" />
          <h1 className="text-2xl font-black">Acesso restrito</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">{error || "Esta área é exclusiva para administradores."}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-8 text-slate-100">
      <section className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Admin</p>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Painel interno AtendeZap IA</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              Acompanhe leads capturados, campanhas, entregas do ebook, assinaturas e conversão aproximada.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadAdminData()}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 hover:bg-emerald-300 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
        </header>

        {error ? <div className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm font-bold text-red-200">{error}</div> : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total de leads" value={metrics?.totalLeads ?? 0} icon={<Users className="h-5 w-5" />} />
          <MetricCard label="Leads ultimos 7 dias" value={metrics?.leadsLast7Days ?? 0} icon={<BarChart3 className="h-5 w-5" />} />
          <MetricCard label="Leads ultimos 30 dias" value={metrics?.leadsLast30Days ?? 0} icon={<BarChart3 className="h-5 w-5" />} />
          <MetricCard label="Usuarios cadastrados" value={metrics?.totalUsers ?? 0} icon={<Users className="h-5 w-5" />} />
          <MetricCard label="Assinaturas ativas" value={metrics?.activeSubscriptions ?? 0} icon={<BarChart3 className="h-5 w-5" />} />
          <MetricCard label="Assinaturas canceladas" value={metrics?.canceledSubscriptions ?? 0} icon={<BarChart3 className="h-5 w-5" />} />
          <MetricCard label="Plano mais usado" value={metrics?.mostUsedPlan || "Sem dados"} icon={<BarChart3 className="h-5 w-5" />} />
          <MetricCard label="Ebooks enviados" value={metrics?.emailSentSuccess ?? 0} icon={<Mail className="h-5 w-5" />} />
          <MetricCard label="Falha no envio" value={metrics?.emailSentFailed ?? 0} icon={<Mail className="h-5 w-5" />} />
          <MetricCard label="Feedbacks recentes" value={data?.feedback?.length ?? 0} icon={<MessageSquare className="h-5 w-5" />} />
          <MetricCard label="Lead -> cadastro" value={`${metrics?.leadToSignupRate ?? 0}%`} icon={<BarChart3 className="h-5 w-5" />} />
          <MetricCard label="Cadastro -> assinatura" value={`${metrics?.signupToSubscriptionRate ?? 0}%`} icon={<BarChart3 className="h-5 w-5" />} />
          <MetricCard label="Lead -> assinatura" value={`${metrics?.leadToSubscriptionRate ?? 0}%`} icon={<BarChart3 className="h-5 w-5" />} />
        </section>

        {productMetrics ? (
          <section className="mt-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">MÃ©tricas do produto</p>
                <h2 className="mt-2 text-2xl font-black text-white">AtivaÃ§Ã£o e conversÃ£o inicial</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  NÃºmeros agregados para entender se os primeiros usuÃ¡rios avanÃ§am no funil e usam o produto de verdade. PerÃ­odo aplicado: {productMetrics.period.label}.
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-slate-300">
                Sem dados pessoais
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Leads no perÃ­odo" value={productMetrics.funnel.periodLeads} icon={<Users className="h-5 w-5" />} />
              <MetricCard label="Onboarding concluÃ­do" value={productMetrics.funnel.completedOnboardingUsers} icon={<CheckCircle2 className="h-5 w-5" />} />
              <MetricCard label="Primeira resposta" value={productMetrics.funnel.usersWithFirstResponse} icon={<MessageSquare className="h-5 w-5" />} />
              <MetricCard label="UsuÃ¡rios ativados" value={productMetrics.activation.activatedUsers} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard label="Taxa de ativaÃ§Ã£o" value={`${productMetrics.activation.activationRate}%`} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard label="Checkout iniciado" value={productMetrics.funnel.checkoutStartedUsers} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard label="Assinantes ativos" value={productMetrics.funnel.activeSubscriptions} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard
                label="Tempo atÃ© ativaÃ§Ã£o"
                value={productMetrics.activation.averageHoursToActivation === null ? "Sem amostra" : `${productMetrics.activation.averageHoursToActivation}h`}
                icon={<BarChart3 className="h-5 w-5" />}
              />
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-4">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <h3 className="text-lg font-black text-white">Funil</h3>
                <div className="mt-4 grid gap-3">
                  <ConversionLine label="Lead -> cadastro" value={`${productMetrics.funnel.leadToSignupRate}%`} />
                  <ConversionLine label="Cadastro -> onboarding" value={`${productMetrics.funnel.signupToOnboardingRate}%`} />
                  <ConversionLine label="Onboarding -> primeira resposta" value={`${productMetrics.funnel.onboardingToFirstResponseRate}%`} />
                  <ConversionLine label="Cadastro -> assinatura ativa" value={`${productMetrics.funnel.signupToActiveSubscriptionRate}%`} />
                </div>
                <p className="mt-4 rounded-md border border-amber-400/20 bg-amber-400/10 p-3 text-xs font-bold leading-5 text-amber-100">
                  {productMetrics.notes.leadToSignup}
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <h3 className="text-lg font-black text-white">Uso</h3>
                <div className="mt-4 grid gap-3">
                  <ConversionLine label="Respostas hoje" value={productMetrics.usage.responsesToday} />
                  <ConversionLine label="Respostas 7 dias" value={productMetrics.usage.responsesLast7Days} />
                  <ConversionLine label="Respostas 30 dias" value={productMetrics.usage.responsesLast30Days} />
                  <ConversionLine label="Total de respostas" value={productMetrics.usage.totalResponses} />
                  <ConversionLine label="MÃ©dia por usuÃ¡rio" value={productMetrics.usage.averageResponsesPerUser} />
                  <ConversionLine label="UsuÃ¡rios ativos 7 dias" value={productMetrics.usage.activeUsersLast7Days} />
                  <ConversionLine label="UsuÃ¡rios ativos 30 dias" value={productMetrics.usage.activeUsersLast30Days} />
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <h3 className="text-lg font-black text-white">Feedback</h3>
                <div className="mt-4 grid gap-3">
                  <ConversionLine label="Feedbacks no perÃ­odo" value={productMetrics.feedback.periodFeedbacks} />
                  <ConversionLine label="Novos" value={productMetrics.feedback.newFeedbacks} />
                  <ConversionLine label="NÃ£o resolvidos" value={productMetrics.feedback.unresolvedFeedbacks} />
                  <ConversionLine label="Bug" value={productMetrics.feedback.byType.bug} />
                  <ConversionLine label="DÃºvida" value={productMetrics.feedback.byType.duvida} />
                  <ConversionLine label="SugestÃ£o" value={productMetrics.feedback.byType.sugestao} />
                  <ConversionLine label="Elogio" value={productMetrics.feedback.byType.elogio} />
                  <ConversionLine label="Dificuldade de uso" value={productMetrics.feedback.byType.dificuldade_uso} />
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <h3 className="text-lg font-black text-white">Campanhas</h3>
                <div className="mt-4 grid gap-3">
                  {(productMetrics.campaign.leadsByUtmSource.length ? productMetrics.campaign.leadsByUtmSource : [{ label: "sem_utm", count: 0 }]).slice(0, 4).map((item) => (
                    <ConversionLine key={`source-${item.label}`} label={`Source: ${item.label}`} value={item.count} />
                  ))}
                  {(productMetrics.campaign.leadsByUtmCampaign.length ? productMetrics.campaign.leadsByUtmCampaign : [{ label: "sem_utm", count: 0 }]).slice(0, 4).map((item) => (
                    <ConversionLine key={`campaign-${item.label}`} label={`Campanha: ${item.label}`} value={item.count} />
                  ))}
                  {(productMetrics.campaign.checkoutStartedByCampaign.length ? productMetrics.campaign.checkoutStartedByCampaign : [{ label: "sem_dados", count: 0 }]).slice(0, 3).map((item) => (
                    <ConversionLine key={`checkout-${item.label}`} label={`Checkout: ${item.label}`} value={item.count} />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-xs font-bold leading-5 text-slate-400 lg:grid-cols-2">
              <p className="rounded-md border border-white/10 bg-[#0b1118] p-3">{productMetrics.activation.definition}</p>
              <p className="rounded-md border border-white/10 bg-[#0b1118] p-3">{productMetrics.notes.checkoutStarted}</p>
              <p className="rounded-md border border-white/10 bg-[#0b1118] p-3">{productMetrics.notes.campaign}</p>
              <p className="rounded-md border border-white/10 bg-[#0b1118] p-3 lg:col-span-2">{productMetrics.notes.timeToActivation}</p>
            </div>
          </section>
        ) : null}

        <section className="mt-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Feedbacks recentes</p>
              <h2 className="mt-2 text-2xl font-black text-white">Primeiros usuários</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Use esta lista para priorizar bugs, dúvidas e dificuldades de uso da produção controlada.</p>
            </div>
          </div>

          <div className="grid gap-3">
            {data?.feedback?.length ? (
              data.feedback.map((item) => (
                <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={item.id}>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200">{feedbackTypeLabel(item.type)}</span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(item.status)}`}>{feedbackStatusLabel(item.status)}</span>
                      </div>
                      <p className="mt-3 text-sm font-black text-white">{item.email || item.name || "Contato não informado"}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{summarizeMessage(item.message)}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-slate-500">
                        <span>Página: {item.page || "-"}</span>
                        <span>Data: {formatDate(item.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                      <button
                        type="button"
                        onClick={() => void updateFeedbackStatus(item.id, "reviewing")}
                        disabled={updatingFeedbackId === item.id || item.status === "reviewing"}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-xs font-black text-slate-100 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Em análise
                      </button>
                      <button
                        type="button"
                        onClick={() => void updateFeedbackStatus(item.id, "resolved")}
                        disabled={updatingFeedbackId === item.id || item.status === "resolved"}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-emerald-400 px-3 text-xs font-black text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Resolvido
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-8 text-center text-sm text-slate-400">
                <MessageSquare className="mx-auto mb-4 h-8 w-8 text-slate-500" />
                <p className="font-bold text-slate-200">Nenhum feedback recebido ainda.</p>
                <p className="mt-2">Quando os primeiros usuários enviarem comentários, eles aparecerão aqui.</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Leads capturados</p>
              <h2 className="mt-2 text-2xl font-black text-white">Origem das campanhas</h2>
            </div>
            <button
              type="button"
              onClick={() => exportLeadsCsv(data?.leads || [])}
              disabled={!data?.leads.length}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-black text-slate-950 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </button>
          </div>

          <form onSubmit={handleApplyFilters} className="mb-5 grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr_180px_auto]">
            <label className="grid gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
              Buscar
              <span className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={filters.search}
                  onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                  className="field-input pl-9"
                  placeholder="Nome ou e-mail"
                />
              </span>
            </label>
            <FilterSelect label="Tipo" value={filters.business_type} onChange={(value) => setFilters((current) => ({ ...current, business_type: value }))} options={data?.filterOptions.businessTypes || []} />
            <FilterSelect label="UTM source" value={filters.utm_source} onChange={(value) => setFilters((current) => ({ ...current, utm_source: value }))} options={data?.filterOptions.utmSources || []} />
            <FilterSelect label="UTM campaign" value={filters.utm_campaign} onChange={(value) => setFilters((current) => ({ ...current, utm_campaign: value }))} options={data?.filterOptions.utmCampaigns || []} />
            <label className="grid gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
              Periodo
              <select value={filters.period} onChange={(event) => setFilters((current) => ({ ...current, period: event.target.value as PeriodFilter }))} className="field-input">
                {periods.map((period) => (
                  <option value={period.value} key={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 self-end rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 hover:bg-emerald-300">
              <Filter className="h-4 w-4" />
              Filtrar
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full border-separate border-spacing-0 text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {["Nome", "E-mail", "WhatsApp", "Tipo", "Source", "UTM source", "UTM campaign", "Cadastro", "Ebook"].map((header) => (
                    <th className="border-b border-white/10 px-3 py-3 font-black" key={header}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.leads.length ? (
                  data.leads.map((lead) => (
                    <tr className="border-b border-white/10" key={lead.id}>
                      <td className="border-b border-white/10 px-3 py-3 font-bold text-white">{lead.name || "Sem nome"}</td>
                      <td className="border-b border-white/10 px-3 py-3 text-slate-300">{lead.email || "Sem e-mail"}</td>
                      <td className="border-b border-white/10 px-3 py-3 text-slate-300">{lead.whatsapp || "-"}</td>
                      <td className="border-b border-white/10 px-3 py-3 text-slate-300">{lead.business_type || "-"}</td>
                      <td className="border-b border-white/10 px-3 py-3 text-slate-300">{lead.source || "-"}</td>
                      <td className="border-b border-white/10 px-3 py-3 text-slate-300">{lead.utm_source || "-"}</td>
                      <td className="border-b border-white/10 px-3 py-3 text-slate-300">{lead.utm_campaign || "-"}</td>
                      <td className="border-b border-white/10 px-3 py-3 text-slate-300">{formatDate(lead.created_at)}</td>
                      <td className="border-b border-white/10 px-3 py-3">
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${statusClass(lead.email_status)}`}>{lead.email_status}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-8 text-center text-slate-400" colSpan={9}>
                      Nenhum lead encontrado para os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.75fr]">
          <div className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Assinaturas</p>
            <h2 className="mt-2 text-2xl font-black text-white">Planos e status</h2>
            <div className="mt-5 grid gap-3">
              {data?.subscriptions.length ? (
                data.subscriptions.map((subscription) => (
                  <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={subscription.id}>
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="font-black text-white">{subscription.email || "E-mail não informado"}</p>
                        <p className="mt-1 text-sm text-slate-400">{subscription.name || subscription.user_id}</p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(subscription.status)}`}>{subscription.status || "sem status"}</span>
                    </div>
                    <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2 xl:grid-cols-3">
                      <Info label="Plano" value={subscription.plan || subscription.plan_name || "-"} />
                      <Info label="Limite mensal" value={subscription.monthly_limit ?? "-"} />
                      <Info label="Uso atual" value={subscription.monthly_usage} />
                      <Info label="Stripe customer" value={subscription.provider_customer_id || "-"} />
                      <Info label="Stripe subscription" value={subscription.provider_subscription_id || "-"} />
                      <Info label="Renovacao/fim" value={formatDate(subscription.current_period_end)} />
                      <Info label="Criada em" value={formatDate(subscription.created_at)} />
                      <Info label="Atualizada em" value={formatDate(subscription.updated_at)} />
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-8 text-center text-sm text-slate-400">
                  Nenhuma assinatura encontrada.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Conversão aproximada</p>
            <h2 className="mt-2 text-2xl font-black text-white">Resumo do funil</h2>
            <div className="mt-5 grid gap-3">
              <ConversionLine label="Leads totais" value={metrics?.totalLeads ?? 0} />
              <ConversionLine label="Usuários cadastrados" value={metrics?.totalUsers ?? 0} />
              <ConversionLine label="Assinaturas ativas" value={metrics?.activeSubscriptions ?? 0} />
              <ConversionLine label="Lead -> cadastro" value={`${metrics?.leadToSignupRate ?? 0}%`} />
              <ConversionLine label="Cadastro -> assinatura" value={`${metrics?.signupToSubscriptionRate ?? 0}%`} />
              <ConversionLine label="Lead -> assinatura" value={`${metrics?.leadToSubscriptionRate ?? 0}%`} />
            </div>
            <p className="mt-5 rounded-md border border-amber-400/20 bg-amber-400/10 p-3 text-xs font-bold leading-5 text-amber-100">
              {data?.notes.conversion || "Conversão aproximada por e-mail entre leads e usuários."}
            </p>
            <div className="mt-5 grid gap-3 text-sm">
              <ConversionLine label="Ativas" value={subscriptionGroups.active.length} />
              <ConversionLine label="Canceladas" value={subscriptionGroups.canceled.length} />
              <ConversionLine label="Pendentes" value={subscriptionGroups.pending.length} />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string | number; icon: ReactNode }) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-emerald-400 text-slate-950">{icon}</div>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </article>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="field-input">
        <option value="">Todos</option>
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-[#0b1118] p-3">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-words font-bold text-slate-200">{value}</p>
    </div>
  );
}

function ConversionLine({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="text-sm font-bold text-slate-300">{label}</span>
      <span className="font-black text-white">{value}</span>
    </div>
  );
}
