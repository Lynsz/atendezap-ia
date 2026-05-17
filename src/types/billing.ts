import type { CheckoutPlanId } from "@/config/checkout";

export type SubscriptionStatus = "active" | "trial" | "overdue" | "past_due" | "inactive" | "canceled" | "pending";

export type BillingCycle = "monthly";

export type SubscriptionPlan = {
  id: CheckoutPlanId;
  name: string;
  price: string;
  checkoutUrl: string;
  billingCycle: BillingCycle;
  features: string[];
};

export type UserSubscription = {
  id: string;
  userId: string;
  planId: CheckoutPlanId;
  planName: string;
  price: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  startedAt: string;
  nextBillingAt: string;
  updatedAt: string;
};

export type BillingEvent = {
  id: string;
  title: string;
  description: string;
  type: "created" | "plan_changed" | "checkout_redirect" | "canceled" | "reactivated" | "info";
  createdAt: string;
};
