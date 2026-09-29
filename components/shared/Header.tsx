"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog-data";
import { WA_COTIZAR } from "@/lib/site";

interface HeaderProps {
  /** Header transparente sobre el hero (solo home). Se vuelve sólido al hacer scroll. */
  overlay?: boolean;
  /** Compatibilidad con el prop anterior; ya no se usa */
  fixed?: boolean;
}

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo/", label: "Catálogo", dropdown: true },
  { href: "/#proyectos", label: "Proyectos" },
  { href: "/quienes-somos/", label: "Quiénes somos" },
  { href: "/blog/", label: "Blog" },
  { href: "/contacto/", label: "Contacto" },
];

export default function Header({ overlay = false }: HeaderProps) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(!overlay);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname.startsWith(href.replace(/\/$/, ""));
  };

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  // Barra de progreso de lectura
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--dt-scroll", String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`dt-header${overlay ? " dt-header--overlay" : ""}${scrolled || open ? " is-solid" : ""}`}
      >
        <div className="dt-header__inner">
          <Link href="/" className="dt-header__brand" aria-label="DECORTILES — Inicio">
            <Image src="/logo-card.png" alt="DECORTILES" width={400} height={269} priority className="dt-header__logo" />
            <span className="dt-header__word">
              Decor<span>tiles</span>
            </span>
          </Link>

          <nav className="dt-header__nav" aria-label="Principal">
            {LINKS.map((l) =>
              l.dropdown ? (
                <div className="dt-dd" key={l.href}>
                  <Link href={l.href} className={`dt-navlink${isActive(l.href) ? " is-active" : ""}`}>
                    {l.label} <ChevronDown size={13} aria-hidden="true" />
                  </Link>
                  <div className="dt-dd__menu">
                    {CATEGORIES.map((c) => (
                      <Link key={c.id} href={`/catalogo/${c.id}/`} className="dt-dd__item">
                        <strong>{c.label}</strong>
                        <span>{c.blurb}</span>
                      </Link>
                    ))}
                    <Link href="/catalogo/" className="dt-dd__all">
                      Ver todo el catálogo →
                    </Link>
                  </div>
                </div>
              ) : (
                <Link key={l.href} href={l.href} className={`dt-navlink${isActive(l.href) ? " is-active" : ""}`}>
                  {l.label}
                </Link>
              ),
            )}
          </nav>

          <div className="dt-header__actions">
            <a href={WA_COTIZAR} target="_blank" rel="noopener noreferrer" className="dt-btn dt-btn--primary dt-btn--sm dt-header__cta">
              Cotizar
            </a>
            <button
              className="dt-burger"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <span className="dt-progress" aria-hidden="true" />
      </header>
      {!overlay && <div className="dt-header-spacer" aria-hidden="true" />}

      {/* Menú móvil */}
      <div className={`dt-drawer${open ? " is-open" : ""}`} aria-hidden={!open}>
        <nav className="dt-drawer__nav">
          <Link href="/">Inicio</Link>
          <Link href="/catalogo/">Catálogo</Link>
          <div className="dt-drawer__cats">
            {CATEGORIES.map((c) => (
              <Link key={c.id} href={`/catalogo/${c.id}/`} onClick={() => setOpen(false)}>
                {c.label}
              </Link>
            ))}
          </div>
          <Link href="/#proyectos" onClick={() => setOpen(false)}>
            Proyectos
          </Link>
          <Link href="/quienes-somos/">Quiénes somos</Link>
          <Link href="/blog/">Blog</Link>
          <Link href="/contacto/">Contacto</Link>
        </nav>
        <a href={WA_COTIZAR} target="_blank" rel="noopener noreferrer" className="dt-btn dt-btn--primary dt-drawer__cta">
          Solicitar cotización
        </a>
      </div>
    </>
  );
}
