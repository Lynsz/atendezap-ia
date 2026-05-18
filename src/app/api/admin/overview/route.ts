import { NextResponse } from "next/server";
import { AppError } from "@/lib/errors";
import { requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";

type PeriodFilter = "today" | "7d" | "30d" | "all";

type LeadRow = {
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
};

type EmailEventRow = {
  lead_id: string | null;
  email: string;
  status: string;
  event_type: string;
  subject: string;
  sent_at: string | null;
  created_at: string;
};

type ProfileRow = {
  id: string;
  email: string | null;
  name: string | null;
  created_at: string;
};

type SubscriptionRow = {
  id: string;
  user_id: string;
  plan_name: string | null;
  plan: string | null;
  status: string | null;
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  monthly_limit: number | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

function getPeriodStart(period: PeriodFilter) {
  const now = new Date();
  if (period === "today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  }
  if (period === "7d") {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  }
  if (period === "30d") {
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  }
  return null;
}

function getCurrentMonthStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

function isActiveStatus(status?: string | null) {
  const normalized = status?.toLowerCase();
  return normalized === "active" || normalized === "trial" || normalized === "trialing";
}

function isCanceledStatus(status?: string | null) {
  return status?.toLowerCase() === "canceled";
}

function percent(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Number(((numerator / denominator) * 100).toFixed(1));
}

function jsonError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("Falha na API admin:", error instanceof Error ? error.message : "unknown");
  return NextResponse.json({ error: "Não foi possível carregar os dados administrativos." }, { status: 500 });
}

export async function GET(request: Request) {
  try {
    const { supabase } = await requireAdmin(request);
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") || "").trim();
    const businessType = (url.searchParams.get("business_type") || "").trim();
    const utmSource = (url.searchParams.get("utm_source") || "").trim();
    const utmCampaign = (url.searchParams.get("utm_campaign") || "").trim();
    const period = ((url.searchParams.get("period") || "30d") as PeriodFilter) || "30d";
    const periodStart = getPeriodStart(period);

    const [
      totalLeadsResult,
      sevenDayLeadsResult,
      thirtyDayLeadsResult,
      profilesResult,
      subscriptionsResult,
      sentEmailEventsResult,
      failedEmailEventsResult,
      allLeadEmailsResult,
      monthlyUsageResult
    ] = await Promise.all([
      supabase.from("ebook_leads").select("id", { count: "exact", head: true }),
      supabase.from("ebook_leads").select("id", { count: "exact", head: true }).gte("created_at", getPeriodStart("7d") || ""),
      supabase.from("ebook_leads").select("id", { count: "exact", head: true }).gte("created_at", getPeriodStart("30d") || ""),
      supabase.from("profiles").select("id, email, name, created_at"),
      supabase
        .from("subscriptions")
        .select("id, user_id, plan_name, plan, status, provider_customer_id, provider_subscription_id, monthly_limit, current_period_end, created_at, updated_at")
        .order("updated_at", { ascending: false })
        .limit(200),
      supabase.from("lead_email_events").select("id", { count: "exact", head: true }).eq("status", "sent"),
      supabase.from("lead_email_events").select("id", { count: "exact", head: true }).eq("status", "failed"),
      supabase.from("ebook_leads").select("email"),
      supabase.from("generated_responses").select("user_id, created_at").gte("created_at", getCurrentMonthStart()).limit(5000)
    ]);

    const profiles = (profilesResult.data || []) as ProfileRow[];
    const subscriptions = (subscriptionsResult.data || []) as SubscriptionRow[];
    const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
    const profileEmails = new Set(profiles.map((profile) => profile.email?.toLowerCase()).filter(Boolean) as string[]);
    const leadEmails = new Set(((allLeadEmailsResult.data || []) as Array<{ email: string | null }>).map((lead) => lead.email?.toLowerCase()).filter(Boolean) as string[]);
    const signedUpLeadCount = [...leadEmails].filter((email) => profileEmails.has(email)).length;
    const monthlyUsageByUser = ((monthlyUsageResult.data || []) as Array<{ user_id: string | null }>).reduce<Record<string, number>>((accumulator, row) => {
      if (row.user_id) accumulator[row.user_id] = (accumulator[row.user_id] || 0) + 1;
      return accumulator;
    }, {});

    const planCounts = subscriptions.reduce<Record<string, number>>((accumulator, subscription) => {
      const plan = subscription.plan || subscription.plan_name || "sem_plano";
      accumulator[plan] = (accumulator[plan] || 0) + 1;
      return accumulator;
    }, {});
    const mostUsedPlan = Object.entries(planCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Sem dados";
    const activeSubscriptions = subscriptions.filter((subscription) => isActiveStatus(subscription.status));

    let leadsQuery = supabase
      .from("ebook_leads")
      .select("id, name, email, whatsapp, business_type, source, utm_source, utm_medium, utm_campaign, utm_content, utm_term, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (search) {
      leadsQuery = leadsQuery.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    if (businessType) {
      leadsQuery = leadsQuery.eq("business_type", businessType);
    }
    if (utmSource) {
      leadsQuery = leadsQuery.eq("utm_source", utmSource);
    }
    if (utmCampaign) {
      leadsQuery = leadsQuery.eq("utm_campaign", utmCampaign);
    }
    if (periodStart) {
      leadsQuery = leadsQuery.gte("created_at", periodStart);
    }

    const { data: leadRows, error: leadError } = await leadsQuery;
    if (leadError) throw leadError;

    const leads = (leadRows || []) as LeadRow[];
    const leadIds = leads.map((lead) => lead.id);

    let emailEvents: EmailEventRow[] = [];
    if (leadIds.length) {
      const { data: eventsData } = await supabase
        .from("lead_email_events")
        .select("lead_id, email, status, event_type, subject, sent_at, created_at")
        .in("lead_id", leadIds)
        .order("created_at", { ascending: false })
        .limit(500);
      emailEvents = (eventsData || []) as EmailEventRow[];
    }

    const latestEmailEventByLead = new Map<string, EmailEventRow>();
    const latestEmailEventByEmail = new Map<string, EmailEventRow>();
    for (const event of emailEvents) {
      if (event.lead_id && !latestEmailEventByLead.has(event.lead_id)) latestEmailEventByLead.set(event.lead_id, event);
      if (event.email && !latestEmailEventByEmail.has(event.email.toLowerCase())) latestEmailEventByEmail.set(event.email.toLowerCase(), event);
    }

    const hydratedLeads = leads.map((lead) => {
      const latestEmailEvent = latestEmailEventByLead.get(lead.id) || (lead.email ? latestEmailEventByEmail.get(lead.email.toLowerCase()) : undefined);
      return {
        ...lead,
        email_status: latestEmailEvent?.status || "sem_registro",
        email_sent_at: latestEmailEvent?.sent_at || null
      };
    });

    const subscriptionsWithProfiles = subscriptions.map((subscription) => {
      const profile = profileById.get(subscription.user_id);
      return {
        ...subscription,
        email: profile?.email || null,
        name: profile?.name || null,
        monthly_usage: monthlyUsageByUser[subscription.user_id] || 0
      };
    });

    const totalLeads = totalLeadsResult.count || 0;
    const totalUsers = profiles.length;
    const activeSubscriptionCount = activeSubscriptions.length;

    return NextResponse.json({
      metrics: {
        totalLeads,
        leadsLast7Days: sevenDayLeadsResult.count || 0,
        leadsLast30Days: thirtyDayLeadsResult.count || 0,
        totalUsers,
        activeSubscriptions: activeSubscriptionCount,
        canceledSubscriptions: subscriptions.filter((subscription) => isCanceledStatus(subscription.status)).length,
        mostUsedPlan,
        emailSentSuccess: sentEmailEventsResult.count || 0,
        emailSentFailed: failedEmailEventsResult.count || 0,
        leadToSignupRate: percent(signedUpLeadCount, totalLeads),
        signupToSubscriptionRate: percent(activeSubscriptionCount, totalUsers),
        leadToSubscriptionRate: percent(activeSubscriptionCount, totalLeads)
      },
      leads: hydratedLeads,
      subscriptions: subscriptionsWithProfiles,
      filterOptions: {
        businessTypes: [...new Set(leads.map((lead) => lead.business_type).filter(Boolean))],
        utmSources: [...new Set(leads.map((lead) => lead.utm_source).filter(Boolean))],
        utmCampaigns: [...new Set(leads.map((lead) => lead.utm_campaign).filter(Boolean))]
      },
      notes: {
        conversion: "Conversão aproximada calculada por e-mail entre leads e profiles."
      }
    });
  } catch (error) {
    return jsonError(error);
  }
}
