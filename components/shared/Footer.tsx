import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog-data";
import { CURRENT_YEAR, EMAIL, HORARIO, SEDES, SOCIAL, YEARS_EXPERIENCE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="dt-footer">
      <div className="dt-footer__grid">
        <div className="dt-footer__brand">
          <Image src="/logo-card.png" alt="DECORTILES" width={400} height={269} className="dt-footer__logo" />
          <div className="dt-footer__word">
            Decor<span>tiles</span>
          </div>
          <div className="dt-footer__sub">Cerámica S.A.S.</div>
          <p>
            Importadores directos de porcelanatos, cerámicas y acabados. Más de {YEARS_EXPERIENCE} años
            acompañando proyectos de remodelación y construcción.
          </p>
          <div className="dt-footer__social">
            <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <div className="dt-footer__col">
          <h4>Catálogo</h4>
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={`/catalogo/${c.id}/`}>
              {c.label}
            </Link>
          ))}
        </div>

        {SEDES.map((s) => (
          <div className="dt-footer__col" key={s.city}>
            <h4>{s.city}</h4>
            <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer">
              {s.addresses.map((a) => (
                <span key={a} className="block">
                  {a}
                </span>
              ))}
              {s.zone && <span className="block">{s.zone}</span>}
            </a>
            {s.phones.map((p) => (
              <a key={p.wa} href={`https://wa.me/${p.wa}`} target="_blank" rel="noopener noreferrer">
                {p.label}
              </a>
            ))}
          </div>
        ))}

        <div className="dt-footer__col">
          <h4>Contacto</h4>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          {HORARIO.map((h) => (
            <p key={h}>{h}</p>
          ))}
          <Link href="/contacto/">Formulario de contacto</Link>
        </div>
      </div>

      <div className="dt-footer__bottom">
        <span>© {CURRENT_YEAR} Decortiles Cerámica S.A.S. — Todos los derechos reservados</span>
        <span className="dt-footer__line" />
        <span>
          Designed by{" "}
          <a href="https://www.instagram.com/tomi._.montoya/?hl=es-la" target="_blank" rel="noopener noreferrer">
            Tomas Montoya
          </a>
        </span>
      </div>
    </footer>
  );
}
