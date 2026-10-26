"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { money } from "@/lib/shop-config";
import { useCart } from "./CartContext";
import CartLines from "./CartLines";
import FreeShippingBar from "./FreeShippingBar";

export default function CartDrawer() {
  const { drawerOpen, closeDrawer, lines, count, totals, clear } = useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <div
      className={`dt-cart-overlay${drawerOpen ? " is-open" : ""}`}
      onClick={(e) => e.target === e.currentTarget && closeDrawer()}
      aria-hidden={!drawerOpen}
    >
      <aside className="dt-cart" role="dialog" aria-modal="true" aria-label="Carrito de compra">
        <header className="dt-cart__head">
          <div>
            <div className="dt-eyebrow">Tu selección</div>
            <h2 className="dt-cart__title">
              Carrito <span>{count}</span>
            </h2>
          </div>
          <button className="dt-cart__close" onClick={closeDrawer} aria-label="Cerrar carrito">
            <X size={22} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="dt-cart__empty">
            <span className="dt-cart__emptyicon">
              <ShoppingBag size={34} strokeWidth={1.3} />
            </span>
            <p>Tu carrito está vacío.</p>
            <small>Agrega las referencias que te gustan y cotiza todo en un solo pedido.</small>
            <Link href="/catalogo/" className="dt-btn dt-btn--primary" onClick={closeDrawer}>
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <>
            {drawerOpen && (
              <div className="dt-cart__body">
                <FreeShippingBar totals={totals} />
                <CartLines />
                <button className="dt-cart__clear" onClick={clear}>
                  Vaciar carrito
                </button>
              </div>
            )}
            <footer className="dt-cart__foot">
              <div className="dt-cart__sum">
                <span>Subtotal</span>
                <strong>{money(totals.subtotal)}</strong>
              </div>
              <p className="dt-cart__note">
                {totals.subtotal == null
                  ? "Recibirás la cotización con precios y envío antes de pagar."
                  : "El envío se calcula en el checkout según tu ciudad."}
              </p>
              <Link href="/checkout/" className="dt-btn dt-btn--primary dt-cart__cta" onClick={closeDrawer}>
                Finalizar pedido <ArrowRight size={15} />
              </Link>
              <Link href="/carrito/" className="dt-cart__link" onClick={closeDrawer}>
                Ver carrito completo
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
