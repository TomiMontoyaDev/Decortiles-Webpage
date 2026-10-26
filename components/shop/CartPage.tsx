"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { WhatsAppSvg } from "@/components/decortiles/icons";
import { waLink } from "@/lib/site";
import { SHIPPING_METHODS, money, unitLabel } from "@/lib/shop-config";
import { computeTotals } from "@/lib/orders";
import { useCart } from "./CartContext";
import CartLines from "./CartLines";
import FreeShippingBar from "./FreeShippingBar";

export default function CartPage() {
  const { ready, lines, count, totals, clear } = useCart();

  if (!ready) return <div className="dt-shop-empty" />;
  if (lines.length === 0)
    return (
      <div className="dt-shop-empty">
        <span className="dt-cart__emptyicon">
          <ShoppingBag size={40} strokeWidth={1.2} />
        </span>
        <h1 className="dt-sec-title">
          Tu carrito <em>está vacío</em>
        </h1>
        <p>Explora porcelanatos, pisos, paredes, sanitarios y lavamanos y arma tu pedido.</p>
        <Link href="/catalogo/" className="dt-btn dt-btn--primary">
          Explorar catálogo
        </Link>
      </div>
    );

  const quote = [
    "¡Hola DECORTILES! Quiero cotizar estos productos:",
    ...lines.map((l) => `• ${l.qty} ${unitLabel(l.unit, l.qty)} — ${l.name}`),
  ].join("\n");

  return (
    <div className="dt-cartpage">
      <div className="dt-cartpage__main">
        <div className="dt-eyebrow">Tu selección</div>
        <h1 className="dt-checkout__title">
          Carrito <span className="dt-count-chip">{count}</span>
        </h1>
        <CartLines large />
        <div className="dt-cartpage__row">
          <Link href="/catalogo/" className="dt-link">
            ← Seguir viendo productos
          </Link>
          <button className="dt-link" onClick={clear}>
            Vaciar carrito
          </button>
        </div>
      </div>

      <aside className="dt-summary">
        <h2>Resumen</h2>
        <FreeShippingBar totals={totals} />
        <dl className="dt-summary__totals">
          <div>
            <dt>Subtotal</dt>
            <dd>{money(totals.subtotal)}</dd>
          </div>
          <div>
            <dt>Peso estimado</dt>
            <dd>{totals.weightKg} kg</dd>
          </div>
        </dl>
        <div className="dt-shipopts">
          <div className="dt-eyebrow">Opciones de envío</div>
          {SHIPPING_METHODS.map((m) => {
            const t = computeTotals(lines, m);
            return (
              <div key={m.id}>
                <span>
                  {m.label}
                  <small>{m.eta}</small>
                </span>
                <strong className={t.shipping === 0 ? "is-free" : ""}>{t.shipping === 0 ? "Gratis" : money(t.shipping)}</strong>
              </div>
            );
          })}
        </div>
        <Link href="/checkout/" className="dt-btn dt-btn--primary dt-cart__cta">
          Finalizar pedido <ArrowRight size={15} />
        </Link>
        <a className="dt-cart__link dt-cart__link--wa" href={waLink(quote)} target="_blank" rel="noopener noreferrer">
          <WhatsAppSvg size={14} /> Cotizar este carrito por WhatsApp
        </a>
      </aside>
    </div>
  );
}
