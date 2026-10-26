"use client";

import { useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog-data";
import { getSpecs } from "@/lib/catalog-data";
import { money, priceOf } from "@/lib/shop-config";
import { useCart } from "@/components/shop/CartContext";
import ProductImage from "./ProductImage";
import { BoxSvg, SpecSvg } from "./icons";

interface Props {
  product: CatalogProduct;
  onOpen: (p: CatalogProduct) => void;
  index?: number;
  contain?: boolean;
}

export default function ProductCard({ product, onOpen, index = 0, contain }: Props) {
  const specs = getSpecs(product);
  const { add, lines } = useCart();
  const media = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);
  const inCart = lines.find((l) => l.id === product.id)?.qty ?? 0;
  const price = priceOf(product.id);

  function quickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    add(product, 1, media.current?.querySelector("img") ?? media.current);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    // La tarjeta completa abre el detalle; el botón del nombre la hace accesible con teclado
    <article
      className={`dt-card dt-reveal${contain ? " dt-card--contain" : ""}`}
      style={{ transitionDelay: `${(index % 8) * 0.05}s` }}
      onClick={() => onOpen(product)}
    >
      <div className="dt-card__media" ref={media}>
        <ProductImage className="dt-card__img" src={product.image} alt={product.name} />
        <div className="dt-card__overlay" />
        <div className="dt-card__shine" />
        {product.tag && <span className="dt-card__tag">{product.tag}</span>}
        {inCart > 0 && <span className="dt-card__incart">{inCart} en carrito</span>}
        <button
          type="button"
          className={`dt-card__add${added ? " is-done" : ""}`}
          onClick={quickAdd}
          aria-label={`Agregar ${product.name} al carrito`}
        >
          {added ? <Check size={16} /> : <Plus size={16} />}
          <span>{added ? "Agregado" : "Agregar"}</span>
        </button>
      </div>
      <div className="dt-card__info">
        <button type="button" className="dt-card__name" onClick={(e) => (e.stopPropagation(), onOpen(product))}>
          {product.name}
        </button>
        <div className="dt-card__coll">{product.collection}</div>
        {price != null && <div className="dt-card__price">{money(price)}</div>}
        {product.box && product.box.length > 0 && (
          <div className="dt-specs">
            {product.box.map((b) => (
              <span className="dt-spec" key={b}>
                <BoxSvg label={b} />
                <span>{b}</span>
              </span>
            ))}
          </div>
        )}
        <div className="dt-specs dt-specs--soft">
          {specs.map((s) => (
            <span className="dt-spec" key={s.label}>
              <SpecSvg icon={s.icon} />
              <span>{s.label}</span>
            </span>
          ))}
        </div>
        <span className="dt-card__cta">Ver más →</span>
      </div>
    </article>
  );
}
