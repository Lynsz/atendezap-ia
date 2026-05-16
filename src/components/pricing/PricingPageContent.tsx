import { PricingSection } from "@/components/pricing/PricingSection";

export function PricingPageContent() {
  return (
    <main className="bg-[#090d12] text-white">
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">Planos</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
          Escolha o plano certo para o seu volume de atendimento
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">
          O Inicial é bom para começar. O Pro é melhor para quem atende mais clientes. O Premium fica reservado para a próxima fase com WhatsApp conectado.
        </p>
      </section>

      <PricingSection />

      <section className="mx-auto max-w-6xl px-4 pb-16 text-center">
        <div className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-5">
          <p className="text-sm font-bold leading-6 text-emerald-100">
            A integração automática com WhatsApp será liberada em etapa futura. Nesta versão, você gera a resposta, revisa e copia para enviar.
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-sm leading-6 text-slate-400">
          Os planos do AtendeZap IA são cobrados mensalmente pela Kiwify, conforme o plano escolhido. O AtendeZap IA não é afiliado ao WhatsApp, Meta ou Kiwify e não promete aumento de vendas ou resultado financeiro.
        </p>
      </section>
    </main>
  );
}
