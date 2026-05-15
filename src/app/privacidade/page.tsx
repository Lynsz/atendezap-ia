export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-black text-ink">Política de privacidade</h1>
      <div className="mt-8 space-y-5 leading-7 text-slate-700">
        <p>
          Coletamos dados necessários para entregar o produto, como nome, e-mail, telefone, dados do negócio e conteúdo
          informado no formulário.
        </p>
        <p>Usamos os dados do formulário para gerar o kit de atendimento personalizado e disponibilizar o PDF ao comprador.</p>
        <p>
          Podemos usar provedores externos para operar o serviço: Supabase para banco de dados, OpenAI para geração do
          conteúdo, Resend para envio de e-mails e Kiwify para processamento da assinatura mensal.
        </p>
        <p>
          Não vendemos dados pessoais. Mantemos apenas as informações necessárias para suporte, entrega do produto e
          auditoria básica do fluxo.
        </p>
        <p>O usuário pode solicitar remoção de dados entrando em contato pelo suporte informado no site.</p>
      </div>
    </main>
  );
}
