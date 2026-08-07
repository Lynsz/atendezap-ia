import { z } from "zod";
import { requireUser } from "@/lib/auth/server";
import { errorResponse } from "@/lib/errors";
import { getWhatsAppSafeStatus, getWhatsAppServerConfig } from "@/lib/server/whatsapp";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const connectionSchema = z.object({ businessName: z.string().trim().min(2).max(160) });

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    const supabase = getSupabaseAdmin();
    const { data: connection } = await supabase
      .from("whatsapp_connections")
      .select("id,business_name,display_phone_number,status,connection_status,connection_source,last_healthcheck_at,last_error_type,created_at,updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return Response.json({ environment: getWhatsAppSafeStatus(), connection });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const input = connectionSchema.parse(await request.json());
    const config = getWhatsAppServerConfig();
    const supabase = getSupabaseAdmin();
    const { data: occupied, error: occupiedError } = await supabase
      .from("whatsapp_connections")
      .select("user_id")
      .eq("phone_number_id", config.phoneNumberId)
      .maybeSingle();
    if (occupiedError) throw occupiedError;
    if (occupied && occupied.user_id !== user.id) {
      return Response.json({ error: "Este número já pertence a outra conta." }, { status: 409 });
    }
    const values = {
      user_id: user.id,
      business_name: input.businessName,
      phone_number_id: config.phoneNumberId,
      business_account_id: config.businessAccountId,
      whatsapp_business_account_id: config.businessAccountId,
      connection_source: "env_global",
      connection_status: "connected",
      status: "active",
      updated_at: new Date().toISOString()
    };
    const query = occupied
      ? supabase.from("whatsapp_connections").update(values).eq("phone_number_id", config.phoneNumberId).eq("user_id", user.id)
      : supabase.from("whatsapp_connections").insert(values);
    const { data, error } = await query
      .select("id,business_name,display_phone_number,status,connection_status,connection_source,last_healthcheck_at,last_error_type,created_at,updated_at,user_id")
      .single();
    if (error || !data) throw error || new Error("connection_not_saved");
    return Response.json(
      {
        connection: {
          id: data.id,
          business_name: data.business_name,
          display_phone_number: data.display_phone_number,
          status: data.status,
          created_at: data.created_at,
          updated_at: data.updated_at
        }
      },
      { status: occupied ? 200 : 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
