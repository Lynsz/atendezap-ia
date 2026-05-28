import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { dataRequestStatuses, updateDataRequestSchema } from "@/lib/data-requests";
import { AppError } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const idSchema = z.string().uuid("Solicitacao invalida.");
const adminUpdateSchema = z
  .object({
    id: idSchema,
    status: z.enum(dataRequestStatuses, { errorMap: () => ({ message: "Status de solicitacao invalido." }) }),
    notes: updateDataRequestSchema.shape.notes
  })
  .strict();

function maskEmail(email?: string | null) {
  if (!email) return null;
  const [local, domain] = email.split("@");
  if (!local || !domain) return "[email]";
  return `${local.slice(0, 2)}***@${domain}`;
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
    return NextResponse.json({ error: error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }
  serverLog({ level: "error", event: "admin_data_requests_failed", route: "/api/admin/data-requests", error });
  return NextResponse.json({ error: "Nao foi possivel carregar as solicitacoes de dados." }, { status: 500 });
}

export async function GET(request: Request) {
  let userId: string | null = null;

  try {
    await enforceRateLimit({ request, route: "api:admin-data-requests:ip", limit: 60, windowMs: 5 * 60_000 });
    const { supabase, user } = await requireAdmin(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:admin-data-requests:user", identifier: user.id, limit: 60, windowMs: 5 * 60_000 });

    const { data, error } = await supabase
      .from("data_requests")
      .select("id, user_id, type, status, notes, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    const rows = (data || []) as Array<{
      id: string;
      user_id: string;
      type: string;
      status: string;
      notes: string | null;
      created_at: string;
      updated_at: string;
    }>;
    const userIds = [...new Set(rows.map((row) => row.user_id).filter(Boolean))];
    let emailByUserId = new Map<string, string | null>();

    if (userIds.length) {
      const { data: profiles } = await supabase.from("profiles").select("id, email").in("id", userIds).limit(100);
      emailByUserId = new Map(((profiles || []) as Array<{ id: string; email: string | null }>).map((profile) => [profile.id, profile.email]));
    }

    serverLog({ event: "admin_data_requests_loaded", route: "/api/admin/data-requests", userId, status: "ok", metadata: { count: rows.length } });
    return NextResponse.json({
      dataRequests: rows.map((row) => ({
        ...row,
        user_email_masked: maskEmail(emailByUserId.get(row.user_id)),
        user_id_short: row.user_id.length > 12 ? `${row.user_id.slice(0, 8)}...${row.user_id.slice(-4)}` : row.user_id
      }))
    });
  } catch (error) {
    serverLog({ level: "warn", event: "admin_data_requests_failed", route: "/api/admin/data-requests", userId, error });
    return jsonError(error);
  }
}

export async function PATCH(request: Request) {
  let userId: string | null = null;

  try {
    assertRequestSize(request, 4096);
    await enforceRateLimit({ request, route: "api:admin-data-requests-update:ip", limit: 60, windowMs: 5 * 60_000 });
    const { supabase, user } = await requireAdmin(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:admin-data-requests-update:user", identifier: user.id, limit: 60, windowMs: 5 * 60_000 });

    const body = (await request.json()) as unknown;
    const parsed = adminUpdateSchema.parse(body);

    const { data, error } = await supabase
      .from("data_requests")
      .update({
        status: parsed.status,
        notes: parsed.notes || null
      })
      .eq("id", parsed.id)
      .select("id, user_id, type, status, notes, created_at, updated_at")
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "Solicitacao nao encontrada." }, { status: 404 });
    }

    serverLog({ event: "admin_data_request_updated", route: "/api/admin/data-requests", userId, status: "ok", metadata: { request_status: parsed.status } });
    return NextResponse.json({ dataRequest: data });
  } catch (error) {
    serverLog({ level: "warn", event: "admin_data_request_update_failed", route: "/api/admin/data-requests", userId, error });
    return jsonError(error);
  }
}
