import { ArrowRight, BookOpen, CheckCircle2, Copy, MessageCircle, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/badge";
import { NicheFaq } from "@/components/marketing/NicheFaq";
import { TrackOnMount } from "@/components/tracking/TrackOnMount";
import { TrackedLink } from "@/components/tracking/TrackedLink";
import type { NicheLanding } from "@/config/niches";

const primaryCta = "bg-emerald-500 text-slate-950 hover:bg-emerald-400 focus:ring-emerald-500";
const secondaryCta = "bg-white text-ink ring-1 ring-slate-200 hover:bg-slate-50 focus:ring-brand-500";
const darkCta = "bg-slate-950 text-white hover:bg-slate-800 focus:ring-slate-900";

type NicheLandingPageProps = {
  niche: NicheLanding;
};

function ctaProps(niche: NicheLanding, cta: string) {
  return {
    niche: niche.slug,
    cta,
    source: "niche_landing"
  };
}

export function NicheLandingPage({ niche }: NicheLandingPageProps) {
  return (
    <main className="bg-slate-50">
      <TrackOnMount
        eventName="niche_page_view"
        properties={{ niche: niche.slug, source: "niche_landing" }}
        source="niche_landing"
        funnel={`niche_${niche.slug}`}
      />

      <section className="bg-[radial-gradient(circle_at_top_left,#d1fae5,transparent_34%),linear-gradient(135deg,#ffffff_0%,#f8fafc_60%,#ecfeff_100%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <Badge>{niche.label}</Badge>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-ink md:text-6xl">{niche.headline}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{niche.subheadline}</p>
            <p className="mt-4 max-w-2xl text-base font-bold leading-7 text-slate-700">
              O AtendeZap IA gera sugestoes de respostas para voce revisar, copiar, ajustar e enviar pelo WhatsApp.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <TrackedLink href="/demo" eventName="niche_demo_cta_click" secondaryEventName="niche_to_demo_click" properties={ctaProps(niche, "demo")} className={primaryCta}>
                Testar demo gratis
                <Sparkles className="ml-2 h-4 w-4" />
              </TrackedLink>
              <TrackedLink href="/cadastro" eventName="niche_signup_cta_click" secondaryEventName="niche_to_signup_click" properties={ctaProps(niche, "signup")} className={darkCta}>
                Criar minha conta
                <ArrowRight className="ml-2 h-4 w-4" />
              </TrackedLink>
              <TrackedLink href="/ebook" eventName="niche_ebook_cta_click" properties={ctaProps(niche, "ebook")} className={secondaryCta}>
                Baixar guia gratuito
              </TrackedLink>
              <TrackedLink href="/precos" eventName="niche_pricing_cta_click" secondaryEventName="niche_to_pricing_click" properties={ctaProps(niche, "pricing")} className={secondaryCta}>
                Ver planos
              </TrackedLink>
            </div>
          </div>

          <div className="rounded-lg border border-white/80 bg-white/80 p-4 shadow-2xl shadow-emerald-950/10">
            <div className="rounded-lg bg-[#090d12] p-5 text-white">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Exemplo seguro</p>
                  <h2 className="mt-1 text-xl font-black">Resposta para {niche.name}</h2>
                </div>
                <MessageCircle className="h-6 w-6 text-emerald-300" />
              </div>
              <p className="rounded-md border border-white/10 bg-white/[0.06] p-4 text-sm leading-7 text-slate-200">
                {niche.safeResponseExample}
              </p>
              <div className="mt-5 rounded-md border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-50">
                A resposta nao inventa preco, prazo, estoque, garantia ou agenda. Voce adapta com as informacoes reais do seu atendimento.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Dor principal</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink">{niche.mainPain}</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">{niche.mainPromise}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {niche.examples.map((example) => (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-black text-ink" key={example}>
                {example}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Como funciona</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-ink">Da pergunta repetida para uma resposta pronta</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ["1", "Escolha o contexto", `Use o tipo de atendimento de ${niche.name.toLowerCase()}.`],
              ["2", "Cole a pergunta", "Insira a duvida recebida no WhatsApp."],
              ["3", "Revise a resposta", "Confira dados como valor, prazo, agenda e disponibilidade."],
              ["4", "Copie e envie", "Envie manualmente pelo WhatsApp mantendo controle da conversa."]
            ].map(([step, title, description]) => (
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={step}>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-emerald-100 text-sm font-black text-emerald-800">{step}</span>
                <h3 className="mt-4 font-black text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-2">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Beneficios</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink">Mais clareza sem automatizar seu WhatsApp</h2>
            <div className="mt-8 grid gap-3">
              {niche.benefits.map((benefit) => (
                <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4" key={benefit}>
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <p className="font-bold text-ink">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <Copy className="mb-4 h-7 w-7 text-emerald-600" />
            <h2 className="text-2xl font-black text-ink">Templates recomendados</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Use estes temas como ponto de partida. O texto final deve ser revisado de acordo com seu preco, agenda, local e regras.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {niche.recommendedTemplates.map((template) => (
                <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-slate-700 ring-1 ring-slate-200" key={template}>
                  {template}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#090d12] py-14 text-white">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">Plano Pro</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Primeiro mes por R$ 29 para novos usuarios</h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              O Pro e o plano mais recomendado para quem atende clientes todos os dias e precisa de mais limite mensal de respostas.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <TrackedLink href="/precos#planos" eventName="niche_pricing_cta_click" secondaryEventName="niche_to_pricing_click" properties={ctaProps(niche, "pro_offer")} className={primaryCta}>
              Ver planos
            </TrackedLink>
            <TrackedLink href="/demo" eventName="niche_demo_cta_click" secondaryEventName="niche_to_demo_click" properties={ctaProps(niche, "pro_demo")} className="bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15 focus:ring-emerald-300">
              Testar demo gratis
            </TrackedLink>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">FAQ</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-ink">Perguntas frequentes para {niche.name}</h2>
          <NicheFaq niche={niche.slug} items={niche.faq} />
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-6xl rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-8 md:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <BookOpen className="mb-4 h-7 w-7 text-emerald-600" />
              <h2 className="text-2xl font-black text-ink">Teste com uma pergunta real do seu atendimento</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Comece pela demo gratuita, crie conta ou baixe o guia. Nenhuma dessas etapas conecta ou envia mensagens pelo WhatsApp automaticamente.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <TrackedLink href="/demo" eventName="niche_demo_cta_click" secondaryEventName="niche_to_demo_click" properties={ctaProps(niche, "final_demo")} className={primaryCta}>
                Testar demo gratis
              </TrackedLink>
              <TrackedLink href="/cadastro" eventName="niche_signup_cta_click" secondaryEventName="niche_to_signup_click" properties={ctaProps(niche, "final_signup")} className={darkCta}>
                Criar minha conta
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 text-sm font-bold leading-6 text-slate-600">
          <Zap className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          <p>
            Aviso importante: o AtendeZap IA nao envia mensagens automaticamente pelo WhatsApp, nao substitui sua revisao e nao confirma preco,
            prazo, agenda, estoque ou garantia sem dados informados por voce.
          </p>
        </div>
      </section>
    </main>
  );
}
