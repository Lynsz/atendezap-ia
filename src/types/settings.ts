import type { AITone, BusinessSegment } from "@/types/onboarding";

export type CompanySettings = {
  businessName: string;
  ownerName: string;
  document?: string;
  email: string;
  phone: string;
  segment: BusinessSegment;
  customSegment?: string;
  website?: string;
  instagram?: string;
  openingHours: string;
  timezone: string;
};

export type AISettings = {
  aiName: string;
  aiTone: AITone;
  welcomeMessage: string;
  fallbackMessage: string;
  mainGoal: string;
  productsOrServices: string;
  targetAudience: string;
  blockedWords: string[];
  autoSuggestReplies: boolean;
  autoSummarizeConversations: boolean;
  autoClassifyLeads: boolean;
};

export type NotificationSettings = {
  notifyNewLead: boolean;
  notifyUrgentLead: boolean;
  notifyUnansweredConversation: boolean;
  notifyNewSubscription: boolean;
  emailNotifications: boolean;
};

export type SupportSettings = {
  supportEmail: string;
  supportWhatsapp: string;
  helpText: string;
};

export type SettingsTab = "company" | "ai" | "notifications" | "support" | "advanced";
