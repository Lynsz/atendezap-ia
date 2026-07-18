import { requireUser } from "@/lib/auth/server";
import { errorResponse } from "@/lib/errors";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    const { data, error } = await getSupabaseAdmin()
      .from("whatsapp_templates")
      .select("id,name,language,category,status,variables_count,updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return Response.json({ templates: data || [] });
  } catch (error) {
    return errorResponse(error);
  }
}
