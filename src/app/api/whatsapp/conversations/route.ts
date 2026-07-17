import { requireUser } from "@/lib/auth/server";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { errorResponse } from "@/lib/errors";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    const supabase = getSupabaseAdmin();
    const { data: conversations, error } = await supabase
      .from("whatsapp_conversations")
      .select("id,contact_id,status,customer_service_window_until,last_inbound_at,last_outbound_at,updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) throw error;

    const contactIds = [...new Set((conversations || []).map((item) => item.contact_id))];
    const { data: contacts, error: contactsError } = contactIds.length
      ? await supabase.from("whatsapp_contacts").select("id,display_name,phone_number,opt_in_status,last_message_at").eq("user_id", user.id).in("id", contactIds)
      : { data: [], error: null };
    if (contactsError) throw contactsError;
    const contactMap = new Map((contacts || []).map((item) => [item.id, item]));
    const conversationIds = (conversations || []).map((item) => item.id);
    const { data: recentMessages, error: recentMessagesError } = conversationIds.length
      ? await supabase
          .from("whatsapp_messages")
          .select("conversation_id,text,message_type,created_at")
          .eq("user_id", user.id)
          .in("conversation_id", conversationIds)
          .order("created_at", { ascending: false })
          .limit(500)
      : { data: [], error: null };
    if (recentMessagesError) throw recentMessagesError;
    const latestByConversation = new Map<string, { text: string | null; message_type: string; created_at: string }>();
    for (const message of recentMessages || []) {
      if (!latestByConversation.has(message.conversation_id)) latestByConversation.set(message.conversation_id, message);
    }

    await trackServerAppEvent({
      user_id: user.id,
      event_name: "whatsapp_conversation_viewed",
      page: "/dashboard/whatsapp",
      source: "dashboard",
      metadata: { status: "list" }
    });
    return Response.json({
      conversations: (conversations || []).map((item) => ({
        ...item,
        contact: contactMap.get(item.contact_id) || null,
        last_message: latestByConversation.has(item.id)
          ? { ...latestByConversation.get(item.id), text: latestByConversation.get(item.id)?.text?.slice(0, 160) || null }
          : null,
        window_open: Boolean(item.customer_service_window_until && new Date(item.customer_service_window_until).getTime() > Date.now())
      }))
    });
  } catch (error) {
    return errorResponse(error);
  }
}
