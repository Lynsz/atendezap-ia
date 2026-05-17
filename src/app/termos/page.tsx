export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-black text-ink">Termos de uso</h1>
      <div className="mt-8 space-y-5 leading-7 text-slate-700">
        <p>O AtendeZap IA e um produto digital automatizado para geracao de kits e respostas de atendimento.</p>
        <p>
          Os planos do AtendeZap IA sao cobrados mensalmente pela plataforma de pagamento recorrente configurada,
          atualmente Stripe.
        </p>
        <p>Nao ha promessa de aumento de vendas, receita, lucro ou qualquer resultado financeiro.</p>
        <p>O conteudo e gerado por IA e deve ser revisado pelo usuario antes do uso com clientes.</p>
        <p>
          O usuario e responsavel por usar as mensagens corretamente, respeitando leis, boas praticas e regras das
          plataformas utilizadas.
        </p>
        <p>A politica de reembolso deve ser configurada na plataforma de pagamento utilizada e informada ao comprador no checkout.</p>
        <p>Nao ha integracao oficial com WhatsApp, Meta ou WhatsApp API nesta versao do produto.</p>
      </div>
    </main>
  );
}
