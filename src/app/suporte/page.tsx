import { Card } from "@/components/card";
import { SupportForm } from "@/components/support-form";

export default function SupportPage() {
  const supportEmail = process.env.SUPPORT_EMAIL || "suporte@atendezapia.com.br";

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-14 md:grid-cols-[0.8fr_1.2fr]">
      <div>
        <h1 className="text-3xl font-black text-ink">Suporte</h1>
        <p className="mt-4 leading-7 text-slate-600">
          Envie sua duvida pelo formulario ou pelo e-mail{" "}
          <a className="font-black text-brand-700 hover:underline" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>
          . Nao prometemos atendimento instantaneo, mas acompanhamos as solicitacoes para ajudar no acesso ao produto.
        </p>
      </div>
      <Card>
        <SupportForm />
      </Card>
    </main>
  );
}
