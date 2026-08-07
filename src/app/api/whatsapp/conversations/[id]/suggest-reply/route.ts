import { z } from "zod";
import { assertAiUsageAvailable, getCurrentUsageMonth, incrementAiUsage } from "@/lib/ai-usage";
import { generateWhatsAppConversationReplyWithAi } from "@/lib/ai-response";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { requireUser } from "@/lib/auth/server";
import { AppError, errorResponse } from "@/lib/errors";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getSubscriptionPlanName, getUsageLimit } from "@/lib/usage-limits";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    assertRequestSize(request, 8_192);
    const user = await requireUser(request);
    const { id } = await context.params;
    z.string().uuid().parse(id);
    await enforceRateLimit({ request, route: "api:whatsapp-suggest:user", identifier: user.id, limit: 8, windowMs: 60_000 });

    const supabase = getSupabaseAdmin();
    const { data: conversation, error: conversationError } = await supabase
      .from("whatsapp_conversations")
      .select("id,contact_id,connection_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (conversationError) throw conversationError;
    if (!conversation) throw new AppError("Conversa não encontrada.", 404);

    const [{ data: messages, error: messagesError }, { data: business }, { data: profile }, { data: subscription }] = await Promise.all([
      supabase
        .from("whatsapp_messages")
        .select("id,direction,text")
        .eq("conversation_id", id)
        .eq("user_id", user.id)
        .not("text", "is", null)
        .order("created_at", { ascending: false })
        .limit(12),
      supabase.from("businesses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("user_profiles").select("business_name,business_type,tone,description").eq("user_id", user.id).maybeSingle(),
      supabase
        .from("subscriptions")
        .select("plan_name,plan,status,subscription_status,monthly_limit")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    ]);
    if (messagesError) throw messagesError;
    const history = (messages || [])
      .filter((item): item is { id: string; direction: "inbound" | "outbound"; text: string } =>
        (item.direction === "inbound" || item.direction === "outbound") && typeof item.text === "string"
      )
      .reverse();
    if (!history.length) throw new AppError("Esta conversa ainda não tem mensagens de texto para usar como contexto.", 400);

    const limit = getUsageLimit(subscription);
    const month = getCurrentUsageMonth();
    const { snapshot } = await assertAiUsageAvailable(user.id, limit, month);
    if (snapshot.reachedLimit) throw new AppError("Você atingiu o limite mensal de respostas com IA.", 403);

    const businessData = business
      ? {
          ...business,
          business_name: profile?.business_name || business.business_name,
          business_type: profile?.business_type || business.business_type || business.business_area,
          brand_tone: profile?.tone || business.brand_tone,
          description: profile?.description || business.description
        }
      : {
          business_name: profile?.business_name || "seu negócio",
          business_type: profile?.business_type || "atendimento",
          brand_tone: profile?.tone || "educado e profissional",
          description: profile?.description || "atendimento ao cliente pelo WhatsApp"
        };
    const body = await generateWhatsAppConversationReplyWithAi({
      businessData,
      history: history.map((item) => ({ direction: item.direction, body: item.text }))
    });
    const sourceMessageId = [...history].reverse().find((item) => item.direction === "inbound")?.id || null;
    const { data: suggestion, error: saveError } = await supabase
      .from("whatsapp_suggested_replies")
      .insert({ user_id: user.id, connection_id: conversation.connection_id, conversation_id: id, source_message_id: sourceMessageId, suggested_text: body, status: "draft" })
      .select("id,source_message_id,suggested_text,status,created_at,updated_at")
      .single();
    if (saveError || !suggestion) throw saveError || new Error("suggestion_not_saved");

    const usage = await incrementAiUsage(user.id, limit, month);
    await trackServerAppEvent({
      user_id: user.id,
      event_name: "whatsapp_suggested_reply_generated",
      page: "/dashboard/whatsapp",
      source: "dashboard",
      plan: getSubscriptionPlanName(subscription) || "sem_plano",
      metadata: { status: "suggested", response_length_range: body.length < 300 ? "short" : "medium", usage_count: usage.used, usage_limit: usage.limit }
    });
    return Response.json({ suggestion, usage }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
