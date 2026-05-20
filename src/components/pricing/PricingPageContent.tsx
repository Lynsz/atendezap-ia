import {
  DemoEbookSection,
  FaqSection,
  FinalCtaSection,
  ObjectionsSection,
  PlanComparisonSection
} from "@/components/conversion/ConversionSections";
import { PricingSection } from "@/components/pricing/PricingSection";
import { TrackedLink } from "@/components/tracking/TrackedLink";

export function PricingPageContent() {
  return (
    <main className="bg-[#090d12] text-white">
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">Planos</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
          Planos para responder melhor no WhatsApp com IA
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">
          Escolha entre Starter, Pro e Premium conforme sua rotina de atendimento. O Pro é o plano mais recomendado
          para quem responde clientes todos os dias.
        </p>
        <p className="mx-auto mt-5 inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-100">
          Primeiro mês por R$ 29 para novos usuários. Depois, R$ 97/mês.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <TrackedLink
            href="#planos"
            eventName="pricing_cta_click"
            properties={{ section: "pricing_hero", destination: "plans" }}
            className="bg-emerald-400 text-slate-950 hover:bg-emerald-300 focus:ring-emerald-300"
          >
            Ver planos
          </TrackedLink>
          <TrackedLink
            href="/demo"
            eventName="demo_cta_click"
            properties={{ section: "pricing_hero", destination: "demo" }}
            className="bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15 focus:ring-emerald-300"
          >
            Testar demo grátis
          </TrackedLink>
          <TrackedLink
            href="/ebook"
            eventName="ebook_cta_click"
            properties={{ section: "pricing_hero", destination: "ebook" }}
            className="bg-white text-slate-950 hover:bg-slate-100 focus:ring-emerald-300"
          >
            Baixar guia gratuito
          </TrackedLink>
        </div>
      </section>

      <PricingSection />
      <PlanComparisonSection dark />
      <ObjectionsSection dark />
      <FaqSection dark />
      <DemoEbookSection />

      <section className="mx-auto max-w-6xl px-4 pb-16 text-center">
        <div className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-5">
          <p className="text-sm font-bold leading-6 text-emerald-100">
            A Stripe fica responsável pela cobrança recorrente; o dashboard libera recursos a partir do status salvo no Supabase.
            Se o checkout não iniciar, o botão mostra uma mensagem amigável para tentar novamente.
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-sm leading-6 text-slate-400">
          O AtendeZap IA não é afiliado ao WhatsApp, Meta, Kiwify ou Stripe e não promete resultado financeiro garantido.
        </p>
      </section>

      <FinalCtaSection />
    </main>
  );
}
