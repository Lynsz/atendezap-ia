import { NextResponse } from "next/server";
import { z } from "zod";
import { AppError } from "@/lib/errors";
import { requireAdmin } from "@/lib/admin";
import { serverLog } from "@/lib/logger";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type PeriodFilter = "today" | "7d" | "30d" | "all";

type LeadMetricRow = {
  email: string | null;
  created_at: string;
};

type ProfileMetricRow = {
  id: string;
  email: string | null;
  created_at: string;
};

type BusinessMetricRow = {
  user_id: string | null;
  onboarding_completed: boolean | null;
  created_at: string;
  updated_at: string;
};

type ResponseMetricRow = {
  user_id: string | null;
  created_at: string;
};

type SubscriptionMetricRow = {
  user_id: string | null;
  status: string | null;
  stripe_checkout_session_id?: string | null;
  provider_subscription_id?: string | null;
  stripe_subscription_id?: string | null;
  created_at: string;
};

type FeedbackMetricRow = {
  type: string | null;
  status: string | null;
  created_at: string;
};

const metricsQuerySchema = z.object({
  period: z.enum(["today", "7d", "30d", "all"]).optional().default("30d")
});

const feedbackTypes = ["bug", "duvida", "sugestao", "elogio", "dificuldade_uso"] as const;

function getPeriodStart(period: PeriodFilter) {
  const now = new Date();
  if (period === "today") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "7d") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (period === "30d") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return null;
}

function getDayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function isAtOrAfter(value: string, start: Date | null) {
  if (!start) return true;
  return new Date(value).getTime() >= start.getTime();
}

function isActiveSubscription(status?: string | null) {
  const normalized = status?.toLowerCase();
  return normalized === "active" || normalized === "trial" || normalized === "trialing";
}

function isUnresolvedFeedback(status?: string | null) {
  const normalized = status?.toLowerCase();
  return normalized === "new" || normalized === "reviewing";
}

function percent(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Number(((numerator / denominator) * 100).toFixed(1));
}

function average(values: number[]) {
  if (!values.length) return null;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
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
    return NextResponse.json({ error: "Periodo invalido para metricas." }, { status: 400 });
  }
  serverLog({ level: "error", event: "admin_metrics_failed", route: "/api/admin/metrics", error });
  return NextResponse.json({ error: "Nao foi possivel carregar as metricas do produto." }, { status: 500 });
}

