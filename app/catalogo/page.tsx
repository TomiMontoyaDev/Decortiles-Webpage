import type { Metadata } from "next";
import Layout from "@/components/shared/Layout";
import Catalog from "@/components/decortiles/Catalog";

export const metadata: Metadata = {
  title: "Catálogo 2026 — DECORTILES Cerámica",
  description:
    "Porcelanatos, cerámicas, pisos, revestimientos, sanitarios y lavamanos importados. Cotiza con un asesor DECORTILES.",
};

export default function CatalogoPage() {
  return (
    <Layout dark>
      <Catalog />
    </Layout>
  );
}
