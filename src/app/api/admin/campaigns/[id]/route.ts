import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { updateCampaignSchema } from "@/lib/campaigns";
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

const idSchema = z.string().uuid("Campanha invalida.");

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
  serverLog({ level: "error", event: "admin_campaign_update_failed", route: "/api/admin/campaigns/[id]", error });
  return NextResponse.json({ error: "Nao foi possivel atualizar a campanha." }, { status: 500 });
}

export async function PATCH(request: Request, context: RouteContext) {
  let userId: string | null = null;

  try {
    assertRequestSize(request, 8192);
    await enforceRateLimit({ request, route: "api:admin-campaign-update:ip", limit: 60, windowMs: 5 * 60_000 });
    const { supabase, user } = await requireAdmin(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:admin-campaign-update:user", identifier: user.id, limit: 60, windowMs: 5 * 60_000 });

    const { id: rawId } = await context.params;
    const id = idSchema.parse(rawId);
    const payload = updateCampaignSchema.parse(await request.json());

    const { data, error } = await supabase.from("campaign_experiments").update(payload).eq("id", id).select("*").maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "Campanha nao encontrada." }, { status: 404 });
    }

    const decisionChanged = Object.prototype.hasOwnProperty.call(payload, "decision");
    serverLog({
      event: decisionChanged ? "campaign_decision_updated" : "campaign_updated",
      route: "/api/admin/campaigns/[id]",
      userId,
      status: "ok",
      metadata: {
        campaign_id: id,
        status: payload.status || "unchanged",
        decision: payload.decision || "unchanged"
      }
    });
    await logEvent(decisionChanged ? "admin_campaign_decision_updated" : "admin_campaign_updated", {
      campaign_id: id,
      status: payload.status || "unchanged",
      decision: payload.decision || "unchanged"
    });

    return NextResponse.json({ campaign: data });
  } catch (error) {
    serverLog({ level: "warn", event: "admin_campaign_update_failed", route: "/api/admin/campaigns/[id]", userId, error });
    return jsonError(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  let userId: string | null = null;

  try {
    await enforceRateLimit({ request, route: "api:admin-campaign-delete:ip", limit: 20, windowMs: 5 * 60_000 });
    const { supabase, user } = await requireAdmin(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:admin-campaign-delete:user", identifier: user.id, limit: 20, windowMs: 5 * 60_000 });

    const { id: rawId } = await context.params;
    const id = idSchema.parse(rawId);
    const { error } = await supabase.from("campaign_experiments").delete().eq("id", id);

    if (error) throw error;

    serverLog({ event: "campaign_deleted", route: "/api/admin/campaigns/[id]", userId, status: "ok", metadata: { campaign_id: id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    serverLog({ level: "warn", event: "admin_campaign_delete_failed", route: "/api/admin/campaigns/[id]", userId, error });
    return jsonError(error);
  }
}
