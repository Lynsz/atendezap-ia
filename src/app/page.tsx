import {
  ArrowRight,
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

const flowSteps = [
  {
    title: "Cadastre seu negocio",
    description: "Informe servicos, precos, horarios e tom de voz.",
    icon: Store
  },
  {
    title: "Cole a pergunta do cliente",
    description: "Use a duvida real que chegou no seu WhatsApp.",
    icon: MessageCircle
  },
  {
    title: "Copie a resposta da IA",
    description: "Receba uma mensagem profissional pronta para enviar.",
    icon: ClipboardCheck
  }
];

const benefits = [
  "Responda mais rapido",
  "Pareca mais profissional",
  "Economize tempo no atendimento",
  "Organize clientes e leads",
  "Recupere clientes indecisos",
  "Crie mensagens de venda em segundos",
  "Tenha historico das respostas",
  "Funciona para varios nichos"
];

const audiences = [
  "Salao de beleza",
  "Manicure",
  "Loja de roupa",
  "Marmitaria",
  "Delivery",
  "Clinica estetica",
  "Mecanica",
  "Infoprodutor",
  "Pequenos comercios"
];

const beforeItems = [
  "Demora para responder",
  "Mensagens improvisadas",
  "Perde clientes indecisos",
  "Atendimento desorganizado"
];

const afterItems = [
  "Resposta profissional em segundos",
  "Historico salvo",
  "Scripts de venda",
  "Clientes organizados"
];

const plans = [
  {
    name: "Inicial",
    price: "R$ 19,90/mes",
    description: "Bom para comecar a responder melhor e testar o fluxo no dia a dia."
  },
  {
    name: "Pro",
    price: "R$ 39,90/mes",
    description: "Melhor para quem atende mais clientes e quer mais organizacao comercial.",
    featured: true
  },
  {
    name: "Premium",
    price: "Em breve",
    description: "Etapa futura com recursos avancados e WhatsApp conectado."
  }
];

const faqs = [
  [
    "Preciso conectar meu WhatsApp?",
    "Nao nesta primeira versao. Voce cola a pergunta do cliente, gera a resposta e copia para enviar no WhatsApp."
  ],
  [
    "Funciona para qualquer area?",
    "Sim. O sistema usa as informacoes cadastradas do seu negocio para adaptar as respostas."
  ],
  [
    "A IA inventa precos ou horarios?",
    "Nao deve inventar. Ela usa os dados que voce cadastrou. Quanto mais completo o cadastro, melhor a resposta."
  ],
  [
    "Ja responde automaticamente meus clientes?",
    "A versao atual ajuda voce a gerar respostas prontas. A automacao direta do WhatsApp esta planejada para uma proxima etapa."
  ],
  [
    "Preciso saber usar tecnologia?",
    "Nao. A ideia e ser simples: cadastrar o negocio, colar a pergunta e copiar a resposta."
  ]
];

export default function Home() {
  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#d1fae5,transparent_34%),linear-gradient(135deg,#ffffff_0%,#f8fafc_58%,#ecfeff_100%)]">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-20">
          <div>
            <Badge>Assistente IA para WhatsApp</Badge>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-ink md:text-6xl">
              Atenda melhor no WhatsApp com respostas criadas por IA.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Cadastre seu negocio, cole a pergunta do cliente e receba uma resposta profissional pronta para copiar e enviar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/cadastro">
                Comecar agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button href="/plans" variant="ghost">
                Ver planos
              </Button>
            </div>
            <p className="mt-5 inline-flex rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">
              Sem precisar conectar o WhatsApp nesta primeira versao.
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
                Oi, Ana! Consigo te ajudar sim. Temos atendimento hoje e posso te passar as opcoes disponiveis. Voce prefere agendar para qual horario?
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
          <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">Do cadastro a resposta pronta em poucos passos</h2>
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
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">Mais clareza, velocidade e organizacao no atendimento</h2>
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
          <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">Feito para pequenos negocios que vendem pelo WhatsApp</h2>
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
              A integracao automatica com WhatsApp sera liberada em etapa futura.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article className={`rounded-lg border p-6 shadow-2xl shadow-black/25 ${plan.featured ? "border-emerald-300 bg-[#101821]" : "border-white/10 bg-white/[0.04]"}`} key={plan.name}>
                <h3 className="text-2xl font-black">{plan.name}</h3>
                <p className="mt-4 text-3xl font-black">{plan.price}</p>
                <p className="mt-4 min-h-16 text-sm leading-6 text-slate-300">{plan.description}</p>
                <Button href="/plans" className="mt-6 w-full justify-center bg-emerald-400 text-slate-950 hover:bg-emerald-300">
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
          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight md:text-5xl">Comece a atender melhor seus clientes hoje.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Cadastre seu negocio, gere sua primeira resposta e veja como fica mais facil manter um atendimento profissional.
          </p>
          <div className="mt-8">
            <Button href="/cadastro" className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">
              Comecar agora
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
