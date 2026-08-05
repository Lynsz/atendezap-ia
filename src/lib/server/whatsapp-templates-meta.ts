import "server-only";

import { trackServerAppEvent } from "@/lib/analytics/server";
import { AppError } from "@/lib/errors";
import { readServerEnv } from "@/lib/server/env";
import { getWhatsAppServerConfig } from "@/lib/server/whatsapp";
import { normalizeWhatsAppProviderError, toWhatsAppProviderError } from "@/lib/server/whatsapp-errors";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  validateTemplateDefinition,
  type WhatsAppTemplateComponent,
  type WhatsAppTemplateVariable
} from "@/lib/whatsapp/template-validation";

type UnknownRecord = Record<string, unknown>;

export type NormalizedMetaTemplate = {
  metaTemplateId: string;
  metaTemplateName: string;
  remoteStatus: string;
  legacyStatus: "pending" | "approved" | "rejected" | "paused" | "disabled";
  language: string;
  category: string;
  components: Array<Record<string, unknown>>;
  variablesSchema: WhatsAppTemplateVariable[];
  variablesCount: number;
  qualityScore: string | null;
  rejectionReason: string | null;
  supported: boolean;
};

export type TemplateSyncSummary = {
  found: number;
  created: number;
  updated: number;
  statusChanged: number;
  errors: Array<{ type: string; count: number }>;
};

function record(value: unknown): UnknownRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as UnknownRecord : null;
}

