import SignupPage from "@/components/pages/SignupPage";

export const metadata = {
  title: "Cadastro",
  description:
    "Crie sua conta no AtendeZap IA para gerar respostas profissionais para clientes no WhatsApp usando inteligência artificial.",
  alternates: {
    canonical: "/cadastro"
  }
};

export default function SignupRoutePage() {
  return <SignupPage />;
}
