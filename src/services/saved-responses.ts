import { supabase } from "@/lib/supabase/browser";
import type { SavedResponse } from "@/types/mvp";

type SaveResponseInput = {
  response_id?: string;
  source_template_id?: string;
  title?: string;
  content?: string;
  category?: string;
};

type UpdateSavedResponseInput = {
  title?: string | null;
  content?: string;
  category?: string | null;
};

async function getAccessToken() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Sessao nao encontrada. Faca login novamente.");
  }

  return session.access_token;
}

async function parseJsonResponse<T>(response: Response, fallbackMessage: string) {
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || fallbackMessage);
  }
  return data;
}

export async function listSavedResponses() {
  const token = await getAccessToken();
  const response = await fetch("/api/saved-responses", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await parseJsonResponse<{ savedResponses?: SavedResponse[] }>(response, "Nao foi possivel carregar sua biblioteca agora.");
  return data.savedResponses || [];
}

export async function saveResponseToLibrary(input: SaveResponseInput) {
  const token = await getAccessToken();
  const response = await fetch("/api/saved-responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(input)
  });

  return parseJsonResponse<{ savedResponse: SavedResponse; alreadySaved?: boolean }>(response, "Nao foi possivel salvar a resposta agora.");
}

export async function updateSavedResponse(id: string, input: UpdateSavedResponseInput) {
  const token = await getAccessToken();
  const response = await fetch(`/api/saved-responses/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(input)
  });

  const data = await parseJsonResponse<{ savedResponse: SavedResponse }>(response, "Nao foi possivel atualizar a resposta salva agora.");
  return data.savedResponse;
}

export async function deleteSavedResponse(id: string) {
  const token = await getAccessToken();
  const response = await fetch(`/api/saved-responses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return parseJsonResponse<{ deleted: boolean; savedResponse?: Pick<SavedResponse, "id" | "response_id"> }>(response, "Nao foi possivel remover a resposta salva agora.");
}
