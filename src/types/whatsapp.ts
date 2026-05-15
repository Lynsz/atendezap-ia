export type WhatsAppProvider = "whatsapp_cloud_api" | "zapi" | "evolution_api" | "manual_demo";

export type WhatsAppConnectionStatus = "disconnected" | "connecting" | "connected" | "error" | "paused";

export type WhatsAppConnection = {
  id: string;
  provider: WhatsAppProvider;
  status: WhatsAppConnectionStatus;
  phoneNumber: string;
  displayName: string;
  businessName: string;
  connectedAt?: string;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type WhatsAppBusinessProfile = {
  businessName: string;
  category: string;
  description: string;
  website?: string;
  email?: string;
  address?: string;
  openingHours: string;
};

export type WhatsAppTemplate = {
  id: string;
  name: string;
  category: string;
  content: string;
  status: "draft" | "approved" | "pending" | "rejected";
  createdAt: string;
};

export type WhatsAppMessageDirection = "inbound" | "outbound";

export type WhatsAppMessageStatus = "queued" | "sent" | "delivered" | "read" | "failed" | "received";

export type WhatsAppSyncLog = {
  id: string;
  type: "connection" | "message_import" | "template" | "sync" | "error";
  title: string;
  description: string;
  status: "success" | "warning" | "error" | "info";
  createdAt: string;
};
