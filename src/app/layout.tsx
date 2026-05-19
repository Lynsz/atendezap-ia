import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { TrackingProvider } from "@/components/tracking/TrackingProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  applicationName: "AtendeZap IA",
  title: {
    default: "AtendeZap IA - Respostas com IA para WhatsApp",
    template: "%s | AtendeZap IA"
  },
  description:
    "AtendeZap IA ajuda autônomos, prestadores de serviço e pequenos negócios a responder clientes mais rápido no WhatsApp usando inteligência artificial.",
  keywords: [
    "AtendeZap IA",
    "WhatsApp com IA",
    "respostas para WhatsApp",
    "atendimento ao cliente",
    "pequenos negócios",
    "prestadores de serviço"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "AtendeZap IA",
    title: "AtendeZap IA - Respostas com IA para WhatsApp",
    description:
      "Responda clientes mais rápido no WhatsApp com ajuda da IA, organize seu atendimento e gere respostas mais profissionais."
  },
  twitter: {
    card: "summary_large_image",
    title: "AtendeZap IA - Respostas com IA para WhatsApp",
    description:
      "IA para autônomos, prestadores de serviço e pequenos negócios responderem melhor pelo WhatsApp."
  },
  robots: {
    index: true,
    follow: true
  }
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
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:py-4">
            <Link href="/" className="shrink-0 text-lg font-extrabold tracking-tight text-brand-700">
              AtendeZap IA
            </Link>
            <nav className="flex flex-wrap items-center justify-end gap-2 text-sm font-bold text-slate-700 sm:gap-3 md:gap-5">
              <Link href="/#como-funciona" className="hidden hover:text-brand-700 sm:inline">
                Como funciona
              </Link>
              <Link href="/#beneficios" className="hidden hover:text-brand-700 sm:inline">
                Benefícios
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
              <Link href="/cadastro" className="rounded-md bg-brand-600 px-3 py-2 text-white shadow-sm hover:bg-brand-700 sm:px-4">
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
