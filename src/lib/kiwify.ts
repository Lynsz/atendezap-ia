import { AppError } from "@/lib/errors";

export type NormalizedKiwifyPayload = {
  orderId: string;
  customerName?: string;
  customerEmail: string;
  customerPhone?: string;
  productName?: string;
  paymentStatus?: string;
  amount?: number;
  eventName?: string;
  isApproved: boolean;
};

function readPath(payload: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) return (acc as Record<string, unknown>)[key];
    return undefined;
  }, payload);
}

function firstString(payload: unknown, paths: string[]) {
  for (const path of paths) {
    const value = readPath(payload, path);
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return undefined;
}

function firstNumber(payload: unknown, paths: string[]) {
  for (const path of paths) {
    const value = readPath(payload, path);
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const normalized = Number(value.replace(",", "."));
      if (Number.isFinite(normalized)) return normalized;
    }
  }
  return undefined;
}

export function normalizeKiwifyPayload(payload: unknown): NormalizedKiwifyPayload {
  const orderId =
    firstString(payload, ["order_id", "id", "order.id", "data.order.id", "data.order_id", "data.id", "purchase.id"]) ||
    `kiwify_${Date.now()}`;

  const customerEmail = firstString(payload, [
    "Customer.email",
    "customer.email",
    "buyer.email",
    "data.customer.email",
    "data.buyer.email",
    "data.Customer.email",
    "email"
  ]);

  if (!customerEmail) {
    throw new AppError("Webhook recebido sem e-mail do comprador.", 422);
  }

  const customerName = firstString(payload, [
    "Customer.name",
    "customer.name",
    "buyer.name",
    "data.customer.name",
    "data.buyer.name",
    "name"
  ]);

  const customerPhone = firstString(payload, [
    "Customer.phone",
    "customer.phone",
    "buyer.phone",
    "data.customer.phone",
    "data.buyer.phone",
    "phone",
    "whatsapp"
  ]);

  const productName = firstString(payload, [
    "product.name",
    "Product.name",
    "data.product.name",
    "data.Product.name",
    "product_name",
    "data.product_name"
  ]);

  const paymentStatus = firstString(payload, [
    "status",
    "payment_status",
    "order.status",
    "data.status",
    "data.payment_status",
    "data.order.status"
  ])?.toLowerCase();

  const eventName = firstString(payload, ["event", "event_name", "type", "data.event"])?.toLowerCase();
  const amount = firstNumber(payload, ["amount", "price", "total", "order.amount", "data.amount", "data.total", "data.order.amount"]);
  const approvedWords = ["approved", "paid", "payment_approved", "order.approved", "purchase.approved", "completed"];
  const isApproved = approvedWords.includes(paymentStatus || "") || approvedWords.includes(eventName || "");

  return {
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    productName,
    paymentStatus,
    amount,
    eventName,
    isApproved
  };
}
