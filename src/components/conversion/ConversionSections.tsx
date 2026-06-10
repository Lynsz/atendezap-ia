import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  HelpCircle,
  MessageCircle,
  Settings,
  Sparkles,
  Users,
  Zap
} from "lucide-react";
import { Card } from "@/components/card";
import { StripeCheckoutButton } from "@/components/checkout/StripeCheckoutButton";
import { ConversionFaq, type FaqItem } from "@/components/conversion/ConversionFaq";
import { TrackOnMount } from "@/components/tracking/TrackOnMount";
import { TrackedLink } from "@/components/tracking/TrackedLink";
import { PLAN_IDS, SAAS_PLANS, type PlanId } from "@/config/plans";
import { cn } from "@/lib/utils";

const primaryCta =
  "bg-emerald-500 text-slate-950 hover:bg-emerald-400 focus:ring-emerald-500";
const secondaryCta =
  "bg-white text-ink ring-1 ring-slate-200 hover:bg-slate-50 focus:ring-brand-500";
const darkGhostCta =
  "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15 focus:ring-emerald-300";

const problemItems = [
  "Responder as mesmas perguntas todos os dias",
  "Demorar para responder e perder venda",
  "Não saber como responder de forma profissional",
  "Atender clientes fora de hora",
  "Fazer tudo manualmente pelo WhatsApp",
  "Perder tempo montando mensagem do zero"
];

const howItWorksSteps = [
  {
    title: "Configure seu atendimento",
    description: "Cadastre sua atividade, serviços, horários, tom de voz e informações importantes.",
    icon: Settings
  },
  {
    title: "Digite a pergunta do cliente",
    description: "Cole a dúvida recebida no WhatsApp ou descreva o contexto do atendimento.",
    icon: MessageCircle
  },
  {
    title: "A IA gera uma resposta pronta",
    description: "Receba uma sugestão clara, profissional e alinhada com o seu atendimento.",
    icon: Sparkles
  },
  {
    title: "Copie, ajuste e envie",
    description: "Revise a mensagem final e envie pelo WhatsApp mantendo controle da conversa.",
    icon: ClipboardCheck
  }
];

const benefits = [
  "Economize tempo no atendimento",
  "Responda com mais clareza",
  "Tenha respostas mais profissionais",
  "Organize perguntas comuns",
  "Use um tom alinhado ao seu atendimento",
  "Acompanhe seu histórico de respostas"
];

const audienceProfiles = [
  "Autônomos",
  "Prestadores de serviço",
  "Lojas pequenas",
  "Delivery",
  "Estética",
  "Restaurantes",
  "Assistência técnica",
  "Vendedores pelo WhatsApp"
];

const objections = [
  {
    question: "Preciso entender de tecnologia?",
    answer: "Não. A ideia é ser simples: você configura seu atendimento e começa a gerar respostas."
  },
  {
    question: "A IA responde direto no meu WhatsApp?",
    answer:
      "Nesta versão, o AtendeZap IA gera respostas prontas para você copiar, ajustar e enviar. Isso ajuda a manter controle sobre o atendimento."
  },
  {
    question: "Serve para autônomos?",
    answer:
      "Sim. O produto foi pensado também para autônomos, prestadores de serviço e pessoas que atendem clientes sozinhas."
  },
  {
    question: "Posso cancelar?",
    answer:
      "A assinatura é gerenciada pelo Stripe, com acesso ao portal do cliente para acompanhar ou cancelar."
  },
  {
    question: "O Plano Pro por R$ 29 é só no lançamento?",
    answer:
      "Não. O primeiro mês por R$ 29 é uma condição permanente para novos usuários do Plano Pro, enquanto essa estratégia estiver ativa."
  }
];

