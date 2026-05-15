import { CheckCircle2, FileText, MailCheck, MessageCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { KiwifyCheckoutButton } from "@/components/checkout/KiwifyCheckoutButton";
import { PricingSection } from "@/components/pricing/PricingSection";
import { SectionTitle } from "@/components/section-title";

const kitItems = [
  "Painel de atendimento",
  "Clientes e leads",
  "Automações IA",
  "Dashboard comercial",
  "Histórico local no navegador",
  "Interface moderna estilo SaaS",
  "Mensagem de boas-vindas",
  "Respostas rápidas",
  "Follow-ups",
  "PDF pronto para copiar e usar"
];

const audiences = ["salões", "manicures", "barbearias", "marmitarias", "estética", "lojas", "pet shops", "assistência técnica"];

export default function Home() {
  return (
    <main>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-20">
          <div>
            <Badge>Produto digital para WhatsApp Business</Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-ink md:text-6xl">
              Crie um atendimento profissional para WhatsApp Business em minutos
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Use o AtendeZap IA para centralizar conversas, acompanhar leads, simular automações e gerar kits de
              atendimento com IA em um painel simples e profissional.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <KiwifyCheckoutButton planId="starter" />
              <Button href="/suporte" variant="ghost">
                Falar com suporte
              </Button>
            </div>
            <p className="mt-5 text-sm text-slate-500">
              O AtendeZap IA não promete aumento de vendas ou resultado financeiro. O objetivo é ajudar a organizar e
              padronizar o atendimento.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-brand-50 p-5 shadow-soft">
            <div className="rounded-md bg-white p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-100 text-brand-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-extrabold">Plano Starter</p>
                  <p className="text-sm text-slate-500">R$49,00 para começar</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {["Painel de conversas", "Clientes e leads", "Automações IA", "Kit em PDF"].map((item) => (
                  <div className="flex items-center gap-2 rounded-md bg-slate-50 p-3" key={item}>
                    <CheckCircle2 className="h-4 w-4 text-brand-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionTitle title="O que você recebe" eyebrow="Produto completo">
          Um mini CRM local para organizar conversas, leads e automações, além do kit de atendimento pronto para usar.
        </SectionTitle>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {kitItems.map((item) => (
            <Card className="p-4" key={item}>
              <FileText className="mb-3 h-5 w-5 text-brand-600" />
              <p className="text-sm font-bold text-ink">{item}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle title="Como funciona" />
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {["Compre pela Kiwify", "Receba o link de acesso", "Use o painel", "Baixe seu kit em PDF"].map((step, index) => (
              <Card key={step}>
                <p className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-brand-100 font-black text-brand-700">
                  {index + 1}
                </p>
                <h3 className="font-extrabold text-ink">{step}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionTitle title="Feito para pequenos negócios que atendem pelo WhatsApp." />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {audiences.map((item) => (
            <Badge className="bg-white text-ink ring-1 ring-slate-200" key={item}>
              {item}
            </Badge>
          ))}
        </div>
      </section>

      <PricingSection />

      <section className="bg-[#090d12] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-lg border border-white/10 bg-[#101821] p-8 shadow-2xl shadow-black/30 md:p-10">
            <MessageCircle className="mb-5 h-9 w-9 text-emerald-300" />
            <h2 className="max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
              Comece a organizar seus atendimentos com IA hoje
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
              Use o AtendeZap IA para centralizar conversas, acompanhar leads e automatizar respostas em um painel
              simples e profissional.
            </p>
            <div className="mt-8">
              <KiwifyCheckoutButton planId="starter" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <Card className="flex flex-col gap-4 bg-ink text-white md:flex-row md:items-center md:justify-between">
          <div>
            <MailCheck className="mb-3 h-6 w-6 text-brand-100" />
            <h2 className="text-2xl font-black">Pronto para padronizar seu atendimento?</h2>
            <p className="mt-2 text-slate-200">O link de acesso chega por e-mail após a confirmação da compra.</p>
          </div>
          <KiwifyCheckoutButton className="bg-white text-ink hover:bg-slate-100" planId="starter" />
        </Card>
      </section>
    </main>
  );
}
