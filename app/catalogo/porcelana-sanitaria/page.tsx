import Layout from "@/components/shared/Layout";
import Catalog from "@/components/decortiles/Catalog";

// Ruta antigua: se conserva para no romper enlaces y muestra los sanitarios del catálogo nuevo.
export default function PorcelanaSanitariaPage() {
  return (
    <Layout dark>
      <Catalog initialFilter="sanitarios" />
    </Layout>
  );
}
