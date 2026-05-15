import { NextRequest } from "next/server";
import { errorResponse, AppError } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { renderKitPdfBuffer } from "@/lib/pdf";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ kitId: string }> }) {
  try {
    const { kitId } = await params;
    const supabase = getSupabaseAdmin();
    const { data: kit, error } = await supabase
      .from("kits")
      .select("id, business_name, ai_output")
      .eq("id", kitId)
      .maybeSingle();

    if (error || !kit) throw new AppError("Kit não encontrado.", 404);

    const buffer = await renderKitPdfBuffer({
      businessName: kit.business_name,
      aiOutput: kit.ai_output as Record<string, unknown>
    });

    const filename = `atendezap-ia-${kit.business_name.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}.pdf`;
    await logEvent("pdf_downloaded", { kit_id: kit.id });
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    return errorResponse(error);
  }
}
