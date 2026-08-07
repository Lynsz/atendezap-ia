"use client";

import Link from "next/link";
import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import EmbeddedSignupButton from "@/components/whatsapp/embedded-signup-button";

export default function WhatsAppOnboardingPage() {
  const [completed, setCompleted] = useState(false);
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#090d12] px-4 py-8 text-slate-100">
        <section className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#101821] p-6 md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">WhatsApp oficial</p>
          <h1 className="mt-3 text-3xl font-black">Conecte o WhatsApp Business do seu negócio</h1>
          <p className="mt-4 leading-7 text-slate-300">Conecte sua conta oficial do WhatsApp Business para receber mensagens e enviar respostas aprovadas pelo app.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-white/10 bg-black/20 p-5"><h2 className="font-black">Pré-requisitos</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300"><li>Conta Meta Business com acesso administrativo.</li><li>Conta WhatsApp Business e número que possa ser validado.</li><li>Permissões de gerenciamento e mensagens.</li></ul></article>
            <article className="rounded-xl border border-white/10 bg-black/20 p-5"><h2 className="font-black">O que será conectado</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300"><li>Seu Business Account e Phone Number ID.</li><li>Webhooks, templates e envio manual do seu negócio.</li><li>Credencial criptografada e isolada por usuário.</li></ul></article>
          </div>
          <div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-6 text-amber-100"><p>O AtendeZap IA não faz disparos automáticos.</p><p>Você continua responsável por respeitar opt-in, políticas da Meta e janela de atendimento.</p></div>
          <div className="mt-6">
            {completed ? <div role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-emerald-200"><p className="font-black">WhatsApp conectado com sucesso.</p><Link href="/dashboard/whatsapp/configuracao" className="mt-3 inline-block underline">Ver configuração</Link></div> : <EmbeddedSignupButton onComplete={() => setCompleted(true)} />}
          </div>
          <Link href="/dashboard/whatsapp/configuracao" className="mt-6 inline-block text-sm font-bold text-slate-300 underline">Voltar para configuração</Link>
        </section>
      </main>
    </ProtectedRoute>
  );
}
