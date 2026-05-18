import { Home, LogIn } from "lucide-react";
import { Button } from "@/components/button";

export const metadata = {
  title: "Página não encontrada",
  robots: {
    index: false,
    follow: false
  }
};

export default function NotFound() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Erro 404</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-ink md:text-6xl">Página não encontrada</h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
          O endereço acessado não existe ou foi movido. Volte para uma rota principal do AtendeZap IA.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/">
            <Home className="mr-2 h-4 w-4" />
            Voltar para home
          </Button>
          <Button href="/login" variant="ghost">
            <LogIn className="mr-2 h-4 w-4" />
            Entrar
          </Button>
        </div>
      </section>
    </main>
  );
}
