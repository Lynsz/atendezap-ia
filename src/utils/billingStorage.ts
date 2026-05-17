import { CHECKOUT_PLANS, getCheckoutPlan } from "@/config/checkout";
import type { CheckoutPlanId } from "@/config/checkout";
import type { BillingEvent, SubscriptionStatus, UserSubscription } from "@/types/billing";

const BILLING_STORAGE_KEY = "atendezap_ia_subscription_v1";
const BILLING_EVENTS_KEY = "atendezap_ia_billing_events_v1";
const AUTH_STORAGE_KEY = "atendezap_ia_access_session_v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function addMonths(date: Date, months: number) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

function getCurrentUserId() {
  if (!canUseStorage()) return "local-user";

  try {
    const storedSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!storedSession) return "local-user";
    const session = JSON.parse(storedSession) as { user?: { id?: string } };
    return session.user?.id || "local-user";
  } catch {
    return "local-user";
  }
}

function buildSubscription(planId: CheckoutPlanId, status: SubscriptionStatus = "active"): UserSubscription {
  const now = new Date();
  const plan = getCheckoutPlan(planId);

  return {
    id: createId("sub"),
    userId: getCurrentUserId(),
    planId,
    planName: plan.name,
    price: plan.price,
    status,
    billingCycle: "monthly",
    startedAt: now.toISOString(),
    nextBillingAt: addMonths(now, 1).toISOString(),
    updatedAt: now.toISOString()
  };
}

export function getCurrentSubscription(): UserSubscription | null {
  if (!canUseStorage()) return null;

  const stored = window.localStorage.getItem(BILLING_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as UserSubscription;
  } catch {
    window.localStorage.removeItem(BILLING_STORAGE_KEY);
    return null;
  }
}

export function saveSubscription(subscription: UserSubscription) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(subscription));
  window.dispatchEvent(new Event("atendezap-billing-change"));
}

export function createDefaultSubscription(planId: CheckoutPlanId = "starter") {
  const subscription = buildSubscription(planId);
  saveSubscription(subscription);
  addBillingEvent({
    title: "Assinatura local criada",
    description: `Simulação local iniciada no ${subscription.planName}. A cobrança real do SaaS é gerenciada pelo Asaas.`,
    type: "created"
  });
  return subscription;
}

export function updateSubscriptionPlan(planId: CheckoutPlanId) {
  const current = getCurrentSubscription();
  const plan = getCheckoutPlan(planId);
  const now = new Date().toISOString();
  const subscription: UserSubscription = current
    ? {
        ...current,
        planId,
        planName: plan.name,
        price: plan.price,
        status: "active",
        updatedAt: now
      }
    : buildSubscription(planId);

  saveSubscription(subscription);
  addBillingEvent({
    title: "Plano local atualizado",
    description: `A assinatura local foi atualizada para ${plan.name}. Confirme a cobrança real pelo Asaas.`,
    type: "plan_changed"
  });

  return subscription;
}

export function cancelLocalSubscription() {
  const current = getCurrentSubscription();
  if (!current) return null;

  const subscription: UserSubscription = {
    ...current,
    status: "canceled",
    updatedAt: new Date().toISOString()
  };

  saveSubscription(subscription);
  addBillingEvent({
    title: "Assinatura local cancelada",
    description: "O status foi alterado apenas neste navegador. Para cancelar cobranças reais, use o painel do Asaas ou suporte.",
    type: "canceled"
  });

  return subscription;
}

export function reactivateLocalSubscription() {
  const current = getCurrentSubscription();
  if (!current) return createDefaultSubscription("starter");

  const subscription: UserSubscription = {
    ...current,
    status: "active",
    nextBillingAt: addMonths(new Date(), 1).toISOString(),
    updatedAt: new Date().toISOString()
  };

  saveSubscription(subscription);
  addBillingEvent({
    title: "Assinatura local reativada",
    description: `A simulação local voltou para o status ativo no ${subscription.planName}.`,
    type: "reactivated"
  });

  return subscription;
}

export function getBillingEvents(): BillingEvent[] {
  if (!canUseStorage()) return [];

  const stored = window.localStorage.getItem(BILLING_EVENTS_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as BillingEvent[];
  } catch {
    window.localStorage.removeItem(BILLING_EVENTS_KEY);
    return [];
  }
}

export function addBillingEvent(event: Omit<BillingEvent, "id" | "createdAt"> | BillingEvent) {
  if (!canUseStorage()) return null;

  const billingEvent: BillingEvent =
    "id" in event && "createdAt" in event
      ? event
      : {
          ...event,
          id: createId("evt"),
          createdAt: new Date().toISOString()
        };

  const nextEvents = [billingEvent, ...getBillingEvents()].slice(0, 30);
  window.localStorage.setItem(BILLING_EVENTS_KEY, JSON.stringify(nextEvents));
  window.dispatchEvent(new Event("atendezap-billing-change"));

  return billingEvent;
}

export function clearBillingData() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(BILLING_STORAGE_KEY);
  window.localStorage.removeItem(BILLING_EVENTS_KEY);
  window.dispatchEvent(new Event("atendezap-billing-change"));
}

export const LOCAL_SUBSCRIPTION_PLANS = Object.values(CHECKOUT_PLANS);
