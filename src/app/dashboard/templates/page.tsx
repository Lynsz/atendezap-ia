import SaasDashboardPage from "@/components/pages/SaasDashboardPage";

export const metadata = {
  title: "Templates prontos",
  description: "Templates prontos para WhatsApp por nicho no AtendeZap IA.",
  robots: {
    index: false,
    follow: false
  }
};

export default function WhatsAppTemplatesDashboardRoutePage() {
  return <SaasDashboardPage initialTab="templates" />;
}
