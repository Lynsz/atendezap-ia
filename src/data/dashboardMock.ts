import type {
  AutomationMetric,
  ConversationMetric,
  DashboardInsight,
  DashboardMetric,
  LeadStageMetric,
  RevenuePoint
} from "@/types/dashboard";

export const dashboardMockMetrics: DashboardMetric[] = [
  {
    id: "leads-total",
    title: "Leads totais",
    value: "48",
    description: "Contatos captados nos canais conectados ao atendimento.",
    trend: 18,
    trendLabel: "+18% nos últimos 30 dias",
    icon: "users"
  },
  {
    id: "open-conversations",
    title: "Atendimentos abertos",
    value: "12",
    description: "Conversas que ainda precisam de resposta ou acompanhamento.",
    trend: -7,
    trendLabel: "7% menos pendências",
    icon: "message"
  },
  {
    id: "conversion-rate",
    title: "Taxa de conversão",
    value: "22%",
    description: "Leads que avançaram para venda ou fechamento.",
    trend: 4,
    trendLabel: "+4 pontos no mês",
    icon: "conversion"
  },
  {
    id: "potential-revenue",
    title: "Receita potencial",
    value: "R$ 18.760",
    description: "Valor estimado das oportunidades em aberto.",
    trend: 12,
    trendLabel: "+12% em oportunidades",
    icon: "revenue"
  },
  {
    id: "automation-runs",
    title: "Automações executadas",
    value: "136",
    description: "Ações inteligentes simuladas no atendimento.",
    trend: 24,
    trendLabel: "+24 execuções",
    icon: "automation"
  },
  {
    id: "current-plan",
    title: "Plano atual",
    value: "Starter",
    description: "Próxima cobrança mensal simulada em 30 dias.",
    trend: 0,
    trendLabel: "R$49,00/mês",
    icon: "billing"
  }
];

export const dashboardMockRevenue: RevenuePoint[] = [
  { month: "Jan", revenue: 4200, leads: 18, conversions: 4 },
  { month: "Fev", revenue: 6100, leads: 24, conversions: 6 },
  { month: "Mar", revenue: 7200, leads: 28, conversions: 7 },
  { month: "Abr", revenue: 8900, leads: 36, conversions: 9 },
  { month: "Mai", revenue: 11200, leads: 42, conversions: 11 },
  { month: "Jun", revenue: 13700, leads: 48, conversions: 13 }
];

export const dashboardMockLeadStages: LeadStageMetric[] = [
  { stage: "Novo", total: 12, percentage: 25 },
  { stage: "Contato", total: 10, percentage: 21 },
  { stage: "Qualificado", total: 9, percentage: 19 },
  { stage: "Proposta", total: 8, percentage: 17 },
  { stage: "Negociação", total: 5, percentage: 10 },
  { stage: "Fechado", total: 4, percentage: 8 }
];

export const dashboardMockConversations: ConversationMetric[] = [
  { status: "Abertos", total: 12 },
  { status: "Aguardando", total: 9 },
  { status: "Resolvidos", total: 31 }
];

export const dashboardMockAutomations: AutomationMetric[] = [
  { name: "Boas-vindas para novo lead", runs: 46, successRate: 96 },
  { name: "Follow-up após 24h", runs: 32, successRate: 91 },
  { name: "Sugestão de resposta IA", runs: 28, successRate: 94 },
  { name: "Reativar cliente frio", runs: 18, successRate: 83 }
];

export const dashboardMockInsights: DashboardInsight[] = [
  {
    id: "stalled-leads",
    title: "Você tem leads parados no funil",
    description: "Revise oportunidades em proposta ou negociação e defina um próximo contato.",
    type: "warning"
  },
  {
    id: "open-service",
    title: "Atendimentos abertos precisam de resposta",
    description: "Priorize conversas abertas com alta urgência para reduzir tempo de espera.",
    type: "danger"
  },
  {
    id: "automation-follow-up",
    title: "Automações podem aumentar follow-up",
    description: "Ative lembretes para leads sem resposta e mantenha o funil em movimento.",
    type: "info"
  },
  {
    id: "premium-plan",
    title: "Plano atual: veja se faz sentido evoluir para Premium",
    description: "Se o volume de leads crescer, o plano Premium ajuda a organizar automações e funil completo.",
    type: "success"
  }
];
