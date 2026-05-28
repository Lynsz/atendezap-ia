import { supabase } from "@/lib/supabase/browser";
import type { DataRequestStatus, DataRequestType } from "@/lib/data-requests";

export type DataRequest = {
  id: string;
  user_id: string;
  type: DataRequestType;
  status: DataRequestStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
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

export async function listDataRequests() {
  const token = await getAccessToken();
  const response = await fetch("/api/data-requests", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await parseJsonResponse<{ dataRequests?: DataRequest[] }>(response, "Nao foi possivel carregar suas solicitacoes agora.");
  return data.dataRequests || [];
}

export async function createDataRequest(type: DataRequestType) {
  const token = await getAccessToken();
  const response = await fetch("/api/data-requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ type })
  });

  return parseJsonResponse<{ dataRequest: DataRequest; alreadyPending?: boolean }>(response, "Nao foi possivel criar sua solicitacao agora.");
}
