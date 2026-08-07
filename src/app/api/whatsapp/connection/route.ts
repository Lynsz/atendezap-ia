import { requireUser } from "@/lib/auth/server";
import { errorResponse } from "@/lib/errors";
import { getEmbeddedSignupPublicConfig } from "@/lib/server/meta-embedded-signup";
import { maskSecret } from "@/lib/server/secure-token-store";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    const { data, error } = await getSupabaseAdmin()
      .from("whatsapp_connections")
      .select("id,business_name,connection_source,connection_status,whatsapp_business_account_id,business_account_id,phone_number_id,display_phone_number,verified_name,quality_rating,messaging_limit_tier,last_healthcheck_at,last_error_type,token_expires_at,disconnected_at,created_at,updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    const connection = data ? {
      id: data.id,
      status: data.connection_status,
      source: data.connection_source,
      businessName: data.business_name,
      verifiedName: data.verified_name,
      displayPhone: data.display_phone_number ? maskSecret(data.display_phone_number) : null,
      phoneNumberId: maskSecret(data.phone_number_id),
      wabaId: maskSecret(data.whatsapp_business_account_id || data.business_account_id),
      qualityRating: data.quality_rating,
      messagingLimitTier: data.messaging_limit_tier,
      lastHealthcheckAt: data.last_healthcheck_at,
      lastErrorType: data.last_error_type,
      needsReauthorization: data.connection_status === "needs_reauth",
      tokenExpiresAt: data.token_expires_at,
      disconnectedAt: data.disconnected_at,
      updatedAt: data.updated_at
    } : null;
    return Response.json({ embeddedSignup: getEmbeddedSignupPublicConfig(), connection }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
