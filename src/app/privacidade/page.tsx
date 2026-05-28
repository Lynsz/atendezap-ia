import Link from "next/link";

const supportEmail = process.env.SUPPORT_EMAIL || "suporte@atendezapia.com.br";

export const metadata = {
  title: "Politica de Privacidade",
  description:
    "Politica de privacidade do AtendeZap IA sobre dados coletados, Supabase, Stripe, OpenAI, Resend, analytics e direitos do usuario.",
  alternates: {
    canonical: "/privacidade"
  }
};

const sections = [
  {
    title: "1. Quais dados coletamos",
    content:
      "Podemos coletar e-mail, id interno, dados de perfil, onboarding, informacoes do negocio, perguntas usadas para gerar respostas, respostas geradas, respostas salvas, feedbacks, leads do ebook, UTMs, dados locais de assinatura e eventos internos seguros."
  },
  {
    title: "2. Para que usamos os dados",
    content:
      "Usamos os dados para criar e proteger a conta, operar o dashboard, gerar respostas com IA, manter historico e respostas salvas, controlar limite mensal, processar assinatura, enviar e-mails transacionais, prestar suporte e acompanhar metricas operacionais."
  },
  {
    title: "3. Supabase",
    content:
      "Usamos Supabase para autenticacao, banco de dados e controle de acesso. As tabelas principais usam RLS para que cada usuario acesse apenas seus proprios dados quando aplicavel."
  },
  {
    title: "4. Stripe",
    content:
      "Pagamentos e assinaturas sao processados pela Stripe. O AtendeZap IA nao armazena numero completo de cartao. Guardamos apenas estado local de plano, status e identificadores Stripe necessarios para operar a assinatura."
  },
  {
    title: "5. OpenAI",
    content:
      "Usamos OpenAI para gerar sugestoes de resposta. O backend envia o contexto necessario para a geracao. Evite inserir dados sensiveis desnecessarios nas perguntas e informacoes do negocio."
  },
  {
    title: "6. Resend",
    content:
      "Usamos Resend para envio de e-mails transacionais, como entrega de materiais e comunicacoes relacionadas ao produto. Logs de envio devem ser consultados no painel do provedor quando necessario."
  },
  {
    title: "7. Analytics e tracking",
    content:
      "Analytics e pixels, quando configurados, recebem apenas metadados seguros como evento, origem, plano, categoria, tipo de negocio e UTMs. Nao enviamos e-mail, telefone, mensagem do cliente, resposta completa da IA, tokens, chaves ou dados de pagamento para analytics."
  },
  {
    title: "8. Exportacao e exclusao",
    content:
      "Usuarios podem solicitar exportacao ou exclusao de dados pelo dashboard ou suporte. Nesta fase, o atendimento pode ser manual para confirmar identidade, assinatura e obrigacoes legais ou financeiras antes de qualquer acao."
  },
  {
    title: "9. Como o produto funciona",
    content:
      "O AtendeZap IA gera sugestoes de respostas para o usuario copiar, ajustar e enviar manualmente. O produto nao envia mensagens automaticamente pelo WhatsApp."
  }
];

export default function PrivacyPage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-4xl px-4 py-14 md:py-20">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Privacidade</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-5xl">Politica de Privacidade</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Esta politica resume como o AtendeZap IA trata dados pessoais em paginas publicas, captura de leads, cadastro, assinatura, envio de e-mails e uso do produto.
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
            Contato para privacidade:{" "}
            <a className="font-black text-brand-700 hover:underline" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
          </p>
          <p className="mt-2">
            Usuarios logados tambem podem acessar{" "}
            <Link className="font-black text-brand-700 hover:underline" href="/dashboard/privacidade">
              Privacidade no dashboard
            </Link>
            .
          </p>
          <p className="mt-2">
            Veja tambem os{" "}
            <Link className="font-black text-brand-700 hover:underline" href="/termos">
              Termos de Uso
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