function safeText(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export function isWhatsAppTemplateSyncEnabled() {
  return /^(1|true)$/i.test(readServerEnv("WHATSAPP_TEMPLATE_SYNC_ENABLED"));
}

export function requireWhatsAppTemplateSyncEnabled() {
  if (!isWhatsAppTemplateSyncEnabled()) {
    throw new AppError("A sincronização de templates está desativada neste ambiente.", 503);
  }
}

export function isWhatsAppTemplateCreateEnabled() {
  return /^(1|true)$/i.test(readServerEnv("WHATSAPP_TEMPLATE_CREATE_ENABLED"));
}

export function getWhatsAppTemplateSyncLimit() {
  const configured = Number(readServerEnv("WHATSAPP_TEMPLATE_SYNC_LIMIT"));
  return Number.isInteger(configured) && configured > 0 ? Math.min(configured, 200) : 100;
}

export function getTemplateSyncCountRange(count: number) {
  if (count <= 0) return "0";
  if (count < 10) return "1_9";
  if (count < 50) return "10_49";
  return "50_plus";
}

export function templateSyncHasErrors(summary: TemplateSyncSummary) {
  return summary.errors.some((error) => error.count > 0);
}

export function normalizeTemplateStatus(status: unknown) {
  const normalized = safeText(status, 40).toLowerCase();
  const allowed = new Set(["pending", "approved", "rejected", "paused", "disabled", "in_appeal", "pending_deletion", "deleted", "flagged", "reinstated"]);
  return allowed.has(normalized) ? normalized : "unknown";
}

function legacyTemplateStatus(status: string): NormalizedMetaTemplate["legacyStatus"] {
  if (status === "approved") return "approved";
  if (status === "rejected") return "rejected";
  if (["pending", "in_appeal"].includes(status)) return "pending";
  if (["paused", "flagged"].includes(status)) return "paused";
  return "disabled";
}

export function normalizeTemplateCategory(category: unknown) {
  const normalized = safeText(category, 40).toLowerCase();
  if (["utility", "marketing", "authentication", "service", "other"].includes(normalized)) return normalized;
  return "other";
}

function normalizeMetaComponents(value: unknown) {
  if (!Array.isArray(value)) return { components: [] as Array<Record<string, unknown>>, unsupported: true };
  let unsupported = false;
  const components = value.slice(0, 8).map((item) => {
    const component = record(item);
    const type = safeText(component?.type, 30).toUpperCase();
    if (type === "BODY") return { type, text: safeText(component?.text, 1024) };
    if (type === "FOOTER") return { type, text: safeText(component?.text, 60) };
    if (type === "HEADER") {
      const format = safeText(component?.format, 30).toUpperCase();
      if (format !== "TEXT") unsupported = true;
      return { type, format, ...(typeof component?.text === "string" ? { text: safeText(component.text, 60) } : {}) };
    }
    if (type === "BUTTONS") {
      const buttons = Array.isArray(component?.buttons) ? component.buttons.slice(0, 10).flatMap((buttonValue) => {
        const button = record(buttonValue);
        const buttonType = safeText(button?.type, 30).toUpperCase();
        const text = safeText(button?.text, 25);
        if (!text || !["QUICK_REPLY", "URL", "PHONE_NUMBER"].includes(buttonType)) {
          unsupported = true;
          return [];
        }
        if (buttonType !== "QUICK_REPLY") unsupported = true;
        return [{ type: buttonType, text }];
      }) : [];
      if (!buttons.length) unsupported = true;
      return { type, buttons };
    }
    unsupported = true;
    return { type: "UNSUPPORTED" };
  });
  return { components, unsupported };
}

export function normalizeMetaTemplate(template: unknown): NormalizedMetaTemplate {
  const raw = record(template);
  const metaTemplateId = safeText(raw?.id, 255);
  const metaTemplateName = safeText(raw?.name, 512).toLowerCase();
  const language = safeText(raw?.language, 20);
  if (!metaTemplateId || !/^[a-z0-9_]+$/.test(metaTemplateName) || !/^[a-z]{2,3}(?:_[A-Z]{2})?$/.test(language)) {
    throw new AppError("A Meta retornou um template com identificação inválida.", 502);
  }
  const remoteStatus = normalizeTemplateStatus(raw?.status);
  const category = normalizeTemplateCategory(raw?.category);
  const normalizedComponents = normalizeMetaComponents(raw?.components);
  let variablesSchema: WhatsAppTemplateVariable[] = [];
  let supported = !normalizedComponents.unsupported;
  try {
    const validated = validateTemplateDefinition({ name: metaTemplateName, language, category, components: normalizedComponents.components });
    variablesSchema = validated.variablesSchema;
    supported = supported && validated.supported;
  } catch {
    supported = false;
  }
  const qualityObject = record(raw?.quality_score);
  const qualityScore = safeText(raw?.quality_score, 40) || safeText(qualityObject?.score, 40) || safeText(raw?.quality_rating, 40) || null;
  const rejectionReason = safeText(raw?.rejection_reason, 500) || safeText(raw?.rejected_reason, 500) || null;
  return {
    metaTemplateId,
    metaTemplateName,
    remoteStatus,
    legacyStatus: legacyTemplateStatus(remoteStatus),
    language,
    category,
    components: normalizedComponents.components,
    variablesSchema,
    variablesCount: variablesSchema.length,
    qualityScore,
    rejectionReason,
    supported
  };
}

async function fetchMetaTemplatesPage(after?: string) {
  const config = getWhatsAppServerConfig();
  const url = new URL(`https://graph.facebook.com/${config.apiVersion}/${config.businessAccountId}/message_templates`);
  url.searchParams.set("limit", String(Math.min(getWhatsAppTemplateSyncLimit(), 100)));
  if (after) url.searchParams.set("after", after);
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${config.accessToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000)
    });
  } catch (error) {
    throw toWhatsAppProviderError(error);
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) throw normalizeWhatsAppProviderError(response.status, record(body) as { error?: { code?: number; error_subcode?: number; type?: string } } | null);
  const parsed = record(body);
  const paging = record(parsed?.paging);
  const cursors = record(paging?.cursors);
  return {
    data: Array.isArray(parsed?.data) ? parsed.data : [],
    after: safeText(cursors?.after, 500) || null
  };
}

export async function listMetaWhatsAppTemplates() {
  requireWhatsAppTemplateSyncEnabled();
  const limit = getWhatsAppTemplateSyncLimit();
  const templates: NormalizedMetaTemplate[] = [];
  const seenCursors = new Set<string>();
  let after: string | undefined;
  while (templates.length < limit) {
    const page = await fetchMetaTemplatesPage(after);
    for (const raw of page.data) {
      if (templates.length >= limit) break;
      templates.push(normalizeMetaTemplate(raw));
    }
    if (!page.after || seenCursors.has(page.after) || page.data.length === 0) break;
    seenCursors.add(page.after);
    after = page.after;
  }
  return templates;
}

export async function getMetaWhatsAppTemplateByName(name: string, language: string) {
  const normalizedName = name.trim().toLowerCase();
  return (await listMetaWhatsAppTemplates()).find((template) => template.metaTemplateName === normalizedName && template.language === language) || null;
}

