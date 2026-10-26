import type { Metadata } from "next";
import Layout from "@/components/shared/Layout";
import Checkout from "@/components/shop/Checkout";

export const metadata: Metadata = {
  title: "Finalizar pedido — DECORTILES",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <Layout dark>
      <div className="dt dt-shop">
        <Checkout />
      </div>
    </Layout>
  );
}
