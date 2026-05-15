import { Card } from "@/components/card";
import { SupportForm } from "@/components/support-form";

export default function SupportPage() {
  const supportEmail = process.env.SUPPORT_EMAIL || "suporte@seudominio.com";

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-14 md:grid-cols-[0.8fr_1.2fr]">
      <div>
        <h1 className="text-3xl font-black text-ink">Suporte</h1>
        <p className="mt-4 leading-7 text-slate-600">
          Envie sua dúvida pelo formulário ou pelo e-mail <strong>{supportEmail}</strong>. Não prometemos atendimento
          instantâneo, mas acompanhamos as solicitações para ajudar no acesso ao produto.
        </p>
      </div>
      <Card>
        <SupportForm />
      </Card>
    </main>
  );
}
