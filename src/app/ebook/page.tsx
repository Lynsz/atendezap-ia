import { BookOpen, CheckCircle2, Download, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/button";
import { Card } from "@/components/card";

export const metadata = {
  title: "Ebook gratuito - 50 respostas prontas para WhatsApp"
};

const benefits = [
  "Respostas prontas para primeiro contato",
  "Modelos para orcamento, cobranca e pos-venda",
  "Mensagens para cliente indeciso",
  "Exemplos para delivery, estetica e assistencia tecnica",
  "Orientacao para adaptar as respostas com IA"
];

const chapters = [
  "Introducao",
  "Por que atendimento rapido aumenta a chance de venda",
  "Respostas prontas para primeiro contato",
  "Respostas para orcamento",
  "Respostas para cliente indeciso",
  "Respostas para cobranca",
  "Respostas para pos-venda",
  "Respostas para delivery",
  "Respostas para estetica",
  "Respostas para assistencia tecnica",
  "Como usar IA para adaptar respostas ao seu atendimento",
  "Chamada final para conhecer o AtendeZap IA"
];

export default function EbookPage() {
  return (
    <main className="bg-slate-50">
      <section className="bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_55%,#ecfeff_100%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand-700">
              Ebook gratuito
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-ink md:text-6xl">
              Voce perde tempo respondendo as mesmas perguntas no WhatsApp?
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Baixe gratis 50 respostas prontas para atender pelo WhatsApp com mais rapidez, clareza e profissionalismo.
              O guia mostra como organizar mensagens e adaptar respostas com IA para vender e atender melhor.
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
              Informe seus dados para liberar o material e continuar para a proxima etapa do funil.
            </p>

            <form action="/api/ebook-lead" method="post" className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Nome
                <input name="name" required className="field-input" placeholder="Seu nome" autoComplete="name" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                E-mail
                <input name="email" type="email" required className="field-input" placeholder="voce@email.com" autoComplete="email" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                WhatsApp
                <input name="whatsapp" required className="field-input" placeholder="(11) 99999-9999" autoComplete="tel" />
              </label>
              <input type="hidden" name="source" value="ebook_page" />
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700"
              >
                Baixar guia gratuito
                <Download className="h-4 w-4" />
              </button>
            </form>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Conteudo</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-4xl">
              Um guia para quem atende, vende e envia orcamentos pelo WhatsApp
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              O material serve para autonomos, pequenos negocios, prestadores de servico, lojas locais, restaurantes,
              saloes, clinicas, assistencia tecnica, vendedores, social media e infoprodutores.
            </p>
            <Button href="/precos" variant="ghost" className="mt-6">
              Ver planos do AtendeZap IA
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {chapters.map((chapter) => (
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={chapter}>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-brand-100 text-brand-700">
                  <BookOpen className="h-4 w-4" />
                </div>
                <p className="text-sm font-black leading-6 text-ink">{chapter}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#090d12] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <MessageCircle className="mx-auto mb-5 h-9 w-9 text-emerald-300" />
          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
            Transforme respostas prontas em respostas personalizadas
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Depois de baixar o guia, use o AtendeZap IA para adaptar mensagens ao seu negocio, servico ou atividade.
            O fluxo foi pensado para comecar sozinho, sem configuracao complicada.
          </p>
          <p className="mx-auto mt-4 inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-100">
            Plano Pro com primeiro mes por R$ 29 para novos usuarios.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/ebook" className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">
              <Sparkles className="mr-2 h-4 w-4" />
              Baixar guia gratuito
            </Button>
            <Button href="/precos" variant="ghost">
              Testar o AtendeZap IA
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
