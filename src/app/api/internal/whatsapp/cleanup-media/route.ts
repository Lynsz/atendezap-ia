import { errorResponse } from "@/lib/errors";
import { requireInternalJob } from "@/lib/server/internal-job-auth";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import { getWhatsAppMediaRetentionDays, removeStoredWhatsAppMediaFile } from "@/lib/server/whatsapp-media";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    requireInternalJob(request);
    const supabase = getSupabaseAdmin();
    const cutoff = new Date(Date.now() - getWhatsAppMediaRetentionDays() * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("whatsapp_media")
      .select("id,user_id,conversation_id,message_id,storage_bucket,storage_path")
      .lt("created_at", cutoff)
      .not("storage_path", "is", null)
      .is("removed_at", null)
      .order("created_at", { ascending: true })
      .limit(50);
    if (error) throw error;
    let removed = 0;
    for (const media of data || []) {
      if (!media.storage_bucket || !media.storage_path) continue;
      await removeStoredWhatsAppMediaFile({ bucket: media.storage_bucket, path: media.storage_path });
      const now = new Date().toISOString();
      await supabase.from("whatsapp_media").update({ storage_bucket: null, storage_path: null, download_status: "removed", removed_at: now, updated_at: now }).eq("id", media.id);
      await writeWhatsAppAudit({ userId: media.user_id, action: "media_retention_removed", status: "removed", conversationId: media.conversation_id, messageId: media.message_id, mediaId: media.id });
      removed += 1;
    }
    return Response.json({ processed: (data || []).length, removed });
  } catch (error) {
    return errorResponse(error);
  }
}
