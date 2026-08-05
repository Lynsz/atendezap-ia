import { z } from "zod";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { requireUser } from "@/lib/auth/server";
import { AppError, errorResponse } from "@/lib/errors";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { validateTemplateDefinition } from "@/lib/whatsapp/template-validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    const { data, error } = await getSupabaseAdmin()
      .from("whatsapp_templates")
      .select("id,name,meta_template_name,language,category,status,remote_status,local_status,components,variables_schema,variables_count,quality_score,rejection_reason,last_synced_at,created_at,updated_at")
      .eq("user_id", user.id)
      .neq("local_status", "hidden")
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return Response.json({ templates: data || [] });
  } catch (error) {
    return errorResponse(error);
  }
}

const createSchema = z.object({
  name: z.string(),
  language: z.string(),
  category: z.string(),
  components: z.unknown()
}).strict();

export async function POST(request: Request) {
  try {
    assertRequestSize(request, 32_768);
    const user = await requireUser(request);
    await enforceRateLimit({ request, route: "api:whatsapp-template-draft", identifier: user.id, limit: 10, windowMs: 10 * 60_000 });
    const input = createSchema.parse(await request.json());
    const validated = validateTemplateDefinition(input);
    const supabase = getSupabaseAdmin();
    const { data: connection, error: connectionError } = await supabase
      .from("whatsapp_connections")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (connectionError) throw connectionError;
    if (!connection) throw new AppError("Configure uma conexão ativa do WhatsApp antes de criar rascunhos.", 409);
    const now = new Date().toISOString();
    const { data: template, error } = await supabase.from("whatsapp_templates").insert({
      user_id: user.id,
      connection_id: connection.id,
      name: validated.name,
      meta_template_name: validated.name,
      language: validated.language,
      category: validated.category,
      status: "pending",
      remote_status: null,
      local_status: "draft",
      components: validated.components,
      variables_schema: validated.variablesSchema,
      variables_count: validated.variablesCount,
      updated_at: now
    }).select("id,name,language,category,status,remote_status,local_status,components,variables_schema,variables_count,created_at,updated_at").single();
    if (error || !template) throw error || new Error("template_draft_not_saved");
    const { error: historyError } = await supabase.from("whatsapp_template_status_history").insert({
      user_id: user.id,
      template_id: template.id,
      previous_status: null,
      new_status: "draft",
      source: "local",
      reason: "local_draft_created"
    });
    if (historyError) throw historyError;
    await Promise.all([
      writeWhatsAppAudit({ userId: user.id, action: "template_created_local", status: "draft", templateId: template.id }),
      trackServerAppEvent({
        user_id: user.id,
        event_name: "whatsapp_template_draft_created",
        page: "/dashboard/whatsapp/templates",
        source: "dashboard",
        metadata: { template_status: "draft", template_category: validated.category, language: validated.language, variable_count: validated.variablesCount, source: "local" }
      })
    ]);
    return Response.json({ template }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
