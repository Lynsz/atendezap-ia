import { describe, expect, it } from "vitest";
import { buildKitPrompt } from "@/lib/openai";
import type { KitFormData } from "@/lib/validators";

const formData: KitFormData = {
  businessName: "Studio Maria",
  niche: "manicure",
  city: "São Paulo",
  productsOrServices: "manicure e pedicure",
  businessHours: "segunda a sábado",
  frequentlyAskedQuestions: "tem horário hoje?",
  priceRange: "valores sob consulta",
  paymentMethods: "Pix e cartão",
  purchaseProcess: "agenda por WhatsApp",
  toneOfVoice: "simpático",
  whatsapp: "11999999999",
  instagram: "@studio"
};

describe("buildKitPrompt", () => {
  it("inclui os dados do formulário e estrutura JSON", () => {
    const prompt = buildKitPrompt(formData);

    expect(prompt).toContain("Studio Maria");
    expect(prompt).toContain("manicure");
    expect(prompt).toContain('"welcome_message"');
    expect(prompt).toContain("Responder apenas com JSON válido");
  });
});