export const conversionFaqItems: FaqItem[] = [
  {
    question: "O que é o AtendeZap IA?",
    answer:
      "É uma ferramenta para criar respostas rápidas, profissionais e personalizadas com inteligência artificial para quem atende clientes pelo WhatsApp."
  },
  {
    question: "Para quem é indicado?",
    answer:
      "Para autônomos, prestadores de serviço, pequenos negócios, vendedores, delivery, estética, restaurantes e pessoas que respondem clientes pelo WhatsApp."
  },
  {
    question: "Preciso conectar meu WhatsApp?",
    answer:
      "Não. Nesta versão você gera a resposta no AtendeZap IA, copia, ajusta se quiser e envia pelo seu WhatsApp."
  },
  {
    question: "A IA envia mensagens sozinha?",
    answer:
      "O AtendeZap IA não envia mensagens automaticamente. Ele gera respostas para você copiar, ajustar e enviar."
  },
  {
    question: "Posso usar sendo autônomo?",
    answer:
      "Sim. A comunicação, o fluxo e os planos foram pensados também para quem trabalha sozinho e precisa ganhar tempo no atendimento."
  },
  {
    question: "Quais planos existem?",
    answer:
      "Existem os planos Starter, Pro e Premium, com limites mensais diferentes para uso leve, rotina diária ou volume maior."
  },
  {
    question: "Como funciona o primeiro mês do Pro por R$ 29?",
    answer:
      "Novos usuários do Plano Pro pagam R$ 29 no primeiro mês. Depois, segue o valor normal do Plano Pro configurado na assinatura."
  },
  {
    question: "Posso cancelar?",
    answer:
      "Sim. A assinatura é gerenciada pelo Stripe, com portal do cliente para acompanhar pagamentos e cancelar quando necessário."
  },
  {
    question: "O que acontece se eu atingir o limite mensal?",
    answer:
      "Você continua com acesso ao dashboard e ao histórico, mas novas respostas com IA podem ficar limitadas até a renovação do ciclo ou mudança de plano."
  },
  {
    question: "Meus dados ficam protegidos?",
    answer:
      "As integrações sensíveis ficam no backend, sem expor chaves no navegador. O produto também evita registrar dados sensíveis completos em logs."
  },
  {
    question: "Posso testar antes?",
    answer:
      "Sim. A demo gratuita permite gerar uma resposta de exemplo antes de criar conta ou escolher um plano."
  },
  {
    question: "Preciso saber tecnologia?",
    answer:
      "Não. Você configura seu atendimento com informações simples, gera a resposta, revisa e copia para enviar pelo WhatsApp."
  },
  {
    question: "Como peco ajuda?",
    answer:
      "Use a pagina de suporte para duvidas de acesso, pagamento ou conta. Para reportar problema ou sugestao de produto, use a pagina de feedback."
  }
];

const comparisonRows: Array<{ label: string; values: Record<PlanId, string> }> = [
  {
    label: "Respostas com IA",
    values: { starter: "Até 100/mês", pro: "Até 500/mês", premium: "Até 1.500/mês" }
  },
  {
    label: "Histórico de respostas",
    values: { starter: "Básico", pro: "Completo", premium: "Completo" }
  },
  {
    label: "Configuração do atendimento",
    values: { starter: "Incluída", pro: "Incluída", premium: "Incluída" }
  },
  {
    label: "Limite mensal",
    values: { starter: "Uso leve", pro: "Rotina diária", premium: "Volume maior" }
  },
  {
    label: "Suporte básico",
    values: { starter: "Incluído", pro: "Incluído", premium: "Prioritário assíncrono" }
  },
  {
    label: "Acesso ao dashboard",
    values: { starter: "Incluído", pro: "Incluído", premium: "Incluído" }
  },
  {
    label: "Melhor para qual perfil",
    values: {
      starter: "Quem está começando",
      pro: "Quem atende todos os dias",
      premium: "Quem recebe muitas mensagens"
    }
  }
];

