"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { getOrder, type Order } from "@/lib/orders";
import Invoice from "./Invoice";

/** /factura/?id=DT-… — factura imprimible (Imprimir → Guardar como PDF) */
export default function InvoiceView() {
  const id = useSearchParams().get("id") ?? "";
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    getOrder(id).then(setOrder);
  }, [id]);

  return (
    <div className="dt-invpage">
      <div className="dt-invpage__bar">
        <Link href="/" className="dt-back">
          <ArrowLeft size={14} /> Volver al sitio
        </Link>
        {order && (
          <button className="dt-btn dt-btn--primary dt-btn--sm" onClick={() => window.print()}>
            <Printer size={14} /> Imprimir / PDF
          </button>
        )}
      </div>
      {order === undefined ? null : order ? (
        <Invoice order={order} />
      ) : (
        <p className="dt-invpage__missing">
          No encontramos el documento <strong>{id}</strong> en este dispositivo.
        </p>
      )}
    </div>
  );
}
