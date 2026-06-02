import { supabase } from "@/lib/supabase/browser";
import type { SupportCategory, SupportPriority, SupportStatus } from "@/lib/support";

export type SupportRequest = {
  id: string;
  user_id: string | null;
  email: string | null;
  category: SupportCategory;
  subject: string;
  message: string;
  status: SupportStatus;
  priority: SupportPriority;
  created_at: string;
  updated_at: string;
};

export type CreateSupportRequestInput = {
  email?: string;
  category: SupportCategory;
  subject: string;
  message: string;
  source?: string;
};

async function getAccessToken() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  return session?.access_token || null;
}

async function parseJsonResponse<T>(response: Response, fallbackMessage: string) {
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || fallbackMessage);
  }
  return data;
}

export async function listSupportRequests() {
  const token = await getAccessToken();
  if (!token) throw new Error("Sessao nao encontrada. Faca login novamente.");

  const response = await fetch("/api/support", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await parseJsonResponse<{ supportRequests?: SupportRequest[] }>(response, "Nao foi possivel carregar suas solicitacoes agora.");
  return data.supportRequests || [];
}

export async function createSupportRequest(input: CreateSupportRequestInput) {
  const token = await getAccessToken();
  const response = await fetch("/api/support", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(input)
  });

  return parseJsonResponse<{ ok: true; supportRequest: SupportRequest }>(response, "Nao foi possivel criar sua solicitacao agora.");
}
