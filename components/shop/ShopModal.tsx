"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

/** Mantiene montado el contenido mientras corre la animación de salida */
export function usePresence<T>(value: T | null | false, ms = 320) {
  const [shown, setShown] = useState<T | null>(value || null);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (value) {
      setShown(value);
      setLeaving(false);
      return;
    }
    setLeaving(true);
    const t = window.setTimeout(() => {
      setShown(null);
      setLeaving(false);
    }, ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return { shown, leaving };
}

interface Props {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
}

/** Modal pequeño de la tienda (confirmación, recordatorio). Entra y sale animado. */
export default function ShopModal({ open, onClose, label, children, className }: Props) {
  const { shown, leaving } = usePresence(open || null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!shown) return null;
  return (
    <div
      className={`dt-smodal-overlay${leaving ? " is-leaving" : ""}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`dt-smodal ${className ?? ""}`} role="dialog" aria-modal="true" aria-label={label}>
        <button className="dt-smodal__close" onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
