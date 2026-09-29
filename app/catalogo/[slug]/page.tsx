import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Layout from "@/components/shared/Layout";
import Catalog from "@/components/decortiles/Catalog";
import { CATEGORIES, type CategoryId } from "@/lib/catalog-data";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// Una página estática por categoría: /catalogo/porcelanatos, /catalogo/pisos, …
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.id === slug);
  return {
    title: cat ? `${cat.label} — Catálogo DECORTILES` : "Catálogo — DECORTILES",
    description: cat?.blurb,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.id === slug);
  if (!cat) notFound();

  return (
    <Layout dark>
      <Catalog initialFilter={cat.id as CategoryId} />
    </Layout>
  );
}
