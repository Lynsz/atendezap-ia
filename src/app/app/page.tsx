import { redirect } from "next/navigation";

export const metadata = {
  title: "AtendeZap IA - Painel"
};

export default function AppRoutePage() {
  redirect("/dashboard");
}
