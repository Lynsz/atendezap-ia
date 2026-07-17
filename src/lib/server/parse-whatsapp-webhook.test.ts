import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("parseWhatsAppWebhook", () => {
  let parseWhatsAppWebhook: typeof import("./parse-whatsapp-webhook").parseWhatsAppWebhook;

  beforeAll(async () => {
    ({ parseWhatsAppWebhook } = await import("./parse-whatsapp-webhook"));
  });

  it("normaliza mensagens de texto sem incluir eventos de status", () => {
    const result = parseWhatsAppWebhook({
      object: "whatsapp_business_account",
      entry: [
        {
          id: "waba-1",
          changes: [
            {
              field: "messages",
              value: {
                metadata: { phone_number_id: "123456789", display_phone_number: "+55 11 99999-9999" },
                contacts: [{ wa_id: "5511999999999", profile: { name: "Cliente Teste" } }],
                messages: [{ from: "5511999999999", id: "wamid.test-1", timestamp: "1710000000", type: "text", text: { body: "Olá" } }],
                statuses: [{ id: "wamid.outbound", status: "delivered" }]
              }
            }
          ]
        }
      ]
    });

    expect(result).toEqual([
      expect.objectContaining({
        businessAccountId: "waba-1",
        phoneNumberId: "123456789",
        whatsappUserId: "5511999999999",
        contactName: "Cliente Teste",
        messageId: "wamid.test-1",
        messageType: "text",
        text: "Olá"
      })
    ]);
  });

  it("preserva o tipo e remove corpo de mídia não suportada", () => {
    const result = parseWhatsAppWebhook({
      object: "whatsapp_business_account",
      entry: [{ id: "waba", changes: [{ field: "messages", value: { metadata: { phone_number_id: "12345" }, messages: [{ from: "5511999999999", id: "media-1", timestamp: "1710000000", type: "image", image: { caption: "privado" } }] } }] }]
    });
    expect(result[0]).toMatchObject({ messageType: "image", text: null });
  });

  it("ignora payloads de outro objeto", () => {
    expect(parseWhatsAppWebhook({ object: "page", entry: [] })).toEqual([]);
  });

  it("ignora timestamp fora do formato sem lançar erro", () => {
    expect(
      parseWhatsAppWebhook({
        object: "whatsapp_business_account",
        entry: [{ id: "waba", changes: [{ field: "messages", value: { metadata: { phone_number_id: "12345" }, messages: [{ from: "5511999999999", id: "invalid-time", timestamp: "999999999999", type: "text", text: { body: "Oi" } }] } }] }]
      })
    ).toEqual([]);
  });
});
