import { PricingPageContent } from "@/components/pricing/PricingPageContent";

export const metadata = {
  title: "Planos e preços",
  description:
    "Compare os planos Starter, Pro e Premium do AtendeZap IA. O Plano Pro tem primeiro mês por R$ 29 para novos usuários.",
  alternates: {
    canonical: "/precos"
  },
  openGraph: {
    title: "Planos do AtendeZap IA",
    description:
      "Escolha um plano mensal para gerar respostas com IA para atendimento pelo WhatsApp."
  }
};

export default function PricingPage() {
  return <PricingPageContent />;
}
