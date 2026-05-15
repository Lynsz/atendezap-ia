import type { CheckoutPlanId } from "@/config/checkout";
import type { ConversationStatus, LeadPriority, LeadSource, LeadStatus, PipelineStage, Sender } from "@/types/atendezap";
import type { AutomationAction, AutomationTrigger } from "@/types/automation";
import type { BillingCycle, SubscriptionStatus } from "@/types/billing";

export type DatabaseProvider = "localStorage" | "supabase";

export type BackendStatus = {
  provider: DatabaseProvider;
  mode: "demo" | "production";
  isConnected: boolean;
  lastCheckedAt: string;
  message: string;
};

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  planId: CheckoutPlanId;
  status: "active" | "pending" | "blocked" | "canceled";
  createdAt: string;
  updatedAt: string;
};

export type Profile = {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "agent";
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type Organization = {
  id: string;
  tenantId: string;
  businessName: string;
  segment: string;
  phone: string;
  email: string;
  openingHours: string;
  aiTone: string;
  welcomeMessage: string;
  createdAt: string;
  updatedAt: string;
};

export type DatabaseLead = {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  stage: PipelineStage;
  value: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type DatabaseConversation = {
  id: string;
  tenantId: string;
  leadId?: string;
  customerName: string;
  customerPhone: string;
  status: ConversationStatus;
  priority: LeadPriority;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
};

export type DatabaseMessage = {
  id: string;
  tenantId: string;
  conversationId: string;
  sender: Sender;
  content: string;
  createdAt: string;
};

export type DatabaseAutomation = {
  id: string;
  tenantId: string;
  name: string;
  trigger: AutomationTrigger;
  action: AutomationAction;
  isActive: boolean;
  totalRuns: number;
  lastRunAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type DatabaseSubscription = {
  id: string;
  tenantId: string;
  planId: CheckoutPlanId;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  kiwifySubscriptionId?: string;
  startedAt: string;
  nextBillingAt?: string;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type DatabaseWebhookEvent = {
  id: string;
  provider: "kiwify";
  eventType: string;
  payload: Record<string, unknown>;
  processedAt?: string;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  tenantId: string;
  actorId?: string;
  action: string;
  entity: string;
  entityId?: string;
  createdAt: string;
};
