import { ArrowRight, CheckCircle2, FileText, MessageCircle, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/button";
import { TrackOnMount } from "@/components/tracking/TrackOnMount";
import { TrackedLink } from "@/components/tracking/TrackedLink";

export const metadata = {
  title: "Guia gratuito liberado",
  description: "Seu guia gratuito está pronto. Veja como aplicar as respostas com IA no AtendeZap IA.",
  alternates: {
    canonical: "/ebook/obrigado"
  },
  robots: {
    index: false,
    follow: true
  }
};

const productBenefits = [
  "Configuração do atendimento em poucos minutos",
  "Respostas com IA para copiar e enviar no WhatsApp",
  "Histórico de respostas geradas",
  "Controle de plano, limite mensal e uso",
  "Planos simples para começar sem atendimento manual"
];

export default function EbookThankYouPage() {
  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-16 text-slate-100">
      <TrackOnMount eventName="thank_you_view" source="ebook_page" funnel="ebook" properties={{ page: "ebook_obrigado" }} />
      <section className="mx-auto max-w-5xl rounded-lg border border-white/10 bg-[#101821] p-6 shadow-2xl shadow-black/30 md:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <div className="text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Guia gratuito liberado</p>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Seu guia gratuito está pronto.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Enviamos o guia para o seu e-mail. Você também pode acessar agora pelo botão abaixo e depois ver como aplicar isso na prática com o AtendeZap IA.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <FileText className="mb-4 h-6 w-6 text-emerald-300" />
            <h2 className="text-2xl font-black text-white">Acesse o ebook</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              O guia mostra como melhorar o atendimento pelo WhatsApp com respostas mais rápidas, claras e profissionais. Se o e-mail demorar, use o acesso imediato abaixo.
            </p>
            <Button href="/ebook/guia" className="mt-6 w-full justify-center bg-white text-slate-950 hover:bg-slate-100">
              Acessar guia gratuito
            </Button>
          </div>

          <div className="rounded-lg border border-emerald-300/30 bg-emerald-400/10 p-5">
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-200">
              <Sparkles className="h-4 w-4" />
              Próximo passo
            </p>
            <h2 className="text-2xl font-black text-white">O ebook te mostra a estratégia. O AtendeZap IA te ajuda a colocar em prática.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Gere respostas prontas para clientes em poucos segundos, configure seu atendimento e acompanhe seu uso mensal no dashboard.
            </p>
            <div className="mt-5 grid gap-2">
              {productBenefits.map((benefit) => (
                <div className="flex items-start gap-2 text-sm font-bold text-emerald-50" key={benefit}>
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.04] p-5 text-center">
          <Wand2 className="mx-auto mb-4 h-7 w-7 text-emerald-300" />
          <h2 className="text-2xl font-black text-white">Plano Pro com primeiro mês por R$ 29 para novos usuários</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Depois, continue pelo valor mensal normal. A oferta é permanente para novos usuários, sem urgência falsa e sem limite de vagas.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <TrackedLink
              href="/precos"
              eventName="thank_you_cta_click"
              properties={{ cta: "conhecer_atendezap_ia", funnel: "ebook" }}
              className="bg-emerald-400 text-slate-950 hover:bg-emerald-300 focus:ring-emerald-300"
            >
              Conhecer o AtendeZap IA
              <ArrowRight className="ml-2 h-4 w-4" />
            </TrackedLink>
            <Button href="/cadastro" variant="ghost">
              Criar minha conta
            </Button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-slate-400">
          <MessageCircle className="h-4 w-4" />
          Para quem atende, vende ou responde clientes pelo WhatsApp.
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-500">
          <Link href="/termos" className="hover:text-emerald-200">
            Termos de Uso
          </Link>
          <Link href="/privacidade" className="hover:text-emerald-200">
            Política de Privacidade
          </Link>
        </div>
      </section>
    </main>
  );
}
