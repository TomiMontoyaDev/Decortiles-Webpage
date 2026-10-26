"use client";

import { useRef, useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog-data";
import { WASTE_PCT, m2PerBox, money, priceOf, unitLabel, unitOf } from "@/lib/shop-config";
import { useCart } from "./CartContext";

export function QtyStepper({
  value,
  onChange,
  min = 1,
  small,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  small?: boolean;
}) {
  return (
    <div className={`dt-qty${small ? " dt-qty--sm" : ""}`}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Restar" disabled={value <= min}>
        <Minus size={small ? 12 : 14} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={999}
        value={value}
        onChange={(e) => onChange(Math.max(min, Math.min(999, Number(e.target.value) || min)))}
        aria-label="Cantidad"
      />
      <button type="button" onClick={() => onChange(Math.min(999, value + 1))} aria-label="Sumar">
        <Plus size={small ? 12 : 14} />
      </button>
    </div>
  );
}

/** Bloque completo del modal: calculadora de m² → cajas, cantidad y botón agregar */
export default function AddToCart({ product }: { product: CatalogProduct }) {
  const { add } = useCart();
  const perBox = m2PerBox(product);
  const unit = unitOf(product);
  const price = priceOf(product.id);
  const [qty, setQty] = useState(1);
  const [m2, setM2] = useState("");
  const [done, setDone] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  const area = Number(m2.replace(",", "."));
  const suggested = perBox && area > 0 ? Math.ceil((area * (1 + WASTE_PCT)) / perBox) : null;

  function onAdd() {
    add(product, qty, btn.current?.closest(".dt-modal")?.querySelector(".dt-modal__img") as HTMLElement | null);
    setDone(true);
    window.setTimeout(() => setDone(false), 1600);
  }

  return (
    <div className="dt-atc">
      <div className="dt-atc__price">
        <span>{price == null ? "Precio a confirmar" : money(price)}</span>
        <small>{price == null ? "Un asesor confirma el valor de tu pedido" : `por ${unit} · IVA incluido`}</small>
      </div>

      {perBox && (
        <label className="dt-atc__calc">
          <span>¿Cuántos m² necesitas?</span>
          <div className="dt-atc__calcrow">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.1"
              placeholder="Ej. 24"
              value={m2}
              onChange={(e) => setM2(e.target.value)}
            />
            <em>m²</em>
            {suggested && (
              <button type="button" className="dt-atc__use" onClick={() => setQty(suggested)}>
                Usar {suggested} {unitLabel("caja", suggested)}
              </button>
            )}
          </div>
          {suggested && (
            <small>
              {(suggested * perBox).toFixed(2)} m² en {suggested} {unitLabel("caja", suggested)} (incluye {WASTE_PCT * 100}% para
              cortes)
            </small>
          )}
        </label>
      )}

      <div className="dt-atc__row">
        <QtyStepper value={qty} onChange={setQty} />
        <span className="dt-atc__unit">{unitLabel(unit, qty)}</span>
        <button ref={btn} type="button" className={`dt-btn dt-btn--primary dt-atc__btn${done ? " is-done" : ""}`} onClick={onAdd}>
          <span className="dt-atc__icon">{done ? <Check size={16} /> : <ShoppingBag size={16} />}</span>
          {done ? "Agregado" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}
