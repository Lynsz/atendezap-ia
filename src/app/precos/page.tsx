import { PricingSection } from "@/components/pricing/PricingSection";

export default function PricingPage() {
  return (
    <main>
      <PricingSection />
      <section className="bg-[#090d12] px-4 pb-16 text-center">
        <p className="mx-auto max-w-3xl text-sm leading-6 text-slate-400">
          Os planos do AtendeZap IA são cobrados mensalmente pela Kiwify, conforme o plano escolhido. O AtendeZap IA não
          é afiliado ao WhatsApp, Meta ou Kiwify e não promete aumento de vendas ou resultado financeiro.
        </p>
      </section>
    </main>
  );
}
