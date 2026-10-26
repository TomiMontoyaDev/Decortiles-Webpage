import { Truck } from "lucide-react";
import { FREE_SHIPPING_FROM, money } from "@/lib/shop-config";
import type { Totals } from "@/lib/orders";

/** Barra de progreso hacia el envío gratis */
export default function FreeShippingBar({ totals }: { totals: Totals }) {
  const { subtotal, missingForFree } = totals;
  const pct = subtotal == null ? 0 : Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100);
  const reached = subtotal != null && missingForFree == null;

  return (
    <div className={`dt-freebar${reached ? " is-done" : ""}`}>
      <div className="dt-freebar__text">
        <Truck size={16} aria-hidden="true" />
        {subtotal == null ? (
          <span>
            Envío local <strong>gratis</strong> en compras desde {money(FREE_SHIPPING_FROM)}
          </span>
        ) : reached ? (
          <span>
            ¡Tienes <strong>envío local gratis</strong>!
          </span>
        ) : (
          <span>
            Te faltan <strong>{money(missingForFree)}</strong> para envío gratis
          </span>
        )}
      </div>
      {subtotal != null && (
        <div className="dt-freebar__track" aria-hidden="true">
          <span style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}
