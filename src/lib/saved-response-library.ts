import type { SavedResponse } from "@/types/mvp";

export type SavedResponseSourceFilter = "all" | "ai" | "template" | "manual";
export type SavedResponseFavoriteFilter = "all" | "favorites";
export type SavedResponseSortOrder = "recent" | "oldest" | "updated" | "favorites" | "category";

export function getSavedResponseSource(item: Pick<SavedResponse, "response_id" | "source_template_id" | "source">): Exclude<SavedResponseSourceFilter, "all"> {
  if (item.source === "ai" || item.source === "ai_generated") return "ai";
  if (item.source === "template" || item.source === "manual") return item.source;
  if (item.source_template_id) return "template";
  if (item.response_id) return "ai";
  return "manual";
}

export function getSavedResponseSourceLabel(source: SavedResponseSourceFilter) {
  const labels: Record<SavedResponseSourceFilter, string> = {
    all: "Todas",
    ai: "IA",
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
    favorite?: SavedResponseFavoriteFilter;
    sort?: SavedResponseSortOrder;
  }
) {
  const search = filters.search?.trim().toLowerCase() || "";
  const category = filters.category || "Todas";
  const source = filters.source || "all";
  const favorite = filters.favorite || "all";
  const sort = filters.sort || "recent";

  const filteredItems = items.filter((item) => {
    if (category !== "Todas" && item.category !== category) return false;
    if (source !== "all" && getSavedResponseSource(item) !== source) return false;
    if (favorite === "favorites" && !item.is_favorite) return false;
    if (!search) return true;

    return [item.title, item.category, item.content]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search));
  });

  return sortSavedResponses(filteredItems, sort);
}

export function sortSavedResponses(items: SavedResponse[], sort: SavedResponseSortOrder = "recent") {
  const sortedItems = [...items];

  return sortedItems.sort((first, second) => {
    if (sort === "oldest") {
      return new Date(first.created_at).getTime() - new Date(second.created_at).getTime();
    }
    if (sort === "updated") {
      return new Date(second.updated_at).getTime() - new Date(first.updated_at).getTime();
    }
    if (sort === "favorites") {
      if (Boolean(first.is_favorite) !== Boolean(second.is_favorite)) return first.is_favorite ? -1 : 1;
      return new Date(second.updated_at).getTime() - new Date(first.updated_at).getTime();
    }
    if (sort === "category") {
      const categoryCompare = (first.category || "Sem categoria").localeCompare(second.category || "Sem categoria", "pt-BR");
      if (categoryCompare !== 0) return categoryCompare;
      return new Date(second.created_at).getTime() - new Date(first.created_at).getTime();
    }
    return new Date(second.created_at).getTime() - new Date(first.created_at).getTime();
  });
}
