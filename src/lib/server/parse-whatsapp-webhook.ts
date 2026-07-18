import "server-only";

import { z } from "zod";

const idSchema = z.string().trim().min(1).max(255);
const unixTimestampSchema = z.string().regex(/^\d{1,10}$/);

export type ParsedWhatsAppInbound = {
  kind: "inbound_message";
  businessAccountId: string;
  phoneNumberId: string;
  displayPhoneNumber: string | null;
  whatsappUserId: string;
  contactName: string | null;
  messageId: string;
  messageType: string;
  text: string | null;
  receivedAt: string;
};

export type ParsedWhatsAppStatus = {
  kind: "message_status";
  businessAccountId: string;
  phoneNumberId: string;
  messageId: string;
  statusId: string;
  status: "sent" | "delivered" | "read" | "failed";
  statusAt: string;
  providerErrorCode: string | null;
};

export type ParsedWhatsAppEvent = ParsedWhatsAppInbound | ParsedWhatsAppStatus;

type UnknownRecord = Record<string, unknown>;

function record(value: unknown): UnknownRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as UnknownRecord) : null;
}

function records(value: unknown) {
  return Array.isArray(value) ? value.map(record).filter((item): item is UnknownRecord => Boolean(item)) : [];
}

function validId(value: unknown) {
  const parsed = idSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function parseWhatsAppWebhookEvents(payload: unknown): ParsedWhatsAppEvent[] {
  const root = record(payload);
  if (!root || root.object !== "whatsapp_business_account") return [];

  const events: ParsedWhatsAppEvent[] = [];
  for (const entry of records(root.entry)) {
    const businessAccountId = validId(entry.id);
    if (!businessAccountId) continue;

    for (const change of records(entry.changes)) {
      if (change.field !== "messages") continue;
      const value = record(change.value);
      const metadata = record(value?.metadata);
      const phoneNumberId = validId(metadata?.phone_number_id);
      if (!value || !phoneNumberId) continue;

      const contacts = new Map<string, string>();
      for (const contact of records(value.contacts)) {
        const waId = validId(contact.wa_id);
        const profile = record(contact.profile);
        const name = typeof profile?.name === "string" ? profile.name.trim().slice(0, 160) : "";
        if (waId) contacts.set(waId, name);
      }

      for (const message of records(value.messages)) {
        const whatsappUserId = validId(message.from);
        const messageId = validId(message.id);
        const timestamp = unixTimestampSchema.safeParse(message.timestamp);
        const messageType = typeof message.type === "string" ? message.type.trim().slice(0, 40) : "unknown";
        if (!whatsappUserId || !messageId || !timestamp.success) continue;

        const textObject = record(message.text);
        const text = messageType === "text" && typeof textObject?.body === "string" ? textObject.body.trim().slice(0, 4096) : null;
        events.push({
          kind: "inbound_message",
          businessAccountId,
          phoneNumberId,
          displayPhoneNumber: typeof metadata?.display_phone_number === "string" ? metadata.display_phone_number.trim().slice(0, 40) : null,
          whatsappUserId,
          contactName: contacts.get(whatsappUserId) || null,
          messageId,
          messageType,
          text,
          receivedAt: new Date(Number(timestamp.data) * 1000).toISOString()
        });
      }

      for (const statusItem of records(value.statuses)) {
        const messageId = validId(statusItem.id);
        const timestamp = unixTimestampSchema.safeParse(statusItem.timestamp);
        const rawStatus = typeof statusItem.status === "string" ? statusItem.status : "";
        if (!messageId || !timestamp.success || !["sent", "delivered", "read", "failed"].includes(rawStatus)) continue;
        const errors = records(statusItem.errors);
        const providerErrorCode = errors.length ? validId(String(errors[0].code ?? "")) : null;
        events.push({
          kind: "message_status",
          businessAccountId,
          phoneNumberId,
          messageId,
          statusId: `${messageId}:${rawStatus}:${timestamp.data}`,
          status: rawStatus as ParsedWhatsAppStatus["status"],
          statusAt: new Date(Number(timestamp.data) * 1000).toISOString(),
          providerErrorCode
        });
      }
    }
  }

  return events;
}

export function parseWhatsAppWebhook(payload: unknown): ParsedWhatsAppInbound[] {
  return parseWhatsAppWebhookEvents(payload).filter((event): event is ParsedWhatsAppInbound => event.kind === "inbound_message");
}
