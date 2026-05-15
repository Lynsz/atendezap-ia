import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "AtendeZap IA",
  description: "Gere um kit completo de mensagens para organizar o atendimento do seu WhatsApp Business."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-extrabold tracking-tight text-brand-700">
              AtendeZap IA
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
              <Link href="/precos" className="hover:text-brand-700">
                Planos
              </Link>
              <Link href="/suporte" className="hover:text-brand-700">
                Suporte
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} AtendeZap IA. Produto digital independente.</p>
            <div className="flex gap-4">
              <Link href="/termos" className="hover:text-brand-700">
                Termos
              </Link>
              <Link href="/privacidade" className="hover:text-brand-700">
                Privacidade
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
