"use client";

import { useState } from "react";
import { imgSrc } from "@/lib/catalog-data";

interface Props {
  src: string;
  alt: string;
  className?: string;
  /** Imagen alternativa si la principal no carga */
  fallback?: string;
  eager?: boolean;
  onLoad?: () => void;
}

/**
 * <img> con respaldo: si la foto del producto no existe todavía en /public/images,
 * muestra la imagen alternativa o un patrón de baldosa con el nombre, nunca un ícono roto.
 */
export default function ProductImage({ src, alt, className, fallback, eager, onLoad }: Props) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  if (stage === 2 || (stage === 1 && !fallback)) {
    return (
      <div className={`dt-ph ${className ?? ""}`} role="img" aria-label={alt}>
        <span>{alt}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={stage === 0 ? imgSrc(src) : imgSrc(fallback!)}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      onLoad={onLoad}
      onError={() => setStage((s) => (s === 0 && fallback ? 1 : 2))}
    />
  );
}
