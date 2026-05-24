import { NextResponse } from "next/server";
import { z } from "zod";
import { AppError } from "@/lib/errors";
import { requireAdmin } from "@/lib/admin";
import { serverLog } from "@/lib/logger";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type PeriodFilter = "today" | "7d" | "30d" | "all";

type LeadRow = {
  email: string | null;
  created_at: string;
  utm_source: string | null;
  utm_campaign: string | null;
};

type ProfileRow = {
  id: string;
  email: string | null;
  created_at: string;
};

type BusinessRow = {
  user_id: string | null;
  onboarding_completed: boolean | null;
  created_at: string;
  updated_at: string;
};

type ResponseRow = {
  user_id: string | null;
  created_at: string;
};

type SubscriptionRow = {
  user_id: string | null;
  status: string | null;
  acquisition_source?: string | null;
  funnel_source?: string | null;
  metadata?: Record<string, unknown> | null;
  stripe_checkout_session_id?: string | null;
  provider_subscription_id?: string | null;
  stripe_subscription_id?: string | null;
  created_at: string;
};

type FeedbackRow = {
  type: string | null;
  created_at: string;
};

type EventRow = {
  event_name: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

const reportQuerySchema = z.object({
  period: z.enum(["today", "7d", "30d", "all"]).optional().default("30d"),
  utm_source: z.string().trim().max(160).optional().default(""),
  utm_campaign: z.string().trim().max(160).optional().default("")
});

function getPeriodStart(period: PeriodFilter) {
  const now = new Date();
  if (period === "today") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "7d") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (period === "30d") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return null;
}

function periodLabel(period: PeriodFilter) {
  if (period === "today") return "Hoje";
  if (period === "7d") return "Ultimos 7 dias";
  if (period === "30d") return "Ultimos 30 dias";
  return "Todos";
}

function isAtOrAfter(value: string, start: Date | null) {
  if (!start) return true;
  return new Date(value).getTime() >= start.getTime();
}

function isActiveSubscription(status?: string | null) {
  const normalized = status?.toLowerCase();
  return normalized === "active" || normalized === "trial" || normalized === "trialing";
}

function isCheckoutStarted(subscription: SubscriptionRow) {
  const normalized = subscription.status?.toLowerCase();
  return Boolean(
    subscription.stripe_checkout_session_id ||
      subscription.provider_subscription_id ||
      subscription.stripe_subscription_id ||
      normalized === "pending" ||
      normalized === "incomplete"
  );
}

function percent(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Number(((numerator / denominator) * 100).toFixed(1));
}

function cleanValue(value?: string | null) {
  const normalized = value?.trim();
  return normalized || "sem_utm";
}

function metadataString(metadata: Record<string, unknown> | null | undefined, key: string) {
  const value = metadata?.[key];
  return typeof value === "string" ? value : null;
}

function subscriptionMatchesFilters(subscription: SubscriptionRow, filters: { utmSource: string; utmCampaign: string }) {
  const source = metadataString(subscription.metadata, "utm_source") || subscription.acquisition_source || "";
  const campaign = metadataString(subscription.metadata, "utm_campaign") || subscription.funnel_source || "";
  if (filters.utmSource && source !== filters.utmSource) return false;
  if (filters.utmCampaign && campaign !== filters.utmCampaign) return false;
  return true;
}

function eventMatchesFilters(event: EventRow, filters: { utmSource: string; utmCampaign: string }) {
  const source = metadataString(event.metadata, "utm_source") || "";
  const campaign = metadataString(event.metadata, "utm_campaign") || "";
  if (filters.utmSource && source !== filters.utmSource) return false;
  if (filters.utmCampaign && campaign !== filters.utmCampaign) return false;
  return true;
}

