"use client";

import { ArrowRight, CheckCircle2, Home, LogIn, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCheckoutUrl } from "@/config/checkout";
import { createDemoAccess } from "@/utils/authStorage";
import { hasCompletedOnboarding } from "@/utils/onboardingStorage";

export default function ThankYouPage() {
  const router = useRouter();
  const proCheckoutUrl = getCheckoutUrl("pro");

  function handleDemoAccess() {
    createDemoAccess("pro");
    router.push(hasCompletedOnboarding() ? "/dashboard" : "/onboarding");
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-16 text-slate-100">
      <section className="mx-auto max-w-4xl rounded-lg border border-white/10 bg-[#101821] p-6 text-center shadow-2xl shadow-black/30 md:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Obrigado</p>
        <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Seu guia foi liberado.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
          Agora você pode dar o próximo passo: transformar respostas prontas em respostas personalizadas com IA.
        </p>

        <div className="mt-8 rounded-lg border border-emerald-300/30 bg-emerald-400/10 p-6 text-left">
          <h2 className="flex items-center gap-2 text-2xl font-black text-white">
            <Sparkles className="h-5 w-5 text-emerald-300" />
            Comece com o Plano Pro por R$ 29 no primeiro mês. Depois, R$ 97/mês.
          </h2>
          <p className="mt-3 text-sm font-bold leading-6 text-slate-300">Oferta válida para novos usuários.</p>
          <div className="mt-6 grid gap-3 text-sm leading-6 text-slate-200 md:grid-cols-2">
            {["Até 600 respostas com IA por mês", "Histórico completo", "Organização de clientes", "Modelos por tipo de atendimento"].map((item) => (
              <div className="flex items-center gap-2 rounded-md bg-white/[0.04] p-3" key={item}>
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.04] p-5 text-left">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-white">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            Como funciona a próxima etapa
          </h2>
          <ol className="grid gap-3 text-sm leading-6 text-slate-300">
            <li className="rounded-md bg-white/[0.04] p-3">1. Baixe e use o guia gratuito para respostas rápidas.</li>
            <li className="rounded-md bg-white/[0.04] p-3">2. Se quiser personalizar com IA, escolha o Plano Pro.</li>
            <li className="rounded-md bg-white/[0.04] p-3">3. Cadastre sua atividade e gere respostas prontas para revisar e copiar.</li>
          </ol>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {proCheckoutUrl ? (
            <a
              href={proCheckoutUrl}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
            >
              Começar por R$ 29
              <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/precos")}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
            >
              Começar por R$ 29
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleDemoAccess}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/10"
          >
            <LogIn className="h-4 w-4" />
            Acessar painel demo
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/10"
          >
            <Home className="h-4 w-4" />
            Página inicial
          </button>
        </div>

        <p className="mt-6 text-xs leading-5 text-slate-500">
          A assinatura recorrente do SaaS e liberada pelo Asaas. A Kiwify pode continuar no funil do guia, order bump e origem do lead.
        </p>
      </section>
    </main>
  );
}
