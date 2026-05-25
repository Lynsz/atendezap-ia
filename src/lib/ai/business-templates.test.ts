import { describe, expect, it } from "vitest";
import { getBusinessExamples, getBusinessTemplate } from "./business-templates";

describe("business templates", () => {
  it("returns niche examples for delivery", () => {
    expect(getBusinessExamples("Delivery")).toContain("Vocês entregam no meu bairro?");
  });

  it("normalizes accented business types", () => {
    expect(getBusinessTemplate("Assistência técnica").type).toBe("Assistencia tecnica");
  });

  it("falls back to Outro for unknown business type", () => {
    expect(getBusinessTemplate("Servico muito especifico").type).toBe("Outro");
  });
});
