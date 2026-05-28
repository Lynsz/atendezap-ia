import HelpDashboardPage from "@/components/pages/HelpDashboardPage";

export const metadata = {
  title: "Ajuda",
  description: "Central de ajuda e suporte simples do AtendeZap IA.",
  robots: {
    index: false,
    follow: false
  }
};

export default function HelpDashboardRoutePage() {
  return <HelpDashboardPage />;
}
