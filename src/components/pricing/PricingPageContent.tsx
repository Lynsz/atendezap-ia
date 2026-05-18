import { PricingSection } from "@/components/pricing/PricingSection";

export function PricingPageContent() {
  return (
    <main className="bg-[#090d12] text-white">
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">Planos</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
          Planos para responder melhor no WhatsApp com IA
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">
          Escolha uma opção mensal com cobrança recorrente pela Stripe para gerar respostas mais profissionais,
          economizar tempo no atendimento e manter seus clientes mais organizados. Comece sozinho, sem configuração
          complicada.
        </p>
        <p className="mx-auto mt-5 inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-100">
          Plano Pro por R$ 29 no primeiro mês. Depois, R$ 97/mês.
        </p>
      </section>

      <PricingSection />

      <section className="mx-auto max-w-6xl px-4 pb-16 text-center">
        <div className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-5">
          <p className="text-sm font-bold leading-6 text-emerald-100">
            R$ 29 no primeiro mês para novos usuários. Depois, R$ 97/mês. A Stripe fica responsável pela cobrança
            recorrente; o dashboard libera recursos a partir do status salvo no Supabase.
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-sm leading-6 text-slate-400">
          O AtendeZap IA não é afiliado ao WhatsApp, Meta, Kiwify ou Stripe e não promete resultado financeiro garantido.
        </p>
      </section>
    </main>
  );
}
