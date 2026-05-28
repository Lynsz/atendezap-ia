import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { AppError } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { updateSupportRequestSchema } from "@/lib/support";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const idSchema = z.string().uuid("Solicitacao invalida.");

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
    return NextResponse.json({ error: error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }
  serverLog({ level: "error", event: "admin_support_update_failed", route: "/api/admin/support/[id]", error });
  return NextResponse.json({ error: "Nao foi possivel atualizar a solicitacao de suporte." }, { status: 500 });
}

export async function PATCH(request: Request, context: RouteContext) {
  let userId: string | null = null;

  try {
    assertRequestSize(request, 4096);
    await enforceRateLimit({ request, route: "api:admin-support-update:ip", limit: 60, windowMs: 5 * 60_000 });
    const { supabase, user } = await requireAdmin(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:admin-support-update:user", identifier: user.id, limit: 60, windowMs: 5 * 60_000 });

    const { id: rawId } = await context.params;
    const id = idSchema.parse(rawId);
    const payload = updateSupportRequestSchema.parse(await request.json());

    const updates = {
      ...(payload.status ? { status: payload.status } : {}),
      ...(payload.priority ? { priority: payload.priority } : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, "admin_notes") ? { admin_notes: payload.admin_notes || null } : {})
    };

    const { data, error } = await supabase
      .from("support_requests")
      .update(updates)
      .eq("id", id)
      .select("id, user_id, email, category, subject, message, status, priority, admin_notes, created_at, updated_at")
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "Solicitacao nao encontrada." }, { status: 404 });
    }

    serverLog({ event: "admin_support_status_updated", route: "/api/admin/support/[id]", userId, status: "ok", metadata: { request_status: payload.status || "unchanged", priority: payload.priority || "unchanged" } });
    return NextResponse.json({ supportRequest: data });
  } catch (error) {
    serverLog({ level: "warn", event: "admin_support_update_failed", route: "/api/admin/support/[id]", userId, error });
    return jsonError(error);
  }
}