export async function syncMetaTemplateToLocal(userId: string, template: NormalizedMetaTemplate, connectionId?: string) {
  const supabase = getSupabaseAdmin();
  let resolvedConnectionId = connectionId;
  if (!resolvedConnectionId) {
    const { data: connection, error } = await supabase.from("whatsapp_connections").select("id").eq("user_id", userId).eq("status", "active").limit(1).maybeSingle();
    if (error) throw error;
    if (!connection) throw new AppError("A conexão do WhatsApp não está ativa.", 409);
    resolvedConnectionId = connection.id;
  }
  const { data: byMetaId, error: metaLookupError } = await supabase
    .from("whatsapp_templates")
    .select("id,remote_status,status,local_status,submitted_at,approved_at,rejected_at,disabled_at")
    .eq("user_id", userId)
    .eq("meta_template_id", template.metaTemplateId)
    .maybeSingle();
  if (metaLookupError) throw metaLookupError;
  let existing = byMetaId;
  if (!existing) {
    const { data: byName, error: nameLookupError } = await supabase
      .from("whatsapp_templates")
      .select("id,remote_status,status,local_status,submitted_at,approved_at,rejected_at,disabled_at")
      .eq("user_id", userId)
      .eq("name", template.metaTemplateName)
      .eq("language", template.language)
      .maybeSingle();
    if (nameLookupError) throw nameLookupError;
    existing = byName;
  }
  const now = new Date().toISOString();
  const previousStatus = existing?.remote_status || existing?.status || null;
  const statusTransitioned = previousStatus !== template.remoteStatus;
  const localStatus = existing?.local_status === "hidden" ? "hidden" : template.supported ? "active" : "unsupported";
  const timestamps = statusTransitioned ? {
    ...(template.remoteStatus === "pending" ? { submitted_at: now } : {}),
    ...(template.remoteStatus === "approved" ? { approved_at: now } : {}),
    ...(template.remoteStatus === "rejected" ? { rejected_at: now } : {}),
    ...(["paused", "disabled", "deleted", "pending_deletion", "flagged"].includes(template.remoteStatus) ? { disabled_at: now } : {})
  } : {};
  const values = {
    user_id: userId,
    connection_id: resolvedConnectionId,
    provider_template_id: template.metaTemplateId,
    meta_template_id: template.metaTemplateId,
    name: template.metaTemplateName,
    meta_template_name: template.metaTemplateName,
    language: template.language,
    category: template.category,
    status: template.legacyStatus,
    remote_status: template.remoteStatus,
    local_status: localStatus,
    components: template.components,
    variables_schema: template.variablesSchema,
    variables_count: template.variablesCount,
    quality_score: template.qualityScore,
    rejection_reason: template.rejectionReason,
    last_synced_at: now,
    updated_at: now,
    ...timestamps
  };
  let templateId: string;
  if (existing) {
    const { data, error } = await supabase.from("whatsapp_templates").update(values).eq("id", existing.id).eq("user_id", userId).select("id").single();
    if (error || !data) throw error || new Error("template_sync_update_failed");
    templateId = data.id;
  } else {
    const { data, error } = await supabase.from("whatsapp_templates").insert(values).select("id").single();
    if (error || !data) throw error || new Error("template_sync_insert_failed");
    templateId = data.id;
  }
  const statusChanged = statusTransitioned;
  if (statusChanged) {
    const { error } = await supabase.from("whatsapp_template_status_history").insert({
      user_id: userId,
      template_id: templateId,
      previous_status: previousStatus,
      new_status: template.remoteStatus,
      source: "meta_sync",
      reason: "remote_status_updated"
    });
    if (error) throw error;
    await Promise.all([
      writeWhatsAppAudit({ userId, action: "template_status_changed", status: template.remoteStatus, templateId }),
      trackServerAppEvent({
        user_id: userId,
        event_name: "whatsapp_template_status_changed",
        page: "/api/whatsapp/templates/sync",
        source: "meta_sync",
        metadata: { template_status: template.remoteStatus, template_category: template.category, language: template.language, source: "meta_sync" }
      })
    ]);
  }
  return { templateId, created: !existing, updated: Boolean(existing), statusChanged };
}

export async function syncMetaTemplatesForConnection(userId: string, connectionId: string): Promise<TemplateSyncSummary> {
  const templates = await listMetaWhatsAppTemplates();
  const summary: TemplateSyncSummary = { found: templates.length, created: 0, updated: 0, statusChanged: 0, errors: [] };
  let syncErrors = 0;
  for (const template of templates) {
    try {
      const result = await syncMetaTemplateToLocal(userId, template, connectionId);
      if (result.created) summary.created += 1;
      if (result.updated) summary.updated += 1;
      if (result.statusChanged) summary.statusChanged += 1;
    } catch {
      syncErrors += 1;
    }
  }
  if (syncErrors) summary.errors.push({ type: "template_persistence_failed", count: syncErrors });
  return summary;
}
