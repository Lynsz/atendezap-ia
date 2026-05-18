import Link from "next/link";

const supportEmail = process.env.SUPPORT_EMAIL || "suporte@atendezapia.com.br";

export const metadata = {
  title: "Termos de Uso",
  description:
    "Termos de uso do AtendeZap IA, incluindo regras de assinatura, limites mensais, uso de IA e responsabilidades do usuário.",
  alternates: {
    canonical: "/termos"
  }
};

const sections = [
  {
    title: "1. Sobre o AtendeZap IA",
    content:
      "O AtendeZap IA é um produto digital para ajudar pessoas, autônomos, prestadores de serviço e pequenos negócios a criarem respostas mais rápidas e profissionais para atendimento pelo WhatsApp."
  },
  {
    title: "2. Cadastro e acesso",
    content:
      "Para usar recursos privados, o usuário deve criar uma conta com informações verdadeiras e manter seus dados de acesso protegidos. O uso da conta é pessoal e não deve ser compartilhado com terceiros sem autorização."
  },
  {
    title: "3. Planos, cobrança e limites",
    content:
      "Os planos do AtendeZap IA são cobrados via Stripe conforme a opção escolhida. Cada plano pode ter limite mensal de uso, exibido no dashboard. O Plano Pro pode ter primeiro mês por R$ 29 para novos usuários e, depois, segue o valor mensal informado na página de preços."
  },
  {
    title: "4. Cancelamento e alterações",
    content:
      "O usuário pode cancelar sua assinatura conforme as regras disponíveis no fluxo de cobrança da Stripe. O AtendeZap IA pode alterar planos, preços e funcionalidades, mantendo comunicação clara quando a mudança afetar usuários ativos."
  },
  {
    title: "5. Uso de respostas geradas por IA",
    content:
      "As respostas geradas por inteligência artificial servem como apoio. O usuário é responsável por revisar, adaptar e validar qualquer mensagem antes de enviar a clientes, especialmente quando envolver preços, prazos, garantias, saúde, finanças, contratos ou dados pessoais."
  },
  {
    title: "6. Uso proibido",
    content:
      "É proibido usar o AtendeZap IA para spam, fraude, assédio, conteúdo ilegal, violação de direitos de terceiros, tentativa de exploração técnica do serviço ou qualquer uso que prejudique outros usuários, clientes ou a operação da plataforma."
  },
  {
    title: "7. Disponibilidade do serviço",
    content:
      "Buscamos manter o serviço disponível, mas podem ocorrer indisponibilidades por manutenção, falhas de provedores, ajustes técnicos ou eventos fora do nosso controle. Não há promessa de resultado financeiro, aumento de vendas ou receita."
  },
  {
    title: "8. Contato",
    content:
      "Dúvidas sobre estes termos, assinatura ou uso do serviço podem ser enviadas para o e-mail de suporte informado abaixo."
  }
];

export default function TermsPage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-4xl px-4 py-14 md:py-20">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Legal</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-5xl">Termos de Uso</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Estes termos explicam as regras básicas para usar o AtendeZap IA. Eles não substituem orientação jurídica
          específica, mas deixam claro como o produto funciona nesta fase.
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
            Veja também a{" "}
            <Link className="font-black text-brand-700 hover:underline" href="/privacidade">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
