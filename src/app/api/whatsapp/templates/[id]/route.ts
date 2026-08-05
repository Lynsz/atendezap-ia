import { z } from "zod";
import { requireUser } from "@/lib/auth/server";
import { AppError, errorResponse } from "@/lib/errors";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { validateTemplateDefinition } from "@/lib/whatsapp/template-validation";

const updateSchema = z.object({ name: z.string(), language: z.string(), category: z.string(), components: z.unknown() }).strict();

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    assertRequestSize(request, 32_768);
    const user = await requireUser(request);
    const { id } = await context.params;
    z.string().uuid().parse(id);
    await enforceRateLimit({ request, route: "api:whatsapp-template-update", identifier: user.id, limit: 20, windowMs: 10 * 60_000 });
    const input = validateTemplateDefinition(updateSchema.parse(await request.json()));
    const supabase = getSupabaseAdmin();
    const { data: existing, error: existingError } = await supabase
      .from("whatsapp_templates")
      .select("id,meta_template_id,provider_template_id,local_status")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (existingError) throw existingError;
    if (!existing) throw new AppError("Template não encontrado.", 404);
    if (existing.meta_template_id || existing.provider_template_id || existing.local_status !== "draft") {
      throw new AppError("Templates sincronizados não podem ser editados localmente.", 409);
    }
    const { data: template, error } = await supabase.from("whatsapp_templates").update({
      name: input.name,
      meta_template_name: input.name,
      language: input.language,
      category: input.category,
      components: input.components,
      variables_schema: input.variablesSchema,
      variables_count: input.variablesCount,
      updated_at: new Date().toISOString()
    }).eq("id", id).eq("user_id", user.id).select("id,name,language,category,status,remote_status,local_status,components,variables_schema,variables_count,created_at,updated_at").single();
    if (error || !template) throw error || new Error("template_draft_update_failed");
    await writeWhatsAppAudit({ userId: user.id, action: "template_updated_local", status: "draft", templateId: id });
    return Response.json({ template });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(request);
    const { id } = await context.params;
    z.string().uuid().parse(id);
    await enforceRateLimit({ request, route: "api:whatsapp-template-hide", identifier: user.id, limit: 20, windowMs: 10 * 60_000 });
    const supabase = getSupabaseAdmin();
    const { data: existing, error: existingError } = await supabase.from("whatsapp_templates").select("id,local_status").eq("id", id).eq("user_id", user.id).maybeSingle();
    if (existingError) throw existingError;
    if (!existing) throw new AppError("Template não encontrado.", 404);
    const now = new Date().toISOString();
    const { error } = await supabase.from("whatsapp_templates").update({ local_status: "hidden", disabled_at: now, updated_at: now }).eq("id", id).eq("user_id", user.id);
    if (error) throw error;
    const { error: historyError } = await supabase.from("whatsapp_template_status_history").insert({ user_id: user.id, template_id: id, previous_status: existing.local_status, new_status: "hidden", source: "local", reason: "hidden_by_owner" });
    if (historyError) throw historyError;
    await writeWhatsAppAudit({ userId: user.id, action: "template_hidden_local", status: "hidden", templateId: id });
    return Response.json({ hidden: true });
  } catch (error) {
    return errorResponse(error);
  }
}
