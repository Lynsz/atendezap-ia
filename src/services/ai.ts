import type { GenerateResponseInput } from "@/lib/mvp-validators";

type GenerateCustomerResponseInput = {
  customerQuestion: string;
  responseType: GenerateResponseInput["responseType"];
  business: GenerateResponseInput["businessData"];
};

type GenerateCustomerResponseResult = {
  generatedAnswer: string;
  mode?: string;
};

export async function generateCustomerResponse({ customerQuestion, responseType, business }: GenerateCustomerResponseInput) {
  const response = await fetch("/api/ai/generate-response", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      customerQuestion,
      responseType,
      businessData: business
    })
  });

  const data = (await response.json().catch(() => ({}))) as Partial<GenerateCustomerResponseResult> & { error?: string };

  if (!response.ok || !data.generatedAnswer) {
    throw new Error(data.error || "Nao foi possivel gerar a resposta agora.");
  }

  return {
    generatedAnswer: data.generatedAnswer,
    mode: data.mode
  };
}
