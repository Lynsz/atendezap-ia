import { Alert } from "@/components/alert";
import { PricingCard } from "@/components/pricing-card";
import { SectionTitle } from "@/components/section-title";
import { getCheckoutUrl, hasConfiguredCheckout } from "@/lib/checkout";

export default function PricingPage() {
  const basicCheckout = getCheckoutUrl("basic");
  const proCheckout = getCheckoutUrl("pro");
  const premiumCheckout = getCheckoutUrl("premium");

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <SectionTitle title="Planos do AtendeZap IA" eyebrow="Preço inicial R$49">
        Para o MVP, o Plano Profissional é o recomendado para receber um kit completo e vendável.
      </SectionTitle>
      {!hasConfiguredCheckout() ? (
        <div className="mx-auto mt-8 max-w-3xl">
          <Alert tone="info">
            Os links de checkout da Kiwify ainda não foram configurados. Defina as variáveis NEXT_PUBLIC_KIWIFY_CHECKOUT_* para liberar os botões de compra.
          </Alert>
        </div>
      ) : null}
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
      <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-slate-500">
        O AtendeZap IA não é afiliado ao WhatsApp, Meta ou Kiwify. O produto não promete aumento de vendas ou resultado
        financeiro.
      </p>
    </main>
  );
}
