import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/errors";
import { logEvent } from "@/lib/events";
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
    source: formData.get("source") || "ebook_page"
  });
}

export async function POST(request: NextRequest) {
  try {
    const lead = await parseLead(request);

    try {
      const supabase = getSupabaseAdmin();
      await supabase.from("ebook_leads").upsert(
        {
          name: lead.name,
          email: lead.email.toLowerCase(),
          whatsapp: lead.whatsapp,
          source: lead.source
        },
        { onConflict: "email" }
      );
    } catch (error) {
      console.error("Falha ao salvar lead do ebook:", error instanceof Error ? error.message : "unknown");
    }

    await logEvent("ebook_lead_created", {
      email_domain: lead.email.split("@")[1],
      source: lead.source
    });

    if (request.headers.get("content-type")?.includes("application/json")) {
      return Response.json({ ok: true, redirectTo: "/ebook/obrigado" });
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
