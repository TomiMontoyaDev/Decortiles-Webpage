"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import {
  CATEGORIES,
  PRODUCTS,
  getSpecs,
  type CatalogProduct,
  type CategoryId,
} from "@/lib/catalog-data";
import { WA_ASESOR, WA_COTIZAR, YEARS_EXPERIENCE } from "@/lib/site";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import ProductImage from "./ProductImage";
import { BoxSvg, SpecSvg, WhatsAppSvg } from "./icons";
import { PARTICLES, useReveal } from "./useReveal";

export type CatalogFilter = "todos" | CategoryId;

const MAIN_CATS: CategoryId[] = ["porcelanatos", "paredes", "pisos"];

/** Producto de la colección especial (bloque destacado, no está en la grilla) */
const FEATURED: CatalogProduct = {
  id: "featured-sm001h",
  category: "porcelanatos",
  name: "Porcelanato Mosaico Terra SM001H",
  collection: "Colección Especial 2026",
  size: "60×120 cm",
  box: ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"],
  image: "/images/Primera entrega/29.png",
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export default function Catalog({ initialFilter = "todos" }: { initialFilter?: CatalogFilter }) {
  const [filter, setFilter] = useState<CatalogFilter>(initialFilter);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CatalogProduct | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);

  const q = norm(query.trim());
  const matches = useCallback(
    (p: CatalogProduct) => q === "" || norm(`${p.name} ${p.collection} ${p.tag ?? ""}`).includes(q),
    [q],
  );

  const main = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          MAIN_CATS.includes(p.category) &&
          (filter === "todos" || p.category === filter) &&
          matches(p),
      ),
    [filter, matches],
  );
  const sanitarios = useMemo(
    () => PRODUCTS.filter((p) => p.category === "sanitarios" && matches(p)),
    [matches],
  );
  const lavamanos = useMemo(
    () => PRODUCTS.filter((p) => p.category === "lavamanos" && matches(p)),
    [matches],
  );

  const showMain = filter === "todos" || MAIN_CATS.includes(filter as CategoryId);
  const showSan = (filter === "todos" || filter === "sanitarios") && sanitarios.length > 0;
  const showLav = (filter === "todos" || filter === "lavamanos") && lavamanos.length > 0;
  const total =
    (showMain ? main.length : 0) + (showSan ? sanitarios.length : 0) + (showLav ? lavamanos.length : 0);

  useReveal([filter, q]);

  // Parallax suave del hero (igual que el catálogo HTML)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (heroImgRef.current && y < window.innerHeight)
        heroImgRef.current.style.transform = `translateY(${y * 0.3}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Si llegan con un filtro (ej. /catalogo/pisos) bajamos directo a los productos
  useEffect(() => {
    if (initialFilter !== "todos") scrollToToolbar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scrollToToolbar() {
    setTimeout(() => {
      const el = toolbarRef.current;
      if (!el) return;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
    }, 60);
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: PRODUCTS.length };
    CATEGORIES.forEach((cat) => (c[cat.id] = PRODUCTS.filter((p) => p.category === cat.id).length));
    return c;
  }, []);

  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <div className="dt dt-catalog">
      {/* ===== HERO DEL CATÁLOGO ===== */}
      <section className="dt-chero">
        <div className="dt-chero__bg" />
        <div className="dt-chero__grid" />
        <div className="dt-chero__img" ref={heroImgRef}>
          <ProductImage
            src="/images/Primera entrega/1.png"
            fallback="/images/colecciones/wall_abstracto.jpeg"
            alt=""
            className="dt-chero__imgtag"
            eager
          />
        </div>
        <div className="dt-chero__fade" />
        <div className="dt-particles" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <span key={i} style={{ ["--x" as string]: p.x, ["--y" as string]: p.y, ["--d" as string]: p.d, ["--delay" as string]: p.delay }} />
          ))}
        </div>
        <div className="dt-container dt-chero__content">
          <div className="dt-eyebrow dt-anim-1">Colección 2026 · Importadores directos</div>
          <h1 className="dt-chero__title dt-anim-2">
            Catálogo
            <span>Decortiles</span>
          </h1>
          <p className="dt-chero__sub dt-anim-3">
            Porcelanatos, cerámicas, pisos y revestimientos importados para proyectos residenciales y
            comerciales. Más de {YEARS_EXPERIENCE} años ayudándote a elegir bien.
          </p>
          <div className="dt-line dt-anim-4" />
          <div className="dt-btns dt-anim-5">
            <button className="dt-btn dt-btn--primary" onClick={scrollToToolbar}>
              Ver productos
            </button>
            <a className="dt-btn dt-btn--ghost" href={WA_ASESOR} target="_blank" rel="noopener noreferrer">
              Hablar con un asesor
            </a>
          </div>
        </div>
      </section>

      {/* ===== COLECCIÓN ESPECIAL ===== */}
      <section className="dt-container dt-feature-wrap">
        <div className="dt-feature">
          <div className="dt-feature__text dt-reveal dt-reveal--left">
            <div className="dt-eyebrow">Colección Especial 2026</div>
            <h2 className="dt-feature__title">
              Porcelanato
              <em>mosaico terra</em>
              sm001h
            </h2>
            <p className="dt-feature__desc">
              Una propuesta que mezcla madera y geometría para crear espacios únicos y con
              personalidad. Diseño moderno para interiores y exteriores.
            </p>
            <div className="dt-divider" />
            <div className="dt-specs dt-specs--lg">
              {FEATURED.box!.map((b) => (
                <span className="dt-spec" key={b}>
                  <BoxSvg label={b} />
                  <span>{b}</span>
                </span>
              ))}
            </div>
            <div className="dt-feature__specs">
              {getSpecs(FEATURED).map((s) => (
                <div className="dt-feature__spec" key={s.label}>
                  <span className="dt-feature__specicon">
                    <SpecSvg icon={s.icon} />
                  </span>
                  {s.label}
                </div>
              ))}
            </div>
            <button className="dt-link" onClick={() => setSelected(FEATURED)}>
              Ver más →
            </button>
          </div>
          <div className="dt-feature__img dt-reveal dt-reveal--right">
            <ProductImage
              src={FEATURED.image}
              fallback="/images/colecciones/ceramica_madera.jpeg"
              alt="Porcelanato Mosaico Terra SM001H"
            />
          </div>
        </div>
      </section>

      {/* ===== FILTROS + BÚSQUEDA ===== */}
      <section id="productos" className="dt-products">
        <div className="dt-toolbar" ref={toolbarRef}>
          <div className="dt-filters" role="tablist" aria-label="Filtrar por categoría">
            {(["todos", "porcelanatos", "paredes", "pisos", "sanitarios", "lavamanos"] as CatalogFilter[]).map(
              (f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  className={`dt-filter${filter === f ? " is-active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "todos" ? "Todos" : CATEGORIES.find((c) => c.id === f)!.label}
                  <small>{counts[f]}</small>
                </button>
              ),
            )}
          </div>
          <label className="dt-search">
            <Search size={15} aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar producto…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar producto"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Limpiar búsqueda">
                <X size={14} />
              </button>
            )}
          </label>
        </div>
        <div className="dt-count">
          {total} {total === 1 ? "referencia" : "referencias"}
          {query && (
            <>
              {" "}
              para «<strong>{query}</strong>»
            </>
          )}
        </div>

        {showMain && main.length > 0 && (
          <div className="dt-grid">
            {main.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onOpen={setSelected} />
            ))}
          </div>
        )}

        {total === 0 && (
          <div className="dt-empty">
            <p>No encontramos productos con ese nombre.</p>
            <a className="dt-btn dt-btn--ghost" href={WA_ASESOR} target="_blank" rel="noopener noreferrer">
              Pregúntale a un asesor
            </a>
          </div>
        )}
      </section>

      {/* ===== SANITARIOS ===== */}
      {showSan && (
        <section id="sanitarios" className="dt-subsection">
          <div className="dt-sep" />
          <div className="dt-sec-head dt-reveal">
            <div>
              <div className="dt-eyebrow">Colección Premium · 2026</div>
              <h2 className="dt-sec-title">
                Sanit<em>arios</em>
              </h2>
              <div className="dt-pill">Línea Premium</div>
            </div>
            <p className="dt-sec-desc">
              Diseños elegantes, tecnología avanzada y acabados de primera calidad para transformar
              cada espacio.
            </p>
          </div>
          <div className="dt-grid dt-grid--4">
            {sanitarios.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onOpen={setSelected} contain />
            ))}
          </div>
        </section>
      )}

      {/* ===== LAVAMANOS ===== */}
      {showLav && (
        <section id="lavamanos" className="dt-subsection">
          <div className="dt-sep" />
          <div className="dt-sec-head dt-reveal">
            <div>
              <div className="dt-eyebrow">Colección Premium · 2026</div>
              <h2 className="dt-sec-title">
                Lavam<em>anos</em>
              </h2>
              <div className="dt-pill">Línea Premium</div>
            </div>
            <p className="dt-sec-desc">
              Lavamanos y placas sanitarias con líneas limpias para baños modernos, residenciales y
              comerciales.
            </p>
          </div>
          <div className="dt-grid dt-grid--4">
            {lavamanos.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onOpen={setSelected} contain />
            ))}
          </div>
        </section>
      )}

      {/* ===== CTA COTIZACIÓN ===== */}
      <div className="dt-container">
        <div className="dt-banner dt-reveal" id="contacto">
          <h2 className="dt-banner__title">
            ¿Ya tienes
            <em>tu elección?</em>
          </h2>
          <p className="dt-banner__body">
            Envíanos las referencias que te gustaron y los metros de tu espacio. Un asesor confirma
            disponibilidad y te envía la cotización.
          </p>
          <a className="dt-btn dt-btn--primary" href={WA_COTIZAR} target="_blank" rel="noopener noreferrer">
            <WhatsAppSvg size={16} /> Solicitar cotización
          </a>
        </div>
      </div>

      <ProductModal product={selected} onClose={closeModal} />
    </div>
  );
}
