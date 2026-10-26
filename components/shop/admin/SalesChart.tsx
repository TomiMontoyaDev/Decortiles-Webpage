"use client";

import { useEffect, useRef, useState } from "react";
import { money } from "@/lib/shop-config";

export interface Bucket {
  label: string;
  /** Etiqueta larga para el tooltip */
  full: string;
  value: number;
  orders: number;
}

const H = 220;
const PAD = { top: 16, right: 8, bottom: 26, left: 56 };

const compact = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(v >= 10_000_000 ? 0 : 1)} M` : v >= 1000 ? `$${Math.round(v / 1000)} k` : `$${v}`;

function niceMax(v: number) {
  if (v <= 0) return 1_000_000;
  const p = 10 ** Math.floor(Math.log10(v));
  return [1, 2, 2.5, 5, 10].map((m) => m * p).find((m) => m >= v)!;
}

/** Barras de una sola serie: ventas facturadas por periodo. Tooltip por barra. */
export default function SalesChart({ data }: { data: Bucket[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(640);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const max = niceMax(Math.max(...data.map((d) => d.value), 0));
  const innerW = w - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const step = innerW / Math.max(1, data.length);
  const barW = Math.max(3, Math.min(34, step - 2));
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((k) => k * max);
  const labelEvery = Math.ceil(data.length / Math.max(1, Math.floor(innerW / 54)));
  const h = hover != null ? data[hover] : null;

  return (
    <div className="dt-chart" ref={wrap}>
      <svg width={w} height={H} role="img" aria-label="Ventas facturadas por periodo">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={w - PAD.right} y1={y(t)} y2={y(t)} className="dt-chart__grid" />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="dt-chart__axis">
              {compact(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = PAD.left + i * step + (step - barW) / 2;
          const top = y(d.value);
          const bh = PAD.top + innerH - top;
          const r = Math.min(4, barW / 2, bh);
          return (
            <g key={i}>
              {d.value > 0 && (
                <path
                  className={`dt-chart__bar${hover === i ? " is-hover" : ""}`}
                  d={`M${x},${PAD.top + innerH} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${PAD.top + innerH} Z`}
                  style={{ animationDelay: `${i * 18}ms` }}
                />
              )}
              {i % labelEvery === 0 && (
                <text x={x + barW / 2} y={H - 8} textAnchor="middle" className="dt-chart__axis">
                  {d.label}
                </text>
              )}
              {/* Zona de hover más grande que la barra */}
              <rect
                x={PAD.left + i * step}
                y={PAD.top}
                width={step}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            </g>
          );
        })}
        <line x1={PAD.left} x2={w - PAD.right} y1={PAD.top + innerH} y2={PAD.top + innerH} className="dt-chart__base" />
      </svg>
      {h && hover != null && (
        <div
          className="dt-chart__tip"
          style={{
            left: Math.min(w - 170, Math.max(0, PAD.left + hover * step + step / 2 - 80)),
            top: Math.max(0, y(h.value) - 70),
          }}
        >
          <span>{h.full}</span>
          <strong>{money(h.value)}</strong>
          <small>
            {h.orders} {h.orders === 1 ? "pedido facturado" : "pedidos facturados"}
          </small>
        </div>
      )}
    </div>
  );
}
