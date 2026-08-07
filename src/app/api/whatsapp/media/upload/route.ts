import { randomUUID } from "node:crypto";
import { z } from "zod";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { requireUser } from "@/lib/auth/server";
import { AppError, errorResponse } from "@/lib/errors";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import {
  getWhatsAppMaxMediaBytes,
  isWhatsAppMediaUploadEnabled,
  removeStoredWhatsAppMediaFile,
  storeWhatsAppMediaFile,
  validateWhatsAppMediaBytes,
  validateWhatsAppMediaSize,
  validateWhatsAppMediaType
} from "@/lib/server/whatsapp-media";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let stored: { bucket: string; path: string } | null = null;
  try {
    if (!isWhatsAppMediaUploadEnabled()) throw new AppError("O upload de mídias está desativado neste ambiente.", 503);
    assertRequestSize(request, getWhatsAppMaxMediaBytes() + 1024 * 1024);
    const user = await requireUser(request);
    await enforceRateLimit({ request, route: "api:whatsapp-media-upload", identifier: user.id, limit: 8, windowMs: 10 * 60_000 });
    const form = await request.formData();
    const conversationId = z.string().uuid().parse(form.get("conversationId"));
    const file = form.get("file");
    if (!(file instanceof File)) throw new AppError("Selecione um arquivo válido.", 400);
    validateWhatsAppMediaSize(file.size);
    const mimeType = file.type.trim().toLowerCase();
    const mediaType = mimeType.startsWith("image/") ? "image" : "document";
    validateWhatsAppMediaType({ mediaType, mimeType, filename: file.name });
    const buffer = Buffer.from(await file.arrayBuffer());
    validateWhatsAppMediaSize(buffer.length);
    validateWhatsAppMediaBytes(buffer, mimeType);

    const supabase = getSupabaseAdmin();
    const { data: conversation, error: conversationError } = await supabase
      .from("whatsapp_conversations")
      .select("id,contact_id,connection_id")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (conversationError) throw conversationError;
    if (!conversation) throw new AppError("Conversa não encontrada.", 404);

    const mediaId = randomUUID();
    stored = await storeWhatsAppMediaFile({ userId: user.id, mediaId, buffer, mimeType });
    const { data: media, error } = await supabase.from("whatsapp_media").insert({
      id: mediaId,
      user_id: user.id,
      connection_id: conversation.connection_id,
      conversation_id: conversationId,
      contact_id: conversation.contact_id,
      direction: "outbound",
      media_type: mediaType,
      mime_type: mimeType,
      file_size: buffer.length,
      original_filename: file.name.slice(0, 255),
      storage_bucket: stored.bucket,
      storage_path: stored.path,
      download_status: "downloaded",
      scanned_status: "unavailable"
    }).select("id,media_type,mime_type,file_size,original_filename,download_status,created_at").single();
    if (error || !media) throw error || new Error("media_record_not_saved");
    await Promise.all([
      writeWhatsAppAudit({ userId: user.id, connectionId: conversation.connection_id, action: "media_upload_created", status: "created", conversationId, mediaId }),
      trackServerAppEvent({ user_id: user.id, event_name: "whatsapp_media_upload_created", page: "/dashboard/whatsapp", source: "dashboard", metadata: { media_type: mediaType, mime_group: mimeType.split("/")[0], status: "created" } })
    ]);
    return Response.json({ media: { id: media.id, media_type: media.media_type, mime_type: media.mime_type, file_size: media.file_size, filename: media.original_filename, download_status: media.download_status, created_at: media.created_at } }, { status: 201 });
  } catch (error) {
    if (stored) await removeStoredWhatsAppMediaFile(stored).catch(() => undefined);
    return errorResponse(error);
  }
}