export async function GET(request: Request) {
  let userId: string | null = null;

  try {
    await enforceRateLimit({ request, route: "api:admin-metrics:ip", limit: 60, windowMs: 5 * 60_000 });
    const { supabase, user } = await requireAdmin(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:admin-metrics:user", identifier: user.id, limit: 60, windowMs: 5 * 60_000 });

    const url = new URL(request.url);
    const query = metricsQuerySchema.parse({
      period: url.searchParams.get("period") || "30d"
    });
    const period = query.period as PeriodFilter;
    const periodStart = getPeriodStart(period);
    const todayStart = getDayStart();
    const sevenDaysStart = daysAgo(7);
    const thirtyDaysStart = daysAgo(30);

    const [leadsResult, profilesResult, businessesResult, responsesResult, subscriptionsResult, feedbackResult] = await Promise.all([
      supabase.from("ebook_leads").select("email, created_at").limit(10000),
      supabase.from("profiles").select("id, email, created_at").limit(10000),
      supabase.from("businesses").select("user_id, onboarding_completed, created_at, updated_at").limit(10000),
      supabase.from("generated_responses").select("user_id, created_at").limit(20000),
      supabase.from("subscriptions").select("user_id, status, stripe_checkout_session_id, provider_subscription_id, stripe_subscription_id, created_at").limit(10000),
      supabase.from("user_feedback").select("type, status, created_at").limit(10000)
    ]);

    const leads = (leadsResult.data || []) as LeadMetricRow[];
    const profiles = (profilesResult.data || []) as ProfileMetricRow[];
    const businesses = (businessesResult.data || []) as BusinessMetricRow[];
    const responses = (responsesResult.data || []) as ResponseMetricRow[];
    const subscriptions = (subscriptionsResult.data || []) as SubscriptionMetricRow[];
    const feedback = (feedbackResult.data || []) as FeedbackMetricRow[];

    const profileEmails = new Set(profiles.map((profile) => profile.email?.toLowerCase()).filter(Boolean) as string[]);
    const leadEmails = new Set(leads.map((lead) => lead.email?.toLowerCase()).filter(Boolean) as string[]);
    const signedUpLeadCount = [...leadEmails].filter((email) => profileEmails.has(email)).length;

    const onboardingUsers = new Set(
      businesses
        .filter((business) => business.onboarding_completed && business.user_id)
        .map((business) => business.user_id as string)
    );
    const firstResponseUsers = new Set(responses.map((response) => response.user_id).filter(Boolean) as string[]);
    const activatedUserIds = [...onboardingUsers].filter((user) => firstResponseUsers.has(user));
    const activeSubscriptions = subscriptions.filter((subscription) => isActiveSubscription(subscription.status));
    const checkoutStartedUsers = new Set(
      subscriptions
        .filter((subscription) => subscription.stripe_checkout_session_id || subscription.provider_subscription_id || subscription.stripe_subscription_id || subscription.status?.toLowerCase() === "pending")
        .map((subscription) => subscription.user_id)
        .filter(Boolean) as string[]
    );

    const responseCountsByUser = responses.reduce<Record<string, number>>((accumulator, response) => {
      if (response.user_id) accumulator[response.user_id] = (accumulator[response.user_id] || 0) + 1;
      return accumulator;
    }, {});
    const activeUsers7Days = new Set(responses.filter((response) => isAtOrAfter(response.created_at, sevenDaysStart)).map((response) => response.user_id).filter(Boolean) as string[]);
    const activeUsers30Days = new Set(responses.filter((response) => isAtOrAfter(response.created_at, thirtyDaysStart)).map((response) => response.user_id).filter(Boolean) as string[]);

    const firstResponseAtByUser = new Map<string, string>();
    for (const response of responses.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())) {
      if (response.user_id && !firstResponseAtByUser.has(response.user_id)) firstResponseAtByUser.set(response.user_id, response.created_at);
    }
    const profileCreatedAtByUser = new Map(profiles.map((profile) => [profile.id, profile.created_at]));
    const activationHours = activatedUserIds
      .map((activatedUserId) => {
        const profileCreatedAt = profileCreatedAtByUser.get(activatedUserId);
        const firstResponseAt = firstResponseAtByUser.get(activatedUserId);
        if (!profileCreatedAt || !firstResponseAt) return null;
        const diff = new Date(firstResponseAt).getTime() - new Date(profileCreatedAt).getTime();
        return diff >= 0 ? diff / (60 * 60 * 1000) : null;
      })
      .filter((value): value is number => typeof value === "number");

    const feedbackByType = feedbackTypes.reduce<Record<(typeof feedbackTypes)[number], number>>((accumulator, type) => {
      accumulator[type] = feedback.filter((item) => item.type === type).length;
      return accumulator;
    }, {
      bug: 0,
      duvida: 0,
      sugestao: 0,
      elogio: 0,
      dificuldade_uso: 0
    });

    const totalUsers = profiles.length;
    const completedOnboardingUsers = onboardingUsers.size;
    const usersWithFirstResponse = firstResponseUsers.size;
    const activatedUsers = activatedUserIds.length;
    const totalResponses = responses.length;
    const responseUserCount = Object.keys(responseCountsByUser).length;

    serverLog({ event: "admin_metrics_loaded", route: "/api/admin/metrics", userId, status: "ok", metadata: { period } });

    return NextResponse.json({
      period: {
        value: period,
        label: period === "today" ? "Hoje" : period === "7d" ? "Ultimos 7 dias" : period === "30d" ? "Ultimos 30 dias" : "Todos",
        start: periodStart?.toISOString() || null
      },
      funnel: {
        totalLeads: leads.length,
        periodLeads: leads.filter((lead) => isAtOrAfter(lead.created_at, periodStart)).length,
        totalUsers,
        completedOnboardingUsers,
        usersWithFirstResponse,
        activatedUsers,
        checkoutStartedUsers: checkoutStartedUsers.size,
        activeSubscriptions: activeSubscriptions.length,
        leadToSignupRate: percent(signedUpLeadCount, leads.length),
        signupToOnboardingRate: percent(completedOnboardingUsers, totalUsers),
        onboardingToFirstResponseRate: percent(activatedUsers, completedOnboardingUsers),
        signupToActiveSubscriptionRate: percent(activeSubscriptions.length, totalUsers),
        activationRate: percent(activatedUsers, totalUsers)
      },
      activation: {
        definition: "Usuario ativado = concluiu onboarding e gerou pelo menos 1 resposta.",
        activatedUsers,
        activationRate: percent(activatedUsers, totalUsers),
        averageHoursToActivation: average(activationHours)
      },
      usage: {
        totalResponses,
        averageResponsesPerUser: responseUserCount ? Number((totalResponses / responseUserCount).toFixed(1)) : 0,
        responsesToday: responses.filter((response) => isAtOrAfter(response.created_at, todayStart)).length,
        responsesLast7Days: responses.filter((response) => isAtOrAfter(response.created_at, sevenDaysStart)).length,
        responsesLast30Days: responses.filter((response) => isAtOrAfter(response.created_at, thirtyDaysStart)).length,
        activeUsersLast7Days: activeUsers7Days.size,
        activeUsersLast30Days: activeUsers30Days.size
      },
      feedback: {
        totalFeedbacks: feedback.length,
        periodFeedbacks: feedback.filter((item) => isAtOrAfter(item.created_at, periodStart)).length,
        newFeedbacks: feedback.filter((item) => item.status === "new").length,
        unresolvedFeedbacks: feedback.filter((item) => isUnresolvedFeedback(item.status)).length,
        byType: feedbackByType
      },
      notes: {
        leadToSignup: "Taxa aproximada por e-mail entre ebook_leads e profiles.",
        checkoutStarted: "Checkout iniciado e aproximado por subscription pendente ou com ids Stripe salvos.",
        timeToActivation:
          activationHours.length > 0
            ? "Tempo aproximado entre criacao do profile e primeira resposta gerada por usuarios ativados."
            : "Tempo ate ativacao depende de profile criado e primeira resposta gerada; sem amostra suficiente ainda."
      }
    });
  } catch (error) {
    serverLog({ level: "warn", event: "admin_metrics_failed", route: "/api/admin/metrics", userId, error });
    return jsonError(error);
  }
}
