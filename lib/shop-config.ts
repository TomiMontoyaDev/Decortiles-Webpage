// ============================================================
// TIENDA DECORTILES — configuración del carrito, envíos, pagos y facturas
// Editar aquí y se actualiza en todo el sitio (carrito, checkout, factura, dashboard).
// ============================================================

import type { CatalogProduct } from "./catalog-data";

export const CURRENCY = "COP";

/**
 * Precios por referencia en COP, IVA incluido, por unidad de venta (caja o pieza).
 * Por ahora VACÍO: la web muestra "Precio a confirmar" y el pedido llega como cotización.
 * Para activar un precio basta con agregar la línea, ej:
 *   p001: 189000,
 */
export const PRICES: Partial<Record<string, number>> = {};

export const PRICES_INCLUDE_IVA = true;
export const IVA_RATE = 0.19;

export const priceOf = (id: string): number | null => PRICES[id] ?? null;

// ------------------------------------------------------------
// Envíos
// ------------------------------------------------------------
export type ShippingMethodId = "recoger" | "local" | "nacional";

export interface ShippingMethod {
  id: ShippingMethodId;
  label: string;
  desc: string;
  eta: string;
  /** Tarifa fija + valor por kg (peso calculado con los datos de caja) */
  base: number;
  perKg: number;
  /** Aplica envío gratis al superar FREE_SHIPPING_FROM */
  freeEligible: boolean;
  /** Ciudades donde aplica (vacío = todas) */
  cities?: string[];
}

/** Compras desde este valor (subtotal) tienen envío gratis en los métodos freeEligible */
export const FREE_SHIPPING_FROM = 2_500_000;

export const LOCAL_CITIES = [
  "Medellín",
  "Bello",
  "Itagüí",
  "Envigado",
  "Sabaneta",
  "La Estrella",
  "Barranquilla",
  "Soledad",
  "Puerto Colombia",
  "Malambo",
];

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "recoger",
    label: "Recoger en sede",
    desc: "Medellín (La Candelaria) o Barranquilla. Te avisamos cuando esté listo.",
    eta: "1–2 días hábiles",
    base: 0,
    perKg: 0,
    freeEligible: true,
  },
  {
    id: "local",
    label: "Envío local",
    desc: "Área metropolitana de Medellín y Barranquilla.",
    eta: "1–3 días hábiles",
    base: 35_000,
    perKg: 180,
    freeEligible: true,
    cities: LOCAL_CITIES,
  },
  {
    id: "nacional",
    label: "Envío nacional",
    desc: "Transportadora a cualquier ciudad de Colombia.",
    eta: "3–8 días hábiles",
    base: 60_000,
    perKg: 950,
    freeEligible: false,
  },
];

// ------------------------------------------------------------
// Pagos — Mercado Pago (Checkout Pro)
// El sitio es estático: la preferencia de pago la crea un backend pequeño
// (ver MERCADOPAGO.md). Sin estas variables, el checkout funciona en "modo pedido":
// guarda el pedido y lo envía al asesor, sin cobrar.
// ------------------------------------------------------------
export const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY ?? "";
export const MP_PREFERENCE_URL = process.env.NEXT_PUBLIC_MP_PREFERENCE_URL ?? "";
export const MP_ENABLED = MP_PREFERENCE_URL !== "";

/** API opcional para guardar pedidos en un servidor. Sin ella se guardan en este navegador. */
export const ORDERS_API_URL = process.env.NEXT_PUBLIC_ORDERS_API_URL ?? "";

/** PIN del dashboard /admin. Es una barrera visual, no seguridad real (ver MERCADOPAGO.md). */
export const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN ?? "decortiles2026";

// ------------------------------------------------------------
// Datos del emisor de la factura
// ------------------------------------------------------------
export const COMPANY = {
  legalName: "DECORTILES Cerámica S.A.S.",
  brand: "DECORTILES",
  nit: "NIT 000.000.000-0", // ← reemplazar por el NIT real
  regime: "Responsable de IVA",
  address: "Cl. 50 #56B-22, La Candelaria, Medellín",
  phone: "+57 312 801 9754",
  email: "contacto@decorcolombiatiles.com",
  web: "decorcolombiatiles.com",
  logo: "/logo-card.png",
  invoicePrefix: "FV",
  orderPrefix: "DT",
  /** Nota legal al pie de la factura */
  legalNote:
    "Documento de venta generado por decorcolombiatiles.com. La factura electrónica DIAN se emite por el proveedor autorizado de DECORTILES.",
};

// ------------------------------------------------------------
// Utilidades por producto
// ------------------------------------------------------------
const num = (s?: string) => (s ? Number(s.replace(",", ".")) : NaN);

/** m² por caja según los datos de caja, ej "1.44 m² x caja" → 1.44 */
export function m2PerBox(p: CatalogProduct): number | null {
  const line = p.box?.find((b) => /m²|m2/i.test(b));
  const v = num(line?.match(/([\d.,]+)\s*m/)?.[1]);
  return Number.isFinite(v) && v > 0 ? v : null;
}

/** kg por unidad de venta, ej "27 kg x caja" → 27 */
export function kgPerUnit(p: CatalogProduct): number {
  const line = p.box?.find((b) => /kg/i.test(b));
  const v = num(line?.match(/([\d.,]+)\s*kg/i)?.[1]);
  return Number.isFinite(v) ? v : 0;
}

/** Unidad de venta: cajas para revestimientos, unidades para sanitarios y lavamanos */
export const unitOf = (p: CatalogProduct): "caja" | "unidad" => (m2PerBox(p) ? "caja" : "unidad");

export const unitLabel = (unit: "caja" | "unidad", qty: number) =>
  unit === "caja" ? (qty === 1 ? "caja" : "cajas") : qty === 1 ? "unidad" : "unidades";

/** Porcentaje de desperdicio sugerido para cortes al calcular cajas por m² */
export const WASTE_PCT = 0.1;

export const money = (v: number | null | undefined) =>
  v == null
    ? "Por confirmar"
    : new Intl.NumberFormat("es-CO", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 }).format(v);
