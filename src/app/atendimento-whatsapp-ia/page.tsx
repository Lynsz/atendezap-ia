import { ArrowRight, CheckCircle2, HelpCircle, MessageCircle, Sparkles, Timer, Zap } from "lucide-react";
import { StripeCheckoutButton } from "@/components/checkout/StripeCheckoutButton";
import { TrackOnMount } from "@/components/tracking/TrackOnMount";
import { TrackedLink } from "@/components/tracking/TrackedLink";

export const metadata = {
  title: "IA para atendimento no WhatsApp",
  description:
    "Teste o AtendeZap IA: respostas rapidas, profissionais e personalizadas para quem atende, vende ou presta servico pelo WhatsApp.",
  alternates: {
    canonical: "/atendimento-whatsapp-ia"
  },
  openGraph: {
    title: "IA para atendimento no WhatsApp",
    description:
      "Crie respostas melhores para WhatsApp com inteligencia artificial, sem conectar seu WhatsApp."
  }
};

const audience = ["Autonomos", "Prestadores de servico", "Pequenos negocios", "Delivery", "Estetica", "Lojas pequenas", "Assistencia tecnica", "Vendedores pelo WhatsApp"];

const proofPoints = [
  "Demo gratuita para testar uma resposta antes de criar conta.",
  "A IA nao envia mensagens sozinha: voce revisa, copia e envia.",
  "Planos mensais gerenciados pelo Stripe, com cancelamento pelo portal."
];

const valuePoints = [
  {
    title: "Dor principal",
    description: "Respostas repetidas tomam tempo e atrasam vendas.",
    icon: Timer
  },
  {
    title: "Como ajuda",
    description: "A IA cria uma sugestao clara para voce revisar e enviar.",
    icon: Sparkles
  },
  {
    title: "Sem automacao arriscada",
    description: "Voce mantem controle da conversa no WhatsApp.",
    icon: CheckCircle2
  }
];

const faqs = [
  {
    question: "Preciso conectar meu WhatsApp?",
    answer: "Nao. O AtendeZap IA gera sugestoes de resposta para voce copiar, ajustar e enviar manualmente pelo WhatsApp."
  },
  {
    question: "Serve para autonomos?",
    answer: "Sim. A ferramenta foi pensada para pessoas que atendem clientes sozinhas, prestadores de servico e pequenos negocios."
  },
  {
    question: "Como funciona o Pro por R$ 29?",
    answer: "Novos usuarios do Plano Pro pagam R$ 29 no primeiro mes. Depois, a assinatura continua no valor mensal normal."
  },
  {
    question: "Posso testar antes de pagar?",
    answer: "Sim. Use a demo gratuita e baixe o guia para entender o valor antes de escolher um plano."
  }
];

