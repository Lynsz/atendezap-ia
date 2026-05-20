import { ArrowRight, CheckCircle2, MessageCircle, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/badge";
import {
  AudienceProofSection,
  BenefitsSection,
  DemoEbookSection,
  FaqSection,
  FinalCtaSection,
  HowItWorksSection,
  ObjectionsSection,
  PlanComparisonSection,
  PricingPlanCards,
  ProblemsSection
} from "@/components/conversion/ConversionSections";
import { TrackOnMount } from "@/components/tracking/TrackOnMount";
import { TrackedLink } from "@/components/tracking/TrackedLink";

export const metadata = {
  title: "AtendeZap IA — Respostas com IA para WhatsApp",
  description:
    "Crie respostas rápidas e profissionais para clientes no WhatsApp com ajuda da IA. Ideal para autônomos, prestadores de serviço e pequenos negócios.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "AtendeZap IA — Respostas com IA para WhatsApp",
    description:
      "Crie respostas rápidas e profissionais para clientes no WhatsApp com ajuda da IA. Ideal para autônomos, prestadores de serviço e pequenos negócios."
  }
};

export default function Home() {
  return (
    <main className="bg-slate-50">
      <TrackOnMount eventName="landing_view" properties={{ page: "home" }} source="landing_page" funnel="landing" />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#d1fae5,transparent_34%),linear-gradient(135deg,#ffffff_0%,#f8fafc_58%,#ecfeff_100%)]">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-20">
          <div>
            <Badge>IA para atendimento no WhatsApp</Badge>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-ink md:text-6xl">
              Responda clientes no WhatsApp mais rápido com ajuda da IA
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Crie respostas prontas, organize seu atendimento e economize tempo todos os dias, mesmo trabalhando sozinho.
            </p>
            <p className="mt-4 max-w-2xl text-base font-bold leading-7 text-slate-700">
              O AtendeZap IA ajuda quem atende pelo WhatsApp a criar respostas rápidas, profissionais e personalizadas com inteligência artificial.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                href="/cadastro"
                eventName="hero_cta_click"
                properties={{ section: "hero", destination: "signup" }}
                className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 focus:ring-emerald-500"
              >
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </TrackedLink>
              <TrackedLink
                href="/demo"
                eventName="demo_cta_click"
                properties={{ section: "hero", destination: "demo" }}
                className="bg-white text-ink ring-1 ring-slate-200 hover:bg-slate-50 focus:ring-brand-500"
              >
                Testar demo grátis
                <Sparkles className="ml-2 h-4 w-4" />
              </TrackedLink>
            </div>
            <p className="mt-5 inline-flex rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">
              Feito para autônomos, prestadores de serviço e pequenos negócios.
            </p>
          </div>

          <div className="rounded-lg border border-white/80 bg-white/75 p-4 shadow-2xl shadow-emerald-950/10 backdrop-blur">
            <div className="rounded-lg bg-[#090d12] p-5 text-white shadow-xl">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Resposta gerada</p>
                  <h2 className="mt-1 text-xl font-black">WhatsApp pronto</h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-400 text-slate-950">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4 text-sm leading-7 text-slate-200">
                Oi, Ana! Consigo te ajudar sim. Posso te passar as opções e valores certinhos. Você prefere receber o
                orçamento por aqui ou quer me contar primeiro qual serviço precisa?
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {["Pergunta", "IA", "Copiar"].map((item) => (
                  <div
                    className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-center text-xs font-black text-slate-300"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4">
                <div className="flex items-start gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  <p>Você mantém controle da conversa: a IA sugere, você revisa e envia pelo WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-3">
          {[
            "Para quem responde clientes todos os dias",
            "Demo pública para testar sem compromisso",
            "Ebook gratuito para melhorar o atendimento"
          ].map((item) => (
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4" key={item}>
              <Zap className="h-5 w-5 shrink-0 text-emerald-500" />
              <p className="text-sm font-black text-ink">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <ProblemsSection />
      <HowItWorksSection />
      <BenefitsSection />
      <AudienceProofSection />
      <DemoEbookSection />
      <PricingPlanCards />
      <PlanComparisonSection />
      <ObjectionsSection />
      <FaqSection />

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <MessageCircle className="mb-4 h-7 w-7 text-emerald-600" />
              <h2 className="text-2xl font-black text-ink">Quer ver o valor antes de assinar?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Teste uma resposta agora na demo pública ou baixe o guia gratuito para melhorar seu atendimento pelo WhatsApp com IA.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-0">
              <TrackedLink
                href="/demo"
                eventName="demo_cta_click"
                properties={{ section: "after_pricing", destination: "demo" }}
                className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 focus:ring-emerald-500"
              >
                Testar demo grátis
              </TrackedLink>
              <TrackedLink
                href="/ebook"
                eventName="ebook_cta_click"
                properties={{ section: "after_pricing", destination: "ebook" }}
                className="bg-white text-ink ring-1 ring-slate-200 hover:bg-slate-50 focus:ring-brand-500"
              >
                Baixar guia gratuito
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <FinalCtaSection />
    </main>
  );
}
