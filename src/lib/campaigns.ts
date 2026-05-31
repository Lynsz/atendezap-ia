import { z } from "zod";

export const campaignStatuses = ["planned", "running", "paused", "completed", "archived"] as const;
export const campaignDecisions = ["keep", "pause", "iterate", "scale_cautiously", "inconclusive"] as const;
export const campaignChannels = ["Meta Ads", "TikTok Ads", "Google Ads", "Orgânico", "Outro"] as const;
export const campaignNiches = ["delivery", "estética", "assistência técnica", "loja", "restaurante", "prestador de serviço", "autônomo", "geral"] as const;

export type CampaignStatus = (typeof campaignStatuses)[number];
export type CampaignDecision = (typeof campaignDecisions)[number];

export type CampaignExperiment = {
  id: string;
  name: string;
  niche: string | null;
  channel: string;
  objective: string;
  destination_url: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  cta: string | null;
  budget_amount: number | null;
  currency: string;
  start_date: string | null;
  end_date: string | null;
  status: CampaignStatus;
  notes: string | null;
  decision: CampaignDecision | null;
  created_at: string;
  updated_at: string;
};

export type CampaignResult = {
  id: string;
  campaign_id: string;
  visitors: number | null;
  clicks: number | null;
  leads: number | null;
  signups: number | null;
  onboardings: number | null;
  first_responses: number | null;
  saved_responses: number | null;
  checkouts: number | null;
  subscriptions: number | null;
  spend_amount: number | null;
  cost_per_lead: number | null;
  cost_per_signup: number | null;
  cost_per_subscription: number | null;
  notes: string | null;
  recorded_at: string;
  created_at: string;
  updated_at: string;
};

export type CampaignTotals = {
  visitors: number;
  clicks: number;
  leads: number;
  signups: number;
  onboardings: number;
  first_responses: number;
  saved_responses: number;
  checkouts: number;
  subscriptions: number;
  spend_amount: number;
  cost_per_lead: number | null;
  cost_per_signup: number | null;
  cost_per_subscription: number | null;
};

export type CampaignWithResults = CampaignExperiment & {
  results: CampaignResult[];
  totals: CampaignTotals;
  diagnostics: string[];
};

const nullableText = (max = 500) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((value) => value || null);

const nullableUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .nullable()
  .transform((value) => value || null)
  .refine((value) => !value || /^https?:\/\//i.test(value), "Informe uma URL com http ou https.");

const nullableDate = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => value || null)
  .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), "Informe a data no formato YYYY-MM-DD.");

const nullableMoney = z
  .union([z.coerce.number().min(0), z.literal(""), z.null(), z.undefined()])
  .transform((value) => (value === "" || value === null || value === undefined ? null : Number(Number(value).toFixed(2))));

const nullableInteger = z
  .union([z.coerce.number().int().min(0), z.literal(""), z.null(), z.undefined()])
  .transform((value) => (value === "" || value === null || value === undefined ? null : value));

const campaignBaseSchema = z.object({
    name: z.string().trim().min(2, "Informe o nome da campanha.").max(160),
    niche: nullableText(80),
    channel: z.string().trim().min(2, "Informe o canal.").max(80),
    objective: z.string().trim().min(2, "Informe o objetivo.").max(220),
    destination_url: nullableUrl,
    utm_campaign: nullableText(160),
    utm_content: nullableText(160),
    cta: nullableText(160),
    budget_amount: nullableMoney,
    currency: z.string().trim().toUpperCase().length(3).default("BRL"),
    start_date: nullableDate,
    end_date: nullableDate,
    status: z.enum(campaignStatuses).default("planned"),
    notes: nullableText(1500),
    decision: z.enum(campaignDecisions).optional().nullable().transform((value) => value || null)
  });

export const createCampaignSchema = campaignBaseSchema
  .refine((value) => !value.start_date || !value.end_date || value.end_date >= value.start_date, {
    message: "A data final deve ser posterior ou igual a data inicial.",
    path: ["end_date"]
  });

export const updateCampaignSchema = campaignBaseSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Envie ao menos um campo para atualizar."
  })
  .refine((value) => !value.start_date || !value.end_date || value.end_date >= value.start_date, {
    message: "A data final deve ser posterior ou igual a data inicial.",
    path: ["end_date"]
  });

export const createCampaignResultSchema = z.object({
  visitors: nullableInteger,
  clicks: nullableInteger,
  leads: nullableInteger,
  signups: nullableInteger,
  onboardings: nullableInteger,
  first_responses: nullableInteger,
  saved_responses: nullableInteger,
  checkouts: nullableInteger,
  subscriptions: nullableInteger,
  spend_amount: nullableMoney,
  notes: nullableText(1500),
  recorded_at: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => value || new Date().toISOString())
});

export const updateCampaignResultSchema = createCampaignResultSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "Envie ao menos um campo para atualizar."
});

export function calculateCampaignCosts(input: {
  spend_amount?: number | null;
  leads?: number | null;
  signups?: number | null;
  subscriptions?: number | null;
}) {
  const spend = input.spend_amount ?? null;
  return {
    cost_per_lead: spend !== null && input.leads ? Number((spend / input.leads).toFixed(2)) : null,
    cost_per_signup: spend !== null && input.signups ? Number((spend / input.signups).toFixed(2)) : null,
    cost_per_subscription: spend !== null && input.subscriptions ? Number((spend / input.subscriptions).toFixed(2)) : null
  };
}

