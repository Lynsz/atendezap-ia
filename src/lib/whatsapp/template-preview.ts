import type { WhatsAppTemplateComponent, WhatsAppTemplateVariable } from "@/lib/whatsapp/template-validation";

const PREVIEW_LIMIT = 2_500;

function escapePreviewText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildTemplatePreview(
  template: { components: WhatsAppTemplateComponent[]; variablesSchema: WhatsAppTemplateVariable[] },
  variables: string[]
) {
  const valueByKey = new Map(template.variablesSchema.map((variable, index) => [variable.key, (variables[index] || `{{${variable.name}}}`).trim().slice(0, 200)]));
  const sections = template.components.flatMap((component) => {
    if (component.type === "BUTTONS") return component.buttons.map((button) => `[${escapePreviewText(button.text)}]`);
    const key = component.type.toLowerCase() as "header" | "body" | "footer";
    const text = component.text.replace(/{{\s*([a-zA-Z][a-zA-Z0-9_]*|\d{1,2})\s*}}/g, (match, name: string) => valueByKey.get(`${key}.${name}`) || match);
    return escapePreviewText(text);
  });
  return sections.join("\n\n").slice(0, PREVIEW_LIMIT);
}
