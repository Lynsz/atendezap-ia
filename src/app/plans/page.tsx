import { PricingPageContent } from "@/components/pricing/PricingPageContent";

export const metadata = {
  title: "Planos",
  description:
    "Veja os planos mensais do AtendeZap IA para responder clientes mais rápido no WhatsApp com inteligência artificial.",
  alternates: {
    canonical: "/precos"
  },
  robots: {
    index: false,
    follow: true
  }
};

export default function PlansPage() {
  return <PricingPageContent />;
}
