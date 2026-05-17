import { CHECKOUT_PLANS, getCheckoutPlan } from "@/config/checkout";
import type { CheckoutPlanId } from "@/config/checkout";
import { createKiwifyMockEvent, kiwifyMockEvents } from "@/data/kiwifyMock";
import type { KiwifyEventType, KiwifyWebhookEvent } from "@/types/kiwify";
import { addBillingEvent, getCurrentSubscription, saveSubscription } from "@/utils/billingStorage";

const KIWIFY_EVENTS_STORAGE_KEY = "atendezap_ia_kiwify_webhook_events_v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function addMonths(date: Date, months: number) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function currentUserId() {
  return getCurrentSubscription()?.userId || "local-user";
}

export function getKiwifyWebhookEvents(): KiwifyWebhookEvent[] {
  if (!canUseStorage()) return kiwifyMockEvents;

  const stored = window.localStorage.getItem(KIWIFY_EVENTS_STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as KiwifyWebhookEvent[];
  } catch {
    window.localStorage.removeItem(KIWIFY_EVENTS_STORAGE_KEY);
    return [];
  }
}

export function saveKiwifyWebhookEvents(events: KiwifyWebhookEvent[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(KIWIFY_EVENTS_STORAGE_KEY, JSON.stringify(events));
  window.dispatchEvent(new Event("atendezap-kiwify-change"));
}

export function addKiwifyWebhookEvent(event: KiwifyWebhookEvent) {
  const nextEvents = [event, ...getKiwifyWebhookEvents()].slice(0, 50);
  saveKiwifyWebhookEvents(nextEvents);
  return nextEvents;
}

export function mapKiwifyPlanToCheckoutPlanId(planName: string): CheckoutPlanId {
  const normalized = planName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (normalized.includes("pro")) return "pro";
  if (normalized.includes("premium")) return "premium";
  return "starter";
}

function eventLabel(type: KiwifyEventType) {
  const labels: Record<KiwifyEventType, string> = {
    order_paid: "Compra aprovada",
    order_refunded: "Compra reembolsada",
    subscription_created: "Assinatura criada",
    subscription_renewed: "Assinatura renovada",
    subscription_late: "Assinatura em atraso",
    subscription_canceled: "Assinatura cancelada",
    subscription_expired: "Assinatura expirada"
  };

  return labels[type];
}

export function processKiwifyWebhookEvent(event: KiwifyWebhookEvent) {
  const planId = mapKiwifyPlanToCheckoutPlanId(event.order.plan.name);
  const plan = getCheckoutPlan(planId);
  const current = getCurrentSubscription();
  const now = new Date().toISOString();
  const nextBillingAt = addMonths(new Date(event.order.paidAt || event.createdAt), 1).toISOString();
  const activeEvents: KiwifyEventType[] = ["order_paid", "subscription_created", "subscription_renewed"];
  const canceledEvents: KiwifyEventType[] = ["subscription_canceled", "subscription_expired", "order_refunded"];
  const status = event.type === "subscription_late" ? "overdue" : canceledEvents.includes(event.type) ? "canceled" : "active";

  if (activeEvents.includes(event.type) || canceledEvents.includes(event.type) || event.type === "subscription_late") {
    saveSubscription({
      id: current?.id || createId("sub"),
      userId: current?.userId || currentUserId(),
      planId,
      planName: plan.name,
      price: plan.price,
      status,
      billingCycle: "monthly",
      startedAt: current?.startedAt || event.createdAt,
      nextBillingAt: event.type === "subscription_renewed" || activeEvents.includes(event.type) ? nextBillingAt : current?.nextBillingAt || nextBillingAt,
      updatedAt: now
    });
  }

  addBillingEvent({
    title: eventLabel(event.type),
    description: `${event.order.customer.email} - ${plan.name} (${plan.price}). Evento Kiwify processado localmente para simulação de webhook.`,
    type: canceledEvents.includes(event.type) ? "canceled" : event.type === "subscription_late" ? "info" : "plan_changed"
  });

  return {
    ok: true,
    processedStatus: status,
    planId,
    message: `${eventLabel(event.type)} processado localmente.`
  };
}

export function simulateKiwifyEvent(type: KiwifyEventType, planId: CheckoutPlanId = "starter") {
  const event = createKiwifyMockEvent(type, planId);
  addKiwifyWebhookEvent(event);
  return {
    event,
    result: processKiwifyWebhookEvent(event)
  };
}

export function clearKiwifyWebhookEvents() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(KIWIFY_EVENTS_STORAGE_KEY);
  window.dispatchEvent(new Event("atendezap-kiwify-change"));
}

export const KIWIFY_SIMULATOR_PLANS = CHECKOUT_PLANS;
