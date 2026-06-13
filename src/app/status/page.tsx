import Link from "next/link";
import { CheckCircle2, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Status do sistema | AtendeZap IA",
  description: "Status simples do AtendeZap IA para teste beta.",
  robots: {
    index: false,
    follow: false
  }
};

function isConfigured(value?: string) {
  return Boolean(value?.trim());
}

function StatusRow({ label, configured, detail }: { label: string; configured: boolean; detail: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-black text-white">{label}</p>
        <p className="mt-1 text-sm leading-6 text-slate-400">{detail}</p>
      </div>
      <span className={`inline-flex min-h-9 items-center justify-center rounded-full border px-3 text-xs font-black ${configured ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100" : "border-amber-400/30 bg-amber-400/10 text-amber-100"}`}>
        {configured ? "Configurado" : "Nao configurado"}
      </span>
    </div>
  );
}

export default function StatusPage() {
  const statuses = [
    {
      label: "Sistema",
      configured: true,
      detail: "Aplicacao carregando normalmente neste ambiente."
    },
    {
      label: "Supabase",
      configured: isConfigured(process.env.NEXT_PUBLIC_SUPABASE_URL) && isConfigured(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      detail: "Conexao publica configurada para autenticacao e dados."
    },
    {
      label: "IA",
      configured: isConfigured(process.env.OPENAI_API_KEY),
      detail: "Chave de IA presente no servidor para gerar respostas."
    },
    {
      label: "Stripe",
      configured: isConfigured(process.env.STRIPE_SECRET_KEY),
      detail: "Checkout e assinatura podem ser iniciados quando as variaveis do Stripe estiverem presentes."
    }
  ];

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-10 text-slate-100">
      <section className="mx-auto max-w-4xl">
        <div className="mb-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Status</p>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Status do sistema</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            Visao simples para o beta. Esta pagina mostra apenas se os servicos principais estao configurados, sem expor valores de variaveis, tokens ou dados internos.
          </p>
        </div>

        <div className="grid gap-3">
          {statuses.map((status) => (
            <StatusRow key={status.label} {...status} />
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-50">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>Este status nao executa chamadas caras nem mostra secrets. Para diagnostico tecnico, use tambem o endpoint interno /api/health.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/suporte" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 text-sm font-black text-slate-950 hover:bg-emerald-300">
            <HelpCircle className="h-4 w-4" />
            Abrir suporte
          </Link>
          <Link href="/dashboard" className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 bg-white/10 px-4 text-sm font-bold text-slate-100 hover:bg-white/15">
            Voltar ao dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
