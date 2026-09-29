"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, MessageCircle, Globe2, Boxes, Handshake } from "lucide-react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ProductCard from "@/components/decortiles/ProductCard";
import ProductModal from "@/components/decortiles/ProductModal";
import ProductImage from "@/components/decortiles/ProductImage";
import { WhatsAppSvg } from "@/components/decortiles/icons";
import { PARTICLES, useReveal } from "@/components/decortiles/useReveal";
import { CATEGORIES, FEATURED_IDS, PRODUCTS, type CatalogProduct, type CategoryId } from "@/lib/catalog-data";
import { HORARIO, SEDES, WA_ASESOR, WA_COTIZAR, YEARS_EXPERIENCE } from "@/lib/site";

/* Fotos del hero: porcelanato gran formato (sin la foto del camión) */
const HERO_SLIDES = [
  { src: "/images/colecciones/wall_abstracto.jpeg", pos: "center 40%" },
  { src: "/images/colecciones/ceramica_pared.jpeg", pos: "center 45%" },
  { src: "/images/interior3.jpeg", pos: "center 60%" },
];

/* Imagen de cada categoría: primero la foto del producto, si no existe usa un ambiente */
const CATEGORY_MEDIA: Record<CategoryId, { img: string; fallback: string }> = {
  porcelanatos: { img: "/images/Primera entrega/3.png", fallback: "/images/colecciones/ceramica_pared.jpeg" },
  pisos: { img: "/images/Segunda entrega/40.png", fallback: "/images/colecciones/showroom.jpg" },
  paredes: { img: "/images/Segunda entrega/6.png", fallback: "/images/colecciones/mosaicos_premium.jpeg" },
  sanitarios: { img: "/images/Sanitarios/ZT-904.jpeg", fallback: "/images/interior4.jpeg" },
  lavamanos: { img: "/images/Lavamanos/1.jpeg", fallback: "/images/colecciones/ceramica_clasica.jpeg" },
};

const WHY = [
  {
    icon: Globe2,
    title: "Importadores directos",
    text: "Porcelanatos, cerámicas y acabados seleccionados de diferentes mercados internacionales, con variedad de diseños, formatos y estilos.",
  },
  {
    icon: Boxes,
    title: "Disponibilidad y variedad",
    text: "Contamos con inventario para proyectos de diferentes tamaños, desde la remodelación de un espacio hasta proyectos comerciales y constructivos.",
  },
  {
    icon: Handshake,
    title: "Asesoría personalizada",
    text: "Te acompañamos en la elección del producto según tu espacio, estilo, presupuesto y necesidades del proyecto.",
  },
];

const PROJECTS = [
  { src: "/images/interior.jpeg", label: "Sala · piso efecto madera", cls: "dt-gal--wide" },
  { src: "/images/colecciones/ceramica_pared.jpeg", label: "Muro en porcelanato mármol", cls: "dt-gal--tall" },
  { src: "/images/colecciones/showroom.jpg", label: "Lobby · gran formato", cls: "" },
  { src: "/images/colecciones/ceramica_madera.jpeg", label: "Zona común · madera", cls: "" },
  { src: "/images/interior3.jpeg", label: "Apartamento · piso y muro", cls: "dt-gal--wide" },
  { src: "/images/colecciones/ceramica_clasica.jpeg", label: "Oficinas · piso ajedrezado", cls: "dt-gal--tall" },
  { src: "/images/interior4.jpeg", label: "Comercial · lounge", cls: "" },
  { src: "/images/colecciones/mosaicos_premium.jpeg", label: "Hall · revestimiento texturizado", cls: "" },
];

