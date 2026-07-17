import { z } from "zod";
import { requireUser } from "@/lib/auth/server";
import { errorResponse } from "@/lib/errors";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(request);
    const { id } = await context.params;
    z.string().uuid().parse(id);
    const supabase = getSupabaseAdmin();
    const { data: conversation, error } = await supabase
      .from("whatsapp_conversations")
      .select("id,contact_id,status,customer_service_window_until,last_inbound_at,last_outbound_at")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw error;
    if (!conversation) return Response.json({ error: "Conversa não encontrada." }, { status: 404 });

    const [{ data: contact, error: contactError }, { data: messages, error: messagesError }, { data: suggestions, error: suggestionsError }] = await Promise.all([
      supabase.from("whatsapp_contacts").select("id,display_name,phone_number,opt_in_status").eq("id", conversation.contact_id).eq("user_id", user.id).single(),
      supabase
        .from("whatsapp_messages")
        .select("id,direction,message_type,text,status,provider_created_at,created_at")
        .eq("conversation_id", id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(200),
      supabase
        .from("whatsapp_suggested_replies")
        .select("id,source_message_id,suggested_text,status,created_at,updated_at")
        .eq("conversation_id", id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)
    ]);
    if (contactError || messagesError || suggestionsError) throw contactError || messagesError || suggestionsError;
    return Response.json({ conversation, contact, messages, suggestions });
  } catch (error) {
    return errorResponse(error);
  }
}
