import { afterEach, describe, expect, it, vi } from "vitest";

describe("tracking seguro", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(globalThis, "window");
    Reflect.deleteProperty(globalThis, "document");
  });

  it("remove conteudo sensivel antes de enviar eventos", async () => {
    const gtag = vi.fn();
    const fbq = vi.fn();
    const storage = new Map<string, string>();

    vi.stubGlobal("window", {
      location: { pathname: "/dashboard", search: "?utm_source=meta&utm_campaign=teste" },
      localStorage: {
        getItem: vi.fn((key: string) => storage.get(key) || null),
        setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
        removeItem: vi.fn((key: string) => storage.delete(key))
      },
      gtag,
      fbq
    });
    vi.stubGlobal("document", { title: "AtendeZap IA" });

    const { trackEvent } = await import("./tracking");
    trackEvent("first_response_generated", {
      source: "dashboard",
      plan: "pro",
      category: "atendimento",
      businessType: "Delivery",
      customerQuestion: "Meu pedido atrasou?",
      generatedAnswer: "Sinto muito pelo atraso.",
      resposta: "conteudo completo",
      email: "cliente@example.com"
    });

    expect(gtag).toHaveBeenCalledTimes(1);
    const payload = gtag.mock.calls[0][2] as Record<string, unknown>;
    expect(payload).toMatchObject({
      source: "dashboard",
      plan: "pro",
      category: "atendimento",
      businessType: "Delivery",
      utm_source: "meta",
      utm_campaign: "teste"
    });
    expect(payload.customerQuestion).toBeUndefined();
    expect(payload.generatedAnswer).toBeUndefined();
    expect(payload.resposta).toBeUndefined();
    expect(payload.email).toBeUndefined();
  });

  it("mantem eventos de ativacao sem conteudo de resposta", async () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", {
      location: { pathname: "/dashboard", search: "" },
      localStorage: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn()
      },
      gtag
    });
    vi.stubGlobal("document", { title: "AtendeZap IA" });

    const { trackEvent } = await import("./tracking");
    trackEvent("activation_response_copied", {
      source: "generated",
      step: "response_copied",
      category: "atendimento",
      businessType: "Delivery",
      answer: "resposta completa",
      question: "pergunta do cliente",
      email: "cliente@example.com"
    });

    const payload = gtag.mock.calls[0][2] as Record<string, unknown>;
    expect(payload).toMatchObject({
      source: "generated",
      step: "response_copied",
      category: "atendimento",
      businessType: "Delivery"
    });
    expect(payload.answer).toBeUndefined();
    expect(payload.question).toBeUndefined();
    expect(payload.email).toBeUndefined();
  });

  it("mantem eventos de nicho com metadados seguros", async () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", {
      location: { pathname: "/para/delivery", search: "?utm_source=meta&utm_campaign=nicho_delivery" },
      localStorage: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn()
      },
      gtag
    });
    vi.stubGlobal("document", { title: "AtendeZap IA para Delivery" });

    const { trackEvent } = await import("./tracking");
    trackEvent("niche_demo_cta_click", {
      niche: "delivery",
      cta: "demo",
      source: "niche_landing",
      question: "Qual a taxa?",
      answer: "Resposta completa",
      email: "cliente@example.com"
    });

    const payload = gtag.mock.calls[0][2] as Record<string, unknown>;
    expect(payload).toMatchObject({
      niche: "delivery",
      cta: "demo",
      source: "niche_landing",
      utm_source: "meta",
      utm_campaign: "nicho_delivery"
    });
    expect(payload.question).toBeUndefined();
    expect(payload.answer).toBeUndefined();
    expect(payload.email).toBeUndefined();
  });

  it("identifica a campanha pequena otimizada pela UTM oficial", async () => {
    vi.stubGlobal("window", {
      location: { pathname: "/para/delivery", search: "?utm_campaign=campanha_otimizada_01&utm_content=delivery_criativo_1" },
      localStorage: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn()
      }
    });

    const { isOptimizedSmallCampaign } = await import("./tracking");

    expect(isOptimizedSmallCampaign()).toBe(true);
  });
});
