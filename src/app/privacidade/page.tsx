import Link from "next/link";

const supportEmail = process.env.SUPPORT_EMAIL || "suporte@atendezapia.com.br";

export const metadata = {
  title: "Política de Privacidade",
  description:
    "Política de privacidade do AtendeZap IA sobre coleta de dados, entrega do ebook, comunicações, pagamentos via Stripe e tracking opcional.",
  alternates: {
    canonical: "/privacidade"
  }
};

const sections = [
  {
    title: "1. Dados que podemos coletar",
    content:
      "Podemos coletar nome, e-mail, WhatsApp quando informado, tipo de atuação, dados do negócio, informações de cadastro, uso do produto, plano contratado e dados técnicos necessários para manter o serviço funcionando."
  },
  {
    title: "2. Como usamos os dados",
    content:
      "Usamos os dados para entregar o ebook, criar e manter a conta, enviar comunicações sobre o AtendeZap IA, operar o dashboard, processar assinaturas, prestar suporte e melhorar a experiência do usuário."
  },
  {
    title: "3. Ebook, leads e comunicações",
    content:
      "Quando uma pessoa solicita o ebook, podemos salvar os dados enviados no formulário e as UTMs da campanha para entender a origem do lead. Também podemos enviar o material por e-mail e comunicações relacionadas ao produto."
  },
  {
    title: "4. Cookies, UTMs e tracking",
    content:
      "Podemos usar cookies, localStorage ou tecnologias similares para preservar UTMs e medir o funil. Google Analytics 4 e Meta Pixel só carregam quando configurados no ambiente. Esses recursos ajudam a medir visitas, leads e intenção de compra."
  },
  {
    title: "5. Pagamentos",
    content:
      "Pagamentos e assinaturas são processados pela Stripe. O AtendeZap IA não armazena dados completos de cartão no navegador nem no banco da aplicação. Dados de cobrança ficam sujeitos também às políticas da Stripe."
  },
  {
    title: "6. Provedores usados",
    content:
      "Podemos usar Supabase para autenticação e banco de dados, OpenAI para geração de respostas, Resend para envio de e-mails, Stripe para pagamentos e ferramentas de analytics quando configuradas."
  },
  {
    title: "7. Segurança e retenção",
    content:
      "Mantemos apenas dados necessários para operar o serviço, entregar materiais, prestar suporte e cumprir obrigações básicas. Aplicamos controles para não expor chaves secretas no front-end e restringir acesso administrativo."
  },
  {
    title: "8. Solicitação de remoção",
    content:
      "Você pode solicitar acesso, correção ou remoção dos seus dados entrando em contato pelo e-mail de suporte. Algumas informações podem precisar ser mantidas por obrigações legais, antifraude ou registro financeiro."
  }
];

export default function PrivacyPage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-4xl px-4 py-14 md:py-20">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Privacidade</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-5xl">Política de Privacidade</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Esta política resume como o AtendeZap IA trata dados pessoais em páginas públicas, captura de leads, cadastro,
          assinatura, envio de e-mails e uso do produto.
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
            Veja também os{" "}
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
