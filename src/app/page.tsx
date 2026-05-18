import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  MessageCircle,
  Sparkles,
  Store,
  Users,
  Zap
} from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { PLAN_IDS, SAAS_PLANS } from "@/config/plans";

export const metadata = {
  title: "AtendeZap IA - IA para responder clientes no WhatsApp",
  description:
    "AtendeZap IA ajuda autônomos, prestadores de serviço e pequenos negócios a responder clientes mais rápido no WhatsApp usando inteligência artificial.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "AtendeZap IA - IA para responder clientes no WhatsApp",
    description:
      "Gere respostas profissionais para WhatsApp, organize seu atendimento e economize tempo com IA."
  }
};

const flowSteps = [
  {
    title: "Baixe o guia gratuito",
    description: "Comece com 50 respostas prontas para adaptar ao seu atendimento.",
    icon: BookOpen
  },
  {
    title: "Cadastre sua atividade",
    description: "Informe serviços, preços, horários e tom de voz no AtendeZap IA.",
    icon: Store
  },
  {
    title: "Gere respostas personalizadas",
    description: "Cole a pergunta do cliente e copie uma resposta profissional feita com IA.",
    icon: ClipboardCheck
  }
];

const benefits = [
  "Responda clientes mais rápido com ajuda da IA",
  "Crie respostas prontas para WhatsApp em poucos segundos",
  "Economize tempo no atendimento sem precisar contratar alguem agora",
  "Organize melhor clientes e histórico",
  "Adapte respostas prontas para cada conversa",
  "Use modelos por tipo de atendimento",
  "Mantenha um tom claro e consistente",
  "Comece sozinho, sem configuração complicada"
];

const audiences = [
  "Pessoas autonomas",
  "Prestadores de servico",
  "Lojas locais",
  "Restaurantes e delivery",
  "Saloes de beleza",
  "Clinicas de estetica",
  "Assistencia tecnica",
  "Vendedores",
  "Social media",
  "Infoprodutores",
  "Pequenos negocios",
  "Profissionais que precisam responder clientes mais rapido"
];

const beforeItems = [
  "Demora para responder duvidas simples",
  "Mensagens improvisadas a cada atendimento",
  "Orcamentos enviados sem padrao",
  "Histórico e clientes espalhados"
];

const afterItems = [
  "Respostas prontas para revisar e enviar",
  "Atendimento com tom mais profissional",
  "Clientes e histórico mais organizados",
  "Modelos adaptados pela IA para cada contexto"
];

const plans = PLAN_IDS.map((planId) => SAAS_PLANS[planId]);

const faqs = [
  [
    "Preciso conectar meu WhatsApp?",
    "Não nesta versão. Você cola a pergunta do cliente, gera a resposta e copia para enviar no WhatsApp."
  ],
  [
    "O ebook é para qual tipo de profissional?",
    "Para autônomos, prestadores de serviço, lojas, restaurantes, clínicas, vendedores e qualquer pessoa que atende pelo WhatsApp."
  ],
  [
    "A IA inventa precos ou horarios?",
    "Ela deve usar os dados cadastrados. Quanto mais completo o cadastro, melhor a resposta. Informações ausentes não devem ser inventadas."
  ],
  [
    "O Pro por R$ 29 é uma oferta temporária?",
    "Não. É uma oferta permanente para novos usuários no primeiro mês. Depois, o plano custa R$ 97/mês."
  ],
  [
    "Preciso saber usar tecnologia?",
    "Não. A ideia é ser simples: cadastrar a atividade, colar a pergunta e copiar a resposta."
  ]
];

export default function Home() {
  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#d1fae5,transparent_34%),linear-gradient(135deg,#ffffff_0%,#f8fafc_58%,#ecfeff_100%)]">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-20">
          <div>
            <Badge>IA para atendimento no WhatsApp</Badge>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-ink md:text-6xl">
              Responda no WhatsApp com mais rapidez usando IA
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              O AtendeZap IA ajuda autônomos, prestadores de serviço, lojas, delivery, estética, assistência técnica,
              restaurantes e pequenos negócios a criar respostas mais profissionais e economizar tempo no atendimento.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/ebook">
                Baixar guia gratuito
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button href="/precos" variant="ghost">
                Ver planos
              </Button>
            </div>
            <p className="mt-5 inline-flex rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">
              Comece sozinho: baixe o ebook, conheça o AtendeZap IA e escolha um plano mensal pela Stripe.
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
                  <div className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-center text-xs font-black text-slate-300" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Como funciona</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">Do guia gratuito a resposta personalizada</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {flowSteps.map((step, index) => (
            <Card className="p-6" key={step.title}>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-100 text-brand-700">
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-black text-slate-300">0{index + 1}</span>
              </div>
              <h3 className="text-lg font-black text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="beneficios" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Beneficios</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">Mais clareza, velocidade e organização no atendimento</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <Card className="p-5" key={benefit}>
                <CheckCircle2 className="mb-4 h-5 w-5 text-emerald-500" />
                <p className="font-black text-ink">{benefit}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Para quem serve</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">Para quem usa WhatsApp para atender, vender ou responder duvidas</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((item) => (
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={item}>
              <p className="font-black text-ink">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-2">
          <Card className="border-red-100 bg-red-50 p-6">
            <h2 className="text-2xl font-black text-ink">Antes</h2>
            <ul className="mt-6 grid gap-3">
              {beforeItems.map((item) => (
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700" key={item}>
                  <Clock className="h-4 w-4 text-red-500" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="border-emerald-100 bg-emerald-50 p-6">
            <h2 className="text-2xl font-black text-ink">Depois</h2>
            <ul className="mt-6 grid gap-3">
              {afterItems.map((item) => (
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700" key={item}>
                  <Zap className="h-4 w-4 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section id="planos" className="bg-[#090d12] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">Planos</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Comece simples e evolua quando precisar</h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Escolha um plano e comece pelo WhatsApp. O Pro é o mais recomendado para quem atende, vende ou responde clientes todos os dias.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article className={`rounded-lg border p-6 shadow-2xl shadow-black/25 ${plan.recommended ? "border-emerald-300 bg-[#101821]" : "border-white/10 bg-white/[0.04]"}`} key={plan.id}>
                {plan.recommended ? <Badge className="mb-4 bg-emerald-300 text-slate-950">Mais recomendado</Badge> : null}
                <h3 className="text-2xl font-black">{plan.name}</h3>
                <p className="mt-4 text-3xl font-black">{plan.firstMonthPriceLabel || plan.monthlyPriceLabel}</p>
                {plan.recurringPriceLabel ? <p className="mt-1 text-sm font-black text-emerald-200">{plan.recurringPriceLabel}</p> : null}
                {plan.id === "pro" ? <p className="mt-2 text-xs font-bold text-slate-400">Primeiro mês por R$ 29 para novos usuários.</p> : null}
                <p className="mt-4 min-h-16 text-sm leading-6 text-slate-300">{plan.description}</p>
                <Button href="/precos" className="mt-6 w-full justify-center bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                  Ver planos
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">FAQ</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">Perguntas frequentes</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {faqs.map(([question, answer]) => (
            <Card className="p-6" key={question}>
              <h3 className="font-black text-ink">{question}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-[#090d12] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <Users className="mx-auto mb-5 h-9 w-9 text-emerald-300" />
          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight md:text-5xl">Baixe o guia e veja o próximo passo com IA.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Comece com respostas prontas e depois transforme essas mensagens em respostas personalizadas para seu atendimento.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/ebook" className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">
              Baixar guia gratuito
            </Button>
            <Button href="/precos" variant="ghost">
              Ver planos
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
