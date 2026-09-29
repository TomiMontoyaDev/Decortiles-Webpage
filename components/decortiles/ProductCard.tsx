"use client";

import type { CatalogProduct } from "@/lib/catalog-data";
import { getSpecs } from "@/lib/catalog-data";
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
  return (
    <button
      type="button"
      className={`dt-card dt-reveal${contain ? " dt-card--contain" : ""}`}
      style={{ transitionDelay: `${(index % 8) * 0.05}s` }}
      onClick={() => onOpen(product)}
      aria-label={`Ver ${product.name}`}
    >
      <div className="dt-card__media">
        <ProductImage className="dt-card__img" src={product.image} alt={product.name} />
        <div className="dt-card__overlay" />
        <div className="dt-card__shine" />
        {product.tag && <span className="dt-card__tag">{product.tag}</span>}
      </div>
      <div className="dt-card__info">
        <div className="dt-card__name">{product.name}</div>
        <div className="dt-card__coll">{product.collection}</div>
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
    </button>
  );
}
