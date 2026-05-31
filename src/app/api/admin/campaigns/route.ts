import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import {
  createCampaignSchema,
  enrichCampaigns,
  summarizeByDimension,
  type CampaignExperiment,
  type CampaignResult
} from "@/lib/campaigns";
import { AppError } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

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
    return NextResponse.json({ error: error.issues[0]?.message || "Dados invalidos para campanha." }, { status: 400 });
  }
  serverLog({ level: "error", event: "admin_campaigns_failed", route: "/api/admin/campaigns", error });
  return NextResponse.json({ error: "Nao foi possivel processar campanhas." }, { status: 500 });
}

export async function GET(request: Request) {
  let userId: string | null = null;

  try {
    await enforceRateLimit({ request, route: "api:admin-campaigns:ip", limit: 60, windowMs: 5 * 60_000 });
    const { supabase, user } = await requireAdmin(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:admin-campaigns:user", identifier: user.id, limit: 60, windowMs: 5 * 60_000 });

    const [campaignsResult, resultsResult] = await Promise.all([
      supabase.from("campaign_experiments").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("campaign_results").select("*").order("recorded_at", { ascending: false }).limit(1000)
    ]);

    if (campaignsResult.error) throw campaignsResult.error;
    if (resultsResult.error) throw resultsResult.error;

    const campaigns = enrichCampaigns((campaignsResult.data || []) as CampaignExperiment[], (resultsResult.data || []) as CampaignResult[]);

    serverLog({ event: "admin_campaigns_loaded", route: "/api/admin/campaigns", userId, status: "ok", metadata: { count: campaigns.length } });

    return NextResponse.json({
      campaigns,
      nicheSummary: summarizeByDimension(campaigns, "niche"),
      channelSummary: summarizeByDimension(campaigns, "channel")
    });
  } catch (error) {
    serverLog({ level: "warn", event: "admin_campaigns_failed", route: "/api/admin/campaigns", userId, error });
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  let userId: string | null = null;

  try {
    assertRequestSize(request, 8192);
    await enforceRateLimit({ request, route: "api:admin-campaigns-create:ip", limit: 30, windowMs: 5 * 60_000 });
    const { supabase, user } = await requireAdmin(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:admin-campaigns-create:user", identifier: user.id, limit: 30, windowMs: 5 * 60_000 });

    const payload = createCampaignSchema.parse(await request.json());
    const { data, error } = await supabase.from("campaign_experiments").insert(payload).select("*").single();

    if (error) throw error;

    serverLog({
      event: "campaign_created",
      route: "/api/admin/campaigns",
      userId,
      status: "ok",
      metadata: { status: payload.status, channel: payload.channel, niche: payload.niche || "none" }
    });
    await logEvent("admin_campaign_created", { status: payload.status, channel: payload.channel, niche: payload.niche || "none" });

    return NextResponse.json({ campaign: data }, { status: 201 });
  } catch (error) {
    serverLog({ level: "warn", event: "campaign_create_failed", route: "/api/admin/campaigns", userId, error });
    return jsonError(error);
  }
}
