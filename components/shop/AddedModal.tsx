"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Plus } from "lucide-react";
import ProductThumb from "./ProductThumb";
import { ProductTags } from "./CartLines";
import { PRODUCTS } from "@/lib/catalog-data";
import { unitLabel, unitOf } from "@/lib/shop-config";
import { useCart } from "./CartContext";
import FreeShippingBar from "./FreeShippingBar";
import ShopModal, { usePresence } from "./ShopModal";

/** Confirmación al agregar: invita a seguir viendo, abrir el carrito o finalizar */
export default function AddedModal() {
  const { lastAdded, dismissAdded, openDrawer, count, totals, add, lines } = useCart();
  const { shown } = usePresence(lastAdded);

  const related = useMemo(() => {
    if (!shown) return [];
    const inCart = new Set(lines.map((l) => l.id));
    return PRODUCTS.filter((p) => p.category === shown.product.category && !inCart.has(p.id)).slice(0, 3);
  }, [shown, lines]);

  return (
    <ShopModal open={!!lastAdded} onClose={dismissAdded} label="Producto agregado al carrito" className="dt-added">
      {shown && (
        <>
          <div className="dt-added__head">
            <span className="dt-check" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <div>
              <div className="dt-added__title">¡Agregado al carrito!</div>
              <div className="dt-added__sub">
                {count} {count === 1 ? "producto" : "productos"} en tu selección
              </div>
            </div>
          </div>

          <div className="dt-added__item">
            <ProductThumb id={shown.product.id} src={shown.product.image} alt={shown.product.name} className="dt-added__img" />
            <div>
              <ProductTags product={shown.product} />
              <div className="dt-cline__name">{shown.product.name}</div>
              <div className="dt-added__qty">
                +{shown.qty} {unitLabel(unitOf(shown.product), shown.qty)}
              </div>
            </div>
          </div>

          <FreeShippingBar totals={totals} />

          <div className="dt-added__actions">
            <button className="dt-btn dt-btn--ghost dt-btn--sm" onClick={dismissAdded}>
              Seguir viendo
            </button>
            <button className="dt-btn dt-btn--ghost dt-btn--sm" onClick={openDrawer}>
              Ver carrito
            </button>
            <Link href="/checkout/" className="dt-btn dt-btn--primary dt-btn--sm" onClick={dismissAdded}>
              Finalizar pedido
            </Link>
          </div>

          {related.length > 0 && (
            <div className="dt-added__rel">
              <div className="dt-eyebrow">Combina con</div>
              <div className="dt-added__relgrid">
                {related.map((p) => (
                  <button key={p.id} className="dt-rel" onClick={(e) => add(p, 1, e.currentTarget.querySelector("img"))}>
                    <ProductThumb id={p.id} src={p.image} alt={p.name} className="dt-rel__img">
                      <span className="dt-rel__plus">
                        <Plus size={14} />
                      </span>
                    </ProductThumb>
                    <span className="dt-rel__name">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </ShopModal>
  );
}
