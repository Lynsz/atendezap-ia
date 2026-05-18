import AdminDashboardPage from "@/components/admin/AdminDashboardPage";

export const metadata = {
  title: "Admin",
  description: "Painel interno do AtendeZap IA para acompanhar leads, assinaturas e métricas básicas.",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminRoutePage() {
  return <AdminDashboardPage />;
}
