export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-black text-ink">Politica de privacidade</h1>
      <div className="mt-8 space-y-5 leading-7 text-slate-700">
        <p>
          Coletamos dados necessarios para entregar o produto, como nome, e-mail, telefone, dados do negocio e conteudo
          informado no formulario.
        </p>
        <p>Usamos os dados do formulario para gerar respostas, kits de atendimento e historico do usuario.</p>
        <p>
          Podemos usar provedores externos para operar o servico: Supabase para banco de dados, OpenAI para geracao de
          conteudo, Resend para envio de e-mails, Stripe para assinatura mensal e Kiwify para funis de aquisicao.
        </p>
        <p>
          Nao vendemos dados pessoais. Mantemos apenas as informacoes necessarias para suporte, entrega do produto,
          cobranca e auditoria basica do fluxo.
        </p>
        <p>O usuario pode solicitar remocao de dados entrando em contato pelo suporte informado no site.</p>
      </div>
    </main>
  );
}
