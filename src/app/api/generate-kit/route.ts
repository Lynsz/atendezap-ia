import { NextRequest } from "next/server";
import { AppError, errorResponse } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { serverLog } from "@/lib/logger";
import { generateKitWithOpenAI } from "@/lib/openai";
import { assertRequestSize, enforceRateLimit } from "@/lib/rate-limit";
import { sendKitReadyEmail } from "@/lib/resend";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { hashForLog } from "@/lib/tokens";
import { generateKitSchema } from "@/lib/validators";

export const runtime = "nodejs";
export const maxDuration = 60;

async function parseBody(request: NextRequest) {
  try {
    return generateKitSchema.parse(await request.json());
  } catch (error) {
    throw error;
  }
}

export async function POST(request: NextRequest) {
  let orderId: string | undefined;
  let tokenHash: string | undefined;
  let failureLogged = false;

  try {
    assertRequestSize(request, 32_768);
    const body = await parseBody(request);
    tokenHash = hashForLog(body.token);
    await enforceRateLimit({ request, route: "api:generate-kit", identifier: tokenHash, limit: 3, windowMs: 10 * 60_000 });

    const supabase = getSupabaseAdmin();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, customer_id, access_token_used, purchasers(email)")
      .eq("access_token", body.token)
      .maybeSingle();

    if (orderError || !order) {
      throw new AppError("Não encontramos este acesso. Verifique o link recebido por e-mail.", 404);
    }

    orderId = order.id;

    const { data: existingKit } = await supabase.from("kits").select("id").eq("order_id", order.id).maybeSingle();
    if (existingKit?.id) {
      return Response.json({ ok: true, kitId: existingKit.id, alreadyGenerated: true });
    }

    if (order.access_token_used) {
      throw new AppError("Este acesso já foi usado. Entre em contato com o suporte para recuperar seu kit.", 409);
    }

    await logEvent("kit_generation_started", {
      order_id: order.id,
      token_hash: tokenHash,
      niche: body.formData.niche
    });

    let aiOutput: Record<string, unknown>;
    try {
      aiOutput = await generateKitWithOpenAI(body.formData);
    } catch (aiError) {
      await logEvent("kit_generation_failed", {
        order_id: order.id,
        token_hash: tokenHash,
        stage: "openai",
        error: aiError instanceof Error ? aiError.message : "unknown"
      });
      failureLogged = true;

      throw new AppError("Não conseguimos gerar seu kit agora. Tente novamente em alguns minutos.", 502);
    }

    const { data: kit, error: kitError } = await supabase
      .from("kits")
      .insert({
        customer_id: order.customer_id,
        order_id: order.id,
        business_name: body.formData.businessName,
        niche: body.formData.niche,
        form_data: body.formData,
        ai_output: aiOutput,
        status: "generated"
      })
      .select("id")
      .single();

    if (kitError || !kit) {
      await logEvent("kit_generation_failed", {
        order_id: order.id,
        token_hash: tokenHash,
        stage: "database"
      });
      failureLogged = true;
      throw new AppError("Não foi possível salvar o kit gerado. Tente novamente em alguns minutos.", 500);
    }

    const { error: tokenError } = await supabase.from("orders").update({ access_token_used: true }).eq("id", order.id);
    if (tokenError) {
      await logEvent("kit_generation_failed", {
        order_id: order.id,
        kit_id: kit.id,
        token_hash: tokenHash,
        stage: "mark_token_used"
      });
      failureLogged = true;
      throw new AppError("O kit foi criado, mas houve falha ao finalizar o acesso. Fale com o suporte.", 500);
    }

    const customerRelation = order.purchasers as { email?: string } | { email?: string }[] | null;
    const customerEmail = Array.isArray(customerRelation) ? customerRelation[0]?.email : customerRelation?.email;
    if (customerEmail) {
      try {
        await sendKitReadyEmail({ email: customerEmail, kitId: kit.id });
      } catch (emailError) {
        await logEvent("access_email_failed", {
          order_id: order.id,
          kit_id: kit.id,
          type: "kit_ready",
          error: emailError instanceof Error ? emailError.message : "unknown"
        });
      }
    }

    await logEvent("kit_generation_succeeded", {
      order_id: order.id,
      kit_id: kit.id
    });
    serverLog({ event: "kit_generation_succeeded", route: "/api/generate-kit", status: "ok", metadata: { order_id: order.id, kit_id: kit.id } });

    return Response.json({ ok: true, kitId: kit.id });
  } catch (error) {
    if (!failureLogged && (orderId || tokenHash)) {
      await logEvent("kit_generation_failed", {
        order_id: orderId,
        token_hash: tokenHash,
        error: error instanceof Error ? error.message : "unknown"
      });
    }

    serverLog({ level: "warn", event: "kit_generation_failed", route: "/api/generate-kit", error, metadata: { order_id: orderId, token_hash: tokenHash } });
    return errorResponse(error);
  }
}
