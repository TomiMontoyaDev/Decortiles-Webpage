"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { findProduct, imgSrc, thumbSrc, type CatalogProduct } from "@/lib/catalog-data";
import { kgPerUnit, priceOf, unitOf } from "@/lib/shop-config";
import { computeTotals, shippingMethod, type OrderLine, type Totals } from "@/lib/orders";

const KEY = "dt-cart-v1";

interface StoredCart {
  items: { id: string; qty: number }[];
  updatedAt: number;
}

export interface CartLine extends OrderLine {
  product: CatalogProduct;
}

interface CartApi {
  ready: boolean;
  lines: CartLine[];
  count: number;
  totals: Totals;
  /** Momento del último cambio (para el recordatorio de carrito) */
  updatedAt: number;
  add: (p: CatalogProduct, qty?: number, from?: HTMLElement | null) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  /** Último producto agregado → modal de confirmación */
  lastAdded: { product: CatalogProduct; qty: number } | null;
  dismissAdded: () => void;
  bump: number;
}

const Ctx = createContext<CartApi | null>(null);

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return c;
}

const prefersReduced = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Clona la foto del producto y la hace volar hasta el ícono del carrito visible */
function flyToCart(from: HTMLElement, src: string) {
  if (prefersReduced()) return;
  const target = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-target]")).find(
    (el) => el.offsetParent !== null,
  );
  if (!target) return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const size = Math.min(140, Math.max(60, a.width * 0.5));
  const ghost = document.createElement("img");
  ghost.src = imgSrc(thumbSrc(src));
  ghost.onerror = () => {
    ghost.onerror = null;
    ghost.src = imgSrc(src);
  };
  ghost.className = "dt-fly";
  Object.assign(ghost.style, {
    width: `${size}px`,
    height: `${size}px`,
    left: `${a.left + a.width / 2 - size / 2}px`,
    top: `${a.top + a.height / 2 - size / 2}px`,
  });
  document.body.appendChild(ghost);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  ghost
    .animate(
      [
        { transform: "translate(0,0) scale(1) rotate(0)", opacity: 1 },
        { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 90}px) scale(0.7) rotate(-8deg)`, opacity: 1, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.12) rotate(6deg)`, opacity: 0.4 },
      ],
      { duration: 820, easing: "cubic-bezier(0.55, 0, 0.35, 1)" },
    )
    .finished.finally(() => ghost.remove());
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<StoredCart["items"]>([]);
  const [updatedAt, setUpdatedAt] = useState(0);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartApi["lastAdded"]>(null);
  const [bump, setBump] = useState(0);
  const addedTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    try {
      const s: StoredCart = JSON.parse(localStorage.getItem(KEY) || "null");
      if (s?.items) {
        setItems(s.items.filter((i) => findProduct(i.id)));
        setUpdatedAt(s.updatedAt || 0);
      }
    } catch {}
    setReady(true);
    // Sincroniza entre pestañas
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      try {
        const s: StoredCart = JSON.parse(e.newValue || "null");
        setItems(s?.items ?? []);
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const dirty = useRef(false);
  const commit = useCallback((fn: (prev: StoredCart["items"]) => StoredCart["items"]) => {
    dirty.current = true;
    setItems((prev) => fn(prev).filter((i) => i.qty > 0));
  }, []);

  // Guarda solo los cambios hechos por el usuario (no la lectura inicial)
  useEffect(() => {
    if (!dirty.current) return;
    dirty.current = false;
    const now = Date.now();
    setUpdatedAt(now);
    try {
      localStorage.setItem(KEY, JSON.stringify({ items, updatedAt: now } satisfies StoredCart));
    } catch {}
  }, [items]);

  const add = useCallback<CartApi["add"]>(
    (p, qty = 1, from) => {
      commit((prev) =>
        prev.some((i) => i.id === p.id)
          ? prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i))
          : [...prev, { id: p.id, qty }],
      );
      if (from) flyToCart(from, p.image);
      window.clearTimeout(addedTimer.current);
      // El modal aparece cuando la foto "aterriza" en el carrito
      addedTimer.current = window.setTimeout(
        () => {
          setBump((b) => b + 1);
          setLastAdded({ product: p, qty });
        },
        from && !prefersReduced() ? 650 : 0,
      );
    },
    [commit],
  );

  const setQty = useCallback(
    (id: string, qty: number) => commit((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(0, Math.min(999, qty)) } : i))),
    [commit],
  );
  const remove = useCallback((id: string) => commit((prev) => prev.filter((i) => i.id !== id)), [commit]);
  const clear = useCallback(() => commit(() => []), [commit]);

  const lines = useMemo<CartLine[]>(
    () =>
      items.flatMap((i) => {
        const p = findProduct(i.id);
        if (!p) return [];
        return [
          {
            id: p.id,
            name: p.name,
            collection: p.collection,
            image: p.image,
            unit: unitOf(p),
            qty: i.qty,
            unitPrice: priceOf(p.id),
            kgPerUnit: kgPerUnit(p),
            product: p,
          },
        ];
      }),
    [items],
  );

  const totals = useMemo(() => computeTotals(lines, shippingMethod("local")), [lines]);
  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);

  const api: CartApi = {
    ready,
    lines,
    count,
    totals,
    updatedAt,
    add,
    setQty,
    remove,
    clear,
    drawerOpen,
    openDrawer: useCallback(() => {
      setLastAdded(null);
      setDrawerOpen(true);
    }, []),
    closeDrawer: useCallback(() => setDrawerOpen(false), []),
    lastAdded,
    dismissAdded: useCallback(() => setLastAdded(null), []),
    bump,
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
