"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090d12] px-4 text-white">
      <section className="max-w-md rounded-lg border border-white/10 bg-[#101821] p-6 text-center shadow-2xl shadow-black/30" role="alert">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">AtendeZap IA</p>
        <h1 className="mt-3 text-2xl font-black">Nao foi possivel carregar esta tela</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Tente novamente em instantes. Se o problema continuar, fale com o suporte informando o horario do erro.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 hover:bg-emerald-300"
        >
          Tentar novamente
        </button>
      </section>
    </main>
  );
}
