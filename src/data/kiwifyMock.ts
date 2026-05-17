import { CHECKOUT_PLANS } from "@/config/checkout";
import type { CheckoutPlanId } from "@/config/checkout";
import type { KiwifyEventType, KiwifyPaymentMethod, KiwifyWebhookEvent } from "@/types/kiwify";

const customer = {
  name: "Cliente AtendeZap",
  email: "cliente@atendezapia.com",
  phone: "11999999999",
  document: "000.000.000-00"
};

const paymentMethods: Record<CheckoutPlanId, KiwifyPaymentMethod> = {
  starter: "credit_card",
  pro: "pix",
  premium: "credit_card"
};

function eventStatus(type: KiwifyEventType) {
  if (type === "subscription_late") return "late";
  if (type === "subscription_canceled" || type === "subscription_expired" || type === "order_refunded") return "canceled";
  if (type === "subscription_created" || type === "subscription_renewed" || type === "order_paid") return "active";
  return "pending";
}

export function createKiwifyMockEvent(type: KiwifyEventType, planId: CheckoutPlanId): KiwifyWebhookEvent {
  const now = new Date().toISOString();
  const plan = CHECKOUT_PLANS[planId];

  return {
    id: `kiwify-${type}-${planId}-${Date.now()}`,
    type,
    createdAt: now,
    order: {
      id: `order-${planId}-${Date.now()}`,
      status: eventStatus(type),
      paymentMethod: paymentMethods[planId],
      paidAt: ["order_paid", "subscription_created", "subscription_renewed"].includes(type) ? now : undefined,
      createdAt: now,
      customer,
      product: {
        id: "atendezap-ia",
        name: "AtendeZap IA"
      },
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        billingCycle: "monthly"
      }
    },
    rawPayload: {
      source: "local_simulator",
      note: "Evento mockado para preparar integração futura com webhook da Kiwify."
    }
  };
}

export const kiwifyMockEvents: KiwifyWebhookEvent[] = [
  createKiwifyMockEvent("order_paid", "starter"),
  createKiwifyMockEvent("order_paid", "pro"),
  createKiwifyMockEvent("order_paid", "premium"),
  createKiwifyMockEvent("subscription_renewed", "pro"),
  createKiwifyMockEvent("subscription_late", "pro"),
  createKiwifyMockEvent("subscription_canceled", "pro")
];
