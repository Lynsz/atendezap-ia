import PrivacyDashboardPage from "@/components/pages/PrivacyDashboardPage";

export const metadata = {
  title: "Privacidade",
  description: "Solicitacoes de exportacao e exclusao de dados no AtendeZap IA.",
  robots: {
    index: false,
    follow: false
  }
};

export default function PrivacyDashboardRoutePage() {
  return <PrivacyDashboardPage />;
}
