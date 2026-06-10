import { createClient } from "@supabase/supabase-js";
import { AppError } from "@/lib/errors";
import { getUsageSnapshot, type UsageCycle } from "@/lib/usage-limits";

type AiUsageRow = {
  id: string;
  user_id: string;
  month: string;
  count: number | null;
  limit: number | null;
};

function getAiUsageAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new AppError("Supabase nao configurado. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.", 500);
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function getCurrentUsageMonth(now = new Date()) {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function getCalendarMonthCycle(month: string): UsageCycle {
  const [yearText, monthText] = month.split("-");
  const year = Number(yearText);
  const zeroBasedMonth = Number(monthText) - 1;
  const periodStart = new Date(Date.UTC(year, zeroBasedMonth, 1));
  const periodEnd = new Date(Date.UTC(year, zeroBasedMonth + 1, 1));

  return {
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
    source: "calendar_month"
  };
}

export async function ensureUsageRecord(userId: string, limit: number, month = getCurrentUsageMonth()) {
  const supabase = getAiUsageAdmin();
  const { data, error } = await supabase
    .from("ai_usage")
    .select("id, user_id, month, count, limit")
    .eq("user_id", userId)
    .eq("month", month)
    .maybeSingle();

  if (error) {
    throw new AppError("Nao foi possivel verificar seu uso mensal agora. Tente novamente em instantes.", 500);
  }

  if (!data) {
    const { data: inserted, error: insertError } = await supabase
      .from("ai_usage")
      .insert({
        user_id: userId,
        month,
        count: 0,
        limit
      })
      .select("id, user_id, month, count, limit")
      .single();

    if (insertError || !inserted) {
      throw new AppError("Nao foi possivel iniciar seu uso mensal agora. Tente novamente em instantes.", 500);
    }

    return inserted as AiUsageRow;
  }

  const current = data as AiUsageRow;
  if ((current.limit ?? 0) !== limit) {
    const { data: updated, error: updateError } = await supabase
      .from("ai_usage")
      .update({ limit, updated_at: new Date().toISOString() })
      .eq("id", current.id)
      .select("id, user_id, month, count, limit")
      .single();

    if (updateError || !updated) {
      throw new AppError("Nao foi possivel atualizar seu limite mensal agora. Tente novamente em instantes.", 500);
    }

    return updated as AiUsageRow;
  }

  return current;
}

export async function assertAiUsageAvailable(userId: string, limit: number, month = getCurrentUsageMonth()) {
  const usageRow = await ensureUsageRecord(userId, limit, month);
  const cycle = getCalendarMonthCycle(month);
  const snapshot = getUsageSnapshot(usageRow.count ?? 0, usageRow.limit ?? limit, cycle);

  return {
    row: usageRow,
    snapshot
  };
}

export async function getCurrentUsage(userId: string, limit: number, month = getCurrentUsageMonth()) {
  const usageRow = await ensureUsageRecord(userId, limit, month);
  return getUsageSnapshot(usageRow.count ?? 0, usageRow.limit ?? limit, getCalendarMonthCycle(month));
}

export async function canGenerateResponse(userId: string, limit: number, month = getCurrentUsageMonth()) {
  const usage = await getCurrentUsage(userId, limit, month);
  return {
    canGenerate: !usage.reachedLimit,
    usage
  };
}

export async function incrementAiUsage(userId: string, limit: number, month = getCurrentUsageMonth()) {
  const supabase = getAiUsageAdmin();
  const usageRow = await ensureUsageRecord(userId, limit, month);
  const nextCount = (usageRow.count ?? 0) + 1;
  const { data, error } = await supabase
    .from("ai_usage")
    .update({
      count: nextCount,
      limit,
      updated_at: new Date().toISOString()
    })
    .eq("id", usageRow.id)
    .eq("user_id", userId)
    .select("id, user_id, month, count, limit")
    .single();

  if (error || !data) {
    throw new AppError("Resposta gerada, mas nao foi possivel atualizar seu uso mensal. Tente novamente em instantes.", 500);
  }

  const updated = data as AiUsageRow;
  return getUsageSnapshot(updated.count ?? nextCount, updated.limit ?? limit, getCalendarMonthCycle(month));
}

export const incrementUsage = incrementAiUsage;
