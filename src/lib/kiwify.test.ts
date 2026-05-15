import { describe, expect, it } from "vitest";
import { normalizeKiwifyPayload } from "@/lib/kiwify";

describe("normalizeKiwifyPayload", () => {
  it("normaliza payload aprovado comum", () => {
    const result = normalizeKiwifyPayload({
      event: "order.approved",
      order_id: "test_order_123",
      status: "approved",
      product: { name: "AtendeZap IA - Plano Profissional" },
      customer: { name: "Maria Silva", email: "maria@example.com", phone: "11999999999" },
      amount: 49
    });

    expect(result.orderId).toBe("test_order_123");
    expect(result.customerEmail).toBe("maria@example.com");
    expect(result.productName).toBe("AtendeZap IA - Plano Profissional");
    expect(result.isApproved).toBe(true);
  });

  it("procura email em caminhos alternativos", () => {
    const result = normalizeKiwifyPayload({
      data: { buyer: { email: "ana@example.com" }, order: { id: "abc" } },
      payment_status: "paid"
    });

    expect(result.customerEmail).toBe("ana@example.com");
    expect(result.orderId).toBe("abc");
    expect(result.isApproved).toBe(true);
  });

  it("falha sem email", () => {
    expect(() => normalizeKiwifyPayload({ event: "order.approved" })).toThrow("e-mail");
  });
});
