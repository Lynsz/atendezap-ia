import BillingPage from "@/components/pages/BillingPage";

export const metadata = {
  title: "Minha assinatura",
  description: "Acompanhe plano, limite mensal, uso e portal de cobrança do AtendeZap IA.",
  robots: {
    index: false,
    follow: false
  }
};

export default function SubscriptionRoutePage() {
  return <BillingPage />;
}
