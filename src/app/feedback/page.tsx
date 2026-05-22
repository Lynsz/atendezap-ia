import { FeedbackForm } from "@/components/feedback/FeedbackForm";

export const metadata = {
  title: "Feedback",
  description: "Envie feedback, reporte problemas ou sugira melhorias para o AtendeZap IA.",
  robots: {
    index: false,
    follow: false
  }
};

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-10 text-slate-100">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Primeiros usuários</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white md:text-5xl">Ajude a melhorar o AtendeZap IA</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Este canal existe para a fase controlada com poucos usuários. Envie qualquer problema, dúvida ou sugestão que aparecer durante o uso.
          </p>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
            <p className="rounded-md border border-white/10 bg-[#101821] p-3">Se algo impediu cadastro, login, pagamento ou geração de resposta, marque como bug.</p>
            <p className="rounded-md border border-white/10 bg-[#101821] p-3">Se alguma parte ficou confusa, marque como dificuldade de uso.</p>
            <p className="rounded-md border border-white/10 bg-[#101821] p-3">Não envie senhas, chaves, dados de cartão ou informações sensíveis.</p>
          </div>
        </div>

        <FeedbackForm />
      </section>
    </main>
  );
}
