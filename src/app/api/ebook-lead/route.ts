import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { sendEbookDeliveryEmail } from "@/lib/email";
import { ebookLeadSchema } from "@/lib/validators";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

async function parseLead(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return ebookLeadSchema.parse(await request.json());
  }

  const formData = await request.formData();
  return ebookLeadSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    business_type: formData.get("business_type"),
    source: formData.get("source") || "ebook_page",
    utm_source: formData.get("utm_source"),
    utm_medium: formData.get("utm_medium"),
    utm_campaign: formData.get("utm_campaign"),
    utm_content: formData.get("utm_content"),
    utm_term: formData.get("utm_term")
  });
}

export async function POST(request: NextRequest) {
  try {
    const lead = await parseLead(request);
    const normalizedEmail = lead.email.toLowerCase();
    let leadId: string | null = null;
    let supabase: ReturnType<typeof getSupabaseAdmin> | null = null;

    try {
      supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("ebook_leads")
        .upsert(
          {
            name: lead.name,
            email: normalizedEmail,
            whatsapp: lead.whatsapp || null,
            business_type: lead.business_type,
            source: lead.source,
            utm_source: lead.utm_source || null,
            utm_medium: lead.utm_medium || null,
            utm_campaign: lead.utm_campaign || null,
            utm_content: lead.utm_content || null,
            utm_term: lead.utm_term || null
          },
          { onConflict: "email" }
        )
        .select("id")
        .single();

      if (error) throw error;
      leadId = (data?.id as string | undefined) || null;
    } catch (error) {
      console.error("Falha ao salvar lead do ebook:", error instanceof Error ? error.message : "unknown");
    }

    const emailResult = await sendEbookDeliveryEmail({
      name: lead.name,
      email: normalizedEmail
    });

    try {
      if (!supabase) supabase = getSupabaseAdmin();
      await supabase.from("lead_email_events").insert({
        lead_id: leadId,
        email: normalizedEmail,
        event_type: emailResult.eventType,
        subject: emailResult.subject,
        status: emailResult.status,
        provider: emailResult.provider || "resend",
        provider_message_id: emailResult.providerMessageId || null,
        sent_at: emailResult.status === "sent" ? new Date().toISOString() : null,
        error: emailResult.status === "failed" || emailResult.status === "skipped" ? emailResult.error || null : null
      });
    } catch (error) {
      console.error("Falha ao registrar envio do ebook:", error instanceof Error ? error.message : "unknown");
    }

    await logEvent("ebook_lead_created", {
      email_domain: lead.email.split("@")[1],
      source: lead.source,
      business_type: lead.business_type,
      utm_source: lead.utm_source,
      utm_campaign: lead.utm_campaign,
      email_delivery_status: emailResult.status
    });

    if (request.headers.get("content-type")?.includes("application/json")) {
      return Response.json({
        ok: true,
        redirectTo: "/ebook/obrigado",
        message:
          emailResult.status === "sent"
            ? "Guia enviado para o seu e-mail."
            : "Lead cadastrado. Você também pode acessar o guia na próxima página.",
        emailStatus: emailResult.status
      });
    }

    return NextResponse.redirect(new URL("/ebook/obrigado", request.url), { status: 303 });
  } catch (error) {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.redirect(new URL("/ebook?erro=dados", request.url), { status: 303 });
    }
    return errorResponse(error);
  }
}

export function GET() {
  return Response.json({ error: "Método não permitido. Use POST." }, { status: 405 });
}
