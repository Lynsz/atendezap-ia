import SaasDashboardPage from "@/components/pages/SaasDashboardPage";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard do AtendeZap IA para configurar atendimento, gerar respostas e acompanhar uso mensal.",
  robots: {
    index: false,
    follow: false
  }
};

export default function DashboardRoutePage() {
  return <SaasDashboardPage />;
}
