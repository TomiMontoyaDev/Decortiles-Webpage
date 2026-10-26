"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Lock, MapPin, Package, ShieldCheck, Store, Truck } from "lucide-react";
import ProductThumb from "./ProductThumb";
import { SEDES } from "@/lib/site";
import {
  LOCAL_CITIES,
  MP_ENABLED,
  SHIPPING_METHODS,
  money,
  unitLabel,
  type ShippingMethodId,
} from "@/lib/shop-config";
import { computeTotals, newOrderId, saveOrder, shippingMethod, updateOrder, type Order } from "@/lib/orders";
import { createPreference } from "@/lib/mercadopago";
import { useCart } from "./CartContext";
import FreeShippingBar from "./FreeShippingBar";

const DEPARTMENTS = [
  "Antioquia", "Atlántico", "Bogotá D.C.", "Amazonas", "Arauca", "Bolívar", "Boyacá", "Caldas", "Caquetá",
  "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira",
  "Magdalena", "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda", "San Andrés",
  "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada",
];

const DRAFT_KEY = "dt-checkout-draft";

interface Form {
  name: string;
  docType: Order["customer"]["docType"];
  docNumber: string;
  email: string;
  phone: string;
  wantsCompany: boolean;
  company: string;
  method: ShippingMethodId;
  pickupSede: string;
  department: string;
  city: string;
  address: string;
  addressExtra: string;
  neighborhood: string;
  deliveryWindow: string;
  notes: string;
  terms: boolean;
  marketing: boolean;
}

const EMPTY: Form = {
  name: "",
  docType: "CC",
  docNumber: "",
  email: "",
  phone: "",
  wantsCompany: false,
  company: "",
  method: "local",
  pickupSede: SEDES[0].city,
  department: "Antioquia",
  city: "",
  address: "",
  addressExtra: "",
  neighborhood: "",
  deliveryWindow: "Cualquier horario",
  notes: "",
  terms: false,
  marketing: true,
};

type Errors = Partial<Record<keyof Form, string>>;

const STEPS = ["Tus datos", "Envío", "Confirmar"] as const;
const METHOD_ICON = { recoger: Store, local: Truck, nacional: Package };

function validate(f: Form, step: number): Errors {
  const e: Errors = {};
  if (step >= 0) {
    if (f.name.trim().split(/\s+/).length < 2) e.name = "Escribe nombre y apellido";
    if (!/^[0-9A-Za-z.-]{5,15}$/.test(f.docNumber.trim())) e.docNumber = "Documento no válido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Correo no válido";
    if (f.phone.replace(/\D/g, "").length < 10) e.phone = "Celular de 10 dígitos";
    if (f.wantsCompany && f.company.trim().length < 3) e.company = "Escribe la razón social";
  }
  if (step >= 1 && f.method !== "recoger") {
    if (!f.city.trim()) e.city = "Escribe la ciudad";
    if (f.address.trim().length < 6) e.address = "Escribe la dirección completa";
    if (f.method === "local" && f.city && !LOCAL_CITIES.some((c) => c.toLowerCase() === f.city.trim().toLowerCase()))
      e.city = "Fuera del área local: elige envío nacional";
  }
  if (step >= 2 && !f.terms) e.terms = "Debes aceptar para continuar";
  return e;
}

