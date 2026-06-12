import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { sanitizeAppEvent } from "@/lib/analytics/track-event";
import { AppError } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { requireSupabasePublicEnv } from "@/lib/server/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const eventSchema = z
  .object({
    event_name: z.string().trim().min(1).max(80),
    page: z.string().trim().max(120).nullable().optional(),
    source: z.string().trim().max(120).nullable().optional(),
    plan: z.string().trim().max(80).nullable().optional(),
    business_type: z.string().trim().max(120).nullable().optional(),
    metadata: z.record(z.unknown()).optional().default({})
  })
  .strict();

async function getOptionalUserId(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization) return null;

  try {
    const { url, anonKey } = requireSupabasePublicEnv();
    const supabase = createClient(url, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const {
      data: { user }
    } = await supabase.auth.getUser();
    return user?.id || null;
  } catch {
    return null;
  }
}

function jsonError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: "Evento invalido." }, { status: 400 });
  }
  return NextResponse.json({ error: "Nao foi possivel registrar o evento." }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    assertRequestSize(request, 6_144);
    await enforceRateLimit({ request, route: "api:events:ip", limit: 120, windowMs: 5 * 60_000 });

    const parsed = eventSchema.parse(await request.json());
    const event = sanitizeAppEvent(parsed);
    if (!event) {
      return NextResponse.json({ ok: true, ignored: true }, { status: 202 });
    }

    const userId = await getOptionalUserId(request);
    if (userId) {
      await enforceRateLimit({ request, route: "api:events:user", identifier: userId, limit: 180, windowMs: 5 * 60_000 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("app_events").insert({
      user_id: userId,
      event_name: event.event_name,
      page: event.page,
      source: event.source,
      plan: event.plan,
      business_type: event.business_type,
      metadata: event.metadata
    });

    if (error) {
      serverLog({ level: "warn", event: "app_event_insert_failed", route: "/api/events", error, metadata: { event_name: event.event_name } });
      return NextResponse.json({ ok: true, skipped: true }, { status: 202 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    serverLog({ level: "warn", event: "app_event_failed", route: "/api/events", error });
    return jsonError(error);
  }
}