function breakdown(rows: LeadRow[], key: "utm_source" | "utm_campaign") {
  return Object.entries(
    rows.reduce<Record<string, number>>((accumulator, row) => {
      const label = cleanValue(row[key]);
      accumulator[label] = (accumulator[label] || 0) + 1;
      return accumulator;
    }, {})
  )
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function buildInterpretation(metrics: {
  totalLeads: number;
  totalSignups: number;
  onboardingCompleted: number;
  firstResponseGenerated: number;
  checkoutStarted: number;
  activeSubscriptions: number;
  difficultyFeedbacks: number;
}) {
  if (metrics.totalLeads < 5 && metrics.totalSignups < 3) return "Sem dados suficientes para conclusao.";
  if (metrics.totalLeads >= 5 && percent(metrics.totalSignups, metrics.totalLeads) < 10) return "Gargalo provavel: lead para cadastro. Revise pagina de obrigado, CTA e proposta de valor.";
  if (metrics.totalSignups >= 3 && percent(metrics.onboardingCompleted, metrics.totalSignups) < 30) return "Gargalo provavel: onboarding. Revise clareza e numero de campos.";
  if (metrics.onboardingCompleted >= 3 && percent(metrics.firstResponseGenerated, metrics.onboardingCompleted) < 40) return "Gargalo provavel: primeira experiencia no dashboard. Destaque melhor o campo de geracao.";
  if (metrics.firstResponseGenerated >= 3 && metrics.checkoutStarted === 0) return "Gargalo provavel: oferta, pricing ou CTA para plano.";
  if (metrics.checkoutStarted >= 2 && metrics.activeSubscriptions === 0) return "Gargalo provavel: preco, confianca ou checkout.";
  if (metrics.difficultyFeedbacks > 0 && metrics.difficultyFeedbacks >= Math.max(2, Math.ceil(metrics.totalSignups * 0.25))) return "Risco: feedbacks indicam dificuldade de uso.";
  if (metrics.onboardingCompleted > 0 && metrics.firstResponseGenerated > 0) return "Boa ativacao: usuarios estao concluindo onboarding e gerando respostas.";
  return "Acompanhar por mais dados antes de decidir.";
}

function jsonError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (typeof error === "object" && error !== null && "status" in error && "message" in error) {
    const appError = error as { status?: unknown; message?: unknown };
    if (typeof appError.status === "number" && typeof appError.message === "string") {
      return NextResponse.json({ error: appError.message }, { status: appError.status });
    }
  }
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: "Filtros invalidos para o relatorio de campanha." }, { status: 400 });
  }
  serverLog({ level: "error", event: "admin_campaign_report_failed", route: "/api/admin/campaign-report", error });
  return NextResponse.json({ error: "Nao foi possivel carregar o relatorio de campanha." }, { status: 500 });
}

