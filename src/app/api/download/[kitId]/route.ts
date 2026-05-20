import { NextRequest } from "next/server";
import { errorResponse, AppError } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { serverLog } from "@/lib/logger";
import { renderKitPdfBuffer } from "@/lib/pdf";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ kitId: string }> }) {
  try {
    await enforceRateLimit({ request, route: "api:download-kit", limit: 30, windowMs: 10 * 60_000 });
    const { kitId } = await params;
    if (!/^[0-9a-fA-F-]{36}$/.test(kitId)) throw new AppError("Kit invalido.", 400);
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
    serverLog({ event: "pdf_downloaded", route: "/api/download/[kitId]", status: "ok", metadata: { kit_id: kit.id } });
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    serverLog({ level: "warn", event: "pdf_download_failed", route: "/api/download/[kitId]", error });
    return errorResponse(error);
  }
}
