"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { CATEGORIES, type CatalogProduct } from "@/lib/catalog-data";
import { m2PerBox, money, unitLabel } from "@/lib/shop-config";
import ProductThumb from "./ProductThumb";
import { useCart } from "./CartContext";
import { QtyStepper } from "./AddToCart";

/** Categoría · formato · acabado (ej. "Porcelanatos · 60×120 cm · Mate") */
export function ProductTags({ product }: { product: CatalogProduct }) {
  const cat = CATEGORIES.find((c) => c.id === product.category)?.label;
  return (
    <div className="dt-cline__tags">
      {cat && <span className="dt-cline__cat">{cat}</span>}
      <span>{product.size ?? product.collection}</span>
      {product.tag && <span>{product.tag}</span>}
    </div>
  );
}

/** Lista editable de productos del carrito (drawer y página /carrito) */
export default function CartLines({ large }: { large?: boolean }) {
  const { lines, setQty, remove } = useCart();
  const [leaving, setLeaving] = useState<string[]>([]);

  function animateRemove(id: string) {
    setLeaving((l) => [...l, id]);
    window.setTimeout(() => {
      remove(id);
      setLeaving((l) => l.filter((x) => x !== id));
    }, 320);
  }

  return (
    <ul className={`dt-clines${large ? " dt-clines--lg" : ""}`}>
      {lines.map((l, i) => {
        const perBox = m2PerBox(l.product);
        return (
          <li
            key={l.id}
            className={`dt-cline${leaving.includes(l.id) ? " is-leaving" : ""}`}
            style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}
          >
            <ProductThumb id={l.id} src={l.image} alt={l.name} className="dt-cline__img" zoomable />
            <div className="dt-cline__body">
              <ProductTags product={l.product} />
              <div className="dt-cline__name">{l.name}</div>
              <div className="dt-cline__meta">
                <strong>
                  {l.qty} {unitLabel(l.unit, l.qty)}
                </strong>
                {perBox && <span>{(perBox * l.qty).toFixed(2)} m²</span>}
                {l.kgPerUnit > 0 && <span>{Math.round(l.kgPerUnit * l.qty)} kg</span>}
              </div>
              <div className="dt-cline__row">
                <QtyStepper small value={l.qty} onChange={(v) => setQty(l.id, v)} />
                <div className="dt-cline__price">
                  {l.unitPrice == null ? (
                    <>
                      <strong className="dt-cline__tbd">Precio a confirmar</strong>
                      <small>Lo cotiza un asesor</small>
                    </>
                  ) : (
                    <>
                      <strong>{money(l.unitPrice * l.qty)}</strong>
                      <small>
                        {money(l.unitPrice)} / {l.unit}
                      </small>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button type="button" className="dt-cline__rm" onClick={() => animateRemove(l.id)} aria-label={`Quitar ${l.name}`}>
              <Trash2 size={15} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
