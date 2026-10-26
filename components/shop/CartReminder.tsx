"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import ProductThumb from "./ProductThumb";
import { useCart } from "./CartContext";
import ShopModal from "./ShopModal";

/** Minutos sin tocar el carrito para mostrar "tu selección te espera" al volver */
const RETURN_AFTER_MIN = 30;
const SESSION_KEY = "dt-cart-reminded";
const HIDDEN_ON = ["/checkout", "/carrito", "/admin", "/factura"];

/**
 * Llamados para volver al carrito:
 *  1. Modal al regresar al sitio si el carrito quedó con productos.
 *  2. Modal de "intención de salida" en escritorio (una vez por sesión).
 *  3. Botón flotante con el resumen del carrito.
 */
export default function CartReminder() {
  const { ready, count, lines, updatedAt, openDrawer, drawerOpen, lastAdded } = useCart();
  const pathname = usePathname() || "/";
  const hidden = HIDDEN_ON.some((p) => pathname.startsWith(p));
  const [open, setOpen] = useState<"return" | "exit" | null>(null);

  const markShown = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
  };
  const alreadyShown = () => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return true;
    }
  };

  // 1. Regreso al sitio
  useEffect(() => {
    if (!ready || hidden || count === 0 || alreadyShown()) return;
    if (Date.now() - updatedAt < RETURN_AFTER_MIN * 60_000) return;
    const t = window.setTimeout(() => {
      setOpen("return");
      markShown();
    }, 1800);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // 2. Intención de salida (el cursor sale por arriba de la ventana)
  useEffect(() => {
    if (!ready || hidden || count === 0) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const armedAt = Date.now();
    const onOut = (e: MouseEvent) => {
      if (e.relatedTarget || e.clientY > 0 || Date.now() - armedAt < 12_000 || alreadyShown()) return;
      setOpen("exit");
      markShown();
    };
    document.addEventListener("mouseout", onOut);
    return () => document.removeEventListener("mouseout", onOut);
  }, [ready, hidden, count]);

  const close = useCallback(() => setOpen(null), []);
  const preview = lines.slice(0, 3);

  return (
    <>
      <ShopModal open={!!open && count > 0} onClose={close} label="Recordatorio de carrito" className="dt-remind">
        <div className="dt-remind__stack" aria-hidden="true">
          {preview.map((l, i) => (
            <span key={l.id} style={{ ["--i" as string]: i }}>
              <ProductThumb id={l.id} src={l.image} alt="" />
            </span>
          ))}
        </div>
        <div className="dt-eyebrow">{open === "exit" ? "¡Espera!" : "Bienvenido de nuevo"}</div>
        <h3 className="dt-remind__title">
          {open === "exit" ? "No pierdas tu selección" : "Tu selección te espera"}
        </h3>
        <p className="dt-remind__text">
          Tienes {count} {count === 1 ? "producto" : "productos"} en el carrito. Finaliza tu pedido y un asesor confirma
          disponibilidad, precio y envío.
        </p>
        <div className="dt-added__actions">
          <button
            className="dt-btn dt-btn--ghost dt-btn--sm"
            onClick={() => {
              close();
              openDrawer();
            }}
          >
            Ver carrito
          </button>
          <Link href="/checkout/" className="dt-btn dt-btn--primary dt-btn--sm" onClick={close}>
            Finalizar pedido <ArrowRight size={14} />
          </Link>
        </div>
      </ShopModal>

      {ready && !hidden && (
        <button
          type="button"
          className={`dt-cartpill${count > 0 && !drawerOpen && !lastAdded ? " is-in" : ""}`}
          onClick={openDrawer}
          data-cart-target={count > 0 ? "" : undefined}
          tabIndex={count > 0 ? 0 : -1}
          aria-label="Ver carrito"
        >
          <span className="dt-cartpill__icon">
            <ShoppingBag size={17} />
            <b>{count}</b>
          </span>
          <span className="dt-cartpill__text">Ver carrito</span>
          <ArrowRight size={14} />
        </button>
      )}
    </>
  );
}
