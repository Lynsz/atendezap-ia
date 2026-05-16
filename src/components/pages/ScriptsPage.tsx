"use client";

import { useState } from "react";
import { Clipboard, Copy } from "lucide-react";
import { messageScripts } from "@/data/messageScripts";

const categoryLabels = {
  boas_vindas: "Boas-vindas",
  orcamento: "Orcamento",
  cliente_indeciso: "Cliente indeciso",
  promocao: "Promocao",
  pos_venda: "Pos-venda",
  recuperacao: "Recuperacao",
  horario: "Aviso de horario",
  confirmacao: "Confirmacao de pedido"
};

export default function ScriptsPage() {
  const [feedback, setFeedback] = useState("");

  function copyScript(text: string) {
    void navigator.clipboard?.writeText(text);
    setFeedback("Script copiado.");
    window.setTimeout(() => setFeedback(""), 2500);
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-8 text-slate-100">
      <section className="mx-auto max-w-6xl">
        <header className="mb-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
            <Clipboard className="h-4 w-4" />
            Biblioteca pronta
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Scripts para WhatsApp</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            Modelos simples para copiar, adaptar e enviar enquanto a IA gera respostas personalizadas.
          </p>
        </header>

        {feedback ? (
          <div className="mb-5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-200">
            {feedback}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {messageScripts.map((script) => (
            <article className="flex min-h-64 flex-col rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20" key={script.id}>
              <span className="mb-3 w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200">
                {categoryLabels[script.category]}
              </span>
              <h2 className="text-lg font-black text-white">{script.title}</h2>
              <p className="mt-3 flex-1 whitespace-pre-wrap text-sm leading-6 text-slate-300">{script.text}</p>
              <button
                type="button"
                onClick={() => copyScript(script.text)}
                className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
              >
                <Copy className="h-4 w-4" />
                Copiar
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
