import { atendezapMockConversations } from "@/data/atendezapMock";
import {
  dashboardMockAutomations,
  dashboardMockConversations,
  dashboardMockInsights,
  dashboardMockLeadStages,
  dashboardMockMetrics,
  dashboardMockRevenue
} from "@/data/dashboardMock";
import type { Conversation, ConversationStatus, Lead, PipelineStage } from "@/types/atendezap";
import type { AutomationMetric, ConversationMetric, DashboardInsight, DashboardMetric, LeadStageMetric, RevenuePoint } from "@/types/dashboard";
import { listAutomations, listAutomationLogs } from "@/utils/automationEngine";
import { getCurrentSubscription } from "@/utils/billingStorage";
import { listLeads } from "@/utils/leadsStorage";

const CONVERSATIONS_STORAGE_KEY = "atendezap_ia_conversations_v1";
const LOCAL_DATA_KEYS = [
  "atendezap_ia_conversations_v1",
  "atendezap_ia_leads_v1",
  "atendezap_ia_automations_v1",
  "atendezap_ia_automation_logs_v1",
  "atendezap_ia_subscription_v1",
  "atendezap_ia_business_profile_v1"
];

const stageLabels: Record<PipelineStage, string> = {
  new_lead: "Novo",
  contacted: "Contato",
  qualified: "Qualificado",
  proposal: "Proposta",
  negotiation: "Negociação",
  won: "Fechado",
  lost: "Perdido"
};

const statusLabels: Record<ConversationStatus, string> = {
  open: "Abertos",
  waiting: "Aguardando",
  resolved: "Resolvidos"
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value);
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function readConversations(): Conversation[] {
  if (!canUseStorage()) return atendezapMockConversations;

  const stored = window.localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
  if (!stored) return atendezapMockConversations;

  try {
    return JSON.parse(stored) as Conversation[];
  } catch {
    return atendezapMockConversations;
  }
}

function monthLabel(monthIndex: number) {
  return ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][monthIndex] || "";
}

export function hasLocalDashboardData() {
  if (!canUseStorage()) return false;
  return LOCAL_DATA_KEYS.some((key) => window.localStorage.getItem(key));
}

export function getDashboardMetrics(): DashboardMetric[] {
  const leads = listLeads();
  const conversations = readConversations();
  const automations = listAutomations();
  const subscription = getCurrentSubscription();
  const closedLeads = leads.filter((lead) => lead.status === "closed" || lead.stage === "won").length;
  const activeLeads = leads.filter((lead) => lead.status !== "lost" && lead.stage !== "lost");
  const openConversations = conversations.filter((conversation) => conversation.status === "open").length;
  const conversionRate = leads.length ? (closedLeads / leads.length) * 100 : 0;
  const potentialRevenue = activeLeads.reduce((total, lead) => total + lead.value, 0);
  const automationRuns = automations.reduce((total, automation) => total + automation.totalRuns, 0);

  if (!leads.length && !conversations.length && !automations.length) return dashboardMockMetrics;

  return [
    {
      id: "leads-total",
      title: "Leads totais",
      value: String(leads.length),
      description: "Contatos registrados no CRM local.",
      trend: 12,
      trendLabel: `${leads.filter((lead) => lead.status === "new").length} novos leads`,
      icon: "users"
    },
    {
      id: "open-conversations",
      title: "Atendimentos abertos",
      value: String(openConversations),
      description: "Conversas que ainda precisam de resposta.",
      trend: openConversations > 0 ? -4 : 0,
      trendLabel: conversations.filter((conversation) => conversation.status === "waiting").length + " aguardando retorno",
      icon: "message"
    },
    {
      id: "conversion-rate",
      title: "Taxa de conversão",
      value: formatPercent(conversionRate),
      description: "Leads marcados como fechados em relação ao total.",
      trend: conversionRate >= 20 ? 6 : 2,
      trendLabel: `${closedLeads} leads fechados`,
      icon: "conversion"
    },
    {
      id: "potential-revenue",
      title: "Receita potencial",
      value: formatCurrency(potentialRevenue),
      description: "Soma das oportunidades ainda aproveitáveis.",
      trend: 9,
      trendLabel: `${activeLeads.length} oportunidades ativas`,
      icon: "revenue"
    },
    {
      id: "automation-runs",
      title: "Automações executadas",
      value: String(automationRuns),
      description: "Execuções simuladas no módulo de automações IA.",
      trend: automationRuns > 0 ? 14 : 0,
      trendLabel: `${automations.filter((automation) => automation.isActive).length} automações ativas`,
      icon: "automation"
    },
    {
      id: "current-plan",
      title: "Plano atual",
      value: subscription?.planName.replace("Plano ", "") || "Starter",
      description: subscription ? `Próxima cobrança simulada em ${new Date(subscription.nextBillingAt).toLocaleDateString("pt-BR")}.` : "Assinatura local não iniciada.",
      trend: 0,
      trendLabel: subscription?.price || "R$49,00/mês",
      icon: "billing"
    }
  ];
}