export default function Checkout() {
  const { ready, lines, clear } = useCart();
  const router = useRouter();
  const [f, setF] = useState<Form>(EMPTY);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState("");

  // Borrador del formulario (para no volver a escribir si regresa)
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (d) setF({ ...EMPTY, ...d, terms: false });
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...f, notes: f.notes }));
    } catch {}
  }, [f]);

  const method = shippingMethod(f.method);
  const totals = useMemo(() => computeTotals(lines, method), [lines, method]);
  const priced = totals.subtotal != null;
  const willPay = priced && MP_ENABLED;

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  function next() {
    const e = validate(f, step);
    setErrors(e);
    if (Object.keys(e).length) {
      document.querySelector<HTMLElement>(".dt-field.has-error input, .dt-field.has-error select")?.focus();
      return;
    }
    setStep((s) => Math.min(2, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    const e = validate(f, 2);
    setErrors(e);
    if (Object.keys(e).length) {
      if (e.name || e.docNumber || e.email || e.phone || e.company) setStep(0);
      else if (e.city || e.address) setStep(1);
      return;
    }
    setSending(true);
    setFailure("");
    const now = new Date().toISOString();
    const sede = SEDES.find((s) => s.city === f.pickupSede);
    const order: Order = {
      id: newOrderId(),
      createdAt: now,
      updatedAt: now,
      status: priced ? "pendiente_pago" : "por_cotizar",
      customer: {
        name: f.name.trim(),
        docType: f.wantsCompany ? "NIT" : f.docType,
        docNumber: f.docNumber.trim(),
        email: f.email.trim().toLowerCase(),
        phone: f.phone.trim(),
        company: f.wantsCompany ? f.company.trim() : undefined,
      },
      shipping: {
        method: f.method,
        label: method?.label ?? "",
        department: f.method === "recoger" ? "" : f.department,
        city: f.method === "recoger" ? f.pickupSede : f.city.trim(),
        address: f.method === "recoger" ? sede?.addresses[0] ?? "" : f.address.trim(),
        addressExtra: f.method === "recoger" ? "" : f.addressExtra.trim(),
        neighborhood: f.method === "recoger" ? sede?.zone ?? "" : f.neighborhood.trim(),
        pickupSede: f.method === "recoger" ? f.pickupSede : undefined,
        deliveryWindow: f.deliveryWindow,
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      lines: lines.map(({ product, ...l }) => l),
      notes: f.notes.trim(),
      totals,
      payment: { provider: willPay ? "mercadopago" : "asesor" },
      marketingOptIn: f.marketing,
    };

    try {
      await saveOrder(order);
      if (willPay) {
        const pref = await createPreference(order);
        await updateOrder(order.id, { payment: { provider: "mercadopago", preferenceId: pref.id } });
        window.location.href = pref.init_point;
        return;
      }
      clear();
      localStorage.removeItem(DRAFT_KEY);
      router.push(`/checkout/resultado/?order=${encodeURIComponent(order.id)}`);
    } catch (err) {
      setFailure(err instanceof Error ? err.message : "No pudimos enviar el pedido. Intenta de nuevo.");
      setSending(false);
    }
  }

  if (ready && lines.length === 0 && !sending) {
    return (
      <div className="dt-shop-empty">
        <h1 className="dt-sec-title">
          Carrito <em>vacío</em>
        </h1>
        <p>Agrega productos del catálogo para hacer tu pedido.</p>
        <Link href="/catalogo/" className="dt-btn dt-btn--primary">
          Explorar catálogo
        </Link>
      </div>
    );
  }

  const field = (k: keyof Form, label: string, input: React.ReactNode, hint?: string, wide?: boolean) => (
    <label className={`dt-field${errors[k] ? " has-error" : ""}${wide ? " dt-field--wide" : ""}`}>
      <span>{label}</span>
      {input}
      {errors[k] ? <em role="alert">{errors[k]}</em> : hint ? <small>{hint}</small> : null}
    </label>
  );

  return (
    <div className="dt-checkout">
      <div className="dt-checkout__main">
        <Link href="/carrito/" className="dt-back">
          <ArrowLeft size={14} /> Volver al carrito
        </Link>
        <h1 className="dt-checkout__title">Finalizar pedido</h1>

        <ol className="dt-steps-bar" aria-label="Pasos">
          {STEPS.map((s, i) => (
            <li key={s} className={i === step ? "is-current" : i < step ? "is-done" : ""}>
              <button type="button" onClick={() => i < step && setStep(i)} disabled={i > step}>
                <b>{i + 1}</b> {s}
              </button>
            </li>
          ))}
          <span className="dt-steps-bar__fill" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
        </ol>

        {/* PASO 1 — DATOS */}
        {step === 0 && (
          <section className="dt-panel" key="s0">
            <h2>Datos de contacto</h2>
            <div className="dt-fields">
              {field("name", "Nombre completo *", <input value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />, undefined, true)}
              <div className="dt-field dt-field--doc">
                <span>Documento *</span>
                <div className={`dt-doc${errors.docNumber ? " has-error" : ""}`}>
                  <select value={f.docType} onChange={(e) => set("docType", e.target.value as Form["docType"])} aria-label="Tipo de documento">
                    <option value="CC">CC</option>
                    <option value="CE">CE</option>
                    <option value="NIT">NIT</option>
                    <option value="PAS">Pasaporte</option>
                  </select>
                  <input value={f.docNumber} onChange={(e) => set("docNumber", e.target.value)} inputMode="numeric" aria-label="Número de documento" />
                </div>
                {errors.docNumber ? <em role="alert">{errors.docNumber}</em> : <small>Para la factura</small>}
              </div>
              {field("phone", "Celular / WhatsApp *", <input value={f.phone} onChange={(e) => set("phone", e.target.value)} type="tel" autoComplete="tel" placeholder="300 123 4567" />)}
              {field("email", "Correo electrónico *", <input value={f.email} onChange={(e) => set("email", e.target.value)} type="email" autoComplete="email" />, "Aquí te enviamos la factura", true)}
              <label className="dt-check-row dt-field--wide">
                <input type="checkbox" checked={f.wantsCompany} onChange={(e) => set("wantsCompany", e.target.checked)} />
                <span>Necesito factura a nombre de una empresa</span>
              </label>
              {f.wantsCompany &&
                field("company", "Razón social *", <input value={f.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />, "Usa el NIT en el campo documento", true)}
            </div>
          </section>
        )}

        {/* PASO 2 — ENVÍO */}
        {step === 1 && (
          <section className="dt-panel" key="s1">
            <h2>¿Cómo recibes tu pedido?</h2>
            <div className="dt-methods" role="radiogroup">
              {SHIPPING_METHODS.map((m) => {
                const Icon = METHOD_ICON[m.id];
                const t = computeTotals(lines, m);
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={f.method === m.id}
                    key={m.id}
                    className={`dt-method${f.method === m.id ? " is-active" : ""}`}
                    onClick={() => set("method", m.id)}
                  >
                    <Icon size={20} strokeWidth={1.6} />
                    <span className="dt-method__body">
                      <strong>{m.label}</strong>
                      <small>{m.desc}</small>
                      <small className="dt-method__eta">{m.eta}</small>
                    </span>
                    <span className={`dt-method__cost${t.shipping === 0 ? " is-free" : ""}`}>
                      {t.shipping === 0 ? "Gratis" : money(t.shipping)}
                    </span>
                  </button>
                );
              })}
            </div>

            {f.method === "recoger" ? (
              <div className="dt-fields">
                {field(
                  "pickupSede",
                  "Sede de recogida",
                  <select value={f.pickupSede} onChange={(e) => set("pickupSede", e.target.value)}>
                    {SEDES.map((s) => (
                      <option key={s.city} value={s.city}>
                        {s.city} — {s.addresses[0]}
                      </option>
                    ))}
                  </select>,
                  undefined,
                  true,
                )}
              </div>
            ) : (
              <div className="dt-fields">
                {field(
                  "department",
                  "Departamento *",
                  <select value={f.department} onChange={(e) => set("department", e.target.value)}>
                    {DEPARTMENTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>,
                )}
                {field(
                  "city",
                  "Ciudad / municipio *",
                  <>
                    <input value={f.city} onChange={(e) => set("city", e.target.value)} list="dt-cities" autoComplete="address-level2" />
                    <datalist id="dt-cities">
                      {LOCAL_CITIES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </>,
                )}
                {field("address", "Dirección *", <input value={f.address} onChange={(e) => set("address", e.target.value)} autoComplete="street-address" placeholder="Cra. 00 #00-00" />, undefined, true)}
                {field("addressExtra", "Apto / torre / bodega", <input value={f.addressExtra} onChange={(e) => set("addressExtra", e.target.value)} />)}
                {field("neighborhood", "Barrio", <input value={f.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} />)}
                {field(
                  "deliveryWindow",
                  "Horario preferido de entrega",
                  <select value={f.deliveryWindow} onChange={(e) => set("deliveryWindow", e.target.value)}>
                    <option>Cualquier horario</option>
                    <option>Mañana (8:00 – 12:00)</option>
                    <option>Tarde (12:00 – 6:00)</option>
                    <option>Sábado</option>
                  </select>,
                  undefined,
                  true,
                )}
              </div>
            )}

            <div className="dt-fields">
              {field(
                "notes",
                "Notas del pedido",
                <textarea
                  rows={4}
                  value={f.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  maxLength={600}
                  placeholder="Ej: entrega en obra, piso 3 sin ascensor; necesito el mismo lote de color; ¿tienen pegante y boquilla?"
                />,
                `${f.notes.length}/600 · Accesos, lote, horarios, productos complementarios…`,
                true,
              )}
            </div>
          </section>
        )}

        {/* PASO 3 — CONFIRMAR */}
        {step === 2 && (
          <section className="dt-panel" key="s2">
            <h2>Revisa y confirma</h2>
            <div className="dt-review">
              <div>
                <h3>Contacto</h3>
                <p>
                  {f.name}
                  <br />
                  {f.wantsCompany ? `${f.company} · NIT` : f.docType} {f.docNumber}
                  <br />
                  {f.email} · {f.phone}
                </p>
                <button type="button" className="dt-link" onClick={() => setStep(0)}>
                  Editar
                </button>
              </div>
              <div>
                <h3>
                  <MapPin size={14} /> {method?.label}
                </h3>
                <p>
                  {f.method === "recoger" ? (
                    <>Sede {f.pickupSede}</>
                  ) : (
                    <>
                      {f.address} {f.addressExtra}
                      <br />
                      {f.neighborhood && `${f.neighborhood}, `}
                      {f.city}, {f.department}
                      <br />
                      {f.deliveryWindow}
                    </>
                  )}
                </p>
                <button type="button" className="dt-link" onClick={() => setStep(1)}>
                  Editar
                </button>
              </div>
              {f.notes && (
                <div className="dt-review__wide">
                  <h3>Notas</h3>
                  <p>{f.notes}</p>
                </div>
              )}
            </div>

            <div className={`dt-paybox${willPay ? " is-mp" : ""}`}>
              {willPay ? (
                <>
                  <ShieldCheck size={22} />
                  <div>
                    <strong>Pago seguro con Mercado Pago</strong>
                    <small>Tarjeta, PSE, Nequi o efectivo. Serás redirigido para completar el pago.</small>
                  </div>
                </>
              ) : (
                <>
                  <ShieldCheck size={22} />
                  <div>
                    <strong>{priced ? "Pago con asesor" : "Pedido con cotización"}</strong>
                    <small>
                      {priced
                        ? "Un asesor te contacta para confirmar y enviarte el link de pago."
                        : "Confirmamos disponibilidad, precios y envío, y te enviamos el link de pago de Mercado Pago. No se cobra nada ahora."}
                    </small>
                  </div>
                </>
              )}
            </div>

            <label className={`dt-check-row${errors.terms ? " has-error" : ""}`}>
              <input type="checkbox" checked={f.terms} onChange={(e) => set("terms", e.target.checked)} />
              <span>
                Acepto el tratamiento de mis datos personales (Ley 1581 de 2012) para gestionar este pedido. *
              </span>
            </label>
            {errors.terms && <em className="dt-err">{errors.terms}</em>}
            <label className="dt-check-row">
              <input type="checkbox" checked={f.marketing} onChange={(e) => set("marketing", e.target.checked)} />
              <span>Quiero recibir novedades y promociones de DECORTILES.</span>
            </label>
            {failure && <p className="dt-err dt-err--box">{failure}</p>}
          </section>
        )}

        <div className="dt-checkout__nav">
          {step > 0 && (
            <button type="button" className="dt-btn dt-btn--ghost" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft size={14} /> Atrás
            </button>
          )}
          {step < 2 ? (
            <button type="button" className="dt-btn dt-btn--primary" onClick={next}>
              Continuar <ArrowRight size={14} />
            </button>
          ) : (
            <button type="button" className={`dt-btn dt-btn--primary${sending ? " is-loading" : ""}`} onClick={submit} disabled={sending}>
              <Lock size={14} />
              {sending ? "Enviando…" : willPay ? `Pagar ${money(totals.total)}` : "Enviar pedido"}
            </button>
          )}
        </div>
      </div>

      {/* RESUMEN */}
      <aside className="dt-summary">
        <h2>Resumen</h2>
        <ul className="dt-summary__lines">
          {lines.map((l) => (
            <li key={l.id}>
              <span className="dt-summary__img">
                <ProductThumb id={l.id} src={l.image} alt={l.name} />
                <b>{l.qty}</b>
              </span>
              <span className="dt-summary__name">
                {l.name}
                <small>
                  {l.qty} {unitLabel(l.unit, l.qty)} · {l.product.size ?? l.product.collection}
                </small>
              </span>
              <span className="dt-summary__price">{l.unitPrice == null ? "—" : money(l.unitPrice * l.qty)}</span>
            </li>
          ))}
        </ul>
        <FreeShippingBar totals={totals} />
        <dl className="dt-summary__totals">
          <div>
            <dt>Subtotal</dt>
            <dd>{money(totals.subtotal)}</dd>
          </div>
          <div>
            <dt>
              Envío <small>· {method?.label}</small>
            </dt>
            <dd className={totals.shipping === 0 ? "is-free" : ""}>
              {totals.shipping === 0 ? "Gratis" : priced ? money(totals.shipping) : `≈ ${money(totals.shipping)}`}
            </dd>
          </div>
          <div>
            <dt>Peso estimado</dt>
            <dd>{totals.weightKg} kg</dd>
          </div>
          {totals.iva != null && (
            <div>
              <dt>IVA incluido</dt>
              <dd>{money(totals.iva)}</dd>
            </div>
          )}
          <div className="dt-summary__total">
            <dt>Total</dt>
            <dd>{money(totals.total)}</dd>
          </div>
        </dl>
        {!priced && <p className="dt-summary__note">Los precios se confirman con tu cotización.</p>}
      </aside>
    </div>
  );
}
