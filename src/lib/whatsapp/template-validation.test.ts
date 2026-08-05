import { describe, expect, it } from "vitest";
import { buildTemplatePreview } from "@/lib/whatsapp/template-preview";
import {
  validateTemplateDefinition,
  validateTemplateVariableValues
} from "@/lib/whatsapp/template-validation";

const validTemplate = {
  name: "retorno_atendimento",
  language: "pt_BR",
  category: "utility",
  components: [{ type: "BODY", text: "Olá, {{1}}. Seu protocolo é {{2}}." }]
};

describe("WhatsApp template validation", () => {
  it("normaliza a estrutura e extrai somente o schema das variáveis", () => {
    const template = validateTemplateDefinition(validTemplate);
    expect(template.variablesSchema).toEqual([
      { key: "body.1", component: "body", position: 1, name: "variavel_1", type: "text" },
      { key: "body.2", component: "body", position: 2, name: "variavel_2", type: "text" }
    ]);
    expect(JSON.stringify(template.variablesSchema)).not.toContain("Cliente real");
  });

  it.each([
    [{ ...validTemplate, name: "Nome Inválido" }, "nome inválido"],
    [{ ...validTemplate, language: "portugues" }, "idioma inválido"],
    [{ ...validTemplate, category: "sales" }, "categoria inválida"],
    [{ ...validTemplate, components: [{ type: "BODY", text: "" }] }, "body vazio"],
    [{ ...validTemplate, components: [{ type: "UNKNOWN", text: "Olá" }] }, "componente desconhecido"]
  ])("bloqueia %s (%s)", (input) => {
    expect(() => validateTemplateDefinition(input)).toThrow();
  });

  it("bloqueia sequência de variável quebrada", () => {
    expect(() => validateTemplateDefinition({ ...validTemplate, components: [{ type: "BODY", text: "Olá {{2}}" }] })).toThrow(/sequenciais/);
  });

  it("exige todas as variáveis e bloqueia valor longo ou HTML", () => {
    const template = validateTemplateDefinition(validTemplate);
    expect(() => validateTemplateVariableValues(template.variablesSchema, ["Ana"])).toThrow();
    expect(() => validateTemplateVariableValues(template.variablesSchema, ["a".repeat(201), "123"])).toThrow();
    expect(() => validateTemplateVariableValues(template.variablesSchema, ["<script>alert(1)</script>", "123"])).toThrow(/HTML/);
  });

  it("gera prévia limitada e escapa conteúdo perigoso", () => {
    const template = validateTemplateDefinition(validTemplate);
    const preview = buildTemplatePreview({ components: template.components, variablesSchema: template.variablesSchema }, ["<img src=x>", "123"]);
    expect(preview).toContain("&lt;img src=x&gt;");
    expect(preview).not.toContain("<img");
    expect(preview.length).toBeLessThanOrEqual(2_500);
  });
});
