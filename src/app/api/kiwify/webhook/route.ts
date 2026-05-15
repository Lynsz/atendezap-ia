import { NextRequest } from "next/server";
import { AppError, errorResponse } from "@/lib/errors";
import { logEvent } from "@/lib/events";
import { normalizeKiwifyPayload } from "@/lib/kiwify";
import { sendAccessEmail } from "@/lib/resend";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { createAccessToken, hashForLog } from "@/lib/tokens";

export const runtime = "nodejs";

function validateWebhookSecret(request: NextRequest) {
  const expected = process.env.KIWIFY_WEBHOOK_SECRET;
  if (!expected) return;

  const received =
    request.headers.get("x-kiwify-webhook-secret") ||
    request.headers.get("x-webhook-secret") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (received !== expected) {
    throw new AppError("Webhook não autorizado.", 401);
  }
}

async function parseWebhookJson(request: NextRequest) {
  try {
    return (await request.json()) as unknown;
  } catch {
    throw new AppError("JSON inválido no webhook da Kiwify.", 400);
  }
}

async function findOrCreateCustomer({
  email,
  name,
  phone
}: {
  email: string;
  name?: string;
  phone?: string;
}) {
  const supabase = getSupabaseAdmin();
  const normalizedEmail = email.trim().toLowerCase();
  const { data: existingCustomer } = await supabase
    .from("purchasers")
    .select("id, email, name")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existingCustomer) {
    const { data: updatedCustomer, error } = await supabase
      .from("purchasers")
      .update({
        name: name || existingCustomer.name,
        phone
      })
      .eq("id", existingCustomer.id)
      .select("id, name, email")
      .single();

    if (error || !updatedCustomer) {
      throw new AppError("Não foi possível atualizar o cliente.", 500);
    }

    return updatedCustomer;
  }

  const { data: customer, error } = await supabase
    .from("purchasers")
    .insert({
      email: normalizedEmail,
      name,
      phone
    })
    .select("id, name, email")
    .single();

  if (error || !customer) {
    throw new AppError("Não foi possível criar o cliente.", 500);
  }

  return customer;
}

export async function POST(request: NextRequest) {
  try {
    validateWebhookSecret(request);
    const payload = await parseWebhookJson(request);
    const normalized = normalizeKiwifyPayload(payload);
    const supabase = getSupabaseAdmin();

    await logEvent("webhook_received", {
      provider: "kiwify",
      order_id: normalized.orderId,
      event: normalized.eventName,
      status: normalized.paymentStatus,
      approved: normalized.isApproved,
      email_domain: normalized.customerEmail.split("@")[1]
    });

    if (!normalized.isApproved) {
      return Response.json({ ok: true, ignored: true, reason: "Evento não aprovado ignorado." });
    }

    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id, access_token")
      .eq("kiwify_order_id", normalized.orderId)
      .maybeSingle();

    if (existingOrder?.access_token) {
      return Response.json({ ok: true, duplicate: true, orderId: existingOrder.id });
    }

    const customer = await findOrCreateCustomer({
      email: normalized.customerEmail,
      name: normalized.customerName,
      phone: normalized.customerPhone
    });

    const accessToken = createAccessToken();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customer.id,
        kiwify_order_id: normalized.orderId,
        kiwify_payload: payload,
        status: "approved",
        product_name: normalized.productName,
        amount: normalized.amount,
        access_token: accessToken,
        approved_at: new Date().toISOString()
      })
      .select("id")
      .single();

    if (orderError || !order) {
      const { data: duplicatedOrder } = await supabase
        .from("orders")
        .select("id")
        .eq("kiwify_order_id", normalized.orderId)
        .maybeSingle();

      if (duplicatedOrder?.id) {
        return Response.json({ ok: true, duplicate: true, orderId: duplicatedOrder.id });
      }

      throw new AppError("Não foi possível criar o pedido.", 500);
    }

    await logEvent("order_approved", {
      order_id: order.id,
      kiwify_order_id: normalized.orderId,
      amount: normalized.amount,
      product_name: normalized.productName
    });

    let emailSkipped = false;
    try {
      const emailResult = await sendAccessEmail({ email: customer.email, name: customer.name, token: accessToken });
      emailSkipped = Boolean(emailResult.skipped);
      await logEvent(emailSkipped ? "access_email_failed" : "access_email_sent", {
        order_id: order.id,
        token_hash: hashForLog(accessToken),
        skipped: emailSkipped
      });
    } catch (emailError) {
      await logEvent("access_email_failed", {
        order_id: order.id,
        token_hash: hashForLog(accessToken),
        error: emailError instanceof Error ? emailError.message : "unknown"
      });

      return Response.json({
        ok: true,
        orderId: order.id,
        emailSent: false,
        message: "Pagamento recebido, mas houve falha ao enviar o e-mail. Consulte o suporte."
      });
    }

    return Response.json({ ok: true, orderId: order.id, emailSent: !emailSkipped, emailSkipped });
  } catch (error) {
    return errorResponse(error);
  }
}

export function GET() {
  return Response.json({ error: "Método não permitido. Use POST." }, { status: 405 });
}
