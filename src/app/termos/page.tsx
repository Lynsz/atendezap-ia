import Link from "next/link";

const supportEmail = process.env.SUPPORT_EMAIL || "suporte@atendezapia.com.br";

export const metadata = {
  title: "Termos de Uso",
  description:
    "Termos de uso do AtendeZap IA, incluindo uso permitido, limites da IA, planos, Stripe, cancelamento, limites mensais e suporte.",
  alternates: {
    canonical: "/termos"
  }
};

const sections = [
  {
    title: "1. Sobre o AtendeZap IA",
    content:
      "O AtendeZap IA ajuda pessoas, autonomos, prestadores de servico e pequenos negocios a criarem sugestoes de respostas para atendimento pelo WhatsApp. O usuario copia, ajusta e envia manualmente."
  },
  {
    title: "2. Uso permitido",
    content:
      "O usuario pode cadastrar contexto do negocio, gerar respostas com IA, salvar respostas uteis, copiar mensagens e acompanhar o uso mensal conforme o plano contratado."
  },
  {
    title: "3. Limitacoes da IA",
    content:
      "A IA pode errar. O usuario deve revisar toda resposta antes de enviar, especialmente quando houver precos, prazos, disponibilidade, garantias, dados pessoais, saude, financas ou contratos."
  },
  {
    title: "4. Uso proibido",
    content:
      "E proibido usar o produto para spam, fraude, atividade ilegal, assedio, violacao de direitos, conteudo abusivo, exploracao tecnica do servico ou exposicao indevida de dados pessoais."
  },
  {
    title: "5. Planos, cobranca e limites",
    content:
      "Planos e cobrancas sao processados via Stripe. Cada plano pode ter limite mensal de respostas. O dashboard pode bloquear novas geracoes quando o limite for atingido."
  },
  {
    title: "6. Cancelamento",
    content:
      "O cancelamento deve ser feito pelo portal Stripe ou pelo fluxo indicado no produto. Em caso de divergencia, a Stripe deve ser consultada como fonte de verdade financeira."
  },
  {
    title: "7. Disponibilidade",
    content:
      "O servico pode ficar indisponivel por manutencao, falhas de provedores externos, incidentes de infraestrutura ou ajustes tecnicos. Nao ha garantia de resultado financeiro, vendas ou conversao."
  },
  {
    title: "8. Privacidade e dados",
    content:
      "O tratamento de dados segue a politica de privacidade. O usuario pode solicitar exportacao ou exclusao de dados, respeitando verificacoes de identidade, assinatura e obrigacoes legais ou financeiras."
  },
  {
    title: "9. Contato",
    content:
      "Duvidas sobre uso, assinatura, privacidade ou suporte devem ser enviadas ao e-mail de suporte informado abaixo."
  }
];

export default function TermsPage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-4xl px-4 py-14 md:py-20">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Legal</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-5xl">Termos de Uso</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Estes termos explicam as regras basicas para usar o AtendeZap IA. Eles nao substituem orientacao juridica especifica.
        </p>

        <div className="mt-10 grid gap-5">
          {sections.map((section) => (
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={section.title}>
              <h2 className="text-lg font-black text-ink">{section.title}</h2>
              <p className="mt-3 leading-7 text-slate-700">{section.content}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-emerald-100 bg-emerald-50 p-5 text-sm leading-7 text-slate-700">
          <p>
            Contato:{" "}
            <a className="font-black text-brand-700 hover:underline" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
          </p>
          <p className="mt-2">
            Veja tambem a{" "}
            <Link className="font-black text-brand-700 hover:underline" href="/privacidade">
              Politica de Privacidade
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
