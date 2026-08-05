import { z } from "zod";

export const templateNameSchema = z.string().trim().min(1).max(512).regex(
  /^[a-z0-9_]+$/,
  "Use apenas letras minúsculas, números e sublinhado no nome do template."
);

export const templateLanguageSchema = z.string().trim().regex(
  /^[a-z]{2,3}(?:_[A-Z]{2})?$/,
  "Informe um idioma válido, como pt_BR."
);

export const templateCategorySchema = z.enum(["utility", "marketing", "authentication", "service", "other"]);

const textHeaderSchema = z.object({
  type: z.literal("HEADER"),
  format: z.literal("TEXT").default("TEXT"),
  text: z.string().trim().min(1).max(60)
}).strict();

const bodySchema = z.object({
  type: z.literal("BODY"),
  text: z.string().trim().min(1).max(1024)
}).strict();

const footerSchema = z.object({
  type: z.literal("FOOTER"),
  text: z.string().trim().min(1).max(60)
}).strict();

const buttonSchema = z.object({
  type: z.enum(["QUICK_REPLY", "URL", "PHONE_NUMBER"]),
  text: z.string().trim().min(1).max(25)
}).strict();

const buttonsSchema = z.object({
  type: z.literal("BUTTONS"),
  buttons: z.array(buttonSchema).min(1).max(10)
}).strict();

export const templateComponentSchema = z.discriminatedUnion("type", [textHeaderSchema, bodySchema, footerSchema, buttonsSchema]);

export type WhatsAppTemplateComponent = z.infer<typeof templateComponentSchema>;

export type WhatsAppTemplateVariable = {
  key: string;
  component: "header" | "body";
  position: number;
  name: string;
  type: "text";
};

export const templateDraftSchema = z.object({
  name: templateNameSchema,
  language: templateLanguageSchema,
  category: templateCategorySchema,
  components: z.array(templateComponentSchema).min(1).max(4)
}).strict().superRefine((input, context) => {
  const counts = input.components.reduce<Record<string, number>>((result, component) => {
    result[component.type] = (result[component.type] || 0) + 1;
    return result;
  }, {});
  if (counts.BODY !== 1) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["components"], message: "O template deve ter exatamente um body." });
  }
  for (const type of ["HEADER", "FOOTER", "BUTTONS"] as const) {
    if ((counts[type] || 0) > 1) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["components"], message: `O componente ${type.toLowerCase()} não pode ser repetido.` });
    }
  }
});

const placeholderPattern = /{{\s*([a-zA-Z][a-zA-Z0-9_]*|\d{1,2})\s*}}/g;
const htmlPattern = /<\/?[a-z][^>]*>/i;

function variablesFromText(component: "header" | "body", text: string) {
  const found: WhatsAppTemplateVariable[] = [];
  const seen = new Set<string>();
  for (const match of text.matchAll(placeholderPattern)) {
    const rawName = match[1];
    const key = `${component}.${rawName}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const numericPosition = /^\d+$/.test(rawName) ? Number(rawName) : found.length + 1;
    found.push({
      key,
      component,
      position: numericPosition,
      name: /^\d+$/.test(rawName) ? `variavel_${rawName}` : rawName,
      type: "text"
    });
  }
  return found;
}

export function buildTemplateVariablesSchema(components: WhatsAppTemplateComponent[]) {
  const variables = components.flatMap((component) => {
    if (component.type === "HEADER") return variablesFromText("header", component.text);
    if (component.type === "BODY") return variablesFromText("body", component.text);
    return [];
  });
  if (variables.length > 20) throw new z.ZodError([{ code: "custom", path: ["components"], message: "O template pode ter no máximo 20 variáveis." }]);
  for (const component of ["header", "body"] as const) {
    const numeric = variables.filter((item) => item.component === component && /\.\d+$/.test(item.key)).map((item) => item.position).sort((a, b) => a - b);
    if (numeric.some((position, index) => position !== index + 1)) {
      throw new z.ZodError([{ code: "custom", path: ["components"], message: `As variáveis de ${component} devem ser sequenciais, começando em {{1}}.` }]);
    }
  }
  return variables;
}

export function validateTemplateDefinition(input: unknown) {
  const template = templateDraftSchema.parse(input);
  const variablesSchema = buildTemplateVariablesSchema(template.components);
  const supported = template.components.every((component) =>
    component.type !== "BUTTONS" || component.buttons.every((button) => button.type === "QUICK_REPLY")
  );
  return { ...template, variablesSchema, variablesCount: variablesSchema.length, supported };
}

export function parseStoredVariablesSchema(input: unknown): WhatsAppTemplateVariable[] {
  const schema = z.array(z.object({
    key: z.string().trim().min(1).max(100),
    component: z.enum(["header", "body"]),
    position: z.number().int().min(1).max(20),
    name: z.string().trim().min(1).max(100),
    type: z.literal("text")
  }).strict()).max(20);
  const parsed = schema.safeParse(input);
  return parsed.success ? parsed.data : [];
}

export function validateTemplateVariableValues(schema: WhatsAppTemplateVariable[], values: unknown) {
  const parsed = z.array(z.string().trim().min(1).max(200)).max(20).parse(values);
  if (parsed.length !== schema.length) throw new Error("Preencha exatamente as variáveis exigidas pelo template.");
  for (const value of parsed) {
    if (htmlPattern.test(value)) throw new Error("As variáveis do template não podem conter HTML ou script.");
  }
  return parsed;
}

export function buildTemplateSendComponents(schema: WhatsAppTemplateVariable[], values: string[]) {
  return (["header", "body"] as const).flatMap((component) => {
    const parameters = schema
      .map((variable, index) => ({ variable, value: values[index] }))
      .filter((item) => item.variable.component === component)
      .sort((a, b) => a.variable.position - b.variable.position)
      .map((item) => ({ type: "text" as const, text: item.value }));
    return parameters.length ? [{ type: component, parameters }] : [];
  });
}
