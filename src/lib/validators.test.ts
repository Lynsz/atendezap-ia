import { describe, expect, it } from "vitest";
import { kitFormSchema } from "@/lib/validators";

const validForm = {
  businessName: "Studio Maria",
  niche: "manicure",
  city: "São Paulo",
  productsOrServices: "manicure, pedicure e esmaltação",
  businessHours: "segunda a sábado, 9h às 18h",
  frequentlyAskedQuestions: "tem horário hoje?",
  priceRange: "valores sob consulta",
  paymentMethods: "Pix, cartão e dinheiro",
  purchaseProcess: "cliente agenda pelo WhatsApp",
  toneOfVoice: "simpático",
  whatsapp: "11999999999",
  instagram: ""
};

describe("kitFormSchema", () => {
  it("aceita formulário válido", () => {
    expect(kitFormSchema.safeParse(validForm).success).toBe(true);
  });

  it("rejeita campos obrigatórios vazios", () => {
    expect(kitFormSchema.safeParse({ ...validForm, businessName: "" }).success).toBe(false);
  });
});
