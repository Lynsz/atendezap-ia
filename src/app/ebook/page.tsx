import { BookOpen, CheckCircle2, Download, MessageCircle, Sparkles, Timer, Users, Wand2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { EbookLeadForm } from "@/components/ebook/EbookLeadForm";
import { TrackOnMount } from "@/components/tracking/TrackOnMount";

export const metadata = {
  title: "Guia gratuito para WhatsApp com IA",
  description:
    "Baixe o guia gratuito e veja como autônomos, prestadores de serviço e pequenos negócios podem economizar tempo no atendimento usando inteligência artificial.",
  alternates: {
    canonical: "/ebook"
  },
  openGraph: {
    title: "Guia gratuito para WhatsApp com IA",
    description:
      "Aprenda a responder clientes mais rápido no WhatsApp com ajuda da inteligência artificial."
  }
};

const benefits = [
  "Ganhe tempo no atendimento",
  "Responda com mais clareza",
  "Tenha ideias de respostas prontas",
  "Melhore sua comunicação com clientes",
  "Comece sem precisar entender de tecnologia"
];

const lessons = [
  "Como responder perguntas repetidas sem perder qualidade",
  "Como transformar respostas prontas em respostas personalizadas",
  "Como usar IA para adaptar mensagens ao seu atendimento",
  "Como organizar respostas para orçamento, cobrança e pós-venda",
  "Como melhorar a primeira resposta para clientes que chegam pelo WhatsApp"
];

const audiences = ["Autônomos", "Prestadores de serviço", "Lojas", "Delivery", "Estética", "Restaurantes", "Assistência técnica", "Pequenos negócios"];

const painPoints = [
  "Você responde as mesmas perguntas várias vezes por dia?",
  "Perde venda por demorar para responder?",
  "Fica sem ideia de como responder cliente de forma profissional?",
  "Atende pelo WhatsApp, mas ainda faz tudo manualmente?"
];

export default function EbookPage() {
  return (
    <main className="bg-slate-50">
      <TrackOnMount eventName="ebook_view" source="ebook_page" funnel="ebook" properties={{ page: "ebook" }} />
      <section id="top" className="bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_55%,#ecfeff_100%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand-700">
              Guia gratuito
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-ink md:text-6xl">
              Aprenda a responder clientes mais rápido no WhatsApp com IA
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Baixe o guia gratuito e veja como autônomos, prestadores de serviço e pequenos negócios podem economizar tempo no atendimento usando inteligência artificial.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={benefit}>
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <p className="text-sm font-bold leading-6 text-slate-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-emerald-100 p-6 shadow-xl shadow-emerald-950/10">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-emerald-400 text-slate-950">
              <Download className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black text-ink">Receber o guia gratuito</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Preencha seus dados para liberar o material e ver o próximo passo com o AtendeZap IA.
            </p>
            <EbookLeadForm />
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Ao enviar, você concorda com os{" "}
              <Link href="/termos" className="font-bold text-brand-700 hover:underline">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link href="/privacidade" className="font-bold text-brand-700 hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Dor</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">
              Atendimento pelo WhatsApp não precisa ser tão manual
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              O guia foi criado para quem atende, vende ou responde clientes pelo WhatsApp e quer melhorar a comunicação sem depender de uma configuração complicada.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {painPoints.map((pain) => (
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={pain}>
                <Timer className="mb-3 h-5 w-5 text-brand-700" />
                <p className="text-sm font-black leading-6 text-ink">{pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">O que tem no ebook</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">
              Um passo a passo para responder melhor com ajuda da IA
            </h2>
            <div className="mt-6 grid gap-3">
              {lessons.map((lesson) => (
                <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4" key={lesson}>
                  <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <p className="text-sm font-bold leading-6 text-slate-700">{lesson}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Para quem é</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">
              Para quem usa WhatsApp para atender clientes
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {audiences.map((audience) => (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700" key={audience}>
                  {audience}
                </span>
              ))}
            </div>
            <div className="mt-8 rounded-lg border border-emerald-100 bg-emerald-50 p-5">
              <Wand2 className="mb-4 h-6 w-6 text-emerald-600" />
              <h3 className="text-xl font-black text-ink">O ebook mostra a estratégia. O AtendeZap IA coloca em prática.</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Depois de baixar o guia, você pode usar o AtendeZap IA para configurar seu atendimento, gerar respostas com IA, salvar histórico e controlar seu uso mensal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#090d12] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <MessageCircle className="mx-auto mb-5 h-9 w-9 text-emerald-300" />
          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
            Baixe o guia e veja como aplicar no seu atendimento
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
            O AtendeZap IA ajuda você a transformar ideias de respostas em mensagens prontas, personalizadas e mais profissionais para enviar aos clientes.
          </p>
          <p className="mx-auto mt-4 inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-100">
            Plano Pro com primeiro mês por R$ 29 para novos usuários.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="#top" className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">
              <Sparkles className="mr-2 h-4 w-4" />
              Baixar guia gratuito
            </Button>
            <Button href="/precos" variant="ghost">
              Conhecer o AtendeZap IA
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400">
            <Users className="h-4 w-4" />
            Feito para pessoas, autônomos e pequenos negócios que atendem pelo WhatsApp.
          </div>
        </div>
      </section>
    </main>
  );
}
