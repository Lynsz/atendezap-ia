"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { BarChart3, CheckCircle2, Download, Filter, Lock, Mail, MessageSquare, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";
import CampaignAdminSection from "@/components/admin/CampaignAdminSection";
import ProductInsightsSection from "@/components/admin/ProductInsightsSection";
import { getDataRequestStatusLabel, getDataRequestTypeLabel, type DataRequestStatus } from "@/lib/data-requests";
import { supabase } from "@/lib/supabase/browser";
import { supportPriorities, supportPriorityLabel, supportStatuses, supportStatusLabel, type SupportPriority, type SupportStatus } from "@/lib/support";

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
  email_event_type: string | null;
  email_event_created_at: string | null;
  email_error: string | null;
};

type AdminSubscription = {
  id: string;
  user_id: string;
  email: string | null;
  name: string | null;
  plan_name: string | null;
  plan: string | null;
  status: string | null;
  subscription_status?: string | null;
  last_payment_status?: string | null;
  cancel_at_period_end?: boolean | null;
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
  source: string | null;
  context: string | null;
  campaign: string | null;
  status: string;
  created_at: string;
};

type AdminDataRequest = {
  id: string;
  user_id: string;
  user_id_short: string;
  user_email_masked: string | null;
  type: string;
  status: DataRequestStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type AdminSupportRequest = {
  id: string;
  user_id: string | null;
  user_id_short: string | null;
  user_email_masked: string | null;
  email: string | null;
  category: string;
  subject: string;
  message: string;
  status: SupportStatus;
  priority: SupportPriority;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
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
    emailSkippedNotConfigured: number;
    leadToSignupRate: number;
    signupToSubscriptionRate: number;
    leadToSubscriptionRate: number;
  };
  leads: AdminLead[];
  subscriptions: AdminSubscription[];
  feedback: AdminFeedback[];
  supportRequests: AdminSupportRequest[];
  filterOptions: {
    businessTypes: string[];
    utmSources: string[];
    utmCampaigns: string[];
  };
  notes: {
    conversion: string;
  };
};

type AdminDataRequestsPayload = {
  dataRequests: AdminDataRequest[];
};

