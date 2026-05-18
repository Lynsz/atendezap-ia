import LoginPage from "@/components/pages/LoginPage";

export const metadata = {
  title: "Login",
  description: "Entre no AtendeZap IA para acessar seu dashboard, configurar seu atendimento e gerar respostas com IA.",
  robots: {
    index: false,
    follow: true
  }
};

export default function LoginRoutePage() {
  return <LoginPage />;
}
