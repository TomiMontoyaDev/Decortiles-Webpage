import type { Metadata } from "next";
import { Suspense } from "react";
import Layout from "@/components/shared/Layout";
import CheckoutResult from "@/components/shop/CheckoutResult";

export const metadata: Metadata = {
  title: "Estado del pedido — DECORTILES",
  robots: { index: false },
};

// Mercado Pago regresa aquí (back_urls) con ?status=…&external_reference=…
export default function ResultadoPage() {
  return (
    <Layout dark>
      <div className="dt dt-shop">
        <Suspense fallback={<div className="dt-result dt-result--loading" />}>
          <CheckoutResult />
        </Suspense>
      </div>
    </Layout>
  );
}