type ProductMetricsPayload = {
  period: { value: PeriodFilter; label: string; start: string | null };
  availability: {
    leads: boolean;
    profiles: boolean;
    businesses: boolean;
    generatedResponses: boolean;
    subscriptions: boolean;
    feedback: boolean;
    aiResponseFeedback: boolean;
    savedResponses: boolean;
    events: boolean;
    stripeWebhookEvents: boolean;
    supportRequests: boolean;
    cancellationFeedback: boolean;
  };
  funnel: {
    totalLeads: number;
    periodLeads: number;
    totalUsers: number;
    completedOnboardingUsers: number;
    usersWithFirstResponse: number;
    usersWithSavedOrCopiedResponse: number;
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
    newUsersLast7Days: number;
    onboardingCompletedLast7Days: number;
    firstResponsesGenerated: number;
    firstResponsesLast7Days: number;
    responsesSaved: number;
    usersWithSavedResponses: number;
    usersWithCopiedResponse: number;
    usersWithFavoriteResponse: number;
    activeUsersLast7Days: number;
    checkoutStartedUsers: number;
    activeSubscriptions: number;
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
    totalSavedResponses: number;
    periodSavedResponses: number;
    usersWithSavedResponses: number;
    totalSavedTemplates: number;
    savedTemplatesByCategory: Array<{ label: string; count: number }>;
    usersNearLimit: number;
    usersAtLimit: number;
    topUsageUsers: Array<{ user_id: string; user_id_short: string; responses_used: number }>;
    aiCostEstimate: number | null;
    aiCostEstimateNote: string;
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
  operationalHealth: {
    responsesGeneratedToday: number;
    aiFailuresToday: number;
    leadsToday: number;
    checkoutsStartedToday: number;
    stripeWebhooksProcessedToday: number;
    stripeWebhookFailuresToday: number;
    recentNegativeFeedbacks: number;
    activeSubscriptions: number;
  };
  revenue: {
    checkoutStartedUsers: number;
    activeSubscriptions: number;
    canceledSubscriptions: number;
    pastDueSubscriptions: number;
    failedPaymentSubscriptions: number;
    newSubscribersLast30Days: number;
    cancellationsLast30Days: number;
    activeSubscriptionsByPlan: Array<{ label: string; count: number }>;
    estimatedMrr: number | null;
  };
  churn: {
    cancellationFeedbacks: number;
    cancellationFeedbacksLast30Days: number;
    cancellationReasons: Array<{ label: string; count: number }>;
  };
  supportQuality: {
    supportRequestsPeriod: number;
    openSupportRequests: number;
    recentNegativeFeedbacks: number;
  };
  aiQuality: {
    totalFeedbacks: number;
    periodFeedbacks: number;
    positiveFeedbacks: number;
    negativeFeedbacks: number;
    usefulRate: number;
    recentComments: Array<{ rating: string; comment: string; created_at: string }>;
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

type CampaignReportPayload = {
  period: { value: PeriodFilter; label: string; start: string | null };
  filters: {
    utm_source: string;
    utm_campaign: string;
  };
  filterOptions: {
    utmSources: string[];
    utmCampaigns: string[];
  };
  metrics: {
    totalLeads: number;
    totalSignups: number;
    onboardingCompleted: number;
    activatedUsers: number;
    demoUses: number;
    firstResponseGenerated: number;
    checkoutStarted: number;
    activeSubscriptions: number;
    feedbackCount: number;
    difficultyFeedbacks: number;
    leadToSignupRate: number;
    signupToOnboardingRate: number;
    onboardingToFirstResponseRate: number;
    signupToSubscriptionRate: number;
    leadToSubscriptionRate: number;
  };
  breakdowns: {
    leadsByUtmSource: Array<{ label: string; count: number }>;
    leadsByUtmCampaign: Array<{ label: string; count: number }>;
    leadsByUtmContent: Array<{ label: string; count: number }>;
  };
  interpretation: string;
  notes: string[];
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
  if (normalized === "completed") {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  }
  if (normalized === "processing") {
    return "border-sky-400/30 bg-sky-400/10 text-sky-100";
  }
  if (normalized === "failed" || normalized === "canceled" || normalized === "rejected") {
    return "border-red-400/30 bg-red-500/10 text-red-200";
  }
  if (normalized === "pending" || normalized === "past_due" || normalized === "skipped" || normalized === "skipped_not_configured") {
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

function emailStatusLabel(status?: string | null) {
  const labels: Record<string, string> = {
    sent: "Enviado",
    failed: "Falhou",
    skipped: "Sem Resend",
    skipped_not_configured: "Resend nao configurado",
    pending: "Pendente",
    sem_registro: "Sem registro"
  };
  return labels[status || ""] || status || "Sem registro";
}

function exportLeadsCsv(leads: AdminLead[]) {
  const headers = ["name", "email", "whatsapp", "business_type", "source", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "created_at", "email_status", "email_sent_at", "email_error"];
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
      lead.created_at,
      lead.email_status,
      lead.email_sent_at,
      lead.email_error
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

function exportCampaignReportCsv(report: CampaignReportPayload) {
  const headers = [
    "periodo",
    "utm_source",
    "utm_campaign",
    "total_leads",
    "total_signups",
    "onboarding_completed",
    "activated_users",
    "demo_uses",
    "checkout_started",
    "active_subscriptions",
    "feedback_count",
    "lead_to_signup_rate",
    "signup_to_onboarding_rate",
    "onboarding_to_activation_rate",
    "signup_to_subscription_rate"
  ];
  const row = [
    report.period.label,
    report.filters.utm_source || "todos",
    report.filters.utm_campaign || "todos",
    report.metrics.totalLeads,
    report.metrics.totalSignups,
    report.metrics.onboardingCompleted,
    report.metrics.activatedUsers,
    report.metrics.demoUses,
    report.metrics.checkoutStarted,
    report.metrics.activeSubscriptions,
    report.metrics.feedbackCount,
    report.metrics.leadToSignupRate,
    report.metrics.signupToOnboardingRate,
    report.metrics.onboardingToFirstResponseRate,
    report.metrics.signupToSubscriptionRate
  ];
  const blob = new Blob([[headers.join(","), row.map(csvEscape).join(",")].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `atendezap-campaign-report-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportInternalMetricsCsv(metrics: ProductMetricsPayload) {
  const rows = [
    ["categoria", "metrica", "valor"],
    ["aquisicao", "leads_periodo", metrics.availability.leads ? metrics.funnel.periodLeads : "nao_disponivel"],
    ["aquisicao", "cadastros", metrics.availability.profiles ? metrics.funnel.totalUsers : "nao_disponivel"],
    ["ativacao", "onboarding_concluido", metrics.availability.businesses ? metrics.funnel.completedOnboardingUsers : "nao_disponivel"],
    ["ativacao", "primeira_resposta", metrics.availability.generatedResponses ? metrics.funnel.usersWithFirstResponse : "nao_disponivel"],
    ["ativacao", "resposta_salva_ou_copiada", metrics.availability.savedResponses ? metrics.funnel.usersWithSavedOrCopiedResponse : "nao_disponivel"],
    ["uso", "respostas_7_dias", metrics.availability.generatedResponses ? metrics.usage.responsesLast7Days : "nao_disponivel"],
    ["uso", "usuarios_ativos_7_dias", metrics.availability.generatedResponses ? metrics.usage.activeUsersLast7Days : "nao_disponivel"],
    ["uso", "usuarios_perto_limite", metrics.availability.generatedResponses && metrics.availability.subscriptions ? metrics.usage.usersNearLimit : "nao_disponivel"],
    ["uso", "usuarios_no_limite", metrics.availability.generatedResponses && metrics.availability.subscriptions ? metrics.usage.usersAtLimit : "nao_disponivel"],
    ["custo_ia", "estimativa", metrics.usage.aiCostEstimate === null ? "indisponivel" : metrics.usage.aiCostEstimate],
    ["receita", "checkouts_iniciados", metrics.availability.subscriptions ? metrics.revenue.checkoutStartedUsers : "nao_disponivel"],
    ["receita", "assinaturas_ativas", metrics.availability.subscriptions ? metrics.revenue.activeSubscriptions : "nao_disponivel"],
    ["receita", "assinaturas_canceladas", metrics.availability.subscriptions ? metrics.revenue.canceledSubscriptions : "nao_disponivel"],
    ["receita", "pagamentos_com_falha", metrics.availability.subscriptions ? metrics.revenue.failedPaymentSubscriptions : "nao_disponivel"],
    ["churn", "feedbacks_cancelamento_30_dias", metrics.availability.cancellationFeedback ? metrics.churn.cancellationFeedbacksLast30Days : "nao_disponivel"],
    ["suporte", "solicitacoes_abertas", metrics.availability.supportRequests ? metrics.supportQuality.openSupportRequests : "nao_disponivel"],
    ["qualidade", "feedbacks_negativos_recentes", metrics.availability.feedback && metrics.availability.aiResponseFeedback ? metrics.supportQuality.recentNegativeFeedbacks : "nao_disponivel"]
  ];
  const blob = new Blob([rows.map((row) => row.map(csvEscape).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `atendezap-internal-metrics-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getLikelyBottleneck(report: CampaignReportPayload | null, metrics: ProductMetricsPayload | null) {
  const funnel = report
    ? {
        leads: report.metrics.totalLeads,
        signups: report.metrics.totalSignups,
        onboarding: report.metrics.onboardingCompleted,
        firstResponses: report.metrics.firstResponseGenerated,
        checkouts: report.metrics.checkoutStarted,
        subscriptions: report.metrics.activeSubscriptions
      }
    : metrics
      ? {
          leads: metrics.funnel.periodLeads || metrics.funnel.totalLeads,
          signups: metrics.funnel.totalUsers,
          onboarding: metrics.funnel.completedOnboardingUsers,
          firstResponses: metrics.funnel.usersWithFirstResponse,
          checkouts: metrics.funnel.checkoutStartedUsers,
          subscriptions: metrics.funnel.activeSubscriptions
        }
      : null;

  if (!funnel) {
    return "Ainda não há dados suficientes para conclusão.";
  }
  if (funnel.leads === 0 && funnel.signups === 0) {
    return "Poucos leads: revise criativo, público ou landing.";
  }
  if (funnel.leads < 5 && funnel.signups < 3) {
    return "Ainda não há dados suficientes para conclusão.";
  }
  if (funnel.leads >= 5 && funnel.signups < Math.max(1, Math.ceil(funnel.leads * 0.15))) {
    return "Gargalo provável: lead para cadastro. Revise página de obrigado, CTA e proposta de valor.";
  }
  if (funnel.signups >= 3 && funnel.onboarding < Math.max(1, Math.ceil(funnel.signups * 0.4))) {
    return "Gargalo provável: onboarding. Revise clareza e número de campos.";
  }
  if (funnel.onboarding >= 3 && funnel.firstResponses < Math.max(1, Math.ceil(funnel.onboarding * 0.5))) {
    return "Gargalo provável: primeira experiência no dashboard. Destaque melhor o campo de geração.";
  }
  if (funnel.firstResponses >= 3 && funnel.checkouts === 0) {
    return "Gargalo provável: oferta, pricing ou CTA para plano.";
  }
  if (funnel.checkouts >= 2 && funnel.subscriptions === 0) {
    return "Gargalo provável: preço, confiança ou checkout.";
  }
  return "Ainda não há dados suficientes para conclusão.";
}

function availableValue(available: boolean, value: string | number) {
  return available ? value : "Não disponível";
}

function stageRate(current: number, previous: number) {
  if (!previous) return "Não disponível";
  return `${Number(((current / previous) * 100).toFixed(1))}%`;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminPayload | null>(null);
  const [productMetrics, setProductMetrics] = useState<ProductMetricsPayload | null>(null);
  const [campaignReport, setCampaignReport] = useState<CampaignReportPayload | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [updatingFeedbackId, setUpdatingFeedbackId] = useState("");
  const [dataRequests, setDataRequests] = useState<AdminDataRequest[]>([]);
  const [updatingDataRequestId, setUpdatingDataRequestId] = useState("");
  const [dataRequestNotes, setDataRequestNotes] = useState<Record<string, string>>({});
  const [updatingSupportRequestId, setUpdatingSupportRequestId] = useState("");
  const [supportNotes, setSupportNotes] = useState<Record<string, string>>({});

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

      const [response, metricsResponse, campaignResponse, dataRequestsResponse] = await Promise.all([
        fetch(`/api/admin/overview?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        fetch(`/api/admin/metrics?period=${appliedFilters.period}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        fetch(`/api/admin/campaign-report?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        fetch("/api/admin/data-requests", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ]);
      const payload = (await response.json().catch(() => ({}))) as AdminPayload & { error?: string };
      const metricsPayload = (await metricsResponse.json().catch(() => ({}))) as ProductMetricsPayload & { error?: string };
      const campaignPayload = (await campaignResponse.json().catch(() => ({}))) as CampaignReportPayload & { error?: string };
      const dataRequestsPayload = (await dataRequestsResponse.json().catch(() => ({}))) as AdminDataRequestsPayload & { error?: string };

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

      if (!campaignResponse.ok) {
        setAccessDenied(campaignResponse.status === 401 || campaignResponse.status === 403);
        setError(campaignPayload.error || "Nao foi possivel carregar o relatorio de campanha.");
        return;
      }

      if (!dataRequestsResponse.ok) {
        setAccessDenied(dataRequestsResponse.status === 401 || dataRequestsResponse.status === 403);
        setError(dataRequestsPayload.error || "Nao foi possivel carregar as solicitacoes de dados.");
        return;
      }

      setData(payload);
      setProductMetrics(metricsPayload);
      setCampaignReport(campaignPayload);
      setDataRequests(dataRequestsPayload.dataRequests || []);
      setDataRequestNotes(
        Object.fromEntries((dataRequestsPayload.dataRequests || []).map((item) => [item.id, item.notes || ""]))
      );
      setSupportNotes(Object.fromEntries((payload.supportRequests || []).map((item) => [item.id, item.admin_notes || ""])));
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
  const likelyBottleneck = useMemo(() => getLikelyBottleneck(campaignReport, productMetrics), [campaignReport, productMetrics]);
  const subscriptionGroups = useMemo(() => {
    const subscriptions = data?.subscriptions || [];
    return {
      active: subscriptions.filter((subscription) => ["active", "trial", "trialing"].includes(subscription.status?.toLowerCase() || "")),
      canceled: subscriptions.filter((subscription) => subscription.status?.toLowerCase() === "canceled"),
      pastDue: subscriptions.filter((subscription) => subscription.status?.toLowerCase() === "past_due"),
      failedPayment: subscriptions.filter((subscription) => ["past_due", "unpaid"].includes(subscription.status?.toLowerCase() || "") || subscription.last_payment_status?.toLowerCase() === "failed"),
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

  async function updateDataRequestStatus(requestId: string, status: DataRequestStatus) {
    setUpdatingDataRequestId(requestId);
    setError("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setAccessDenied(true);
        setError("Faca login com um e-mail administrador para atualizar solicitacoes.");
        return;
      }

      const response = await fetch("/api/admin/data-requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id: requestId,
          status,
          notes: dataRequestNotes[requestId] || null
        })
      });
      const result = (await response.json().catch(() => ({}))) as { dataRequest?: AdminDataRequest; error?: string };

      if (!response.ok || !result.dataRequest) {
        setError(result.error || "Nao foi possivel atualizar a solicitacao.");
        return;
      }

      setDataRequests((current) => current.map((item) => (item.id === requestId ? { ...item, ...result.dataRequest } : item)));
    } catch {
      setError("Nao foi possivel atualizar a solicitacao agora.");
    } finally {
      setUpdatingDataRequestId("");
    }
  }

  async function updateSupportRequest(requestId: string, updates: { status?: SupportStatus; priority?: SupportPriority }) {
    setUpdatingSupportRequestId(requestId);
    setError("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setAccessDenied(true);
        setError("Faca login com um e-mail administrador para atualizar suporte.");
        return;
      }

      const response = await fetch(`/api/admin/support/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...updates,
          admin_notes: supportNotes[requestId] || null
        })
      });
      const result = (await response.json().catch(() => ({}))) as { supportRequest?: AdminSupportRequest; error?: string };

      if (!response.ok || !result.supportRequest) {
        setError(result.error || "Nao foi possivel atualizar a solicitacao de suporte.");
        return;
      }

      setData((current) =>
        current
          ? {
              ...current,
              supportRequests: current.supportRequests.map((item) => (item.id === requestId ? { ...item, ...result.supportRequest } : item))
            }
          : current
      );
    } catch {
      setError("Nao foi possivel atualizar a solicitacao de suporte agora.");
    } finally {
      setUpdatingSupportRequestId("");
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

        <ProductInsightsSection
          supportRequests={data?.supportRequests || []}
          feedback={data?.feedback || []}
          aiNegativeCount={productMetrics?.aiQuality.negativeFeedbacks || 0}
          churnFeedbackCount={productMetrics?.churn.cancellationFeedbacks || 0}
        />

        <CampaignAdminSection />

        <section className="mb-6 rounded-lg border border-amber-300/20 bg-amber-400/10 p-5 shadow-xl shadow-black/20">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-100">Diagnóstico do funil</p>
          <h2 className="mt-2 text-2xl font-black text-white">{likelyBottleneck}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-50/80">
            Regra simples baseada em leads, cadastros, onboarding, primeira resposta, checkout e assinatura. Use como triagem inicial antes de decidir a próxima melhoria.
          </p>
        </section>

        {productMetrics ? (
          <section className="mb-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Relatórios</p>
                <h2 className="mt-2 text-2xl font-black text-white">Saúde do produto e do negócio</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  Visão agregada de aquisição, ativação, uso, receita e suporte. Não mostra conteúdo completo de respostas, dados de pagamento ou secrets.
                </p>
              </div>
              <button
                type="button"
                onClick={() => exportInternalMetricsCsv(productMetrics)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-black text-slate-950 hover:bg-slate-100"
              >
                <Download className="h-4 w-4" />
                Exportar métricas CSV
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Usuários totais" value={availableValue(productMetrics.availability.profiles, productMetrics.funnel.totalUsers)} icon={<Users className="h-5 w-5" />} />
              <MetricCard label="Usuários novos 7 dias" value={availableValue(productMetrics.availability.profiles, productMetrics.activation.newUsersLast7Days)} icon={<Users className="h-5 w-5" />} />
              <MetricCard label="Leads 7 dias" value={availableValue(productMetrics.availability.leads, metrics?.leadsLast7Days ?? 0)} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard label="Onboardings concluídos" value={availableValue(productMetrics.availability.businesses, productMetrics.funnel.completedOnboardingUsers)} icon={<CheckCircle2 className="h-5 w-5" />} />
              <MetricCard label="Respostas geradas 7 dias" value={availableValue(productMetrics.availability.generatedResponses, productMetrics.usage.responsesLast7Days)} icon={<MessageSquare className="h-5 w-5" />} />
              <MetricCard label="Respostas salvas" value={availableValue(productMetrics.availability.savedResponses, productMetrics.activation.responsesSaved)} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard label="Usuários ativos 7 dias" value={availableValue(productMetrics.availability.generatedResponses, productMetrics.activation.activeUsersLast7Days)} icon={<Users className="h-5 w-5" />} />
              <MetricCard label="Checkouts iniciados" value={availableValue(productMetrics.availability.subscriptions, productMetrics.revenue.checkoutStartedUsers)} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard label="Assinaturas ativas" value={availableValue(productMetrics.availability.subscriptions, productMetrics.revenue.activeSubscriptions)} icon={<CheckCircle2 className="h-5 w-5" />} />
              <MetricCard label="Assinaturas canceladas" value={availableValue(productMetrics.availability.subscriptions, productMetrics.revenue.canceledSubscriptions)} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard label="Pagamentos com falha" value={availableValue(productMetrics.availability.subscriptions, productMetrics.revenue.failedPaymentSubscriptions)} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard label="Cancelamentos 30 dias" value={availableValue(productMetrics.availability.subscriptions, productMetrics.revenue.cancellationsLast30Days)} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard label="Feedbacks negativos recentes" value={availableValue(productMetrics.availability.feedback && productMetrics.availability.aiResponseFeedback, productMetrics.supportQuality.recentNegativeFeedbacks)} icon={<MessageSquare className="h-5 w-5" />} />
              <MetricCard label="Suporte aberto" value={availableValue(productMetrics.availability.supportRequests, productMetrics.supportQuality.openSupportRequests)} icon={<MessageSquare className="h-5 w-5" />} />
            </div>
          </section>
        ) : null}

        {productMetrics ? (
          <section className="mb-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Saude do sistema</p>
                <h2 className="mt-2 text-2xl font-black text-white">Monitoramento operacional</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  Contagens agregadas para triagem diaria. Esta visao nao mostra prompts, respostas completas, tokens, chaves ou dados de pagamento.
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-slate-300">
                Hoje
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Respostas geradas hoje" value={productMetrics.operationalHealth.responsesGeneratedToday} icon={<MessageSquare className="h-5 w-5" />} />
              <MetricCard label="Falhas de IA hoje" value={productMetrics.operationalHealth.aiFailuresToday} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard label="Leads hoje" value={productMetrics.operationalHealth.leadsToday} icon={<Users className="h-5 w-5" />} />
              <MetricCard label="Checkouts iniciados hoje" value={productMetrics.operationalHealth.checkoutsStartedToday} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard label="Webhooks processados hoje" value={productMetrics.operationalHealth.stripeWebhooksProcessedToday} icon={<CheckCircle2 className="h-5 w-5" />} />
              <MetricCard label="Falhas de webhook hoje" value={productMetrics.operationalHealth.stripeWebhookFailuresToday} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard label="Feedbacks negativos recentes" value={productMetrics.operationalHealth.recentNegativeFeedbacks} icon={<MessageSquare className="h-5 w-5" />} />
              <MetricCard label="Assinaturas ativas" value={productMetrics.operationalHealth.activeSubscriptions} icon={<BarChart3 className="h-5 w-5" />} />
            </div>
          </section>
        ) : null}

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
          <MetricCard label="Resend nao configurado" value={metrics?.emailSkippedNotConfigured ?? 0} icon={<Mail className="h-5 w-5" />} />
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

            <div className="mt-5 grid gap-5 xl:grid-cols-5">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <h3 className="text-lg font-black text-white">Funil</h3>
                <div className="mt-4 grid gap-3">
                  <ConversionLine label="Leads" value={availableValue(productMetrics.availability.leads, productMetrics.funnel.periodLeads)} />
                  <ConversionLine label="Cadastros" value={availableValue(productMetrics.availability.profiles, productMetrics.funnel.totalUsers)} />
                  <ConversionLine label="Onboarding concluído" value={availableValue(productMetrics.availability.businesses, productMetrics.funnel.completedOnboardingUsers)} />
                  <ConversionLine label="Primeira resposta" value={availableValue(productMetrics.availability.generatedResponses, productMetrics.funnel.usersWithFirstResponse)} />
                  <ConversionLine label="Resposta salva/copiada" value={availableValue(productMetrics.availability.savedResponses, productMetrics.funnel.usersWithSavedOrCopiedResponse)} />
                  <ConversionLine label="Checkout iniciado" value={availableValue(productMetrics.availability.subscriptions, productMetrics.funnel.checkoutStartedUsers)} />
                  <ConversionLine label="Assinatura ativa" value={availableValue(productMetrics.availability.subscriptions, productMetrics.funnel.activeSubscriptions)} />
                  <ConversionLine label="Lead -> cadastro" value={stageRate(productMetrics.funnel.totalUsers, productMetrics.funnel.periodLeads || productMetrics.funnel.totalLeads)} />
                  <ConversionLine label="Cadastro -> onboarding" value={stageRate(productMetrics.funnel.completedOnboardingUsers, productMetrics.funnel.totalUsers)} />
                  <ConversionLine label="Onboarding -> primeira resposta" value={stageRate(productMetrics.funnel.usersWithFirstResponse, productMetrics.funnel.completedOnboardingUsers)} />
                  <ConversionLine label="Primeira resposta -> salva/copiada" value={stageRate(productMetrics.funnel.usersWithSavedOrCopiedResponse, productMetrics.funnel.usersWithFirstResponse)} />
                  <ConversionLine label="Checkout -> assinatura" value={stageRate(productMetrics.funnel.activeSubscriptions, productMetrics.funnel.checkoutStartedUsers)} />
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
                  <ConversionLine label="UsuÃ¡rios perto do limite" value={productMetrics.usage.usersNearLimit} />
                  <ConversionLine label="UsuÃ¡rios no limite" value={productMetrics.usage.usersAtLimit} />
                  <ConversionLine label="Custo estimado OpenAI" value={productMetrics.usage.aiCostEstimate === null ? "IndisponÃ­vel" : `R$ ${productMetrics.usage.aiCostEstimate}`} />
                  <p className="rounded-md border border-amber-400/20 bg-amber-400/10 p-3 text-xs font-bold leading-5 text-amber-100">
                    {productMetrics.usage.aiCostEstimateNote}
                  </p>
                  {(productMetrics.usage.topUsageUsers.length ? productMetrics.usage.topUsageUsers : [{ user_id: "sem_dados", user_id_short: "sem_dados", responses_used: 0 }]).slice(0, 3).map((item) => (
                    <ConversionLine key={`top-usage-${item.user_id}`} label={`Top uso: ${item.user_id_short}`} value={item.responses_used} />
                  ))}
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
                <h3 className="text-lg font-black text-white">Qualidade IA</h3>
                <div className="mt-4 grid gap-3">
                  <ConversionLine label="Avaliações no período" value={productMetrics.aiQuality.periodFeedbacks} />
                  <ConversionLine label="Úteis" value={productMetrics.aiQuality.positiveFeedbacks} />
                  <ConversionLine label="Não úteis" value={productMetrics.aiQuality.negativeFeedbacks} />
                  <ConversionLine label="Taxa útil" value={`${productMetrics.aiQuality.usefulRate}%`} />
                </div>
                <div className="mt-4 grid gap-2">
                  {(productMetrics.aiQuality.recentComments.length ? productMetrics.aiQuality.recentComments : [{ rating: "sem_dados", comment: "Sem comentários recentes.", created_at: "" }]).slice(0, 3).map((item, index) => (
                    <p key={`${item.created_at}-${index}`} className="rounded-md border border-white/10 bg-[#0b1118] p-2 text-xs font-bold leading-5 text-slate-300">
                      {item.rating === "positive" ? "Útil" : item.rating === "negative" ? "Não útil" : "Sem dados"}: {item.comment}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <h3 className="text-lg font-black text-white">Biblioteca</h3>
                <div className="mt-4 grid gap-3">
                  <ConversionLine label="Respostas salvas" value={productMetrics.usage.totalSavedResponses} />
                  <ConversionLine label="Salvas no periodo" value={productMetrics.usage.periodSavedResponses} />
                  <ConversionLine label="Usuarios com biblioteca" value={productMetrics.usage.usersWithSavedResponses} />
                  <ConversionLine label="Templates salvos" value={productMetrics.usage.totalSavedTemplates} />
                  {(productMetrics.usage.savedTemplatesByCategory.length ? productMetrics.usage.savedTemplatesByCategory : [{ label: "sem_dados", count: 0 }]).slice(0, 3).map((item) => (
                    <ConversionLine key={`template-${item.label}`} label={`Categoria: ${item.label}`} value={item.count} />
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <h3 className="text-lg font-black text-white">Receita</h3>
                <div className="mt-4 grid gap-3">
                  <ConversionLine label="Checkouts iniciados" value={availableValue(productMetrics.availability.subscriptions, productMetrics.revenue.checkoutStartedUsers)} />
                  <ConversionLine label="Assinaturas ativas" value={availableValue(productMetrics.availability.subscriptions, productMetrics.revenue.activeSubscriptions)} />
                  <ConversionLine label="Assinaturas canceladas" value={availableValue(productMetrics.availability.subscriptions, productMetrics.revenue.canceledSubscriptions)} />
                  <ConversionLine label="Past due" value={availableValue(productMetrics.availability.subscriptions, productMetrics.revenue.pastDueSubscriptions)} />
                  <ConversionLine label="Pagamentos com falha" value={availableValue(productMetrics.availability.subscriptions, productMetrics.revenue.failedPaymentSubscriptions)} />
                  <ConversionLine label="Novos assinantes 30 dias" value={availableValue(productMetrics.availability.subscriptions, productMetrics.revenue.newSubscribersLast30Days)} />
                  <ConversionLine label="Cancelamentos 30 dias" value={availableValue(productMetrics.availability.subscriptions, productMetrics.revenue.cancellationsLast30Days)} />
                  <ConversionLine label="MRR estimado" value={productMetrics.revenue.estimatedMrr === null ? "Não disponível" : `R$ ${productMetrics.revenue.estimatedMrr}`} />
                  {(productMetrics.revenue.activeSubscriptionsByPlan.length ? productMetrics.revenue.activeSubscriptionsByPlan : [{ label: "sem_dados", count: 0 }]).slice(0, 3).map((item) => (
                    <ConversionLine key={`plan-${item.label}`} label={`Plano: ${item.label}`} value={item.count} />
                  ))}
                  {(productMetrics.churn.cancellationReasons.length ? productMetrics.churn.cancellationReasons : [{ label: "sem_dados", count: 0 }]).slice(0, 3).map((item) => (
                    <ConversionLine key={`cancel-reason-${item.label}`} label={`Motivo: ${item.label}`} value={availableValue(productMetrics.availability.cancellationFeedback, item.count)} />
                  ))}
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

        {campaignReport ? (
          <section className="mt-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Relatorio de campanha</p>
                <h2 className="mt-2 text-2xl font-black text-white">Validacao de anuncios</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  Performance do funil para decidir se a campanha inicial deve continuar, ser ajustada ou pausada. Periodo: {campaignReport.period.label}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => exportCampaignReportCsv(campaignReport)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-black text-slate-950 hover:bg-slate-100"
              >
                <Download className="h-4 w-4" />
                Exportar resumo CSV
              </button>
            </div>

            <form onSubmit={handleApplyFilters} className="mb-5 grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_180px_auto]">
              <FilterSelect
                label="UTM source"
                value={filters.utm_source}
                onChange={(value) => setFilters((current) => ({ ...current, utm_source: value }))}
                options={campaignReport.filterOptions.utmSources}
              />
              <FilterSelect
                label="UTM campaign"
                value={filters.utm_campaign}
                onChange={(value) => setFilters((current) => ({ ...current, utm_campaign: value }))}
                options={campaignReport.filterOptions.utmCampaigns}
              />
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

            <div className="mb-5 rounded-md border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm font-black leading-6 text-emerald-100">
              {campaignReport.interpretation}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Leads totais" value={campaignReport.metrics.totalLeads} icon={<Users className="h-5 w-5" />} />
              <MetricCard label="Cadastros totais" value={campaignReport.metrics.totalSignups} icon={<Users className="h-5 w-5" />} />
              <MetricCard label="Onboardings concluidos" value={campaignReport.metrics.onboardingCompleted} icon={<CheckCircle2 className="h-5 w-5" />} />
              <MetricCard label="Usuarios ativados" value={campaignReport.metrics.activatedUsers} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard label="Demo usada" value={campaignReport.metrics.demoUses} icon={<MessageSquare className="h-5 w-5" />} />
              <MetricCard label="Primeira resposta" value={campaignReport.metrics.firstResponseGenerated} icon={<MessageSquare className="h-5 w-5" />} />
              <MetricCard label="Checkout iniciado" value={campaignReport.metrics.checkoutStarted} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard label="Assinaturas ativas" value={campaignReport.metrics.activeSubscriptions} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard label="Feedbacks recebidos" value={campaignReport.metrics.feedbackCount} icon={<MessageSquare className="h-5 w-5" />} />
              <MetricCard label="Dificuldade de uso" value={campaignReport.metrics.difficultyFeedbacks} icon={<MessageSquare className="h-5 w-5" />} />
              <MetricCard label="Lead -> cadastro" value={`${campaignReport.metrics.leadToSignupRate}%`} icon={<BarChart3 className="h-5 w-5" />} />
              <MetricCard label="Cadastro -> assinatura" value={`${campaignReport.metrics.signupToSubscriptionRate}%`} icon={<BarChart3 className="h-5 w-5" />} />
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-5">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 xl:col-span-2">
                <h3 className="text-lg font-black text-white">Taxas do funil</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <ConversionLine label="Lead -> cadastro" value={`${campaignReport.metrics.leadToSignupRate}%`} />
                  <ConversionLine label="Cadastro -> onboarding" value={`${campaignReport.metrics.signupToOnboardingRate}%`} />
                  <ConversionLine label="Onboarding -> primeira resposta" value={`${campaignReport.metrics.onboardingToFirstResponseRate}%`} />
                  <ConversionLine label="Lead -> assinatura" value={`${campaignReport.metrics.leadToSubscriptionRate}%`} />
                </div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <h3 className="text-lg font-black text-white">Leads por source</h3>
                <div className="mt-4 grid gap-3">
                  {(campaignReport.breakdowns.leadsByUtmSource.length ? campaignReport.breakdowns.leadsByUtmSource : [{ label: "sem_dados", count: 0 }]).slice(0, 5).map((item) => (
                    <ConversionLine key={`report-source-${item.label}`} label={item.label} value={item.count} />
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <h3 className="text-lg font-black text-white">Leads por campanha</h3>
                <div className="mt-4 grid gap-3">
                  {(campaignReport.breakdowns.leadsByUtmCampaign.length ? campaignReport.breakdowns.leadsByUtmCampaign : [{ label: "sem_dados", count: 0 }]).slice(0, 5).map((item) => (
                    <ConversionLine key={`report-campaign-${item.label}`} label={item.label} value={item.count} />
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <h3 className="text-lg font-black text-white">Leads por criativo</h3>
                <div className="mt-4 grid gap-3">
                  {(campaignReport.breakdowns.leadsByUtmContent.length ? campaignReport.breakdowns.leadsByUtmContent : [{ label: "sem_dados", count: 0 }]).slice(0, 5).map((item) => (
                    <ConversionLine key={`report-content-${item.label}`} label={item.label} value={item.count} />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-xs font-bold leading-5 text-slate-400 lg:grid-cols-2">
              {campaignReport.notes.map((note) => (
                <p className="rounded-md border border-white/10 bg-[#0b1118] p-3" key={note}>
                  {note}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Privacidade e LGPD</p>
              <h2 className="mt-2 text-2xl font-black text-white">Solicitacoes de dados</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Acompanhe pedidos de exportacao e exclusao. O processamento inicial deve ser manual e documentado.</p>
            </div>
            <ShieldCheck className="h-9 w-9 text-emerald-300" />
          </div>

          <div className="grid gap-3">
            {dataRequests.length ? (
              dataRequests.map((item) => (
                <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={item.id}>
                  <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr_auto] xl:items-start">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200">{getDataRequestTypeLabel(item.type)}</span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(item.status)}`}>{getDataRequestStatusLabel(item.status)}</span>
                      </div>
                      <p className="mt-3 text-sm font-black text-white">{item.user_email_masked || item.user_id_short}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-slate-500">
                        <span>Criada: {formatDate(item.created_at)}</span>
                        <span>Atualizada: {formatDate(item.updated_at)}</span>
                      </div>
                    </div>
                    <label className="grid gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                      Nota interna
                      <textarea
                        value={dataRequestNotes[item.id] || ""}
                        onChange={(event) => setDataRequestNotes((current) => ({ ...current, [item.id]: event.target.value }))}
                        className="field-input min-h-20 resize-none py-3 normal-case"
                        maxLength={1000}
                        placeholder="Sem dados sensiveis. Registre apenas andamento operacional."
                      />
                    </label>
                    <div className="grid gap-2 sm:grid-cols-3 xl:min-w-48 xl:grid-cols-1">
                      {(["processing", "completed", "rejected"] as const).map((status) => (
                        <button
                          type="button"
                          key={`${item.id}-${status}`}
                          onClick={() => void updateDataRequestStatus(item.id, status)}
                          disabled={updatingDataRequestId === item.id || item.status === status}
                          className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] px-3 text-xs font-black text-slate-100 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {getDataRequestStatusLabel(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-8 text-center text-sm text-slate-400">
                <ShieldCheck className="mx-auto mb-4 h-8 w-8 text-slate-500" />
                <p className="font-bold text-slate-200">Nenhuma solicitacao de dados aberta.</p>
                <p className="mt-2">Pedidos de exportacao e exclusao criados pelos usuarios aparecerao aqui.</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Suporte</p>
              <h2 className="mt-2 text-2xl font-black text-white">Solicitacoes recentes</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Acompanhe pedidos simples de ajuda sem criar conversa, CRM ou chat em tempo real.</p>
            </div>
            <MessageSquare className="h-9 w-9 text-emerald-300" />
          </div>

          <div className="grid gap-3">
            {data?.supportRequests?.length ? (
              data.supportRequests.map((item) => (
                <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={item.id}>
                  <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr_auto] xl:items-start">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200">{item.category}</span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(item.status)}`}>{supportStatusLabel(item.status)}</span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(item.priority)}`}>{supportPriorityLabel(item.priority)}</span>
                      </div>
                      <h3 className="mt-3 font-black text-white">{item.subject}</h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{summarizeMessage(item.message)}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-slate-500">
                        <span>{item.user_email_masked || item.user_id_short || "Visitante sem usuario"}</span>
                        <span>Criada: {formatDate(item.created_at)}</span>
                      </div>
                    </div>
                    <label className="grid gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                      Nota interna
                      <textarea
                        value={supportNotes[item.id] || ""}
                        onChange={(event) => setSupportNotes((current) => ({ ...current, [item.id]: event.target.value }))}
                        className="field-input min-h-20 resize-none py-3 normal-case"
                        maxLength={1000}
                        placeholder="Sem dados sensiveis. Registre apenas andamento operacional."
                      />
                    </label>
                    <div className="grid gap-2 xl:min-w-56">
                      <select
                        value={item.status}
                        onChange={(event) => void updateSupportRequest(item.id, { status: event.target.value as SupportStatus })}
                        disabled={updatingSupportRequestId === item.id}
                        className="field-input"
                      >
                        {supportStatuses.map((status) => (
                          <option value={status} key={status}>{supportStatusLabel(status)}</option>
                        ))}
                      </select>
                      <select
                        value={item.priority}
                        onChange={(event) => void updateSupportRequest(item.id, { priority: event.target.value as SupportPriority })}
                        disabled={updatingSupportRequestId === item.id}
                        className="field-input"
                      >
                        {supportPriorities.map((priority) => (
                          <option value={priority} key={priority}>{supportPriorityLabel(priority)}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => void updateSupportRequest(item.id, {})}
                        disabled={updatingSupportRequestId === item.id}
                        className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] px-3 text-xs font-black text-slate-100 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Salvar nota
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-8 text-center text-sm text-slate-400">
                <MessageSquare className="mx-auto mb-4 h-8 w-8 text-slate-500" />
                <p className="font-bold text-slate-200">Nenhuma solicitacao de suporte aberta.</p>
                <p className="mt-2">Pedidos enviados por usuarios ou visitantes aparecerao aqui.</p>
              </div>
            )}
          </div>
        </section>

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
                        <span>Contexto: {item.context || "-"}</span>
                        <span>Origem: {item.source || "-"}</span>
                        <span>Campanha: {item.campaign || "-"}</span>
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
                  {["Nome", "E-mail", "WhatsApp", "Tipo", "Source", "UTM source", "UTM campaign", "Cadastro", "Ebook", "Detalhe envio"].map((header) => (
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
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${statusClass(lead.email_status)}`}>{emailStatusLabel(lead.email_status)}</span>
                      </td>
                      <td className="border-b border-white/10 px-3 py-3 text-slate-300">
                        <p>{lead.email_sent_at ? formatDate(lead.email_sent_at) : lead.email_event_created_at ? formatDate(lead.email_event_created_at) : "-"}</p>
                        {lead.email_error ? <p className="mt-1 max-w-[260px] truncate text-xs font-bold text-amber-100" title={lead.email_error}>{lead.email_error}</p> : null}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-8 text-center text-slate-400" colSpan={10}>
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
                      <Info label="Status Stripe" value={subscription.subscription_status || subscription.status || "-"} />
                      <Info label="Pagamento" value={subscription.last_payment_status || "-"} />
                      <Info label="Limite mensal" value={subscription.monthly_limit ?? "-"} />
                      <Info label="Uso atual" value={subscription.monthly_usage} />
                      <Info label="Cancelamento agendado" value={subscription.cancel_at_period_end ? "Sim" : "Não"} />
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
              <ConversionLine label="Past due" value={subscriptionGroups.pastDue.length} />
              <ConversionLine label="Pagamento falhou" value={subscriptionGroups.failedPayment.length} />
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
