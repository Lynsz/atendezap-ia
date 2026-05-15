export type ConversationStatus = "open" | "waiting" | "resolved";

export type Priority = "low" | "medium" | "high";

export type Sender = "customer" | "agent" | "ai";

export type LeadStatus = "new" | "in_service" | "qualified" | "proposal_sent" | "closed" | "lost";

export type LeadSource = "whatsapp" | "instagram" | "website" | "referral" | "ad";

export type LeadTag = "urgent" | "high_value" | "interested" | "needs_follow_up" | "cold_customer";

export type LeadPriority = "low" | "medium" | "high";

export type PipelineStage = "new_lead" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";

export type Customer = {
  id: string;
  name: string;
  phone: string;
  avatarInitials: string;
  city: string;
  tags: string[];
};

export type Message = {
  id: string;
  sender: Sender;
  content: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  customer: Customer;
  status: ConversationStatus;
  priority: Priority;
  intent: string;
  updatedAt: string;
  messages: Message[];
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  tags: LeadTag[];
  stage: PipelineStage;
  value: number;
  notes: string;
  lastContactAt: string;
  createdAt: string;
};