export default function CampaignPage() {
  return (
    <main className="bg-slate-50">
      <TrackOnMount eventName="campaign_view" source="ads_campaign" funnel="ads" properties={{ page: "atendimento_whatsapp_ia" }} />

      <section className="bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_58%,#ecfeff_100%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
              Atendimento no WhatsApp com IA
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-ink md:text-6xl">
              Responda clientes mais rapido sem perder o tom profissional
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              O AtendeZap IA ajuda quem atende pelo WhatsApp a criar respostas rapidas, profissionais e personalizadas com inteligencia artificial.
            </p>
            <p className="mt-4 max-w-2xl text-base font-bold leading-7 text-slate-700">
              Feito para autonomos, prestadores de servico, pequenos negocios e pessoas que vendem ou atendem pelo WhatsApp.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <TrackedLink
                href="/demo"
                eventName="campaign_demo_cta_click"
                properties={{ section: "campaign_hero", destination: "demo" }}
                className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 focus:ring-emerald-500"
              >
                Testar demo gratis
                <Sparkles className="ml-2 h-4 w-4" />
              </TrackedLink>
              <TrackedLink
                href="/ebook"
                eventName="campaign_ebook_cta_click"
                properties={{ section: "campaign_hero", destination: "ebook" }}
                className="bg-white text-ink ring-1 ring-slate-200 hover:bg-slate-50 focus:ring-brand-500"
              >
                Baixar guia gratuito
              </TrackedLink>
              <TrackedLink
                href="/precos#planos"
                eventName="campaign_pricing_cta_click"
                properties={{ section: "campaign_hero", destination: "pricing" }}
                className="bg-slate-950 text-white hover:bg-slate-800 focus:ring-slate-900"
              >
                Ver planos
                <ArrowRight className="ml-2 h-4 w-4" />
              </TrackedLink>
            </div>
          </div>

          <div className="rounded-lg border border-white/80 bg-white/80 p-5 shadow-2xl shadow-emerald-950/10">
            <div className="rounded-lg bg-[#090d12] p-5 text-white">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Valor em segundos</p>
                  <h2 className="mt-1 text-2xl font-black">Pergunta do cliente vira resposta pronta</h2>
                </div>
                <MessageCircle className="h-8 w-8 text-emerald-300" />
              </div>
              <div className="grid gap-3">
                <div className="rounded-md border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-slate-300">
                  Cliente: Qual o valor e voces atendem hoje?
                </div>
                <div className="rounded-md border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm leading-7 text-emerald-50">
                  Oi! Consigo te ajudar sim. Me conta qual servico voce precisa e eu ja te passo as opcoes, valores e horarios disponiveis para hoje.
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Digite", "Gere", "Copie"].map((item) => (
                  <div className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-center text-xs font-black text-slate-300" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 md:grid-cols-3">
          {valuePoints.map(({ title, description, icon: Icon }) => (
            <article className="rounded-lg border border-slate-200 bg-slate-50 p-5" key={title}>
              <Icon className="mb-4 h-6 w-6 text-emerald-600" />
              <h2 className="text-lg font-black text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Para quem e</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">Para quem usa WhatsApp como canal de atendimento ou venda</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              A campanha inicial deve validar se esses publicos entendem a oferta, usam a demo, deixam lead e avancam para cadastro ou checkout.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {audience.map((item) => (
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#090d12] py-14 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">Oferta inicial</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Plano Pro com primeiro mes por R$ 29 para novos usuarios</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Melhor custo-beneficio para validar uso diario. Depois do primeiro mes, a assinatura continua no valor mensal normal e pode ser gerenciada pelo Stripe.
            </p>
            <div className="mt-6 max-w-sm">
              <TrackedLink
                href="/precos#planos"
                eventName="campaign_pro_cta_click"
                properties={{ section: "campaign_pro_offer", destination: "pricing", plan: "pro" }}
                className="mb-3 w-full bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15 focus:ring-emerald-300"
              >
                Entender oferta do Pro
              </TrackedLink>
              <StripeCheckoutButton planId="pro" recommended label="Assinar Pro" />
            </div>
          </div>
          <div className="grid gap-3">
            {proofPoints.map((point) => (
              <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4" key={point}>
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <p className="text-sm font-bold leading-6 text-slate-200">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center gap-3">
            <HelpCircle className="h-7 w-7 text-emerald-600" />
            <h2 className="text-3xl font-black tracking-tight text-ink">Duvidas rapidas</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <article className="rounded-lg border border-slate-200 bg-slate-50 p-5" key={faq.question}>
                <h3 className="font-black text-ink">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <TrackedLink
              href="/demo"
              eventName="campaign_demo_cta_click"
              properties={{ section: "campaign_final", destination: "demo" }}
              className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 focus:ring-emerald-500"
            >
              Testar demo gratis
              <Zap className="ml-2 h-4 w-4" />
            </TrackedLink>
            <TrackedLink
              href="/cadastro"
              eventName="campaign_signup_cta_click"
              properties={{ section: "campaign_final", destination: "signup" }}
              className="bg-slate-950 text-white hover:bg-slate-800 focus:ring-slate-900"
            >
              Criar minha conta
            </TrackedLink>
          </div>
        </div>
      </section>
    </main>
  );
}
