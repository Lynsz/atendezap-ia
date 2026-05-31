import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { AppError } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { serverLog } from "@/lib/logger";
import { updateProductInsightSchema } from "@/lib/product-insights";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const idSchema = z.string().uuid("Insight invalido.");

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
    return NextResponse.json({ error: error.issues[0]?.message || "Dados invalidos para insight." }, { status: 400 });
  }
  serverLog({ level: "error", event: "admin_product_insight_update_failed", route: "/api/admin/product-insights/[id]", error });
  return NextResponse.json({ error: "Nao foi possivel atualizar o insight." }, { status: 500 });
}

export async function PATCH(request: Request, context: RouteContext) {
  let userId: string | null = null;

  try {
    assertRequestSize(request, 8192);
    await enforceRateLimit({ request, route: "api:admin-product-insight-update:ip", limit: 60, windowMs: 5 * 60_000 });
    const { supabase, user } = await requireAdmin(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:admin-product-insight-update:user", identifier: user.id, limit: 60, windowMs: 5 * 60_000 });

    const { id: rawId } = await context.params;
    const id = idSchema.parse(rawId);
    const payload = updateProductInsightSchema.parse(await request.json());

    const { data, error } = await supabase.from("product_insights").update(payload).eq("id", id).select("*").maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "Insight nao encontrado." }, { status: 404 });
    }

    const statusChanged = Object.prototype.hasOwnProperty.call(payload, "status");
    serverLog({
      event: statusChanged ? "product_insight_status_changed" : "product_insight_updated",
      route: "/api/admin/product-insights/[id]",
      userId,
      status: "ok",
      metadata: {
        insight_id: id,
        type: payload.type || "unchanged",
        severity: payload.severity || "unchanged",
        insight_status: payload.status || "unchanged",
        impact_area: payload.impact_area || "unchanged"
      }
    });
    await logEvent(statusChanged ? "product_insight_status_changed" : "product_insight_updated", {
      insight_id: id,
      type: payload.type || "unchanged",
      severity: payload.severity || "unchanged",
      status: payload.status || "unchanged",
      impact_area: payload.impact_area || "unchanged"
    });

    return NextResponse.json({ insight: data });
  } catch (error) {
    serverLog({ level: "warn", event: "admin_product_insight_update_failed", route: "/api/admin/product-insights/[id]", userId, error });
    return jsonError(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  let userId: string | null = null;

  try {
    await enforceRateLimit({ request, route: "api:admin-product-insight-delete:ip", limit: 20, windowMs: 5 * 60_000 });
    const { supabase, user } = await requireAdmin(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:admin-product-insight-delete:user", identifier: user.id, limit: 20, windowMs: 5 * 60_000 });

    const { id: rawId } = await context.params;
    const id = idSchema.parse(rawId);
    const { error } = await supabase.from("product_insights").delete().eq("id", id);

    if (error) throw error;

    serverLog({ event: "product_insight_deleted", route: "/api/admin/product-insights/[id]", userId, status: "ok", metadata: { insight_id: id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    serverLog({ level: "warn", event: "admin_product_insight_delete_failed", route: "/api/admin/product-insights/[id]", userId, error });
    return jsonError(error);
  }
}
