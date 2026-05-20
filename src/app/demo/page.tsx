import { PublicDemo } from "@/components/demo/PublicDemo";

export const metadata = {
  title: "Demo gratuita",
  description: "Teste como o AtendeZap IA gera respostas para WhatsApp antes de criar sua conta.",
  alternates: {
    canonical: "/demo"
  },
  openGraph: {
    title: "Teste o AtendeZap IA",
    description: "Digite uma pergunta de cliente e veja uma resposta pronta em poucos segundos."
  }
};

export default function DemoPage() {
  return <PublicDemo />;
}
