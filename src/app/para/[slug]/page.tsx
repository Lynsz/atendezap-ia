import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NicheLandingPage } from "@/components/marketing/NicheLandingPage";
import { getNiche, NICHE_SLUGS } from "@/config/niches";

type NichePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return NICHE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: NichePageProps): Promise<Metadata> {
  const { slug } = await params;
  const niche = getNiche(slug);
  if (!niche) return {};

  return {
    title: niche.seo.title,
    description: niche.seo.description,
    alternates: {
      canonical: niche.route
    },
    openGraph: {
      title: niche.seo.title,
      description: niche.seo.description,
      url: niche.route
    }
  };
}

export default async function NichePage({ params }: NichePageProps) {
  const { slug } = await params;
  const niche = getNiche(slug);

  if (!niche) notFound();

  return <NicheLandingPage niche={niche} />;
}
