export type KiwifyEventType =
  | "order_paid"
  | "order_refunded"
  | "subscription_created"
  | "subscription_renewed"
  | "subscription_late"
  | "subscription_canceled"
  | "subscription_expired";

export type KiwifyPaymentMethod = "credit_card" | "pix" | "boleto";

export type KiwifySubscriptionStatus = "active" | "late" | "canceled" | "expired" | "pending";

export type KiwifyCustomer = {
  name: string;
  email: string;
  phone?: string;
  document?: string;
};

export type KiwifyProduct = {
  id: string;
  name: string;
};

export type KiwifyPlan = {
  id: string;
  name: string;
  price: string;
  billingCycle: "monthly";
};

export type KiwifyOrder = {
  id: string;
  status: KiwifySubscriptionStatus;
  paymentMethod: KiwifyPaymentMethod;
  paidAt?: string;
  createdAt: string;
  customer: KiwifyCustomer;
  product: KiwifyProduct;
  plan: KiwifyPlan;
};

export type KiwifyWebhookEvent = {
  id: string;
  type: KiwifyEventType;
  createdAt: string;
  order: KiwifyOrder;
  rawPayload?: unknown;
};
