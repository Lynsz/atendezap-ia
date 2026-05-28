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
});
