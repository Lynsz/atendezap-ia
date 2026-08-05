import { z } from "zod";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { requireUser } from "@/lib/auth/server";
import { errorResponse } from "@/lib/errors";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import { readStoredWhatsAppMediaFile } from "@/lib/server/whatsapp-media";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeFilename(value: string | null, mimeType: string) {
  const fallback = mimeType.startsWith("image/") ? "imagem" : "documento";
  return (value || fallback).replace(/[\r\n";\\/]/g, "_").slice(0, 120) || fallback;
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(request);
    const { id } = await context.params;
    z.string().uuid().parse(id);
    const { data: media, error } = await getSupabaseAdmin()
      .from("whatsapp_media")
      .select("id,user_id,conversation_id,message_id,media_type,mime_type,original_filename,file_size,storage_bucket,storage_path,download_status,scanned_status")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw error;
    if (!media) return Response.json({ error: "Mídia não encontrada." }, { status: 404 });
    if (media.download_status !== "downloaded" || !media.storage_bucket || !media.storage_path) return Response.json({ error: "Arquivo ainda não está disponível." }, { status: 409 });
    if (["suspicious", "blocked"].includes(media.scanned_status)) return Response.json({ error: "Este arquivo foi bloqueado por segurança." }, { status: 403 });
    const buffer = await readStoredWhatsAppMediaFile({ bucket: media.storage_bucket, path: media.storage_path });
    const mimeType = media.mime_type || "application/octet-stream";
    const filename = safeFilename(media.original_filename, mimeType);
    const asciiFilename = filename.replace(/[^\x20-\x7e]/g, "_");
    const download = new URL(request.url).searchParams.get("download") === "1" || !mimeType.startsWith("image/");
    await Promise.all([
      writeWhatsAppAudit({ userId: user.id, action: "media_preview_opened", status: download ? "downloaded" : "previewed", conversationId: media.conversation_id, messageId: media.message_id, mediaId: media.id }),
      trackServerAppEvent({ user_id: user.id, event_name: "whatsapp_media_preview_opened", page: "/dashboard/whatsapp", source: "dashboard", metadata: { media_type: media.media_type, mime_group: mimeType.split("/")[0], status: download ? "download" : "preview" } })
    ]);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(buffer.length),
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Cache-Control": "private, no-store, max-age=0",
        "Content-Security-Policy": "default-src 'none'; sandbox",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY"
      }
    });
  } catch (error) {
    return errorResponse(error);
  }
}
