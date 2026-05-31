import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { calculateCampaignCosts, updateCampaignResultSchema } from "@/lib/campaigns";
import { AppError } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const idSchema = z.string().uuid("Resultado invalido.");

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
    return NextResponse.json({ error: error.issues[0]?.message || "Dados invalidos para resultado." }, { status: 400 });
  }
  serverLog({ level: "error", event: "admin_campaign_result_update_failed", route: "/api/admin/campaign-results/[id]", error });
  return NextResponse.json({ error: "Nao foi possivel atualizar o resultado da campanha." }, { status: 500 });
}

export async function PATCH(request: Request, context: RouteContext) {
  let userId: string | null = null;

  try {
    assertRequestSize(request, 8192);
    await enforceRateLimit({ request, route: "api:admin-campaign-result-update:ip", limit: 60, windowMs: 5 * 60_000 });
    const { supabase, user } = await requireAdmin(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:admin-campaign-result-update:user", identifier: user.id, limit: 60, windowMs: 5 * 60_000 });

    const { id: rawId } = await context.params;
    const id = idSchema.parse(rawId);
    const payload = updateCampaignResultSchema.parse(await request.json());
    const costs = calculateCampaignCosts(payload);
    const { data, error } = await supabase
      .from("campaign_results")
      .update({ ...payload, ...costs })
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "Resultado nao encontrado." }, { status: 404 });
    }

    serverLog({
      event: "campaign_result_recorded",
      route: "/api/admin/campaign-results/[id]",
      userId,
      status: "ok",
      metadata: { campaign_id: data.campaign_id, result_id: id }
    });
    await logEvent("admin_campaign_result_recorded", { campaign_id: data.campaign_id, result_id: id });

    return NextResponse.json({ result: data });
  } catch (error) {
    serverLog({ level: "warn", event: "admin_campaign_result_update_failed", route: "/api/admin/campaign-results/[id]", userId, error });
    return jsonError(error);
  }
}
