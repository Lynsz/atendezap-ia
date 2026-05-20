import { PricingPageContent } from "@/components/pricing/PricingPageContent";

export const metadata = {
  title: "AtendeZap IA — Respostas com IA para WhatsApp",
  description:
    "Crie respostas rápidas e profissionais para clientes no WhatsApp com ajuda da IA. Ideal para autônomos, prestadores de serviço e pequenos negócios.",
  alternates: {
    canonical: "/precos"
  },
  openGraph: {
    title: "AtendeZap IA — Planos para respostas com IA no WhatsApp",
    description:
      "Compare Starter, Pro e Premium para criar respostas rápidas e profissionais para clientes no WhatsApp com ajuda da IA."
  }
};

export default function PricingPage() {
  return <PricingPageContent />;
}