export async function GET(request: Request) {
  let userId: string | null = null;

  try {
    await enforceRateLimit({ request, route: "api:admin-campaign-report:ip", limit: 60, windowMs: 5 * 60_000 });
    const { supabase, user } = await requireAdmin(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:admin-campaign-report:user", identifier: user.id, limit: 60, windowMs: 5 * 60_000 });

    const url = new URL(request.url);
    const query = reportQuerySchema.parse({
      period: url.searchParams.get("period") || "30d",
      utm_source: url.searchParams.get("utm_source") || "",
      utm_campaign: url.searchParams.get("utm_campaign") || ""
    });
    const period = query.period as PeriodFilter;
    const periodStart = getPeriodStart(period);
    const filters = {
      utmSource: query.utm_source,
      utmCampaign: query.utm_campaign
    };

    const [leadsResult, profilesResult, businessesResult, responsesResult, subscriptionsResult, feedbackResult, eventsResult] = await Promise.all([
      supabase.from("ebook_leads").select("email, created_at, utm_source, utm_campaign").limit(10000),
      supabase.from("profiles").select("id, email, created_at").limit(10000),
      supabase.from("businesses").select("user_id, onboarding_completed, created_at, updated_at").limit(10000),
      supabase.from("generated_responses").select("user_id, created_at").limit(20000),
      supabase
        .from("subscriptions")
        .select("user_id, status, acquisition_source, funnel_source, metadata, stripe_checkout_session_id, provider_subscription_id, stripe_subscription_id, created_at")
        .limit(10000),
      supabase.from("user_feedback").select("type, created_at").limit(10000),
      supabase.from("events").select("event_name, metadata, created_at").limit(20000)
    ]);

    const allLeads = (leadsResult.data || []) as LeadRow[];
    const profiles = (profilesResult.data || []) as ProfileRow[];
    const businesses = (businessesResult.data || []) as BusinessRow[];
    const responses = (responsesResult.data || []) as ResponseRow[];
    const subscriptions = (subscriptionsResult.data || []) as SubscriptionRow[];
    const feedback = (feedbackResult.data || []) as FeedbackRow[];
    const events = (eventsResult.data || []) as EventRow[];

    const filteredLeads = allLeads.filter((lead) => {
      if (!isAtOrAfter(lead.created_at, periodStart)) return false;
      if (filters.utmSource && lead.utm_source !== filters.utmSource) return false;
      if (filters.utmCampaign && lead.utm_campaign !== filters.utmCampaign) return false;
      return true;
    });
    const filteredLeadEmails = new Set(filteredLeads.map((lead) => lead.email?.toLowerCase()).filter(Boolean) as string[]);
    const hasCampaignFilter = Boolean(filters.utmSource || filters.utmCampaign);

    const profilesInScope = profiles.filter((profile) => {
      if (hasCampaignFilter || filteredLeadEmails.size > 0) return Boolean(profile.email && filteredLeadEmails.has(profile.email.toLowerCase()));
      return isAtOrAfter(profile.created_at, periodStart);
    });
    const userIdsInScope = new Set(profilesInScope.map((profile) => profile.id));
    const onboardingUsers = new Set(
      businesses
        .filter((business) => business.user_id && business.onboarding_completed && userIdsInScope.has(business.user_id))
        .map((business) => business.user_id as string)
    );
    const firstResponseUsers = new Set(
      responses
        .filter((response) => response.user_id && userIdsInScope.has(response.user_id) && isAtOrAfter(response.created_at, periodStart))
        .map((response) => response.user_id as string)
    );
    const activatedUsers = [...onboardingUsers].filter((id) => firstResponseUsers.has(id)).length;
    const subscriptionsInScope = subscriptions.filter((subscription) => {
      if (!isAtOrAfter(subscription.created_at, periodStart)) return false;
      if (hasCampaignFilter) return subscriptionMatchesFilters(subscription, filters);
      return Boolean(subscription.user_id && userIdsInScope.has(subscription.user_id));
    });
    const periodFeedback = feedback.filter((item) => isAtOrAfter(item.created_at, periodStart));
    const filteredEvents = events.filter((event) => isAtOrAfter(event.created_at, periodStart) && eventMatchesFilters(event, filters));

    const metrics = {
      totalLeads: filteredLeads.length,
      totalSignups: profilesInScope.length,
      onboardingCompleted: onboardingUsers.size,
      activatedUsers,
      demoUses: filteredEvents.filter((event) => event.event_name === "demo_response_success" || event.event_name === "demo_generate_click").length,
      firstResponseGenerated: firstResponseUsers.size,
      checkoutStarted: subscriptionsInScope.filter(isCheckoutStarted).length,
      activeSubscriptions: subscriptionsInScope.filter((subscription) => isActiveSubscription(subscription.status)).length,
      feedbackCount: periodFeedback.length,
      difficultyFeedbacks: periodFeedback.filter((item) => item.type === "dificuldade_uso").length
    };

    serverLog({ event: "admin_campaign_report_loaded", route: "/api/admin/campaign-report", userId, status: "ok", metadata: { period, utm_source: filters.utmSource || "all", utm_campaign: filters.utmCampaign || "all" } });

    return NextResponse.json({
      period: {
        value: period,
        label: periodLabel(period),
        start: periodStart?.toISOString() || null
      },
      filters: {
        utm_source: filters.utmSource,
        utm_campaign: filters.utmCampaign
      },
      filterOptions: {
        utmSources: [...new Set(allLeads.map((lead) => lead.utm_source).filter(Boolean))].sort(),
        utmCampaigns: [...new Set(allLeads.map((lead) => lead.utm_campaign).filter(Boolean))].sort()
      },
      metrics: {
        ...metrics,
        leadToSignupRate: percent(metrics.totalSignups, metrics.totalLeads),
        signupToOnboardingRate: percent(metrics.onboardingCompleted, metrics.totalSignups),
        onboardingToFirstResponseRate: percent(metrics.firstResponseGenerated, metrics.onboardingCompleted),
        signupToSubscriptionRate: percent(metrics.activeSubscriptions, metrics.totalSignups),
        leadToSubscriptionRate: percent(metrics.activeSubscriptions, metrics.totalLeads)
      },
      breakdowns: {
        leadsByUtmSource: breakdown(filteredLeads, "utm_source"),
        leadsByUtmCampaign: breakdown(filteredLeads, "utm_campaign")
      },
      interpretation: buildInterpretation(metrics),
      notes: [
        "Dados retornados sao agregados e nao incluem listas de pessoas.",
        "Cadastro por campanha e aproximado por e-mail entre ebook_leads e profiles.",
        "Onboarding, ativacao e primeira resposta usam usuarios associados aos leads filtrados quando ha UTM ou leads no periodo.",
        "Demo usada depende de eventos internos persistidos na tabela events; se apenas GA4/Meta estiverem ativos, essa metrica pode aparecer zerada.",
        "Checkout iniciado e aproximado por subscriptions pendentes ou com ids Stripe salvos."
      ]
    });
  } catch (error) {
    serverLog({ level: "warn", event: "admin_campaign_report_failed", route: "/api/admin/campaign-report", userId, error });
    return jsonError(error);
  }
}
