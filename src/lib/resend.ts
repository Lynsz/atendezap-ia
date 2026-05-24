import "server-only";

import { Resend } from "resend";
import { appUrl } from "@/lib/utils";

function resendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !from) return null;
  return new Resend(apiKey);
}

function emailFrom() {
  return process.env.EMAIL_FROM?.trim() || "";
}

export async function sendAccessEmail({ email, name, token }: { email: string; name?: string | null; token: string }) {
  const client = resendClient();
  if (!client) return { skipped: true };

  const link = `${appUrl()}/gerar/${token}`;
  await client.emails.send({
    from: emailFrom(),
    to: email,
    subject: "Seu acesso ao AtendeZap IA esta liberado",
    text: `Ola, ${name || "tudo bem"}.

Seu pagamento foi confirmado.

Clique no link abaixo para gerar seu kit de atendimento para WhatsApp Business:

${link}

Voce so precisa preencher as informacoes do seu negocio e baixar o PDF gerado automaticamente.`
  });

  return { skipped: false };
}

export async function sendKitReadyEmail({ email, kitId }: { email: string; kitId: string }) {
  const client = resendClient();
  if (!client) return { skipped: true };

  const link = `${appUrl()}/kit/${kitId}`;
  await client.emails.send({
    from: emailFrom(),
    to: email,
    subject: "Seu kit de atendimento esta pronto",
    text: `Ola.

Seu kit foi gerado com sucesso.

Voce pode acessar e baixar seu PDF pelo link:

${link}`
  });

  return { skipped: false };
}
