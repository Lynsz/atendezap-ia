import "server-only";

import { Resend } from "resend";

export type EmailSendStatus = "sent" | "skipped_not_configured" | "failed";

export type EmailSendResult = {
  status: EmailSendStatus;
  provider?: "resend";
  providerMessageId?: string;
  error?: string;
};

export type LeadEmailTemplateKey = "ebook_delivery" | "manual_pain" | "value_demo" | "pro_offer";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

type EbookDeliveryEmailInput = {
  name: string;
  email: string;
};

type LeadEmailTemplate = {
  key: LeadEmailTemplateKey;
  subject: string;
  ctaLabel: string;
  description: string;
};

export const leadEmailTemplates: Record<LeadEmailTemplateKey, LeadEmailTemplate> = {
  ebook_delivery: {
    key: "ebook_delivery",
    subject: "Seu guia gratuito do AtendeZap IA esta aqui",
    ctaLabel: "Acessar guia gratuito",
    description: "Entrega o guia gratuito e leva o lead para conhecer o produto."
  },
  manual_pain: {
    key: "manual_pain",
    subject: "Voce ainda responde tudo manualmente no WhatsApp?",
    ctaLabel: "Ver como o AtendeZap IA funciona",
    description: "Mostra a dor do atendimento manual e apresenta o caminho simples com IA."
  },
  value_demo: {
    key: "value_demo",
    subject: "Exemplos de respostas prontas com IA para seus clientes",
    ctaLabel: "Criar minha conta no AtendeZap IA",
    description: "Demonstra valor com exemplos de respostas e chama para cadastro."
  },
  pro_offer: {
    key: "pro_offer",
    subject: "Comece com o Plano Pro por R$ 29 no primeiro mes",
    ctaLabel: "Assinar Plano Pro",
    description: "Apresenta a oferta permanente do Pro para novos usuarios."
  }
};

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getEmailFrom() {
  return process.env.EMAIL_FROM?.trim() || null;
}

function getPublicAppUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl.replace(/\/$/, "")}`;

  if (process.env.NODE_ENV !== "production") return "http://localhost:3000";

  throw new Error("NEXT_PUBLIC_APP_URL nao configurada para montar links de e-mail.");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendTransactionalEmail({ to, subject, text, html }: SendEmailInput): Promise<EmailSendResult> {
  const client = getResendClient();
  if (!client) {
    return {
      status: "skipped_not_configured",
      provider: "resend",
      error: "RESEND_API_KEY nao configurada."
    };
  }

  const from = getEmailFrom();
  if (!from) {
    return {
      status: "skipped_not_configured",
      provider: "resend",
      error: "EMAIL_FROM nao configurado."
    };
  }

  try {
    const response = await client.emails.send({
      from,
      to,
      subject,
      text,
      html
    });

    if (response.error) {
      return {
        status: "failed",
        provider: "resend",
        error: response.error.message || "Falha ao enviar e-mail pelo Resend."
      };
    }

    return {
      status: "sent",
      provider: "resend",
      providerMessageId: response.data?.id
    };
  } catch (error) {
    return {
      status: "failed",
      provider: "resend",
      error: error instanceof Error ? error.message : "Falha desconhecida ao enviar e-mail."
    };
  }
}

export function buildEbookDeliveryEmail({ name, email }: EbookDeliveryEmailInput) {
  const firstName = name.trim().split(/\s+/)[0] || "tudo bem";
  const guideUrl = `${getPublicAppUrl()}/ebook/guia`;
  const demoUrl = `${getPublicAppUrl()}/demo`;
  const pricingUrl = `${getPublicAppUrl()}/precos`;
  const signupUrl = `${getPublicAppUrl()}/cadastro`;
  const safeFirstName = escapeHtml(firstName);

  return {
    eventType: leadEmailTemplates.ebook_delivery.key,
    subject: leadEmailTemplates.ebook_delivery.subject,
    text: `Ola, ${firstName}.

Seu guia gratuito do AtendeZap IA esta aqui:
${guideUrl}

Voce acabou de dar o primeiro passo para responder clientes mais rapido no WhatsApp usando IA.

O guia mostra exemplos praticos de respostas prontas, erros comuns no atendimento e como organizar perguntas frequentes.

Depois de ler, teste o AtendeZap IA para criar sua conta, configurar seu atendimento e gerar respostas personalizadas:
${demoUrl}

Planos:
${pricingUrl}

Se preferir criar sua conta agora:
${signupUrl}

AtendeZap IA`,
    html: `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 12px;">
                <p style="margin:0 0 10px;color:#047857;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Guia gratuito</p>
                <h1 style="margin:0;color:#0f172a;font-size:28px;line-height:1.2;">Seu guia gratuito esta aqui</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 24px;color:#334155;font-size:16px;line-height:1.65;">
                <p>Ola, ${safeFirstName}.</p>
                <p>Voce acabou de dar o primeiro passo para responder clientes mais rapido no WhatsApp usando IA.</p>
                <p>O guia traz exemplos praticos de respostas prontas, erros comuns no atendimento e formas simples de organizar perguntas frequentes.</p>
                <p style="margin:26px 0;">
                  <a href="${guideUrl}" style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;font-weight:700;border-radius:8px;padding:12px 18px;">Acessar guia gratuito</a>
                </p>
                <p>Depois, conheca o AtendeZap IA para configurar seu atendimento e gerar respostas personalizadas para copiar e enviar no WhatsApp.</p>
                <p style="margin:22px 0;">
                  <a href="${demoUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;font-weight:700;border-radius:8px;padding:12px 18px;">Testar o AtendeZap IA</a>
                </p>
                <p style="font-size:14px;color:#475569;">Tambem pode ver os <a href="${pricingUrl}" style="color:#047857;font-weight:700;">planos</a> ou <a href="${signupUrl}" style="color:#047857;font-weight:700;">criar sua conta</a>.</p>
                <p style="font-size:13px;color:#64748b;">Este e-mail foi enviado porque ${escapeHtml(email)} solicitou o guia gratuito do AtendeZap IA.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
  };
}

export async function sendEbookDeliveryEmail(input: EbookDeliveryEmailInput) {
  const email = buildEbookDeliveryEmail(input);
  const result = await sendTransactionalEmail({
    to: input.email,
    subject: email.subject,
    text: email.text,
    html: email.html
  });

  return {
    ...result,
    eventType: email.eventType,
    subject: email.subject
  };
}
