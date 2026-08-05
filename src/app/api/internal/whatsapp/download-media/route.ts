import { trackServerAppEvent } from "@/lib/analytics/server";
import { errorResponse } from "@/lib/errors";
import { serverLog } from "@/lib/logger";
import { requireInternalJob } from "@/lib/server/internal-job-auth";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import {
  downloadWhatsAppMedia,
  getWhatsAppMediaMetadata,
  isWhatsAppMediaDownloadEnabled,
  storeWhatsAppMediaFile,
  validateWhatsAppMediaSize,
  validateWhatsAppMediaType,
  WhatsAppMediaError
} from "@/lib/server/whatsapp-media";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { WhatsAppMediaType } from "@/lib/whatsapp/allowed-media-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PendingMedia = {
  id: string;
  user_id: string;
  conversation_id: string;
  message_id: string | null;
  contact_id: string;
  whatsapp_media_id: string;
  media_type: WhatsAppMediaType;
  original_filename: string | null;
};

function blockedStatus(errorType: string) {
  if (errorType === "blocked_size") return "blocked_size";
  if (errorType === "blocked_type") return "blocked_type";
  return "failed";
}

export async function POST(request: Request) {
  try {
    requireInternalJob(request);
    if (!isWhatsAppMediaDownloadEnabled()) {
      return Response.json({ error: "O download de mídias está desativado." }, { status: 503 });
    }
    const supabase = getSupabaseAdmin();
    const { error: requeueError } = await supabase
      .from("whatsapp_media")
      .update({ download_status: "pending", download_error_type: "stale_download_requeued", updated_at: new Date().toISOString() })
      .eq("download_status", "downloading")
      .lt("updated_at", new Date(Date.now() - 15 * 60_000).toISOString());
    if (requeueError) throw requeueError;
    const requestedLimit = Number(new URL(request.url).searchParams.get("limit"));
    const limit = Number.isInteger(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 20) : 10;
    const { data, error } = await supabase
      .from("whatsapp_media")
      .select("id,user_id,conversation_id,message_id,contact_id,whatsapp_media_id,media_type,original_filename")
      .eq("direction", "inbound")
      .eq("download_status", "pending")
      .order("created_at", { ascending: true })
      .limit(limit);
    if (error) throw error;

    const results = [];
    for (const media of (data || []) as PendingMedia[]) {
      const { data: claimed, error: claimError } = await supabase
        .from("whatsapp_media")
        .update({ download_status: "downloading", updated_at: new Date().toISOString() })
        .eq("id", media.id)
        .eq("download_status", "pending")
        .select("id")
        .maybeSingle();
      if (claimError) throw claimError;
      if (!claimed) continue;
      await writeWhatsAppAudit({ userId: media.user_id, action: "media_download_attempted", status: "attempted", conversationId: media.conversation_id, messageId: media.message_id, mediaId: media.id });
      try {
        const [{ data: conversation }, { data: message }] = await Promise.all([
          supabase.from("whatsapp_conversations").select("id").eq("id", media.conversation_id).eq("user_id", media.user_id).eq("contact_id", media.contact_id).maybeSingle(),
          media.message_id
            ? supabase.from("whatsapp_messages").select("id").eq("id", media.message_id).eq("user_id", media.user_id).eq("conversation_id", media.conversation_id).maybeSingle()
            : Promise.resolve({ data: null })
        ]);
        if (!conversation || !message) throw new WhatsAppMediaError("Referências da mídia inválidas.", 409, "media_reference_mismatch");
        if (!media.whatsapp_media_id) throw new WhatsAppMediaError("Identificador da mídia ausente.", 409, "provider_media_id_missing");
        if (!["image", "document"].includes(media.media_type)) {
          await supabase.from("whatsapp_media").update({ download_status: "skipped_unsupported", download_error_type: "metadata_only", updated_at: new Date().toISOString() }).eq("id", media.id);
          await writeWhatsAppAudit({ userId: media.user_id, action: "media_blocked_type", status: "skipped_unsupported", conversationId: media.conversation_id, messageId: media.message_id, mediaId: media.id, errorType: "metadata_only" });
          results.push({ id: media.id, status: "skipped_unsupported" });
          continue;
        }
        const metadata = await getWhatsAppMediaMetadata(media.whatsapp_media_id);
        await supabase.from("whatsapp_media").update({ mime_type: metadata.mimeType, sha256: metadata.sha256, file_size: metadata.fileSize, updated_at: new Date().toISOString() }).eq("id", media.id);
        validateWhatsAppMediaType({ mediaType: media.media_type, mimeType: metadata.mimeType, filename: media.original_filename });
        validateWhatsAppMediaSize(metadata.fileSize);
        const downloaded = await downloadWhatsAppMedia({ mediaId: media.whatsapp_media_id, mediaType: media.media_type, filename: media.original_filename, metadata });
        const stored = await storeWhatsAppMediaFile({ userId: media.user_id, mediaId: media.id, buffer: downloaded.buffer, mimeType: metadata.mimeType });
        await supabase.from("whatsapp_media").update({
          storage_bucket: stored.bucket,
          storage_path: stored.path,
          download_status: "downloaded",
          download_error_type: null,
          scanned_status: "unavailable",
          updated_at: new Date().toISOString()
        }).eq("id", media.id);
        await Promise.all([
          writeWhatsAppAudit({ userId: media.user_id, action: "media_downloaded", status: "downloaded", conversationId: media.conversation_id, messageId: media.message_id, mediaId: media.id }),
          trackServerAppEvent({
            user_id: media.user_id,
            event_name: "whatsapp_media_downloaded",
            page: "/api/internal/whatsapp/download-media",
            source: "internal_job",
            metadata: { media_type: media.media_type, mime_group: metadata.mimeType.split("/")[0], status: "downloaded" }
          })
        ]);
        results.push({ id: media.id, status: "downloaded" });
      } catch (mediaError) {
        const errorType = mediaError instanceof WhatsAppMediaError ? mediaError.errorType : "media_download_failed";
        const status = blockedStatus(errorType);
        await supabase.from("whatsapp_media").update({ download_status: status, download_error_type: errorType, scanned_status: status === "blocked_type" ? "blocked" : "unavailable", updated_at: new Date().toISOString() }).eq("id", media.id);
        const action = status === "blocked_size" ? "media_blocked_size" : status === "blocked_type" ? "media_blocked_type" : "media_download_failed";
        await writeWhatsAppAudit({ userId: media.user_id, action, status, errorType, conversationId: media.conversation_id, messageId: media.message_id, mediaId: media.id });
        await trackServerAppEvent({
          user_id: media.user_id,
          event_name: status === "blocked_size" ? "whatsapp_media_blocked_size" : status === "blocked_type" ? "whatsapp_media_blocked_type" : "whatsapp_media_send_failed",
          page: "/api/internal/whatsapp/download-media",
          source: "internal_job",
          metadata: { media_type: media.media_type, status, error_type: errorType }
        });
        serverLog({ level: "warn", event: "whatsapp_media_download_failed", route: "/api/internal/whatsapp/download-media", metadata: { error_type: errorType, media_type: media.media_type } });
        results.push({ id: media.id, status });
      }
    }
    return Response.json({ processed: results.length, results });
  } catch (error) {
    return errorResponse(error);
  }
}
