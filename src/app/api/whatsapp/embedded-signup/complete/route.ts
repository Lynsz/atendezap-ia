import { z } from "zod";
import { trackServerAppEvent } from "@/lib/analytics/server";
import { requireUser } from "@/lib/auth/server";
import { AppError, errorResponse } from "@/lib/errors";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  assertMinimumWhatsAppPermissions,
  debugMetaToken,
  exchangeCodeForAccessToken,
  getOwnedWhatsAppBusinessAccounts,
  getWhatsAppPhoneNumbers,
  normalizeEmbeddedSignupError,
  subscribeAppToWaba,
  verifyEmbeddedSignupState
} from "@/lib/server/meta-embedded-signup";
import { encryptSecret, maskSecret } from "@/lib/server/secure-token-store";
import { writeWhatsAppAudit } from "@/lib/server/whatsapp-audit";
import { writeWhatsAppConnectionEvent } from "@/lib/server/whatsapp-connection-events";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const completeSchema = z.object({
  code: z.string().trim().min(8).max(4096),
  state: z.string().trim().min(20).max(4096),
  wabaId: z.string().regex(/^\d{5,40}$/).optional(),
  phoneNumberId: z.string().regex(/^\d{5,40}$/).optional()
}).strict();

export async function POST(request: Request) {
  let userId: string | undefined;
  let connectionId: string | undefined;
  let tokenExchangeStarted = false;
  let tokenExchangeCompleted = false;
  try {
    const user = await requireUser(request);
    userId = user.id;
    await enforceRateLimit({ request, route: "api:whatsapp-embedded-signup-complete", identifier: user.id, limit: 5, windowMs: 10 * 60_000 });
    const input = completeSchema.parse(await request.json());
    verifyEmbeddedSignupState(input.state, user.id);
    await writeWhatsAppAudit({ userId: user.id, action: "token_exchange_started", status: "started" });
    tokenExchangeStarted = true;
    const exchanged = await exchangeCodeForAccessToken(input.code);
    const debug = await debugMetaToken(exchanged.accessToken);
    assertMinimumWhatsAppPermissions(debug.permissions);
    tokenExchangeCompleted = true;
    await Promise.all([
      writeWhatsAppConnectionEvent({ userId: user.id, eventType: "token_exchanged", status: "completed" }),
      writeWhatsAppAudit({ userId: user.id, action: "token_exchange_completed", status: "completed" })
    ]);

    const wabas = await getOwnedWhatsAppBusinessAccounts(exchanged.accessToken, debug.userId);
    const selectedWaba = input.wabaId ? wabas.find((item) => item.wabaId === input.wabaId) : wabas.length === 1 ? wabas[0] : null;
    if (!selectedWaba) throw new AppError("Selecione novamente a conta WhatsApp Business autorizada na Meta.", 409);
    const phones = await getWhatsAppPhoneNumbers({ accessToken: exchanged.accessToken, wabaId: selectedWaba.wabaId });
    const selectedPhone = input.phoneNumberId ? phones.find((item) => item.id === input.phoneNumberId) : phones.length === 1 ? phones[0] : null;
    if (!selectedPhone) throw new AppError("Selecione novamente o número autorizado na Meta.", 409);

    const supabase = getSupabaseAdmin();
    const [{ data: occupied, error: occupiedError }, { data: existing, error: existingError }] = await Promise.all([
      supabase.from("whatsapp_connections").select("id,user_id").eq("phone_number_id", selectedPhone.id).maybeSingle(),
      supabase.from("whatsapp_connections").select("id,user_id").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(1).maybeSingle()
    ]);
    if (occupiedError || existingError) throw occupiedError || existingError;
    if (occupied && occupied.user_id !== user.id) throw new AppError("Este número do WhatsApp já está conectado a outro negócio.", 409);

    // Valida a assinatura antes de substituir qualquer credencial anterior.
    await subscribeAppToWaba({ accessToken: exchanged.accessToken, wabaId: selectedWaba.wabaId });

    const now = new Date().toISOString();
    const values = {
      user_id: user.id,
      business_name: selectedWaba.wabaName || selectedWaba.businessName,
      connection_source: "embedded_signup",
      connection_status: "connected",
      meta_business_id: selectedWaba.metaBusinessId,
      business_account_id: selectedWaba.wabaId,
      whatsapp_business_account_id: selectedWaba.wabaId,
      phone_number_id: selectedPhone.id,
      display_phone_number: selectedPhone.displayPhoneNumber,
      verified_name: selectedPhone.verifiedName,
      quality_rating: selectedPhone.qualityRating,
      messaging_limit_tier: selectedPhone.messagingLimitTier,
      access_token_encrypted: encryptSecret(exchanged.accessToken),
      token_expires_at: debug.expiresAt || exchanged.expiresAt,
      permissions: debug.permissions,
      status: "active",
      last_error_type: null,
      disconnected_at: null,
      updated_at: now
    };
    const target = occupied || existing;
    const query = target
      ? supabase.from("whatsapp_connections").update(values).eq("id", target.id).eq("user_id", user.id)
      : supabase.from("whatsapp_connections").insert(values);
    const { data: connection, error: saveError } = await query.select("id,business_name,connection_status,display_phone_number,phone_number_id").single();
    if (saveError || !connection) throw saveError || new Error("connection_not_saved");
    connectionId = connection.id;
    await Promise.all([
      writeWhatsAppConnectionEvent({ userId: user.id, connectionId, eventType: "signup_completed", status: "completed" }),
      writeWhatsAppConnectionEvent({ userId: user.id, connectionId, eventType: "phone_number_linked", status: "completed" }),
      writeWhatsAppConnectionEvent({ userId: user.id, connectionId, eventType: "connection_verified", status: "connected" }),
      writeWhatsAppAudit({ userId: user.id, connectionId, action: "embedded_signup_completed", status: "connected" }),
      writeWhatsAppAudit({ userId: user.id, connectionId, action: target ? "connection_updated" : "connection_created", status: "connected" }),
      trackServerAppEvent({ user_id: user.id, event_name: "whatsapp_embedded_signup_completed", page: "/dashboard/whatsapp/onboarding", source: "embedded_signup", metadata: { status: "connected", connection_source: "embedded_signup", has_phone_number: true, has_waba: true } }),
      trackServerAppEvent({ user_id: user.id, event_name: "whatsapp_connection_created", page: "/dashboard/whatsapp/onboarding", source: "embedded_signup", metadata: { status: "connected", connection_source: "embedded_signup", has_phone_number: true, has_waba: true } })
    ]);
    return Response.json({
      connection: {
        id: connection.id,
        status: connection.connection_status,
        businessName: connection.business_name,
        displayPhone: connection.display_phone_number ? maskSecret(connection.display_phone_number) : null,
        phoneNumberId: maskSecret(connection.phone_number_id)
      }
    }, { status: target ? 200 : 201, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const normalized = normalizeEmbeddedSignupError(error);
    if (userId) {
      const writes = [
        writeWhatsAppConnectionEvent({ userId, connectionId, eventType: "connection_failed", status: "failed", errorType: "embedded_signup_failed" }),
        writeWhatsAppAudit({ userId, connectionId, action: "embedded_signup_failed", status: "failed", errorType: "embedded_signup_failed" }),
        trackServerAppEvent({ user_id: userId, event_name: "whatsapp_embedded_signup_failed", page: "/dashboard/whatsapp/onboarding", source: "embedded_signup", metadata: { status: "failed", error_type: "embedded_signup_failed", connection_source: "embedded_signup" } })
      ];
      if (tokenExchangeStarted && !tokenExchangeCompleted) {
        writes.push(writeWhatsAppAudit({ userId, connectionId, action: "token_exchange_failed", status: "failed", errorType: "token_exchange_failed" }));
      }
      await Promise.all(writes);
    }
    return errorResponse(normalized);
  }
}
