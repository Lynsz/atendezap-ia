import { Resend } from "resend";
import { appUrl } from "@/lib/utils";

function resendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendAccessEmail({ email, name, token }: { email: string; name?: string | null; token: string }) {
  const client = resendClient();
  if (!client) return { skipped: true };

  const link = `${appUrl()}/gerar/${token}`;
  await client.emails.send({
    from: process.env.EMAIL_FROM || "AtendeZap IA <noreply@example.com>",
    to: email,
    subject: "Seu acesso ao AtendeZap IA está liberado",
    text: `Olá, ${name || "tudo bem"}.

Seu pagamento foi confirmado.

Clique no link abaixo para gerar seu kit de atendimento para WhatsApp Business:

${link}

Você só precisa preencher as informações do seu negócio e baixar o PDF gerado automaticamente.`
  });

  return { skipped: false };
}

export async function sendKitReadyEmail({ email, kitId }: { email: string; kitId: string }) {
  const client = resendClient();
  if (!client) return { skipped: true };

  const link = `${appUrl()}/kit/${kitId}`;
  await client.emails.send({
    from: process.env.EMAIL_FROM || "AtendeZap IA <noreply@example.com>",
    to: email,
    subject: "Seu kit de atendimento está pronto",
    text: `Olá.

Seu kit foi gerado com sucesso.

Você pode acessar e baixar seu PDF pelo link:

${link}`
  });

  return { skipped: false };
}
