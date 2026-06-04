import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function readSource(path: string) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

describe("copy de conversao da Sprint 3", () => {
  it("mantem pricing com Pro R$ 29, recorrencia normal e portal Stripe", () => {
    const pricing = readSource("../pricing/PricingPageContent.tsx");
    const sections = readSource("./ConversionSections.tsx");

    expect(pricing).toContain("Primeiro mês por R$ 29 para novos usuários.");
    expect(pricing).toContain("Depois, segue o valor normal do Plano Pro configurado na assinatura.");
    expect(pricing).toContain("portal Stripe");
    expect(sections).toContain("Primeiro mês por R$ 29 para novos usuários.");
    expect(sections).toContain("Depois, segue o valor normal do Plano Pro configurado na assinatura.");
  });

  it("mantem CTA pos-demo com os textos e eventos esperados", () => {
    const source = readSource("../demo/PublicDemo.tsx");

    expect(source).toContain("Quer usar isso com o contexto do seu atendimento?");
    expect(source).toContain("Com uma conta, você configura seu tipo de atendimento, salva respostas, usa templates e acompanha seu limite mensal.");
    expect(source).toContain("demo_signup_cta_click");
    expect(source).toContain("demo_pricing_cta_click");
    expect(source).toContain("demo_ebook_cta_click");
    expect(source).toContain("demo_to_signup_click");
    expect(source).toContain("demo_to_pricing_click");
  });

  it("mantem CTA pos-primeira resposta para usuario sem plano pago", () => {
    const source = readSource("../pages/SaasDashboardPage.tsx");

    expect(source).toContain("Gostou da resposta? Veja os planos para continuar usando com mais limite e recursos.");
    expect(source).toContain("first_response_to_pricing_click");
    expect(source).toContain("Ver templates prontos");
  });

  it("mantem paginas de nicho com aviso anti-automacao e eventos de conversao", () => {
    const landing = readSource("../marketing/NicheLandingPage.tsx");
    const niches = readSource("../../config/niches.ts");

    expect(niches).toContain("O AtendeZap IA não envia mensagens automaticamente. Ele gera respostas para você copiar, ajustar e enviar.");
    expect(landing).toContain("nao envia mensagens automaticamente pelo WhatsApp");
    expect(landing).toContain("niche_to_demo_click");
    expect(landing).toContain("niche_to_signup_click");
    expect(landing).toContain("niche_to_pricing_click");
  });
});