export function getRevenueData(): RevenuePoint[] {
  const leads = listLeads();
  if (!leads.length) return dashboardMockRevenue;

  const now = new Date();
  const points = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      date,
      month: monthLabel(date.getMonth()),
      revenue: 0,
      leads: 0,
      conversions: 0
    };
  });

  leads.forEach((lead) => {
    const createdAt = new Date(lead.createdAt);
    const point = points.find((item) => item.date.getFullYear() === createdAt.getFullYear() && item.date.getMonth() === createdAt.getMonth());
    if (!point) return;

    point.leads += 1;
    if (lead.stage === "won" || lead.status === "closed") {
      point.conversions += 1;
      point.revenue += lead.value;
      return;
    }

    if (lead.status !== "lost" && lead.stage !== "lost") {
      point.revenue += Math.round(lead.value * 0.35);
    }
  });

  const hasRevenue = points.some((point) => point.revenue > 0 || point.leads > 0);
  return hasRevenue ? points.map(({ month, revenue, leads: totalLeads, conversions }) => ({ month, revenue, leads: totalLeads, conversions })) : dashboardMockRevenue;
}

export function getLeadStageData(): LeadStageMetric[] {
  const leads = listLeads();
  if (!leads.length) return dashboardMockLeadStages;

  const totals = leads.reduce<Record<PipelineStage, number>>(
    (acc, lead) => {
      acc[lead.stage] += 1;
      return acc;
    },
    { new_lead: 0, contacted: 0, qualified: 0, proposal: 0, negotiation: 0, won: 0, lost: 0 }
  );

  return Object.entries(totals)
    .filter(([, total]) => total > 0)
    .map(([stage, total]) => ({
      stage: stageLabels[stage as PipelineStage],
      total,
      percentage: leads.length ? Math.round((total / leads.length) * 100) : 0
    }));
}

export function getConversationStatusData(): ConversationMetric[] {
  const conversations = readConversations();
  if (!conversations.length) return dashboardMockConversations;

  const totals = conversations.reduce<Record<ConversationStatus, number>>(
    (acc, conversation) => {
      acc[conversation.status] += 1;
      return acc;
    },
    { open: 0, waiting: 0, resolved: 0 }
  );

  return Object.entries(totals).map(([status, total]) => ({
    status: statusLabels[status as ConversationStatus],
    total
  }));
}

export function getAutomationPerformanceData(): AutomationMetric[] {
  const automations = listAutomations();
  const logs = listAutomationLogs();
  if (!automations.length) return dashboardMockAutomations;

  return automations
    .slice()
    .sort((a, b) => b.totalRuns - a.totalRuns)
    .slice(0, 4)
    .map((automation) => {
      const automationLogs = logs.filter((log) => log.automationId === automation.id);
      const successLogs = automationLogs.filter((log) => log.status === "success").length;
      const successRate = automationLogs.length ? Math.round((successLogs / automationLogs.length) * 100) : automation.isActive ? 92 : 0;

      return {
        name: automation.name,
        runs: automation.totalRuns,
        successRate
      };
    });
}

export function getDashboardInsights(): DashboardInsight[] {
  const leads = listLeads();
  const conversations = readConversations();
  const automations = listAutomations();
  const subscription = getCurrentSubscription();

  if (!leads.length && !conversations.length && !automations.length) return dashboardMockInsights;

  const stalledLeads = leads.filter((lead) => ["proposal", "negotiation"].includes(lead.stage)).length;
  const openConversations = conversations.filter((conversation) => conversation.status === "open").length;
  const inactiveAutomations = automations.filter((automation) => !automation.isActive || automation.status !== "active").length;

  return [
    {
      id: "stalled-leads",
      title: stalledLeads ? "Você tem leads parados no funil" : "Funil comercial em movimento",
      description: stalledLeads
        ? `${stalledLeads} oportunidades estão entre proposta e negociação. Vale criar um follow-up hoje.`
        : "Nenhum gargalo relevante apareceu nas etapas comerciais.",
      type: stalledLeads ? "warning" : "success"
    },
    {
      id: "open-service",
      title: openConversations ? "Atendimentos abertos precisam de resposta" : "Atendimentos sob controle",
      description: openConversations
        ? `${openConversations} conversas estão abertas. Priorize clientes de alta urgência primeiro.`
        : "Não há conversas abertas no momento. Mantenha os follow-ups agendados.",
      type: openConversations ? "danger" : "success"
    },
    {
      id: "automation-follow-up",
      title: "Automações podem aumentar follow-up",
      description: inactiveAutomations
        ? `${inactiveAutomations} automações estão pausadas ou em rascunho. Ative as mais importantes para manter cadência.`
        : "Suas automações principais estão ativas. Acompanhe o histórico para refinar mensagens.",
      type: inactiveAutomations ? "info" : "success"
    },
    {
      id: "premium-plan",
      title: "Plano atual: veja se faz sentido evoluir para Premium",
      description:
        subscription?.planId === "premium"
          ? "Você já está no plano Premium. Use o dashboard para acompanhar escala e qualidade do atendimento."
          : "Se o volume de leads crescer, o Premium ajuda a organizar automações avançadas, dashboard e funil completo.",
      type: subscription?.planId === "premium" ? "success" : "info"
    }
  ];
}
