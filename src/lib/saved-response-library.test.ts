import { describe, expect, it } from "vitest";
import { buildDuplicateSavedResponseTitle, filterSavedResponses, getSavedResponseSource, getSavedResponseSourceLabel } from "./saved-response-library";
import type { SavedResponse } from "@/types/mvp";

const baseItem: SavedResponse = {
  id: "33333333-3333-4333-8333-333333333333",
  user_id: "11111111-1111-4111-8111-111111111111",
  response_id: null,
  source_template_id: null,
  source: "manual",
  title: "Resposta de pagamento",
  content: "Aceitamos Pix e cartao.",
  category: "Pagamento",
  created_at: "2026-05-26T12:00:00.000Z",
  updated_at: "2026-05-26T12:00:00.000Z"
};

describe("saved response library helpers", () => {
  it("filtra por busca em titulo, conteudo e categoria", () => {
    const items: SavedResponse[] = [
      baseItem,
      { ...baseItem, id: "44444444-4444-4444-8444-444444444444", title: "Agenda", content: "Tenho horario na sexta.", category: "Agendamento" }
    ];

    expect(filterSavedResponses(items, { search: "pix" })).toHaveLength(1);
    expect(filterSavedResponses(items, { search: "agenda" })).toHaveLength(1);
    expect(filterSavedResponses(items, { search: "agendamento" })).toHaveLength(1);
  });

  it("filtra por categoria e origem", () => {
    const items: SavedResponse[] = [
      baseItem,
      { ...baseItem, id: "44444444-4444-4444-8444-444444444444", source: "template", source_template_id: "delivery-1", category: "Entrega" },
      { ...baseItem, id: "55555555-5555-4555-8555-555555555555", source: "ai_generated", response_id: "22222222-2222-4222-8222-222222222222", category: "Preco" }
    ];

    expect(filterSavedResponses(items, { category: "Entrega" }).map((item) => item.id)).toEqual(["44444444-4444-4444-8444-444444444444"]);
    expect(filterSavedResponses(items, { source: "ai_generated" }).map((item) => item.id)).toEqual(["55555555-5555-4555-8555-555555555555"]);
  });

  it("infere origem quando registros antigos ainda nao tem source", () => {
    expect(getSavedResponseSource({ response_id: "22222222-2222-4222-8222-222222222222", source_template_id: null, source: null })).toBe("ai_generated");
    expect(getSavedResponseSource({ response_id: null, source_template_id: "delivery-1", source: null })).toBe("template");
    expect(getSavedResponseSource({ response_id: null, source_template_id: null, source: null })).toBe("manual");
  });

  it("retorna labels simples de origem e titulo de copia", () => {
    expect(getSavedResponseSourceLabel("ai_generated")).toBe("IA");
    expect(getSavedResponseSourceLabel("template")).toBe("Template");
    expect(buildDuplicateSavedResponseTitle("Orcamento")).toBe("Orcamento (Copia)");
  });
});
