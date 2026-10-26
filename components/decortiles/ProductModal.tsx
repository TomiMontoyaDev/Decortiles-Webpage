"use client";

import { useEffect } from "react";
import type { CatalogProduct } from "@/lib/catalog-data";
import { getSpecs } from "@/lib/catalog-data";
import { waLink } from "@/lib/site";
import ProductImage from "./ProductImage";
import { BoxSvg, SpecSvg, WhatsAppSvg } from "./icons";
import AddToCart from "@/components/shop/AddToCart";
import { usePresence } from "@/components/shop/ShopModal";

interface Props {
  product: CatalogProduct | null;
  onClose: () => void;
}

export default function ProductModal({ product: current, onClose }: Props) {
  const open = !!current;
  // Conserva el producto mientras corre la animación de salida
  const { shown: product, leaving } = usePresence(current);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      className={`dt-modal-overlay${open ? " is-active" : ""}${leaving ? " is-leaving" : ""}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-hidden={!open}
    >
      {product && (
        <div className="dt-modal" role="dialog" aria-modal="true" aria-label={product.name}>
          <button className="dt-modal__close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
          <div className="dt-modal__media">
            <ProductImage
              key={product.id}
              className="dt-modal__img"
              src={product.image}
              alt={product.name}
              eager
            />
          </div>
          <div className="dt-modal__info">
            <div className="dt-eyebrow">{product.collection}</div>
            <h2 className="dt-modal__title">{product.name}</h2>
            <div className="dt-divider" />
            {product.box && (
              <div className="dt-specs dt-specs--lg">
                {product.box.map((b) => (
                  <span className="dt-spec" key={b}>
                    <BoxSvg label={b} />
                    <span>{b}</span>
                  </span>
                ))}
              </div>
            )}
            <div className="dt-specs dt-specs--soft dt-specs--lg">
              {getSpecs(product).map((s) => (
                <span className="dt-spec" key={s.label}>
                  <SpecSvg icon={s.icon} />
                  <span>{s.label}</span>
                </span>
              ))}
            </div>
            <AddToCart key={product.id} product={product} />
            <a
              className="dt-modal__wa"
              target="_blank"
              rel="noopener noreferrer"
              href={waLink(
                `¡Hola DECORTILES! Me interesa cotizar: ${product.name} (${product.collection}).`,
              )}
            >
              <WhatsAppSvg size={15} /> ¿Dudas? Cotiza con un asesor
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
