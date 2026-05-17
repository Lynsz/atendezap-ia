import { ArrowRight, CheckCircle2, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/button";
import { getCheckoutUrl } from "@/config/checkout";

export const metadata = {
  title: "Guia liberado - AtendeZap IA"
};

const nextSteps = [
  "Use o guia para responder dúvidas frequentes com mais clareza.",
  "Adapte os modelos ao seu serviço, produto ou atividade.",
  "Use o AtendeZap IA para transformar respostas prontas em respostas personalizadas com IA."
];

export default function EbookThankYouPage() {
  const proCheckoutUrl = getCheckoutUrl("pro");

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-16 text-slate-100">
      <section className="mx-auto max-w-4xl rounded-lg border border-white/10 bg-[#101821] p-6 text-center shadow-2xl shadow-black/30 md:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Guia gratuito</p>
        <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Seu guia foi liberado.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
          Agora você pode dar o próximo passo: transformar respostas prontas em respostas personalizadas com IA.
        </p>

        <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
          {nextSteps.map((step) => (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={step}>
              <FileText className="mb-3 h-5 w-5 text-emerald-300" />
              <p className="text-sm font-bold leading-6 text-slate-200">{step}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-emerald-300/30 bg-emerald-400/10 p-6 text-left">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-200">
                <Sparkles className="h-4 w-4" />
                Plano Pro
              </p>
              <h2 className="text-2xl font-black text-white">Comece com o Plano Pro por R$ 29 no primeiro mês. Depois, R$ 97/mês.</h2>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-300">Oferta válida para novos usuários.</p>
            </div>
            {proCheckoutUrl ? (
              <a
                href={proCheckoutUrl}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
              >
                Começar por R$ 29
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <Button href="/precos" className="shrink-0 bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                Ver planos
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/ebook/guia" variant="ghost">
            Abrir guia
          </Button>
          <Button href="/precos" variant="ghost">
            Ver todos os planos
          </Button>
        </div>
      </section>
    </main>
  );
}
