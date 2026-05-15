import { ArrowRight, CheckCircle2, Clipboard, MessageCircle, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { PricingSection } from "@/components/pricing/PricingSection";
import { SectionTitle } from "@/components/section-title";

const benefits = [
  "Responda clientes mais rápido",
  "Pareça mais profissional",
  "Organize atendimentos",
  "Recupere clientes indecisos",
  "Crie mensagens de venda em segundos",
  "Funciona para vários tipos de negócio"
];

const audiences = ["salão de beleza", "manicure", "loja de roupa", "marmitaria", "delivery", "estética", "mecânica", "infoprodutor", "pequenos comércios"];

const faqs = [
  ["O AtendeZap IA conecta no WhatsApp?", "Nesta primeira versão, não. Você gera a resposta com IA, copia e envia manualmente pelo WhatsApp."],
  ["Preciso cadastrar meu negócio?", "Sim. A IA usa os dados do negócio para adaptar tom, horários, preços, serviços e formas de pagamento."],
  ["A IA promete vender mais?", "Não prometemos resultado financeiro. O objetivo é ajudar você a responder melhor e com mais agilidade."],
  ["Funciona para qual nicho?", "Funciona para pequenos negócios que atendem clientes pelo WhatsApp, como beleza, delivery, lojas e serviços."]
];

export default function Home() {
  return (
    <main>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-20">
          <div>
            <Badge>Assistente IA para WhatsApp</Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-ink md:text-6xl">
              Atenda melhor no WhatsApp com respostas criadas por IA.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Cadastre seu negócio, cole a pergunta do cliente e receba uma resposta profissional pronta para copiar e enviar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/cadastro">
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button href="/login" variant="ghost">
                Entrar
              </Button>
            </div>
            <p className="mt-5 text-sm text-slate-500">
              MVP sem conexão automática ao WhatsApp. Você mantém o controle: gera, revisa, copia e envia.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-brand-50 p-5 shadow-soft">
            <div className="rounded-md bg-white p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-100 text-brand-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-extrabold">Resposta pronta para WhatsApp</p>
                  <p className="text-sm text-slate-500">Gerada com os dados do seu negócio</p>
                </div>
              </div>
              <div className="rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                Oi, Maria! Consigo te ajudar sim. Para te passar o valor correto, me confirma qual serviço você deseja e o melhor horário para atendimento? Aceitamos Pix e cartão.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionTitle title="Como funciona" />
        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {["Crie sua conta", "Cadastre seu negócio", "Cole a pergunta do cliente", "Copie a resposta da IA"].map((step, index) => (
            <Card key={step}>
              <p className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-brand-100 font-black text-brand-700">{index + 1}</p>
              <h3 className="font-extrabold text-ink">{step}</h3>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle title="Benefícios para o atendimento" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <Card className="p-5" key={benefit}>
                <CheckCircle2 className="mb-3 h-5 w-5 text-brand-600" />
                <p className="font-bold text-ink">{benefit}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionTitle title="Para quem serve" />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {audiences.map((item) => (
            <Badge className="bg-white text-ink ring-1 ring-slate-200" key={item}>
              {item}
            </Badge>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
          <Card>
            <MessageCircle className="mb-4 h-6 w-6 text-brand-600" />
            <h3 className="font-black text-ink">Gerador de respostas</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Perguntas de clientes viram respostas naturais, profissionais e adaptadas ao seu negócio.</p>
          </Card>
          <Card>
            <Users className="mb-4 h-6 w-6 text-brand-600" />
            <h3 className="font-black text-ink">Clientes organizados</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Cadastre leads, acompanhe status e mantenha observações importantes.</p>
          </Card>
          <Card>
            <Clipboard className="mb-4 h-6 w-6 text-brand-600" />
            <h3 className="font-black text-ink">Scripts prontos</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Use modelos de boas-vindas, orçamento, pós-venda e recuperação de clientes.</p>
          </Card>
        </div>
      </section>

      <PricingSection />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionTitle title="Perguntas frequentes" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {faqs.map(([question, answer]) => (
            <Card key={question}>
              <h3 className="font-black text-ink">{question}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-[#090d12] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight md:text-5xl">Comece a responder melhor seus clientes hoje</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Crie sua conta, cadastre seu negócio e gere sua primeira resposta profissional para WhatsApp.
          </p>
          <div className="mt-8">
            <Button href="/cadastro" className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">
              Criar conta grátis
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
