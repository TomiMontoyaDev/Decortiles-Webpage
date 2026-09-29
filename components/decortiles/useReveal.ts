"use client";

import { useEffect } from "react";

/** Anima un número de 0 al valor de data-count (ej. <strong data-count="13">13</strong>) */
function countUp(el: HTMLElement) {
  if (el.dataset.counted) return;
  el.dataset.counted = "1";
  const to = Number(el.dataset.count || el.textContent?.replace(/\D/g, "") || 0);
  const prefix = el.dataset.prefix ?? "";
  const suffix = el.dataset.suffix ?? "";
  const dur = 1600;
  const t0 = performance.now();
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / dur);
    const eased = 1 - Math.pow(1 - k, 3);
    el.textContent = `${prefix}${Math.round(to * eased)}${suffix}`;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * Animación de entrada al hacer scroll para todo elemento con .dt-reveal,
 * y contador animado para los elementos con [data-count].
 * `deps` permite volver a observar cuando cambia la lista (filtros / búsqueda).
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".dt-reveal:not(.is-in)"));
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]:not([data-counted])"));
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || reduce) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          if (el.hasAttribute("data-count")) countUp(el);
          else el.classList.add("is-in");
          io.unobserve(el);
        }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    counters.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Posiciones fijas para las partículas (evita diferencias entre servidor y navegador) */
export const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  x: `${(i * 37 + 11) % 100}%`,
  y: `${(i * 53 + 23) % 100}%`,
  d: `${6 + (i % 5) * 1.5}s`,
  delay: `${(i % 7) * 0.9}s`,
}));
