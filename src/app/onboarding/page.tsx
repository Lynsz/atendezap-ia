import { redirect } from "next/navigation";

export const metadata = {
  title: "Configuração inicial",
  description: "Configure seus dados de atendimento para gerar respostas melhores com o AtendeZap IA.",
  robots: {
    index: false,
    follow: false
  }
};

export default function OnboardingRoutePage() {
  redirect("/dashboard");
}
