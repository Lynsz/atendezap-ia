import { ArrowRight, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import Link from "next/link";

export const metadata = {
  title: "Como responder clientes mais rápido no WhatsApp usando IA",
  description: "Guia gratuito do AtendeZap IA com exemplos de respostas prontas e passos simples para melhorar o atendimento pelo WhatsApp."
};

const mistakes = [
  "Responder sem contexto e obrigar o cliente a repetir informações.",
  "Demorar para responder perguntas simples sobre preço, prazo ou disponibilidade.",
  "Usar mensagens muito frias quando o cliente precisa de orientação.",
  "Inventar informação que não foi confirmada, como preço, horário ou garantia.",
  "Não ter respostas base para orçamento, cobrança, pós-venda e clientes indecisos."
];

const aiSteps = [
  "Liste as perguntas que você recebe toda semana.",
  "Escreva as informações reais do seu negócio: horários, serviços, formas de pagamento e limites.",
  "Peça para a IA transformar essas informações em respostas curtas para WhatsApp.",
  "Revise antes de enviar e ajuste nomes, valores, prazos e detalhes do cliente.",
  "Salve as melhores respostas para reutilizar quando a mesma dúvida aparecer."
];

const examples = [
  {
    title: "Primeiro contato",
    replies: [
      "Oi! Obrigado pelo contato. Me conta rapidinho o que você precisa para eu te orientar da melhor forma.",
      "Olá! Posso te ajudar sim. Você já sabe qual serviço ou produto procura ou quer ver as opções?",
      "Oi! Para te passar uma resposta certinha, me diga seu nome e o principal ponto que você precisa resolver."
    ]
  },
  {
    title: "Orçamento",
    replies: [
      "Consigo te passar um orçamento. Para calcular melhor, preciso de algumas informações: tipo de serviço, prazo desejado e detalhes do que você precisa.",
      "O valor depende do escopo. Me envie mais detalhes e, se tiver, uma foto ou referência para eu avaliar com mais precisão.",
      "Vou te explicar as opções e valores disponíveis para você escolher com clareza."
    ]
  },
  {
    title: "Cliente indeciso",
    replies: [
      "Sem problema. Posso te mostrar a opção mais simples para começar e você decide com calma.",
      "Entendo. Quer que eu compare as opções e te diga qual faz mais sentido para o seu caso?",
      "Se preferir, posso te mandar um resumo com benefícios, prazo e forma de pagamento."
    ]
  },
  {
    title: "Cobrança",
    replies: [
      "Oi! Passando para lembrar que o pagamento referente ao serviço ficou pendente. Posso te reenviar os dados por aqui?",
      "Olá! Tudo bem? Vi que ainda não identificamos o pagamento. Você consegue confirmar se já foi feito?",
      "Para mantermos o prazo combinado, preciso da confirmação do pagamento. Posso ajudar com alguma dúvida?"
    ]
  },
  {
    title: "Pós-venda",
    replies: [
      "Oi! Passando para saber se ficou tudo certo com seu atendimento. Qualquer ajuste, me avise por aqui.",
      "Obrigado pela confiança. Se precisar novamente, fico à disposição.",
      "Fico feliz em ajudar. Posso te mandar também algumas orientações para aproveitar melhor o serviço ou produto."
    ]
  }
];

const faqExamples = [
  "Quais perguntas chegam todos os dias?",
  "Quais respostas precisam de preço, prazo ou condição específica?",
  "Quais informações nunca devem ser inventadas?",
  "Quais respostas ajudam a vender sem pressionar o cliente?",
  "Quais mensagens podem ser enviadas depois da venda?"
];

export default function EbookGuidePage() {
  return (
    <main className="bg-slate-50">
      <section className="bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_55%,#ecfeff_100%)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[1fr_0.78fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand-700">
              Guia gratuito
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-ink md:text-6xl">
              Como responder clientes mais rápido no WhatsApp usando IA
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Um guia prático para autônomos, prestadores de serviço e pequenos negócios que querem responder com mais clareza, velocidade e consistência.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/demo" className="bg-emerald-600 text-white hover:bg-emerald-700">
                Testar demo
              </Button>
              <Button href="/precos">
                Conhecer o AtendeZap IA
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button href="/cadastro" variant="ghost">
                Criar conta
              </Button>
            </div>
          </div>

          <Card className="border-emerald-100 p-6 shadow-xl shadow-emerald-950/10">
            <MessageCircle className="mb-5 h-8 w-8 text-emerald-500" />
            <h2 className="text-2xl font-black text-ink">O objetivo</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Você não precisa automatizar tudo para começar. O primeiro ganho vem de organizar perguntas frequentes e transformar respostas improvisadas em mensagens claras.
            </p>
          </Card>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-3xl font-black text-ink">Por que respostas rápidas aumentam chances de venda</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Quando a pessoa chama no WhatsApp, ela normalmente quer tirar uma dúvida, comparar opções ou decidir se vai comprar. Uma resposta rápida reduz atrito, transmite atenção e mantém o cliente em movimento.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            O ponto não é responder de qualquer jeito. É responder rápido com informação correta, tom profissional e próximo passo claro.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-3xl font-black text-ink">Principais erros no atendimento pelo WhatsApp</h2>
          <div className="mt-5 grid gap-3">
            {mistakes.map((mistake) => (
              <div className="flex gap-3 rounded-md bg-slate-50 p-4" key={mistake}>
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <p className="text-sm leading-6 text-slate-700">{mistake}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Método simples</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">
              Como usar IA para criar respostas melhores
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {aiSteps.map((step, index) => (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4" key={step}>
                <span className="text-sm font-black text-emerald-600">0{index + 1}</span>
                <p className="mt-3 text-sm font-bold leading-6 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Exemplos</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">Respostas prontas para adaptar</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Use como ponto de partida. Antes de enviar, ajuste nomes, valores, prazos e condições reais do seu atendimento.
          </p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {examples.map((section) => (
            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" key={section.title}>
              <h3 className="text-2xl font-black text-ink">{section.title}</h3>
              <div className="mt-5 grid gap-3">
                {section.replies.map((reply) => (
                  <div className="flex gap-3 rounded-md bg-slate-50 p-4" key={reply}>
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <p className="text-sm leading-6 text-slate-700">{reply}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Organização</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">
              Como organizar perguntas frequentes
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Separe suas respostas por situação. Isso facilita revisar, copiar e melhorar com IA sem perder informações importantes.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {faqExamples.map((item) => (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4" key={item}>
                <p className="text-sm font-black leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#090d12] py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <Sparkles className="mx-auto mb-5 h-9 w-9 text-emerald-300" />
          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
            O AtendeZap IA ajuda a colocar esse processo em prática
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Cadastre seu negócio, cole a pergunta do cliente e gere uma resposta profissional com IA para copiar e enviar no WhatsApp.
          </p>
          <p className="mx-auto mt-4 inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-100">
            Plano Pro com primeiro mês por R$ 29 para novos usuários.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/demo" className="bg-white text-slate-950 hover:bg-slate-100">
              Testar demo
            </Button>
            <Button href="/cadastro" className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">
              Criar minha conta
            </Button>
            <Button href="/precos" variant="ghost">
              Ver planos
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-500">
            <Link href="/termos" className="hover:text-emerald-200">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:text-emerald-200">
              Politica de Privacidade
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
