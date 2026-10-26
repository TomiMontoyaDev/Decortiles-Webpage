import type { Metadata } from "next";
import Layout from "@/components/shared/Layout";
import CartPage from "@/components/shop/CartPage";

export const metadata: Metadata = {
  title: "Carrito — DECORTILES",
  robots: { index: false },
};

export default function CarritoPage() {
  return (
    <Layout dark>
      <div className="dt dt-shop">
        <CartPage />
      </div>
    </Layout>
  );
}
