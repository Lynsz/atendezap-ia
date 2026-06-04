import { NextResponse } from "next/server";
import { z } from "zod";
import { AppError } from "@/lib/errors";
import { requireAdmin } from "@/lib/admin";
import { serverLog } from "@/lib/logger";
import { getPlanResponseLimit } from "@/lib/plan-limits";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type PeriodFilter = "today" | "7d" | "30d" | "all";

type LeadMetricRow = {
  email: string | null;
  created_at: string;
  utm_source: string | null;
  utm_campaign: string | null;
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
  plan?: string | null;
  plan_name?: string | null;
  price?: number | null;
  monthly_limit?: number | null;
  status: string | null;
  acquisition_source?: string | null;
  funnel_source?: string | null;
  metadata?: Record<string, unknown> | null;
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

type AiResponseFeedbackMetricRow = {
  rating: string | null;
  comment: string | null;
  created_at: string;
};

type SavedResponseMetricRow = {
  user_id: string | null;
  source_template_id?: string | null;
  category?: string | null;
  copy_count?: number | null;
  is_favorite?: boolean | null;
  created_at: string;
};

type EventMetricRow = {
  event_name: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
};

type StripeWebhookEventMetricRow = {
  event_type: string;
  processed_at: string | null;
  created_at: string;
};

type SupportRequestMetricRow = {
  status: string | null;
  created_at: string;
};

type CancellationFeedbackMetricRow = {
  reason: string | null;
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

function isOpenSupportRequest(status?: string | null) {
  const normalized = status?.toLowerCase();
  return normalized === "pending" || normalized === "in_progress";
}

function percent(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Number(((numerator / denominator) * 100).toFixed(1));
}

function average(values: number[]) {
  if (!values.length) return null;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
}

function cleanCampaignValue(value?: string | null) {
  const normalized = value?.trim();
  return normalized || "sem_utm";
}

function topBreakdown(rows: Array<{ label: string }>, limit = 8) {
  return Object.entries(
    rows.reduce<Record<string, number>>((accumulator, row) => {
      accumulator[row.label] = (accumulator[row.label] || 0) + 1;
      return accumulator;
    }, {})
  )
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}

function getSubscriptionCampaign(subscription: SubscriptionMetricRow) {
  const metadata = subscription.metadata || {};
  const campaign = typeof metadata.utm_campaign === "string" ? metadata.utm_campaign : null;
  return cleanCampaignValue(campaign || subscription.funnel_source || subscription.acquisition_source);
}

function planLabel(subscription: SubscriptionMetricRow) {
  return subscription.plan || subscription.plan_name || "sem_plano";
}

function resultAvailable(result: { error?: unknown }) {
  return !result.error;
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

    const [
      leadsResult,
      profilesResult,
      businessesResult,
      responsesResult,
      subscriptionsResult,
      feedbackResult,
      aiResponseFeedbackResult,
      savedResponsesResult,
      eventsResult,
      stripeWebhookEventsResult,
      supportRequestsResult,
      cancellationFeedbackResult
    ] = await Promise.all([
      supabase.from("ebook_leads").select("email, created_at, utm_source, utm_campaign").limit(10000),
      supabase.from("profiles").select("id, email, created_at").limit(10000),
      supabase.from("businesses").select("user_id, onboarding_completed, created_at, updated_at").limit(10000),
      supabase.from("generated_responses").select("user_id, created_at").limit(20000),
      supabase.from("subscriptions").select("user_id, plan, plan_name, price, monthly_limit, status, acquisition_source, funnel_source, metadata, stripe_checkout_session_id, provider_subscription_id, stripe_subscription_id, created_at").limit(10000),
      supabase.from("user_feedback").select("type, status, created_at").limit(10000),
      supabase.from("ai_response_feedback").select("rating, comment, created_at").limit(10000),
      supabase.from("saved_responses").select("user_id, source_template_id, category, copy_count, is_favorite, created_at").limit(20000),
      supabase.from("events").select("event_name, metadata, created_at").limit(20000),
      supabase.from("stripe_webhook_events").select("event_type, processed_at, created_at").limit(10000),
      supabase.from("support_requests").select("status, created_at").limit(10000),
      supabase.from("cancellation_feedback").select("reason, created_at").limit(10000)
    ]);

    const availability = {
      leads: resultAvailable(leadsResult),
      profiles: resultAvailable(profilesResult),
      businesses: resultAvailable(businessesResult),
      generatedResponses: resultAvailable(responsesResult),
      subscriptions: resultAvailable(subscriptionsResult),
      feedback: resultAvailable(feedbackResult),
      aiResponseFeedback: resultAvailable(aiResponseFeedbackResult),
      savedResponses: resultAvailable(savedResponsesResult),
      events: resultAvailable(eventsResult),
      stripeWebhookEvents: resultAvailable(stripeWebhookEventsResult),
      supportRequests: resultAvailable(supportRequestsResult),
      cancellationFeedback: resultAvailable(cancellationFeedbackResult)
    };

    const leads = (leadsResult.data || []) as LeadMetricRow[];
    const profiles = (profilesResult.data || []) as ProfileMetricRow[];
    const businesses = (businessesResult.data || []) as BusinessMetricRow[];
    const responses = (responsesResult.data || []) as ResponseMetricRow[];
    const subscriptions = (subscriptionsResult.data || []) as SubscriptionMetricRow[];
    const feedback = (feedbackResult.data || []) as FeedbackMetricRow[];
    const aiResponseFeedback = (aiResponseFeedbackResult.data || []) as AiResponseFeedbackMetricRow[];
    const savedResponses = (savedResponsesResult.data || []) as SavedResponseMetricRow[];
    const events = (eventsResult.data || []) as EventMetricRow[];
    const stripeWebhookEvents = (stripeWebhookEventsResult.data || []) as StripeWebhookEventMetricRow[];
    const supportRequests = (supportRequestsResult.data || []) as SupportRequestMetricRow[];
    const cancellationFeedback = (cancellationFeedbackResult.data || []) as CancellationFeedbackMetricRow[];
    const savedTemplates = savedResponses.filter((item) => item.source_template_id);

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
    const monthlyResponseCountsByUser = responses
      .filter((response) => isAtOrAfter(response.created_at, new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1))))
      .reduce<Record<string, number>>((accumulator, response) => {
        if (response.user_id) accumulator[response.user_id] = (accumulator[response.user_id] || 0) + 1;
        return accumulator;
      }, {});
    const usersNearLimit = activeSubscriptions.filter((subscription) => {
      if (!subscription.user_id) return false;
      const limit = subscription.monthly_limit || getPlanResponseLimit(subscription.plan || subscription.plan_name, subscription.status);
      const used = monthlyResponseCountsByUser[subscription.user_id] || 0;
      return limit > 0 && used >= limit * 0.8 && used < limit;
    });
    const usersAtLimit = activeSubscriptions.filter((subscription) => {
      if (!subscription.user_id) return false;
      const limit = subscription.monthly_limit || getPlanResponseLimit(subscription.plan || subscription.plan_name, subscription.status);
      const used = monthlyResponseCountsByUser[subscription.user_id] || 0;
      return limit > 0 && used >= limit;
    });
    const topUsageUsers = Object.entries(monthlyResponseCountsByUser)
      .map(([user_id, responses_used]) => ({
        user_id,
        user_id_short: user_id.length > 12 ? `${user_id.slice(0, 8)}...${user_id.slice(-4)}` : user_id,
        responses_used
      }))
      .sort((a, b) => b.responses_used - a.responses_used)
      .slice(0, 5);
    const activeUsers7Days = new Set(responses.filter((response) => isAtOrAfter(response.created_at, sevenDaysStart)).map((response) => response.user_id).filter(Boolean) as string[]);
    const activeUsers30Days = new Set(responses.filter((response) => isAtOrAfter(response.created_at, thirtyDaysStart)).map((response) => response.user_id).filter(Boolean) as string[]);
    const positiveAiFeedback = aiResponseFeedback.filter((item) => item.rating === "positive");
    const negativeAiFeedback = aiResponseFeedback.filter((item) => item.rating === "negative");
    const aiFeedbackInPeriod = aiResponseFeedback.filter((item) => isAtOrAfter(item.created_at, periodStart));
    const savedResponseUsers = new Set(savedResponses.map((item) => item.user_id).filter(Boolean) as string[]);
    const copiedResponseUsers = new Set(savedResponses.filter((item) => (item.copy_count || 0) > 0).map((item) => item.user_id).filter(Boolean) as string[]);
    const favoriteResponseUsers = new Set(savedResponses.filter((item) => item.is_favorite).map((item) => item.user_id).filter(Boolean) as string[]);
    const recentAiComments = aiResponseFeedback
      .filter((item) => item.comment?.trim())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map((item) => ({
        rating: item.rating || "unknown",
        comment: item.comment as string,
        created_at: item.created_at
      }));

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
    const savedOrCopiedUsers = new Set([...savedResponseUsers, ...copiedResponseUsers]);
    const responseUserCount = Object.keys(responseCountsByUser).length;
    const canceledSubscriptions = subscriptions.filter((subscription) => subscription.status?.toLowerCase() === "canceled");
    const pastDueSubscriptions = subscriptions.filter((subscription) => subscription.status?.toLowerCase() === "past_due");
    const failedPaymentSubscriptions = subscriptions.filter((subscription) => subscription.status?.toLowerCase() === "past_due" || subscription.status?.toLowerCase() === "unpaid");
    const newSubscribersLast30Days = subscriptions.filter((subscription) => isActiveSubscription(subscription.status) && isAtOrAfter(subscription.created_at, thirtyDaysStart)).length;
    const cancellationsLast30Days = canceledSubscriptions.filter((subscription) => isAtOrAfter(subscription.created_at, thirtyDaysStart)).length;
    const estimatedMrr = activeSubscriptions.reduce((sum, subscription) => sum + (typeof subscription.price === "number" ? subscription.price : 0), 0);
    const activeSubscriptionsByPlan = Object.entries(
      activeSubscriptions.reduce<Record<string, number>>((accumulator, subscription) => {
        const label = planLabel(subscription);
        accumulator[label] = (accumulator[label] || 0) + 1;
        return accumulator;
      }, {})
    )
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    const leadEmailsByCampaign = leads.reduce<Record<string, Set<string>>>((accumulator, lead) => {
      const campaign = cleanCampaignValue(lead.utm_campaign);
      if (!accumulator[campaign]) accumulator[campaign] = new Set<string>();
      if (lead.email) accumulator[campaign].add(lead.email.toLowerCase());
      return accumulator;
    }, {});
    const leadSignupByCampaign = Object.entries(leadEmailsByCampaign)
      .map(([campaign, emails]) => ({
        campaign,
        leads: emails.size,
        signups: [...emails].filter((email) => profileEmails.has(email)).length
      }))
      .sort((a, b) => b.leads - a.leads || a.campaign.localeCompare(b.campaign))
      .slice(0, 8);
    const pricingPageViews = events.filter((event) => ["pricing_page_view", "pricing_view"].includes(event.event_name)).length;
    const planClicks = events.filter((event) => ["plan_cta_click", "plan_click", "pricing_cta_click"].includes(event.event_name)).length;
    const checkoutsStartedByEvent = events.filter((event) => event.event_name === "checkout_started").length;
    const checkoutFailures = events.filter((event) => ["checkout_failed", "checkout_error"].includes(event.event_name)).length;
    const firstResponsePricingClicks = events.filter((event) => event.event_name === "first_response_to_pricing_click").length;
    const demoSignupClicks = events.filter((event) => ["demo_to_signup_click", "demo_signup_cta_click"].includes(event.event_name)).length;
    const ebookSignupClicks = events.filter((event) => ["ebook_to_signup_click", "thank_you_signup_cta_click"].includes(event.event_name)).length;
    const usersSavedBeforeCheckout = [...savedResponseUsers].filter((user) => checkoutStartedUsers.has(user)).length;
    const approximateCheckoutStarted = Math.max(checkoutStartedUsers.size, checkoutsStartedByEvent);

    serverLog({ event: "admin_metrics_loaded", route: "/api/admin/metrics", userId, status: "ok", metadata: { period } });

    return NextResponse.json({
      period: {
        value: period,
        label: period === "today" ? "Hoje" : period === "7d" ? "Ultimos 7 dias" : period === "30d" ? "Ultimos 30 dias" : "Todos",
        start: periodStart?.toISOString() || null
      },
      availability,
      funnel: {
        totalLeads: leads.length,
        periodLeads: leads.filter((lead) => isAtOrAfter(lead.created_at, periodStart)).length,
        totalUsers,
        completedOnboardingUsers,
        usersWithFirstResponse,
        usersWithSavedOrCopiedResponse: savedOrCopiedUsers.size,
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
        newUsersLast7Days: profiles.filter((profile) => isAtOrAfter(profile.created_at, sevenDaysStart)).length,
        onboardingCompletedLast7Days: businesses.filter((business) => business.onboarding_completed && isAtOrAfter(business.updated_at || business.created_at, sevenDaysStart)).length,
        firstResponsesGenerated: usersWithFirstResponse,
        firstResponsesLast7Days: [...firstResponseAtByUser.values()].filter((createdAt) => isAtOrAfter(createdAt, sevenDaysStart)).length,
        responsesSaved: savedResponses.length,
        usersWithSavedResponses: savedResponseUsers.size,
        usersWithCopiedResponse: copiedResponseUsers.size,
        usersWithFavoriteResponse: favoriteResponseUsers.size,
        activeUsersLast7Days: activeUsers7Days.size,
        checkoutStartedUsers: checkoutStartedUsers.size,
        activeSubscriptions: activeSubscriptions.length,
        activatedUsers,
        activationRate: percent(activatedUsers, totalUsers),
        averageHoursToActivation: average(activationHours)
      },
      conversion: {
        pricingPageViews,
        planClicks,
        checkoutsStarted: approximateCheckoutStarted,
        checkoutFailures,
        activeSubscriptions: activeSubscriptions.length,
        signupsWithFirstResponse: usersWithFirstResponse,
        firstResponseToPricingClicks: firstResponsePricingClicks,
        usersSavedResponseBeforeCheckout: usersSavedBeforeCheckout,
        demoToSignupClicks: demoSignupClicks,
        ebookToSignupClicks: ebookSignupClicks,
        approximateFirstResponseToCheckoutRate: percent(approximateCheckoutStarted, usersWithFirstResponse),
        approximateCheckoutToSubscriptionRate: percent(activeSubscriptions.length, approximateCheckoutStarted)
      },
      usage: {
        totalResponses,
        averageResponsesPerUser: responseUserCount ? Number((totalResponses / responseUserCount).toFixed(1)) : 0,
        responsesToday: responses.filter((response) => isAtOrAfter(response.created_at, todayStart)).length,
        responsesLast7Days: responses.filter((response) => isAtOrAfter(response.created_at, sevenDaysStart)).length,
        responsesLast30Days: responses.filter((response) => isAtOrAfter(response.created_at, thirtyDaysStart)).length,
        activeUsersLast7Days: activeUsers7Days.size,
        activeUsersLast30Days: activeUsers30Days.size,
        totalSavedResponses: savedResponses.length,
        periodSavedResponses: savedResponses.filter((item) => isAtOrAfter(item.created_at, periodStart)).length,
        usersWithSavedResponses: savedResponseUsers.size,
        totalSavedTemplates: savedTemplates.length,
        savedTemplatesByCategory: topBreakdown(savedTemplates.map((item) => ({ label: cleanCampaignValue(item.category) })), 8),
        usersNearLimit: usersNearLimit.length,
        usersAtLimit: usersAtLimit.length,
        topUsageUsers,
        aiCostEstimate: null,
        aiCostEstimateNote: "Estimativa indisponivel sem tokens salvos; confira o custo real no painel da OpenAI."
      },
      feedback: {
        totalFeedbacks: feedback.length,
        periodFeedbacks: feedback.filter((item) => isAtOrAfter(item.created_at, periodStart)).length,
        newFeedbacks: feedback.filter((item) => item.status === "new").length,
        unresolvedFeedbacks: feedback.filter((item) => isUnresolvedFeedback(item.status)).length,
        byType: feedbackByType
      },
      operationalHealth: {
        responsesGeneratedToday: responses.filter((response) => isAtOrAfter(response.created_at, todayStart)).length,
        aiFailuresToday: events.filter((event) => event.event_name === "ai_generation_failed" && isAtOrAfter(event.created_at, todayStart)).length,
        leadsToday: leads.filter((lead) => isAtOrAfter(lead.created_at, todayStart)).length,
        checkoutsStartedToday: events.filter((event) => event.event_name === "checkout_started" && isAtOrAfter(event.created_at, todayStart)).length,
        stripeWebhooksProcessedToday: stripeWebhookEvents.filter((event) => Boolean(event.processed_at) && isAtOrAfter(event.created_at, todayStart)).length,
        stripeWebhookFailuresToday: events.filter((event) => event.event_name === "stripe_webhook_failed" && isAtOrAfter(event.created_at, todayStart)).length,
        recentNegativeFeedbacks:
          aiResponseFeedback.filter((item) => item.rating === "negative" && isAtOrAfter(item.created_at, thirtyDaysStart)).length +
          feedback.filter((item) => ["bug", "dificuldade_uso"].includes(item.type || "") && isAtOrAfter(item.created_at, thirtyDaysStart)).length,
        activeSubscriptions: activeSubscriptions.length
      },
      revenue: {
        checkoutStartedUsers: checkoutStartedUsers.size,
        activeSubscriptions: activeSubscriptions.length,
        canceledSubscriptions: canceledSubscriptions.length,
        pastDueSubscriptions: pastDueSubscriptions.length,
        failedPaymentSubscriptions: failedPaymentSubscriptions.length,
        newSubscribersLast30Days,
        cancellationsLast30Days,
        activeSubscriptionsByPlan,
        estimatedMrr: estimatedMrr > 0 ? Number(estimatedMrr.toFixed(2)) : null
      },
      churn: {
        cancellationFeedbacks: cancellationFeedback.length,
        cancellationFeedbacksLast30Days: cancellationFeedback.filter((item) => isAtOrAfter(item.created_at, thirtyDaysStart)).length,
        cancellationReasons: topBreakdown(cancellationFeedback.map((item) => ({ label: cleanCampaignValue(item.reason) })), 8)
      },
      supportQuality: {
        supportRequestsPeriod: supportRequests.filter((item) => isAtOrAfter(item.created_at, periodStart)).length,
        openSupportRequests: supportRequests.filter((item) => isOpenSupportRequest(item.status)).length,
        recentNegativeFeedbacks:
          aiResponseFeedback.filter((item) => item.rating === "negative" && isAtOrAfter(item.created_at, thirtyDaysStart)).length +
          feedback.filter((item) => ["bug", "dificuldade_uso"].includes(item.type || "") && isAtOrAfter(item.created_at, thirtyDaysStart)).length
      },
      aiQuality: {
        totalFeedbacks: aiResponseFeedback.length,
        periodFeedbacks: aiFeedbackInPeriod.length,
        positiveFeedbacks: positiveAiFeedback.length,
        negativeFeedbacks: negativeAiFeedback.length,
        usefulRate: percent(positiveAiFeedback.length, aiResponseFeedback.length),
        recentComments: recentAiComments
      },
      campaign: {
        leadsByUtmSource: topBreakdown(leads.map((lead) => ({ label: cleanCampaignValue(lead.utm_source) }))),
        leadsByUtmCampaign: topBreakdown(leads.map((lead) => ({ label: cleanCampaignValue(lead.utm_campaign) }))),
        signupsByUtmCampaign: leadSignupByCampaign,
        activeSubscriptionsByCampaign: topBreakdown(activeSubscriptions.map((subscription) => ({ label: getSubscriptionCampaign(subscription) }))),
        checkoutStartedByCampaign: topBreakdown(
          subscriptions
            .filter((subscription) => subscription.stripe_checkout_session_id || subscription.provider_subscription_id || subscription.stripe_subscription_id || subscription.status?.toLowerCase() === "pending")
            .map((subscription) => ({ label: getSubscriptionCampaign(subscription) }))
        )
      },
      notes: {
        leadToSignup: "Taxa aproximada por e-mail entre ebook_leads e profiles.",
        checkoutStarted: "Checkout iniciado e aproximado por subscription pendente ou com ids Stripe salvos.",
        campaign:
          "Metricas por campanha usam UTMs dos leads e metadata/funnel salvo em subscriptions. Cadastros por campanha sao aproximados por e-mail.",
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