const featured = FEATURED_IDS.map((id) => PRODUCTS.find((p) => p.id === id)!).filter(Boolean);

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [selected, setSelected] = useState<CatalogProduct | null>(null);
  const closeModal = useCallback(() => setSelected(null), []);

  useReveal();

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="dt dt-home">
      <Header overlay />

      {/* ============ 1. HERO — Necesidad ============ */}
      <section className="dt-hero">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.src}
            className={`dt-hero__slide${i === slide ? " is-active" : ""}`}
            style={{ backgroundImage: `url('${s.src}')`, backgroundPosition: s.pos }}
            aria-hidden="true"
          />
        ))}
        <div className="dt-hero__shade" />
        <div className="dt-hero__grain" />
        <div className="dt-particles" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <span key={i} style={{ ["--x" as string]: p.x, ["--y" as string]: p.y, ["--d" as string]: p.d, ["--delay" as string]: p.delay }} />
          ))}
        </div>

        <div className="dt-container dt-hero__content">
          <div className="dt-eyebrow dt-anim-1">Importadores directos · Colección 2026</div>
          <h1 className="dt-hero__title dt-anim-2">
            Encuentra el acabado ideal para <em>transformar tu espacio.</em>
          </h1>
          <p className="dt-hero__sub dt-anim-3">
            Porcelanatos, cerámicas, pisos y revestimientos importados para proyectos residenciales y
            comerciales.
          </p>
          <div className="dt-btns dt-anim-4">
            <Link href="/catalogo/" className="dt-btn dt-btn--primary">
              Explorar catálogo <ArrowRight size={16} />
            </Link>
            <a href={WA_ASESOR} target="_blank" rel="noopener noreferrer" className="dt-btn dt-btn--ghost">
              <WhatsAppSvg size={16} /> Hablar con un asesor
            </a>
          </div>
          <ul className="dt-hero__trust dt-anim-5">
            <li>
              <strong data-count={YEARS_EXPERIENCE} data-prefix="+">+{YEARS_EXPERIENCE}</strong> años de experiencia
            </li>
            <li>
              <strong data-count={PRODUCTS.length} data-suffix="+">{PRODUCTS.length}+</strong> referencias en catálogo
            </li>
            <li>
              <strong>2</strong> sedes: Medellín y Barranquilla
            </li>
          </ul>
        </div>

        <div className="dt-hero__dots" role="tablist" aria-label="Imágenes">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.src}
              className={i === slide ? "is-active" : ""}
              onClick={() => setSlide(i)}
              aria-label={`Imagen ${i + 1}`}
              aria-selected={i === slide}
              role="tab"
            />
          ))}
        </div>
        <a href="#categorias" className="dt-hero__scroll" aria-label="Bajar">
          <span>Explorar</span>
          <i />
        </a>
      </section>

      {/* Cinta animada de categorías */}
      <div className="dt-marquee" aria-hidden="true">
        <div className="dt-marquee__track">
          {[0, 1].map((k) => (
            <div key={k} style={{ display: "flex" }}>
              {["Porcelanatos", "Cerámicas", "Pisos", "Revestimientos", "Sanitarios", "Lavamanos", "Gran formato", "Importación directa"].map((w) => (
                <span className="dt-marquee__item" key={w + k}>
                  {w} <i />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============ 2. CATEGORÍAS ============ */}
      <section id="categorias" className="dt-section">
        <div className="dt-container">
          <div className="dt-head dt-reveal">
            <div>
              <div className="dt-eyebrow">¿Qué vas a renovar?</div>
              <h2 className="dt-h2">
                Empieza por <em>tu espacio</em>
              </h2>
            </div>
            <p className="dt-lead">
              Pisos, muros, fachadas o baños: elige la categoría y encuentra formatos, acabados y
              estilos para tu proyecto.
            </p>
          </div>

          <div className="dt-cats">
            {CATEGORIES.map((c, i) => {
              const n = PRODUCTS.filter((p) => p.category === c.id).length;
              const m = CATEGORY_MEDIA[c.id];
              return (
                <Link
                  key={c.id}
                  href={`/catalogo/${c.id}/`}
                  className={`dt-cat dt-reveal${i < 2 ? " dt-cat--lg" : ""}`}
                  style={{ transitionDelay: `${i * 0.07}s` }}
                >
                  <ProductImage src={m.img} fallback={m.fallback} alt={c.label} className="dt-cat__img" />
                  <div className="dt-cat__shade" />
                  <div className="dt-cat__body">
                    <span className="dt-cat__num">0{i + 1}</span>
                    <h3>{c.label}</h3>
                    <p>{c.blurb}</p>
                    <span className="dt-cat__meta">
                      {n} referencias <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ 3. PRODUCTOS DESTACADOS — Producto ============ */}
      <section className="dt-section dt-section--alt">
        <div className="dt-container">
          <div className="dt-head dt-reveal">
            <div>
              <div className="dt-eyebrow">Selección 2026</div>
              <h2 className="dt-h2">
                Productos <em>destacados</em>
              </h2>
            </div>
            <Link href="/catalogo/" className="dt-link dt-link--head">
              Ver catálogo completo →
            </Link>
          </div>
        </div>
        <div className="dt-grid dt-grid--home">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onOpen={setSelected} contain={p.category === "sanitarios"} />
          ))}
        </div>
      </section>

      {/* ============ 4. POR QUÉ DECORTILES — Confianza ============ */}
      <section className="dt-section dt-why">
        <div className="dt-container">
          <div className="dt-head dt-head--center dt-reveal dt-reveal--blur">
            <div className="dt-eyebrow">Por qué DECORTILES</div>
            <h2 className="dt-h2">
              Te ayudamos a <em>elegir bien</em> para tu proyecto.
            </h2>
            <p className="dt-lead">
              Experiencia, variedad y acompañamiento para encontrar la solución adecuada para cada
              espacio.
            </p>
          </div>
          <div className="dt-why__grid">
            {WHY.map((w, i) => (
              <article key={w.title} className="dt-why__card dt-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <span className="dt-why__n">0{i + 1}</span>
                <span className="dt-why__icon">
                  <w.icon size={26} strokeWidth={1.4} />
                </span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 5. PROYECTOS / AMBIENTES ============ */}
      <section id="proyectos" className="dt-section dt-section--alt">
        <div className="dt-container">
          <div className="dt-head dt-reveal">
            <div>
              <div className="dt-eyebrow">Proyectos y ambientes</div>
              <h2 className="dt-h2">
                Inspiración para <em>cada espacio</em>
              </h2>
            </div>
            <p className="dt-lead">
              Así se ven nuestros acabados instalados: salas, halls, oficinas y zonas comunes con
              porcelanato de gran formato, efecto madera y mármol.
            </p>
          </div>
          <div className="dt-gallery">
            {PROJECTS.map((p, i) => (
              <figure key={p.src} className={`dt-gal dt-reveal ${p.cls}`} style={{ transitionDelay: `${(i % 4) * 0.06}s` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.label} loading="lazy" />
                <figcaption>{p.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 6. +13 AÑOS ============ */}
      <section className="dt-section dt-exp">
        <div className="dt-container dt-exp__inner">
          <div className="dt-exp__num dt-reveal dt-reveal--left" aria-hidden="true">
            <span data-count={YEARS_EXPERIENCE} data-prefix="+">+{YEARS_EXPERIENCE}</span>
            <small>años</small>
          </div>
          <div className="dt-exp__text dt-reveal dt-reveal--right">
            <div className="dt-eyebrow">Nuestra trayectoria</div>
            <h2 className="dt-h2">
              Experiencia que se nota <em>en cada elección.</em>
            </h2>
            <p className="dt-lead dt-lead--left">
              Llevamos más de {YEARS_EXPERIENCE} años acompañando proyectos de remodelación y
              construcción con productos seleccionados y asesoría especializada.
            </p>
            <div className="dt-btns">
              <Link href="/quienes-somos/" className="dt-btn dt-btn--ghost">
                Conoce DECORTILES
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 7. SEDES ============ */}
      <section id="sedes" className="dt-section dt-section--alt">
        <div className="dt-container">
          <div className="dt-head dt-reveal">
            <div>
              <div className="dt-eyebrow">Visítanos</div>
              <h2 className="dt-h2">
                Nuestras <em>sedes</em>
              </h2>
            </div>
            <p className="dt-lead">
              Ven a ver y tocar los acabados. Te atendemos en persona o por WhatsApp.
            </p>
          </div>
          <div className="dt-sedes">
            {SEDES.map((s, i) => (
              <article key={s.city} className="dt-sede dt-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="dt-sede__city">{s.city}</div>
                <ul>
                  <li>
                    <MapPin size={16} />
                    <span>
                      {s.addresses.join(" · ")}
                      {s.zone && <em> — {s.zone}</em>}
                    </span>
                  </li>
                  <li>
                    <MessageCircle size={16} />
                    <span>{s.phones.map((p) => p.label).join(" · ")}</span>
                  </li>
                  <li>
                    <Clock size={16} />
                    <span>{HORARIO.join(" · ")}</span>
                  </li>
                </ul>
                <div className="dt-sede__actions">
                  <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="dt-btn dt-btn--ghost dt-btn--sm">
                    Cómo llegar
                  </a>
                  <a
                    href={`https://wa.me/${s.phones[0].wa}?text=${encodeURIComponent(`¡Hola DECORTILES ${s.city}! Quiero información.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dt-btn dt-btn--wa dt-btn--sm"
                  >
                    <WhatsAppSvg size={15} /> WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 8. CTA COTIZACIÓN — Asesoría → Cotización ============ */}
      <section className="dt-quote">
        <div className="dt-quote__bg" style={{ backgroundImage: "url('/images/colecciones/outlet-banner.jpg')" }} />
        <div className="dt-container dt-quote__inner dt-reveal">
          <div className="dt-eyebrow">Asesoría sin costo</div>
          <h2 className="dt-quote__title">
            Cotiza tu proyecto <em>con un asesor</em>
          </h2>
          <ol className="dt-steps">
            <li>
              <span>1</span>Cuéntanos qué espacio vas a transformar
            </li>
            <li>
              <span>2</span>Envíanos medidas aproximadas y estilo
            </li>
            <li>
              <span>3</span>Recibe opciones y tu cotización
            </li>
          </ol>
          <div className="dt-btns dt-btns--center">
            <a href={WA_COTIZAR} target="_blank" rel="noopener noreferrer" className="dt-btn dt-btn--primary">
              <WhatsAppSvg size={16} /> Solicitar cotización
            </a>
            <Link href="/contacto/" className="dt-btn dt-btn--ghost">
              Prefiero el formulario
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <ProductModal product={selected} onClose={closeModal} />
    </div>
  );
}
