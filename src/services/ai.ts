import type { GenerateResponseInput } from "@/lib/mvp-validators";
import { supabase } from "@/lib/supabase/browser";
import type { GeneratedResponse } from "@/types/mvp";

type GenerateCustomerResponseInput = {
  customerQuestion: string;
  responseType: GenerateResponseInput["responseType"];
  business: GenerateResponseInput["businessData"];
};

type GenerateCustomerResponseResult = {
  response: string;
  generatedAnswer: string;
  mode?: string;
  savedResponse?: GeneratedResponse | null;
  savedResponseId: string | null;
  usage: {
    used: number;
    limit: number;
    remaining: number;
  };
};

export async function generateCustomerResponse({ customerQuestion, responseType, business }: GenerateCustomerResponseInput) {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const response = await fetch("/api/ai/generate-response", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
    },
    body: JSON.stringify({
      customerQuestion,
      responseType,
      businessData: business
    })
  });

  const data = (await response.json().catch(() => ({}))) as Partial<GenerateCustomerResponseResult> & { error?: string };

  const generatedAnswer = data.generatedAnswer || data.response;

  if (!response.ok || !generatedAnswer) {
    throw new Error(data.error || "Não foi possível gerar a resposta agora.");
  }

  return {
    generatedAnswer,
    mode: data.mode,
    savedResponse: data.savedResponse ?? null,
    savedResponseId: data.savedResponseId ?? null,
    usage: data.usage ?? {
      used: 0,
      limit: 0,
      remaining: 0
    }
  };
}
