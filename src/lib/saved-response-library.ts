import type { SavedResponse } from "@/types/mvp";

export type SavedResponseSourceFilter = "all" | "ai_generated" | "template" | "manual";

export function getSavedResponseSource(item: Pick<SavedResponse, "response_id" | "source_template_id" | "source">): Exclude<SavedResponseSourceFilter, "all"> {
  if (item.source === "ai_generated" || item.source === "template" || item.source === "manual") return item.source;
  if (item.source_template_id) return "template";
  if (item.response_id) return "ai_generated";
  return "manual";
}

export function getSavedResponseSourceLabel(source: SavedResponseSourceFilter) {
  const labels: Record<SavedResponseSourceFilter, string> = {
    all: "Todas",
    ai_generated: "IA",
    template: "Template",
    manual: "Manual"
  };
  return labels[source];
}

export function buildDuplicateSavedResponseTitle(title?: string | null) {
  const baseTitle = title?.trim() || "Resposta salva";
  return `${baseTitle} (Copia)`;
}

export function filterSavedResponses(
  items: SavedResponse[],
  filters: {
    search?: string;
    category?: string;
    source?: SavedResponseSourceFilter;
  }
) {
  const search = filters.search?.trim().toLowerCase() || "";
  const category = filters.category || "Todas";
  const source = filters.source || "all";

  return items.filter((item) => {
    if (category !== "Todas" && item.category !== category) return false;
    if (source !== "all" && getSavedResponseSource(item) !== source) return false;
    if (!search) return true;

    return [item.title, item.category, item.content]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search));
  });
}
