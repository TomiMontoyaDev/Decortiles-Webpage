import type { Metadata } from "next";
import { Suspense } from "react";
import InvoiceView from "@/components/shop/InvoiceView";

export const metadata: Metadata = {
  title: "Factura — DECORTILES",
  robots: { index: false },
};

export default function FacturaPage() {
  return (
    <Suspense>
      <InvoiceView />
    </Suspense>
  );
}
