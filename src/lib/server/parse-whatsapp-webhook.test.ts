import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("parseWhatsAppWebhook", () => {
  let parseWhatsAppWebhook: typeof import("./parse-whatsapp-webhook").parseWhatsAppWebhook;
  let parseWhatsAppWebhookEvents: typeof import("./parse-whatsapp-webhook").parseWhatsAppWebhookEvents;

  beforeAll(async () => {
    ({ parseWhatsAppWebhook, parseWhatsAppWebhookEvents } = await import("./parse-whatsapp-webhook"));
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

  it("extrai metadados e caption de imagem sem preservar payload bruto", () => {
    const result = parseWhatsAppWebhook({
      object: "whatsapp_business_account",
      entry: [{ id: "waba", changes: [{ field: "messages", value: { metadata: { phone_number_id: "12345" }, messages: [{ from: "5511999999999", id: "media-1", timestamp: "1710000000", type: "image", image: { id: "provider-media-1", mime_type: "image/jpeg", sha256: "hash-test-only", caption: "privado" } }] } }] }]
    });
    expect(result[0]).toMatchObject({
      messageType: "image",
      text: "privado",
      media: { whatsappMediaId: "provider-media-1", mediaType: "image", mimeType: "image/jpeg", sha256: "hash-test-only", caption: "privado" }
    });
  });

  it.each([
    ["document", { id: "doc-1", mime_type: "application/pdf", filename: "arquivo.pdf" }],
    ["audio", { id: "audio-1", mime_type: "audio/ogg" }],
    ["video", { id: "video-1", mime_type: "video/mp4" }],
    ["sticker", { id: "sticker-1", mime_type: "image/webp" }]
  ])("reconhece mídia inbound do tipo %s", (type, mediaObject) => {
    const result = parseWhatsAppWebhook({
      object: "whatsapp_business_account",
      entry: [{ id: "waba", changes: [{ field: "messages", value: { metadata: { phone_number_id: "12345" }, messages: [{ from: "5511999999999", id: `${type}-message`, timestamp: "1710000000", type, [type]: mediaObject }] } }] }]
    });
    expect(result[0]).toMatchObject({ messageType: type, media: { mediaType: type } });
    if (type === "document") expect(result[0].media?.filename).toBe("arquivo.pdf");
  });

  it("normaliza tipo desconhecido como unsupported sem tratá-lo como texto", () => {
    const result = parseWhatsAppWebhook({
      object: "whatsapp_business_account",
      entry: [{ id: "waba", changes: [{ field: "messages", value: { metadata: { phone_number_id: "12345" }, messages: [{ from: "5511999999999", id: "unknown-1", timestamp: "1710000000", type: "location", location: { name: "não persistir" } }] } }] }]
    });
    expect(result[0]).toMatchObject({ messageType: "unsupported", text: null, media: null });
    expect(JSON.stringify(result)).not.toContain("não persistir");
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

  it("normaliza status de entrega com chave estável e sem erro bruto", () => {
    const result = parseWhatsAppWebhookEvents({
      object: "whatsapp_business_account",
      entry: [{ id: "waba", changes: [{ field: "messages", value: { metadata: { phone_number_id: "12345" }, statuses: [{ id: "wamid.out", timestamp: "1710000000", status: "failed", errors: [{ code: 131026, title: "conteúdo privado" }] }] } }] }]
    });
    expect(result).toEqual([
      expect.objectContaining({
        kind: "message_status",
        messageId: "wamid.out",
        statusId: "wamid.out:failed:1710000000",
        status: "failed",
        providerErrorCode: "131026"
      })
    ]);
    expect(JSON.stringify(result)).not.toContain("conteúdo privado");
  });
});
