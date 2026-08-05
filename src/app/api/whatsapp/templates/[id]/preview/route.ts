import { z } from "zod";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { requireUser } from "@/lib/auth/server";
import { AppError, errorResponse } from "@/lib/errors";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { buildTemplatePreview } from "@/lib/whatsapp/template-preview";
import { parseStoredVariablesSchema, templateComponentSchema, validateTemplateVariableValues } from "@/lib/whatsapp/template-validation";

const previewSchema = z.object({ variables: z.array(z.unknown()).max(20).default([]) }).strict();

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    assertRequestSize(request, 16_384);
    const user = await requireUser(request);
    const { id } = await context.params;
    z.string().uuid().parse(id);
    await enforceRateLimit({ request, route: "api:whatsapp-template-preview", identifier: user.id, limit: 30, windowMs: 60_000 });
    const input = previewSchema.parse(await request.json());
    const { data: template, error } = await getSupabaseAdmin()
      .from("whatsapp_templates")
      .select("id,category,language,components,variables_schema,local_status")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw error;
    if (!template || template.local_status === "hidden") throw new AppError("Template não encontrado.", 404);
    const components = z.array(templateComponentSchema).max(4).safeParse(template.components);
    const variablesSchema = parseStoredVariablesSchema(template.variables_schema);
    if (!components.success) throw new AppError("Este template possui componentes sem prévia compatível.", 409);
    let variables: string[];
    try {
      variables = validateTemplateVariableValues(variablesSchema, input.variables);
    } catch {
      throw new AppError("Preencha as variáveis válidas antes de gerar a prévia.", 400);
    }
    const preview = buildTemplatePreview({ components: components.data, variablesSchema }, variables);
    await Promise.all([
      writeWhatsAppAudit({ userId: user.id, action: "template_preview_generated", status: "generated", templateId: id }),
      trackServerAppEvent({ user_id: user.id, event_name: "whatsapp_template_preview_generated", page: "/dashboard/whatsapp", source: "dashboard", metadata: { template_category: template.category || "unknown", language: template.language, variable_count: variables.length, source: "preview" } })
    ]);
    return Response.json({ preview });
  } catch (error) {
    return errorResponse(error);
  }
}
