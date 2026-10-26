"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";

/** Ícono del carrito en el header: abre el drawer y "late" cuando llega un producto */
export default function CartButton() {
  const { count, openDrawer, bump, ready } = useCart();
  const [hit, setHit] = useState(false);

  useEffect(() => {
    if (!bump) return;
    setHit(true);
    const t = window.setTimeout(() => setHit(false), 650);
    return () => window.clearTimeout(t);
  }, [bump]);

  return (
    <button
      type="button"
      className={`dt-cartbtn${hit ? " is-hit" : ""}`}
      onClick={openDrawer}
      aria-label={`Abrir carrito (${count} ${count === 1 ? "producto" : "productos"})`}
      data-cart-target
    >
      <ShoppingBag size={21} strokeWidth={1.7} />
      {ready && count > 0 && (
        <span key={count} className="dt-cartbtn__badge">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
