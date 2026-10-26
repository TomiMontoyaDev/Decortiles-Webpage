"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Maximize2, X } from "lucide-react";
import ProductImage from "@/components/decortiles/ProductImage";
import { findProduct, isObjectPhoto, thumbSrc } from "@/lib/catalog-data";

interface Props {
  id: string;
  src: string;
  alt: string;
  className?: string;
  /** Abre la foto original ampliada al hacer clic */
  zoomable?: boolean;
  children?: React.ReactNode;
}

/**
 * Miniatura de producto para carrito, checkout y pedidos:
 * WebP liviano (con la foto original de respaldo), skeleton mientras carga,
 * aparición suave y sanitarios/lavamanos completos sobre blanco.
 */
export default function ProductThumb({ id, src, alt, className, zoomable, children }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [zoom, setZoom] = useState(false);
  const contain = isObjectPhoto(findProduct(id));

  const cls = `dt-thumb${contain ? " dt-thumb--contain" : ""}${loaded ? " is-loaded" : ""}${zoomable ? " is-zoomable" : ""} ${className ?? ""}`;
  const img = <ProductImage key={src} src={thumbSrc(src)} fallback={src} alt={alt} onLoad={() => setLoaded(true)} />;

  return (
    <>
      {zoomable ? (
        <button type="button" className={cls} onClick={() => setZoom(true)} aria-label={`Ampliar foto de ${alt}`}>
          {img}
          <span className="dt-thumb__zoom" aria-hidden="true">
            <Maximize2 size={13} />
          </span>
          {children}
        </button>
      ) : (
        <span className={cls}>
          {img}
          {children}
        </span>
      )}
      {zoom && <Lightbox src={src} alt={alt} contain={contain} onClose={() => setZoom(false)} />}
    </>
  );
}

function Lightbox({ src, alt, contain, onClose }: { src: string; alt: string; contain: boolean; onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Captura: Escape cierra la foto sin cerrar también el carrito
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      onClose();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  return createPortal(
    <div
      className="dt-lightbox"
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <figure className={`dt-lightbox__fig${contain ? " dt-thumb--contain" : ""}${loaded ? " is-loaded" : ""}`}>
        {/* La miniatura se ve al instante; la original reemplaza cuando termina de cargar */}
        <ProductImage className="dt-lightbox__low" src={thumbSrc(src)} fallback={src} alt="" />
        <ProductImage className="dt-lightbox__hi" src={src} alt={alt} eager onLoad={() => setLoaded(true)} />
        <figcaption>{alt}</figcaption>
      </figure>
      <button type="button" className="dt-lightbox__close" onClick={onClose} aria-label="Cerrar foto">
        <X size={20} />
      </button>
    </div>,
    document.body,
  );
}
