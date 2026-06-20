import { afterEach, describe, expect, it, vi } from "vitest";

describe("safe app events", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(globalThis, "window");
    Reflect.deleteProperty(globalThis, "navigator");
  });

  it("sanitize event metadata without sensitive content", async () => {
    const { sanitizeAppEvent } = await import("./track-event");
    const event = sanitizeAppEvent({
      event_name: "first_response_generated",
      page: "/dashboard",
      source: "dashboard",
      plan: "pro",
      business_type: "Delivery",
      metadata: {
        category: "atendimento",
        response_length_range: "medium",
        usage_count: 4,
        usage_limit: 30,
        customerQuestion: "Meu pedido atrasou?",
        generatedAnswer: "Sinto muito pelo atraso.",
        message: "texto completo enviado pelo cliente",
        content: "conteudo completo de resposta",
        resposta: "resposta completa",
        email: "cliente@example.com",
        phone: "11999999999",
        stripe_customer_id: "cus_123"
      }
    });

    expect(event).toMatchObject({
      event_name: "first_response_generated",
      page: "/dashboard",
      source: "dashboard",
      plan: "pro",
      business_type: "Delivery"
    });
    expect(event?.metadata).toMatchObject({
      category: "atendimento",
      response_length_range: "medium",
      usage_count: 4,
      usage_limit: 30
    });
    expect(event?.metadata.customerQuestion).toBeUndefined();
    expect(event?.metadata.generatedAnswer).toBeUndefined();
    expect(event?.metadata.message).toBeUndefined();
    expect(event?.metadata.content).toBeUndefined();
    expect(event?.metadata.resposta).toBeUndefined();
    expect(event?.metadata.email).toBeUndefined();
    expect(event?.metadata.phone).toBeUndefined();
    expect(event?.metadata.stripe_customer_id).toBeUndefined();
  });

  it("normalizes existing UI aliases into MVP event names", async () => {
    const { sanitizeAppEvent } = await import("./track-event");

    expect(sanitizeAppEvent({ event_name: "activation_response_copied" })?.event_name).toBe("response_copied");
    expect(sanitizeAppEvent({ event_name: "template_copy" })?.event_name).toBe("template_copied");
    expect(sanitizeAppEvent({ event_name: "saved_responses_view" })?.event_name).toBe("library_viewed");
    expect(sanitizeAppEvent({ event_name: "unknown_event" })).toBeNull();
  });

  it("allows beta events with only safe metadata", async () => {
    const { sanitizeAppEvent } = await import("./track-event");
    const event = sanitizeAppEvent({
      event_name: "beta_first_response_generated",
      page: "/dashboard",
      source: "dashboard",
      business_type: "Servicos",
      metadata: {
        category: "atendimento",
        response_length_range: "short",
        usage_count: 1,
        usage_limit: 20,
        pergunta: "quanto custa?",
        resposta: "resposta completa",
        email: "cliente@example.com"
      }
    });

    expect(event?.event_name).toBe("beta_first_response_generated");
    expect(event?.metadata).toEqual({
      business_type: "Servicos",
      category: "atendimento",
      page: "/dashboard",
      response_length_range: "short",
      source: "dashboard",
      usage_count: 1,
      usage_limit: 20
    });
  });

  it("allows small launch events with only safe metadata", async () => {
    const { sanitizeAppEvent } = await import("./track-event");
    const event = sanitizeAppEvent({
      event_name: "small_launch_first_response_generated",
      page: "/dashboard",
      source: "dashboard",
      plan: "pro",
      business_type: "Servicos",
      metadata: {
        category: "atendimento",
        response_length_range: "medium",
        usage_count: 2,
        usage_limit: 50,
        customerMessage: "texto completo do cliente",
        generatedResponse: "texto completo da IA",
        email: "cliente@example.com",
        token: "secret-token"
      }
    });

    expect(event?.event_name).toBe("small_launch_first_response_generated");
    expect(event?.metadata).toEqual({
      business_type: "Servicos",
      category: "atendimento",
      page: "/dashboard",
      plan: "pro",
      response_length_range: "medium",
      source: "dashboard",
      usage_count: 2,
      usage_limit: 50
    });
  });

  it("does not throw when event delivery fails", async () => {
    vi.stubGlobal("window", { location: { pathname: "/dashboard" } });
    vi.stubGlobal("navigator", {});
    vi.stubGlobal("fetch", vi.fn(() => {
      throw new Error("network unavailable");
    }));

    const { trackSafeAppEvent } = await import("./track-event");

    expect(() =>
      trackSafeAppEvent({
        event_name: "dashboard_viewed",
        metadata: {
          question: "conteudo sensivel"
        }
      })
    ).not.toThrow();
  });
});
