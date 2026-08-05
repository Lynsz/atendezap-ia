import { z } from "zod";
import { requireUser } from "@/lib/auth/server";
import { errorResponse } from "@/lib/errors";
import { buildSafeMediaPreviewUrl } from "@/lib/server/whatsapp-media";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(request);
    const { id } = await context.params;
    z.string().uuid().parse(id);
    const supabase = getSupabaseAdmin();
    const { data: conversation, error: conversationError } = await supabase.from("whatsapp_conversations").select("id").eq("id", id).eq("user_id", user.id).maybeSingle();
    if (conversationError) throw conversationError;
    if (!conversation) return Response.json({ error: "Conversa não encontrada." }, { status: 404 });
    const { data, error } = await supabase
      .from("whatsapp_media")
      .select("id,message_id,direction,media_type,mime_type,file_size,original_filename,download_status,scanned_status,created_at")
      .eq("conversation_id", id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) throw error;
    return Response.json({
      media: (data || []).map((item) => ({
        id: item.id,
        message_id: item.message_id,
        direction: item.direction,
        media_type: item.media_type,
        mime_type: item.mime_type,
        filename: item.original_filename,
        file_size: item.file_size,
        download_status: item.download_status,
        created_at: item.created_at,
        preview_url: item.download_status === "downloaded" && !["suspicious", "blocked"].includes(item.scanned_status) ? buildSafeMediaPreviewUrl(item.id) : null
      }))
    });
  } catch (error) {
    return errorResponse(error);
  }
}
