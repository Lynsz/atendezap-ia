import SaasDashboardPage from "@/components/pages/SaasDashboardPage";

export const metadata = {
  title: "Biblioteca de respostas",
  description: "Respostas salvas do AtendeZap IA para copiar e reutilizar.",
  robots: {
    index: false,
    follow: false
  }
};

export default function SavedResponsesDashboardRoutePage() {
  return <SaasDashboardPage initialTab="library" />;
}