export function ProblemsSection() {
  return (
    <section id="problemas" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Problemas reais</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">
            Atender pelo WhatsApp toma tempo quando tudo depende de você
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Se você atende pelo WhatsApp, provavelmente já perdeu tempo respondendo perguntas repetidas ou deixou cliente esperando.
            O AtendeZap IA foi criado para resolver isso de forma simples.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problemItems.map((item) => (
            <Card className="p-5" key={item}>
              <HelpCircle className="mb-4 h-5 w-5 text-amber-500" />
              <p className="font-black text-ink">{item}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <TrackedLink
            href="/demo"
            eventName="demo_cta_click"
            properties={{ section: "after_problems" }}
            className={primaryCta}
          >
            Testar demo grátis
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Como funciona</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">
          Quatro passos para transformar uma dúvida em resposta pronta
        </h2>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {howItWorksSteps.map((step, index) => (
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
  );
}

export function BenefitsSection() {
  return (
    <section id="beneficios" className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Benefícios</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">
            Respostas melhores sem transformar seu atendimento em algo complicado
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <Card className="p-5" key={benefit}>
              <CheckCircle2 className="mb-4 h-5 w-5 text-emerald-500" />
              <p className="font-black text-ink">{benefit}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <TrackedLink
            href="/precos"
            eventName="pricing_cta_click"
            properties={{ section: "after_benefits" }}
            className={secondaryCta}
          >
            Ver planos
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}

export function AudienceProofSection() {
  return (
    <section id="publico" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Prova inicial</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">
            Criado para quem precisa atender melhor sem complicação
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Pensado para a rotina de quem atende clientes todos os dias, sem depoimentos inventados, promessas irreais ou urgência falsa.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audienceProfiles.map((item) => (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm" key={item}>
              <Users className="mb-4 h-5 w-5 text-brand-700" />
              <p className="font-black text-ink">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DemoEbookSection() {
  return (
    <section id="demo-ebook" className="bg-[#090d12] py-16 text-white">
      <div className="mx-auto grid max-w-6xl gap-5 px-4 md:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.04] p-6 text-white">
          <Sparkles className="mb-5 h-7 w-7 text-emerald-300" />
          <h2 className="text-2xl font-black">Teste uma resposta agora.</h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Use a demo pública para sentir como a IA transforma uma pergunta comum em uma resposta pronta para revisar e enviar.
          </p>
          <TrackedLink
            href="/demo"
            eventName="demo_cta_click"
            properties={{ section: "demo_ebook", destination: "demo" }}
            className={cn("mt-6", primaryCta)}
          >
            Testar demo grátis
          </TrackedLink>
        </Card>

        <Card className="border-white/10 bg-white/[0.04] p-6 text-white">
          <BookOpen className="mb-5 h-7 w-7 text-emerald-300" />
          <h2 className="text-2xl font-black">Aprenda a melhorar seu atendimento pelo WhatsApp com IA.</h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Baixe o guia gratuito com respostas prontas e use o ebook como primeiro passo antes de ativar um plano.
          </p>
          <TrackedLink
            href="/ebook"
            eventName="ebook_cta_click"
            properties={{ section: "demo_ebook", destination: "ebook" }}
            className={cn("mt-6", darkGhostCta)}
          >
            Baixar guia gratuito
          </TrackedLink>
        </Card>
      </div>
    </section>
  );
}

export function PlanComparisonSection({ dark = false }: { dark?: boolean }) {
  const plans = PLAN_IDS.map((planId) => SAAS_PLANS[planId]);

  return (
    <section id="comparacao" className={dark ? "bg-[#090d12] py-16 text-white" : "bg-white py-16"}>
      <TrackOnMount eventName="plan_compare_view" properties={{ section: "plan_comparison" }} />
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-3xl">
          <p className={cn("text-sm font-black uppercase tracking-[0.22em]", dark ? "text-emerald-300" : "text-brand-700")}>
            Comparação
          </p>
          <h2 className={cn("mt-3 text-3xl font-black tracking-tight md:text-4xl", dark ? "text-white" : "text-ink")}>
            Compare os planos antes de assinar
          </h2>
          <p className={cn("mt-4 text-base leading-7", dark ? "text-slate-300" : "text-slate-600")}>
            O Starter é ideal para começar, o Pro é o mais recomendado para rotina diária e o Premium atende volumes maiores.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-[760px] w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="px-4 py-4 font-black">Recurso</th>
                {plans.map((plan) => (
                  <th className="px-4 py-4 font-black" key={plan.id}>
                    {plan.name}
                    {plan.recommended ? (
                      <span className="ml-2 rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-800">
                        Mais recomendado
                      </span>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr className="border-t border-slate-200" key={row.label}>
                  <td className="px-4 py-4 font-bold text-ink">{row.label}</td>
                  {PLAN_IDS.map((planId) => (
                    <td className="px-4 py-4 text-slate-600" key={planId}>
                      {row.values[planId]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function ObjectionsSection({ dark = false }: { dark?: boolean }) {
  return (
    <section id="objecoes" className={dark ? "bg-[#090d12] py-16 text-white" : "bg-slate-50 py-16"}>
      <TrackOnMount eventName="objection_section_view" properties={{ section: "objections" }} />
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-3xl">
          <p className={cn("text-sm font-black uppercase tracking-[0.22em]", dark ? "text-emerald-300" : "text-brand-700")}>
            Objeções comuns
          </p>
          <h2 className={cn("mt-3 text-3xl font-black tracking-tight md:text-4xl", dark ? "text-white" : "text-ink")}>
            O que você precisa saber antes de começar
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {objections.map((item) => (
            <Card className={cn("p-6", dark ? "border-white/10 bg-white/[0.04] text-white" : "bg-white")} key={item.question}>
              <h3 className={cn("font-black", dark ? "text-white" : "text-ink")}>{item.question}</h3>
              <p className={cn("mt-3 text-sm leading-6", dark ? "text-slate-300" : "text-slate-600")}>{item.answer}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ dark = false }: { dark?: boolean }) {
  return (
    <section id="faq" className={dark ? "bg-[#090d12] py-16 text-white" : "bg-white py-16"}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-3xl">
          <p className={cn("text-sm font-black uppercase tracking-[0.22em]", dark ? "text-emerald-300" : "text-brand-700")}>
            FAQ
          </p>
          <h2 className={cn("mt-3 text-3xl font-black tracking-tight md:text-4xl", dark ? "text-white" : "text-ink")}>
            Perguntas frequentes
          </h2>
        </div>
        <ConversionFaq items={conversionFaqItems} />
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  return (
    <section className="bg-[#090d12] py-16 text-white">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <Zap className="mx-auto mb-5 h-9 w-9 text-emerald-300" />
        <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
          Comece a responder clientes com mais clareza usando IA
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
          Teste a demo, baixe o guia gratuito ou crie sua conta para usar o AtendeZap IA no atendimento do dia a dia.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <TrackedLink
            href="/cadastro"
            eventName="final_cta_click"
            properties={{ section: "final", destination: "signup" }}
            className={primaryCta}
          >
            Criar minha conta
          </TrackedLink>
          <TrackedLink
            href="/demo"
            eventName="demo_cta_click"
            properties={{ section: "final", destination: "demo" }}
            className={darkGhostCta}
          >
            Testar demo grátis
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}

export function PricingPlanCards() {
  const plans = PLAN_IDS.map((planId) => SAAS_PLANS[planId]);

  return (
    <section id="planos" className="bg-[#090d12] py-16 text-white">
      <TrackOnMount eventName="pricing_view" properties={{ section: "pricing", plans: plans.length }} />
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">Planos</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            Escolha o plano ideal para sua rotina de atendimento
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            O Pro é o plano mais recomendado para quem atende clientes todos os dias. O primeiro mês por R$ 29 é válido para novos usuários.
          </p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              className={cn(
                "relative flex h-full flex-col rounded-lg border p-6 shadow-2xl shadow-black/25",
                plan.recommended ? "border-emerald-300 bg-[#101821]" : "border-white/10 bg-white/[0.04]"
              )}
              key={plan.id}
            >
              <TrackOnMount eventName="plan_card_view" properties={{ plan: plan.id, page: "pricing" }} />
              {plan.recommended ? (
                <span className="mb-4 w-fit rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-slate-950">
                  Mais recomendado
                </span>
              ) : (
                <span className="mb-4 w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-slate-950">
                  {plan.badge}
                </span>
              )}
              <h3 className="text-2xl font-black">{plan.name}</h3>
              <p className="mt-4 text-3xl font-black">{plan.firstMonthPriceLabel || plan.monthlyPriceLabel}</p>
              {plan.recurringPriceLabel ? <p className="mt-1 text-sm font-black text-emerald-200">{plan.recurringPriceLabel}</p> : null}
              {plan.id === "pro" ? (
                <p className="mt-2 text-xs font-bold text-slate-400">Primeiro mês por R$ 29 para novos usuários. Depois, segue o valor normal do Plano Pro configurado na assinatura.</p>
              ) : null}
              <p className="mt-4 min-h-16 text-sm leading-6 text-slate-300">{plan.description}</p>
              <ul className="mt-5 flex flex-1 flex-col gap-3 text-sm text-slate-200">
                {plan.features.slice(0, 5).map((feature) => (
                  <li className="flex gap-2" key={feature}>
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <StripeCheckoutButton planId={plan.id} className="mt-7" recommended={plan.recommended} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
