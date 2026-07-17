import "server-only";

import { z } from "zod";

const idSchema = z.string().trim().min(1).max(255);
const unixTimestampSchema = z.string().regex(/^\d{1,10}$/);

export type ParsedWhatsAppInbound = {
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

export function parseWhatsAppWebhook(payload: unknown): ParsedWhatsAppInbound[] {
  const root = record(payload);
  if (!root || root.object !== "whatsapp_business_account") return [];

  const inbound: ParsedWhatsAppInbound[] = [];
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
        inbound.push({
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
    }
  }

  return inbound;
}
