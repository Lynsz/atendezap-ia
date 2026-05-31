import { z } from "zod";

export const productInsightTypes = ["bug", "improvement", "feature_request", "complaint", "question", "churn_reason", "campaign_learning", "ai_quality"] as const;
export const productInsightSeverities = ["low", "medium", "high", "critical"] as const;
export const productInsightStatuses = ["new", "reviewing", "planned", "in_progress", "shipped", "rejected", "archived"] as const;
export const productInsightImpactAreas = ["activation", "retention", "conversion", "billing", "ai_quality", "support", "privacy", "campaign", "usability", "performance"] as const;

export type ProductInsightType = (typeof productInsightTypes)[number];
export type ProductInsightSeverity = (typeof productInsightSeverities)[number];
export type ProductInsightStatus = (typeof productInsightStatuses)[number];
export type ProductInsightImpactArea = (typeof productInsightImpactAreas)[number];

export type ProductInsight = {
  id: string;
  source: string;
  type: ProductInsightType;
  category: string;
  title: string;
  description: string | null;
  severity: ProductInsightSeverity;
  status: ProductInsightStatus;
  impact_area: ProductInsightImpactArea | null;
  user_id: string | null;
  related_support_request_id: string | null;
  related_campaign_id: string | null;
  related_feedback_id: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductInsightSummary = {
  totalNew: number;
  criticalBugs: number;
  onboardingIssues: number;
  aiIssues: number;
  featureRequests: number;
  billingIssues: number;
  churnReasons: number;
  campaignLearnings: number;
};

const nullableText = (max = 1000) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((value) => value || null);

const nullableUuid = z
  .string()
  .trim()
  .uuid()
  .optional()
  .nullable()
  .transform((value) => value || null);

const productInsightBaseSchema = z.object({
  source: z.string().trim().min(2, "Informe a fonte do insight.").max(80),
  type: z.enum(productInsightTypes),
  category: z.string().trim().min(2, "Informe a categoria.").max(120),
  title: z.string().trim().min(3, "Informe o titulo.").max(180),
  description: nullableText(1800),
  severity: z.enum(productInsightSeverities).default("medium"),
  status: z.enum(productInsightStatuses).default("new"),
  impact_area: z.enum(productInsightImpactAreas).optional().nullable().transform((value) => value || null),
  user_id: nullableUuid,
  related_support_request_id: nullableUuid,
  related_campaign_id: nullableUuid,
  related_feedback_id: nullableUuid,
  admin_notes: nullableText(1800)
});

export const createProductInsightSchema = productInsightBaseSchema;

export const updateProductInsightSchema = productInsightBaseSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "Envie ao menos um campo para atualizar."
});

export const productInsightFilterSchema = z.object({
  type: z.enum(productInsightTypes).optional(),
  severity: z.enum(productInsightSeverities).optional(),
  status: z.enum(productInsightStatuses).optional(),
  impact_area: z.enum(productInsightImpactAreas).optional()
});

export function summarizeProductInsights(insights: ProductInsight[]): ProductInsightSummary {
  return {
    totalNew: insights.filter((insight) => insight.status === "new").length,
    criticalBugs: insights.filter((insight) => insight.type === "bug" && insight.severity === "critical").length,
    onboardingIssues: insights.filter((insight) => insight.impact_area === "activation" || insight.category.toLowerCase().includes("onboarding")).length,
    aiIssues: insights.filter((insight) => insight.type === "ai_quality" || insight.impact_area === "ai_quality").length,
    featureRequests: insights.filter((insight) => insight.type === "feature_request").length,
    billingIssues: insights.filter((insight) => insight.impact_area === "billing" || insight.category.toLowerCase().includes("cobr")).length,
    churnReasons: insights.filter((insight) => insight.type === "churn_reason").length,
    campaignLearnings: insights.filter((insight) => insight.type === "campaign_learning" || insight.impact_area === "campaign").length
  };
}

export function getProductInsightDiagnostics(insights: ProductInsight[]) {
  const diagnostics: string[] = [];
  const aiIssues = insights.filter((insight) => insight.type === "ai_quality" || insight.impact_area === "ai_quality").length;
  const onboardingIssues = insights.filter((insight) => insight.impact_area === "activation" || insight.category.toLowerCase().includes("onboarding")).length;
  const whatsappRequests = insights.filter((insight) => {
    const text = `${insight.title} ${insight.description || ""} ${insight.category}`.toLowerCase();
    return text.includes("whatsapp") && (text.includes("automatic") || text.includes("integra"));
  }).length;
  const priceChurn = insights.filter((insight) => {
    const text = `${insight.title} ${insight.description || ""} ${insight.category}`.toLowerCase();
    return insight.type === "churn_reason" && (text.includes("preco") || text.includes("preço") || text.includes("valor"));
  }).length;
  const checkoutBugs = insights.filter((insight) => {
    const text = `${insight.title} ${insight.description || ""} ${insight.category}`.toLowerCase();
    return insight.type === "bug" && (insight.impact_area === "billing" || text.includes("checkout") || text.includes("stripe"));
  }).length;

  if (aiIssues >= 3) diagnostics.push("Priorizar qualidade das respostas e templates.");
  if (onboardingIssues >= 3) diagnostics.push("Priorizar clareza do dashboard inicial.");
  if (whatsappRequests >= 2) diagnostics.push("Reforçar comunicação do escopo atual e avaliar integração futura.");
  if (priceChurn >= 2) diagnostics.push("Revisar percepção de valor, planos e onboarding.");
  if (checkoutBugs >= 1) diagnostics.push("Priorizar billing antes de campanhas.");

  return diagnostics.length ? diagnostics : ["Sem padrão recorrente suficiente para prioridade automática."];
}

export function productInsightTypeLabel(type?: string | null) {
  const labels: Record<string, string> = {
    bug: "Bug",
    improvement: "Melhoria",
    feature_request: "Pedido de funcionalidade",
    complaint: "Reclamação",
    question: "Dúvida",
    churn_reason: "Motivo de churn",
    campaign_learning: "Aprendizado de campanha",
    ai_quality: "Qualidade da IA"
  };
  return labels[type || ""] || "Não informado";
}

export function productInsightSeverityLabel(severity?: string | null) {
  const labels: Record<string, string> = {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
    critical: "Crítica"
  };
  return labels[severity || ""] || "Não informado";
}

export function productInsightStatusLabel(status?: string | null) {
  const labels: Record<string, string> = {
    new: "Novo",
    reviewing: "Em análise",
    planned: "Planejado",
    in_progress: "Em andamento",
    shipped: "Entregue",
    rejected: "Rejeitado",
    archived: "Arquivado"
  };
  return labels[status || ""] || "Não informado";
}

export function productInsightImpactAreaLabel(impactArea?: string | null) {
  const labels: Record<string, string> = {
    activation: "Ativação",
    retention: "Retenção",
    conversion: "Conversão",
    billing: "Cobrança",
    ai_quality: "Qualidade da IA",
    support: "Suporte",
    privacy: "Privacidade",
    campaign: "Campanha",
    usability: "Usabilidade",
    performance: "Performance"
  };
  return labels[impactArea || ""] || "Não informado";
}
