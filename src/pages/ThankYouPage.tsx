"use client";

import { CheckCircle2, Home, LogIn, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { createDemoAccess } from "@/utils/authStorage";
import { hasCompletedOnboarding } from "@/utils/onboardingStorage";

export default function ThankYouPage() {
  const router = useRouter();

  function handleDemoAccess() {
    createDemoAccess("starter");
    router.push(hasCompletedOnboarding() ? "/app" : "/onboarding");
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-16 text-slate-100">
      <section className="mx-auto max-w-3xl rounded-lg border border-white/10 bg-[#101821] p-6 text-center shadow-2xl shadow-black/30 md:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Kiwify</p>
        <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Compra quase finalizada</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
          Seu pagamento está sendo processado pela Kiwify. Assim que a confirmação acontecer, você poderá acessar o
          painel do AtendeZap IA e começar a organizar seus atendimentos.
        </p>

        <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.04] p-5 text-left">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-white">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            Próximos passos
          </h2>
          <ol className="grid gap-3 text-sm leading-6 text-slate-300">
            <li className="rounded-md bg-white/[0.04] p-3">1. Confirme o pagamento na Kiwify.</li>
            <li className="rounded-md bg-white/[0.04] p-3">2. Aguarde a confirmação.</li>
            <li className="rounded-md bg-white/[0.04] p-3">3. Acesse o painel do AtendeZap IA.</li>
          </ol>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleDemoAccess}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
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
            Voltar para a página inicial
          </button>
        </div>

        <p className="mt-6 text-xs leading-5 text-slate-500">
          Configure a URL de obrigado na Kiwify como `/obrigado` quando publicar o projeto.
        </p>
      </section>
    </main>
  );
}