export function aggregateCampaignResults(results: CampaignResult[]): CampaignTotals {
  const totals = results.reduce(
    (accumulator, result) => ({
      visitors: accumulator.visitors + (result.visitors || 0),
      clicks: accumulator.clicks + (result.clicks || 0),
      leads: accumulator.leads + (result.leads || 0),
      signups: accumulator.signups + (result.signups || 0),
      onboardings: accumulator.onboardings + (result.onboardings || 0),
      first_responses: accumulator.first_responses + (result.first_responses || 0),
      saved_responses: accumulator.saved_responses + (result.saved_responses || 0),
      checkouts: accumulator.checkouts + (result.checkouts || 0),
      subscriptions: accumulator.subscriptions + (result.subscriptions || 0),
      spend_amount: accumulator.spend_amount + (result.spend_amount || 0)
    }),
    {
      visitors: 0,
      clicks: 0,
      leads: 0,
      signups: 0,
      onboardings: 0,
      first_responses: 0,
      saved_responses: 0,
      checkouts: 0,
      subscriptions: 0,
      spend_amount: 0
    }
  );

  return {
    ...totals,
    ...calculateCampaignCosts(totals)
  };
}

export function getCampaignDiagnostics(totals: CampaignTotals) {
  const diagnostics: string[] = [];

  if (totals.visitors >= 50 && totals.leads < Math.max(3, Math.ceil(totals.visitors * 0.05))) {
    diagnostics.push("A página ou oferta pode não estar clara.");
  }
  if (totals.leads >= 10 && totals.signups < Math.max(2, Math.ceil(totals.leads * 0.2))) {
    diagnostics.push("A transição do lead para cadastro pode estar fraca.");
  }
  if (totals.signups >= 5 && totals.onboardings < Math.max(1, Math.ceil(totals.signups * 0.4))) {
    diagnostics.push("O onboarding pode estar confuso.");
  }
  if (totals.onboardings >= 5 && totals.first_responses < Math.max(1, Math.ceil(totals.onboardings * 0.5))) {
    diagnostics.push("O dashboard inicial pode precisar de mais orientação.");
  }
  if (totals.first_responses >= 5 && totals.checkouts < Math.max(1, Math.ceil(totals.first_responses * 0.2))) {
    diagnostics.push("A oferta ou pricing pode precisar de ajuste.");
  }
  if (totals.checkouts >= 3 && totals.subscriptions < Math.max(1, Math.ceil(totals.checkouts * 0.3))) {
    diagnostics.push("Revisar preço, checkout ou confiança.");
  }

  return diagnostics.length ? diagnostics : ["Sem dados suficientes para diagnóstico automático."];
}

export function enrichCampaigns(campaigns: CampaignExperiment[], results: CampaignResult[]): CampaignWithResults[] {
  return campaigns.map((campaign) => {
    const campaignResults = results.filter((result) => result.campaign_id === campaign.id);
    const totals = aggregateCampaignResults(campaignResults);
    return {
      ...campaign,
      results: campaignResults,
      totals,
      diagnostics: getCampaignDiagnostics(totals)
    };
  });
}

export function summarizeByDimension(campaigns: CampaignWithResults[], dimension: "niche" | "channel") {
  const groups = campaigns.reduce<Record<string, CampaignTotals & { campaigns: number }>>((accumulator, campaign) => {
    const label = (campaign[dimension] || "Não informado").trim() || "Não informado";
    const current = accumulator[label] || {
      campaigns: 0,
      visitors: 0,
      clicks: 0,
      leads: 0,
      signups: 0,
      onboardings: 0,
      first_responses: 0,
      saved_responses: 0,
      checkouts: 0,
      subscriptions: 0,
      spend_amount: 0,
      cost_per_lead: null,
      cost_per_signup: null,
      cost_per_subscription: null
    };
    const next = {
      ...current,
      campaigns: current.campaigns + 1,
      visitors: current.visitors + campaign.totals.visitors,
      clicks: current.clicks + campaign.totals.clicks,
      leads: current.leads + campaign.totals.leads,
      signups: current.signups + campaign.totals.signups,
      onboardings: current.onboardings + campaign.totals.onboardings,
      first_responses: current.first_responses + campaign.totals.first_responses,
      saved_responses: current.saved_responses + campaign.totals.saved_responses,
      checkouts: current.checkouts + campaign.totals.checkouts,
      subscriptions: current.subscriptions + campaign.totals.subscriptions,
      spend_amount: current.spend_amount + campaign.totals.spend_amount
    };
    accumulator[label] = {
      ...next,
      ...calculateCampaignCosts(next)
    };
    return accumulator;
  }, {});

  return Object.entries(groups)
    .map(([label, totals]) => ({ label, ...totals }))
    .sort((a, b) => b.subscriptions - a.subscriptions || b.leads - a.leads || a.label.localeCompare(b.label));
}

export function campaignStatusLabel(status?: string | null) {
  const labels: Record<string, string> = {
    planned: "Planejada",
    running: "Rodando",
    paused: "Pausada",
    completed: "Concluída",
    archived: "Arquivada"
  };
  return labels[status || ""] || "Não informado";
}

export function campaignDecisionLabel(decision?: string | null) {
  const labels: Record<string, string> = {
    keep: "Manter",
    pause: "Pausar",
    iterate: "Ajustar",
    scale_cautiously: "Escalar com cautela",
    inconclusive: "Inconclusivo"
  };
  return labels[decision || ""] || "Não informado";
}
