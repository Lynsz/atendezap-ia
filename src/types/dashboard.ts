export type DashboardMetric = {
  id: string;
  title: string;
  value: string;
  description: string;
  trend: number;
  trendLabel: string;
  icon: "users" | "message" | "conversion" | "revenue" | "automation" | "billing";
};

export type RevenuePoint = {
  month: string;
  revenue: number;
  leads: number;
  conversions: number;
};

export type LeadStageMetric = {
  stage: string;
  total: number;
  percentage: number;
};

export type AutomationMetric = {
  name: string;
  runs: number;
  successRate: number;
};

export type ConversationMetric = {
  status: string;
  total: number;
};

export type DashboardInsight = {
  id: string;
  title: string;
  description: string;
  type: "success" | "warning" | "info" | "danger";
};
