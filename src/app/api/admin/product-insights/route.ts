import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { AppError } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { serverLog } from "@/lib/logger";
import {
  createProductInsightSchema,
  getProductInsightDiagnostics,
  productInsightFilterSchema,
  summarizeProductInsights,
  type ProductInsight
} from "@/lib/product-insights";
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
    return NextResponse.json({ error: error.issues[0]?.message || "Dados invalidos para insight." }, { status: 400 });
  }
  serverLog({ level: "error", event: "admin_product_insights_failed", route: "/api/admin/product-insights", error });
  return NextResponse.json({ error: "Nao foi possivel processar insights de produto." }, { status: 500 });
}

export async function GET(request: Request) {
  let userId: string | null = null;

  try {
    await enforceRateLimit({ request, route: "api:admin-product-insights:ip", limit: 60, windowMs: 5 * 60_000 });
    const { supabase, user } = await requireAdmin(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:admin-product-insights:user", identifier: user.id, limit: 60, windowMs: 5 * 60_000 });

    const url = new URL(request.url);
    const filters = productInsightFilterSchema.parse({
      type: url.searchParams.get("type") || undefined,
      severity: url.searchParams.get("severity") || undefined,
      status: url.searchParams.get("status") || undefined,
      impact_area: url.searchParams.get("impact_area") || undefined
    });

    let query = supabase.from("product_insights").select("*");
    if (filters.type) query = query.eq("type", filters.type);
    if (filters.severity) query = query.eq("severity", filters.severity);
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.impact_area) query = query.eq("impact_area", filters.impact_area);

    const { data, error } = await query.order("created_at", { ascending: false }).limit(500);
    if (error) throw error;

    const insights = (data || []) as ProductInsight[];
    serverLog({ event: "admin_product_insights_loaded", route: "/api/admin/product-insights", userId, status: "ok", metadata: { count: insights.length } });

    return NextResponse.json({
      insights,
      summary: summarizeProductInsights(insights),
      diagnostics: getProductInsightDiagnostics(insights)
    });
  } catch (error) {
    serverLog({ level: "warn", event: "admin_product_insights_failed", route: "/api/admin/product-insights", userId, error });
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  let userId: string | null = null;

  try {
    assertRequestSize(request, 8192);
    await enforceRateLimit({ request, route: "api:admin-product-insight-create:ip", limit: 30, windowMs: 5 * 60_000 });
    const { supabase, user } = await requireAdmin(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:admin-product-insight-create:user", identifier: user.id, limit: 30, windowMs: 5 * 60_000 });

    const payload = createProductInsightSchema.parse(await request.json());
    const { data, error } = await supabase.from("product_insights").insert(payload).select("*").single();

    if (error) throw error;

    serverLog({
      event: "product_insight_created",
      route: "/api/admin/product-insights",
      userId,
      status: "ok",
      metadata: { type: payload.type, severity: payload.severity, status: payload.status, impact_area: payload.impact_area || "none" }
    });
    await logEvent("product_insight_created", {
      type: payload.type,
      severity: payload.severity,
      status: payload.status,
      impact_area: payload.impact_area || "none"
    });

    return NextResponse.json({ insight: data }, { status: 201 });
  } catch (error) {
    serverLog({ level: "warn", event: "product_insight_create_failed", route: "/api/admin/product-insights", userId, error });
    return jsonError(error);
  }
}
