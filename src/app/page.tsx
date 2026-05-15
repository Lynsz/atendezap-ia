import { ArrowRight, CheckCircle2, FileText, MailCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { PricingCard } from "@/components/pricing-card";
import { SectionTitle } from "@/components/section-title";
import { getCheckoutUrl } from "@/lib/checkout";

const kitItems = [
  "Mensagem de boas-vindas",
  "Mensagem de ausência",
  "Respostas rápidas",
  "Follow-ups",
  "Mensagens para clientes que sumiram",
  "Mensagens de pós-venda",
  "Frases para status",
  "Etiquetas recomendadas",
  "Fluxo de atendimento",
  "PDF pronto para copiar e usar"
];

const audiences = ["salões", "manicures", "barbearias", "marmitarias", "estética", "lojas", "pet shops", "assistência técnica"];

export default function Home() {
  const basicCheckout = getCheckoutUrl("basic");
  const proCheckout = getCheckoutUrl("pro");
  const premiumCheckout = getCheckoutUrl("premium");

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
              Responda algumas perguntas sobre seu negócio e receba um kit com mensagens prontas, respostas rápidas,
              follow-ups e fluxo de atendimento gerado por IA.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={proCheckout || "/precos"} className="gap-2">
                Criar meu kit agora <ArrowRight className="h-4 w-4" />
              </Button>
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
                  <p className="font-extrabold">Kit Profissional</p>
                  <p className="text-sm text-slate-500">Pronto para copiar e usar</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {["Boas-vindas", "40 respostas rápidas", "Fluxo completo", "PDF organizado"].map((item) => (
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
        <SectionTitle title="O que você recebe" eyebrow="Kit completo">
          Mensagens e organização para transformar conversas soltas em um atendimento mais claro.
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
            {["Compre pela Kiwify", "Receba o link de acesso", "Preencha o formulário", "Baixe seu kit em PDF"].map(
              (step, index) => (
                <Card key={step}>
                  <p className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-brand-100 font-black text-brand-700">
                    {index + 1}
                  </p>
                  <h3 className="font-extrabold text-ink">{step}</h3>
                </Card>
              )
            )}
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

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle title="Escolha seu plano" eyebrow="A partir de R$29" />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <PricingCard
              name="Plano Básico"
              price="R$29"
              checkoutUrl={basicCheckout}
              features={["20 respostas rápidas", "mensagem de boas-vindas", "mensagem de ausência", "5 follow-ups", "PDF simples"]}
            />
            <PricingCard
              name="Plano Profissional"
              price="R$49"
              highlighted
              checkoutUrl={proCheckout}
              features={[
                "40 respostas rápidas",
                "10 follow-ups",
                "10 mensagens para clientes que sumiram",
                "10 frases para status",
                "etiquetas recomendadas",
                "fluxo completo",
                "PDF completo"
              ]}
            />
            <PricingCard
              name="Plano Premium"
              price="R$79"
              checkoutUrl={premiumCheckout}
              disabled={!premiumCheckout}
              features={["tudo do profissional", "3 versões de tom de voz", "texto para bio do Instagram", "ideias de catálogo", "2 regenerações futuras em breve"]}
            />
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
          <Button href={proCheckout || "/precos"} className="bg-white text-ink hover:bg-slate-100">
            Criar meu kit agora
          </Button>
        </Card>
      </section>
    </main>
  );
}
