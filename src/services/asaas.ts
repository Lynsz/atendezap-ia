import { AppError } from "@/lib/errors";
import type { PlanId, SaasPlan } from "@/config/plans";

type AsaasEnvironment = "sandbox" | "production";
type AsaasBillingType = "UNDEFINED" | "BOLETO" | "CREDIT_CARD" | "PIX";

export type CreateAsaasCustomerInput = {
  name: string;
  email?: string;
  cpfCnpj?: string;
  mobilePhone?: string;
  externalReference: string;
};

export type CreateAsaasSubscriptionInput = {
  customer: string;
  billingType: AsaasBillingType;
  value: number;
  nextDueDate: string;
  description: string;
  externalReference: string;
};

export type AsaasCustomer = {
  id: string;
  name?: string;
  email?: string;
};

export type AsaasSubscription = {
  id: string;
  customer?: string;
  value?: number;
  status?: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  paymentLink?: string;
};

export type AsaasPayment = {
  id: string;
  status?: string;
  subscription?: string;
  customer?: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  dueDate?: string;
  confirmedDate?: string;
  paymentDate?: string;
  clientPaymentDate?: string;
  value?: number;
  netValue?: number;
  externalReference?: string;
};

export type UpdateAsaasPaymentInput = {
  billingType: AsaasBillingType;
  value: number;
  dueDate: string;
  description: string;
  externalReference: string;
};

export type AsaasWebhookPayload = {
  id?: string;
  event?: string;
  payment?: AsaasPayment;
};

function getAsaasEnvironment(): AsaasEnvironment {
  const environment = process.env.ASAAS_ENVIRONMENT?.trim() || "sandbox";
  if (environment !== "sandbox" && environment !== "production") {
    throw new AppError("ASAAS_ENVIRONMENT deve ser sandbox ou production.", 500);
  }
  return environment;
}

export function getAsaasBaseUrl() {
  return getAsaasEnvironment() === "production" ? "https://api.asaas.com/v3" : "https://api-sandbox.asaas.com/v3";
}

function getAsaasApiKey() {
  const apiKey = process.env.ASAAS_API_KEY?.trim();
  if (!apiKey) {
    throw new AppError("Pagamento indisponível no momento. Configure ASAAS_API_KEY no servidor.", 503);
  }
  return apiKey;
}

async function asaasRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getAsaasBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "AtendeZap IA",
      access_token: getAsaasApiKey(),
      ...(init.headers || {})
    },
    cache: "no-store"
  });

  const body = (await response.json().catch(() => ({}))) as { errors?: Array<{ description?: string }> };

  if (!response.ok) {
    const message = body.errors?.[0]?.description || "Não foi possível concluir a operação no Asaas.";
    throw new AppError(message, response.status);
  }

  return body as T;
}

export function nextAsaasDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function addOneMonthIso(value = new Date()) {
  const date = new Date(value);
  date.setMonth(date.getMonth() + 1);
  return date.toISOString();
}

export function buildAsaasExternalReference(userId: string, planId: PlanId) {
  return `atendezap:${userId}:${planId}`;
}

export async function createAsaasCustomer(input: CreateAsaasCustomerInput) {
  if (!input.cpfCnpj) {
    throw new AppError("Informe CPF ou CNPJ para iniciar a cobrança pelo Asaas.", 400);
  }

  return asaasRequest<AsaasCustomer>("/customers", {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      cpfCnpj: input.cpfCnpj,
      mobilePhone: input.mobilePhone,
      externalReference: input.externalReference
    })
  });
}

export async function createAsaasSubscription(input: CreateAsaasSubscriptionInput) {
  return asaasRequest<AsaasSubscription>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      customer: input.customer,
      billingType: input.billingType,
      value: input.value,
      nextDueDate: input.nextDueDate,
      cycle: "MONTHLY",
      description: input.description,
      externalReference: input.externalReference
    })
  });
}

export async function listAsaasSubscriptionPayments(subscriptionId: string) {
  return asaasRequest<{ data?: AsaasPayment[] }>(`/subscriptions/${subscriptionId}/payments`);
}

export async function updateAsaasPayment(paymentId: string, input: UpdateAsaasPaymentInput) {
  return asaasRequest<AsaasPayment>(`/payments/${paymentId}`, {
    method: "POST",
    body: JSON.stringify({
      billingType: input.billingType,
      value: input.value,
      dueDate: input.dueDate,
      description: input.description,
      externalReference: input.externalReference
    })
  });
}

export async function getAsaasSubscription(subscriptionId: string) {
  return asaasRequest<AsaasSubscription>(`/subscriptions/${subscriptionId}`);
}

export async function cancelAsaasSubscription(subscriptionId: string) {
  return asaasRequest<AsaasSubscription>(`/subscriptions/${subscriptionId}`, {
    method: "DELETE"
  });
}

export function mapAsaasEventToSubscriptionStatus(eventName?: string, paymentStatus?: string) {
  if (eventName === "PAYMENT_RECEIVED" || eventName === "PAYMENT_CONFIRMED") return "active";
  if (eventName === "PAYMENT_CREATED" || eventName === "PAYMENT_PENDING" || paymentStatus === "PENDING") return "pending";
  if (eventName === "PAYMENT_OVERDUE" || eventName === "PAYMENT_CREDIT_CARD_CAPTURE_REFUSED") return "past_due";
  if (eventName === "PAYMENT_DELETED" || eventName === "PAYMENT_REFUNDED" || eventName === "PAYMENT_CHARGEBACK_REQUESTED") return "canceled";
  return "pending";
}

export function asaasSubscriptionDescription(plan: SaasPlan, firstMonthPriceApplied: boolean) {
  if (plan.id === "pro" && firstMonthPriceApplied) {
    return "AtendeZap IA Pro - primeiro mês por R$ 29 para novos usuários. Depois, R$ 97/mês.";
  }

  return `AtendeZap IA ${plan.name} - ${plan.monthlyPriceLabel}`;
}
