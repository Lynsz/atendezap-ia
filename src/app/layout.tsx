import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { TrackingProvider } from "@/components/tracking/TrackingProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();

export const metadata: Metadata = {
  title: "AtendeZap IA - Respostas com IA para WhatsApp",
  description: "Responda no WhatsApp com mais rapidez usando IA, organize melhor seu atendimento e gere respostas mais profissionais."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {gaMeasurementId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { send_page_view: false });
              `}
            </Script>
          </>
        ) : null}
        {metaPixelId ? (
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
            `}
          </Script>
        ) : null}
        <TrackingProvider />
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-extrabold tracking-tight text-brand-700">
              AtendeZap IA
            </Link>
            <nav className="flex items-center gap-3 text-sm font-bold text-slate-700 md:gap-5">
              <Link href="/#como-funciona" className="hidden hover:text-brand-700 sm:inline">
                Como funciona
              </Link>
              <Link href="/#beneficios" className="hidden hover:text-brand-700 sm:inline">
                Beneficios
              </Link>
              <Link href="/ebook" className="hover:text-brand-700">
                Ebook
              </Link>
              <Link href="/precos" className="hover:text-brand-700">
                Preços
              </Link>
              <Link href="/login" className="hover:text-brand-700">
                Entrar
              </Link>
              <Link href="/cadastro" className="rounded-md bg-brand-600 px-4 py-2 text-white shadow-sm hover:bg-brand-700">
                Cadastro
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
