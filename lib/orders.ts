// ============================================================
// Pedidos y facturas — tipos, cálculo de totales y almacenamiento.
// Sin ORDERS_API_URL los pedidos se guardan en localStorage (solo este navegador);
// con ella, se leen y escriben en ese servidor (GET / POST / PUT /:id).
// ============================================================

import {
  COMPANY,
  FREE_SHIPPING_FROM,
  IVA_RATE,
  ORDERS_API_URL,
  PRICES_INCLUDE_IVA,
  SHIPPING_METHODS,
  type ShippingMethod,
  type ShippingMethodId,
} from "./shop-config";

export type OrderStatus =
  | "por_cotizar"
  | "pendiente_pago"
  | "pagado"
  | "en_preparacion"
  | "enviado"
  | "entregado"
  | "cancelado";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  por_cotizar: "Por cotizar",
  pendiente_pago: "Pendiente de pago",
  pagado: "Pagado",
  en_preparacion: "En preparación",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

/** Estados que cuentan como venta facturada */
export const PAID_STATUSES: OrderStatus[] = ["pagado", "en_preparacion", "enviado", "entregado"];
export const isPaid = (o: Order) => PAID_STATUSES.includes(o.status);

export interface OrderLine {
  id: string;
  name: string;
  collection: string;
  image: string;
  unit: "caja" | "unidad";
  qty: number;
  unitPrice: number | null;
  kgPerUnit: number;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  invoiceNumber?: string;
  invoiceDate?: string;
  customer: {
    name: string;
    docType: "CC" | "CE" | "NIT" | "PAS";
    docNumber: string;
    email: string;
    phone: string;
    /** Factura a nombre de empresa */
    company?: string;
  };
  shipping: {
    method: ShippingMethodId;
    label: string;
    department: string;
    city: string;
    address: string;
    addressExtra: string;
    neighborhood: string;
    pickupSede?: string;
    deliveryWindow?: string;
  };
  lines: OrderLine[];
  notes: string;
  totals: Totals;
  payment: {
    provider: "mercadopago" | "asesor";
    status?: string;
    preferenceId?: string;
    paymentId?: string;
  };
  marketingOptIn?: boolean;
  /** Pedido de ejemplo creado desde el dashboard */
  demo?: boolean;
}

export interface Totals {
  subtotal: number | null;
  weightKg: number;
  shipping: number | null;
  freeShipping: boolean;
  total: number | null;
  iva: number | null;
  /** Falta para envío gratis (null si no aplica o no hay precios) */
  missingForFree: number | null;
}

export function shippingMethod(id: ShippingMethodId | null | undefined): ShippingMethod | null {
  return SHIPPING_METHODS.find((m) => m.id === id) ?? null;
}

export function computeTotals(
  lines: Pick<OrderLine, "qty" | "unitPrice" | "kgPerUnit">[],
  method: ShippingMethod | null,
): Totals {
  const priced = lines.length > 0 && lines.every((l) => l.unitPrice != null);
  const subtotal = priced ? lines.reduce((s, l) => s + (l.unitPrice as number) * l.qty, 0) : null;
  const weightKg = Math.round(lines.reduce((s, l) => s + l.kgPerUnit * l.qty, 0) * 10) / 10;

  const qualifies = subtotal != null && subtotal >= FREE_SHIPPING_FROM;
  const freeShipping = !!method && method.freeEligible && (method.base === 0 || qualifies);
  let shipping: number | null = null;
  if (method) shipping = freeShipping ? 0 : Math.round((method.base + weightKg * method.perKg) / 100) * 100;

  const total = subtotal != null && shipping != null ? subtotal + shipping : null;
  const iva =
    total == null ? null : PRICES_INCLUDE_IVA ? Math.round(total - total / (1 + IVA_RATE)) : Math.round(total * IVA_RATE);

  return {
    subtotal,
    weightKg,
    shipping,
    freeShipping,
    total: total != null && !PRICES_INCLUDE_IVA ? total + (iva ?? 0) : total,
    iva,
    missingForFree: subtotal != null && !qualifies ? FREE_SHIPPING_FROM - subtotal : null,
  };
}

export function newOrderId(d = new Date()) {
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${COMPANY.orderPrefix}-${ymd}-${rnd}`;
}

// ------------------------------------------------------------
// Almacenamiento
// ------------------------------------------------------------
const KEY = "dt-orders-v1";
const SEQ_KEY = "dt-invoice-seq";
const EVENT = "dt-orders-change";

function readLocal(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function writeLocal(orders: Order[]) {
  localStorage.setItem(KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event(EVENT));
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${ORDERS_API_URL.replace(/\/$/, "")}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!r.ok) throw new Error(`Pedidos API ${r.status}`);
  return r.json();
}

export async function listOrders(): Promise<Order[]> {
  const all = ORDERS_API_URL ? await api<Order[]>("") : readLocal();
  return [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrder(id: string): Promise<Order | null> {
  if (ORDERS_API_URL) return api<Order>(`/${encodeURIComponent(id)}`).catch(() => null);
  return readLocal().find((o) => o.id === id) ?? null;
}

export async function saveOrder(order: Order): Promise<Order> {
  if (ORDERS_API_URL) return api<Order>("", { method: "POST", body: JSON.stringify(order) });
  writeLocal([order, ...readLocal().filter((o) => o.id !== order.id)]);
  return order;
}

/** Siguiente número de factura consecutivo: FV-2026-000001 */
function nextInvoiceNumber(orders: Order[]) {
  const year = new Date().getFullYear();
  const used = orders
    .map((o) => o.invoiceNumber?.match(/-(\d+)$/)?.[1])
    .filter(Boolean)
    .map(Number);
  const stored = Number(localStorage.getItem(SEQ_KEY) || 0);
  const n = Math.max(stored, ...used, 0) + 1;
  localStorage.setItem(SEQ_KEY, String(n));
  return `${COMPANY.invoicePrefix}-${year}-${String(n).padStart(6, "0")}`;
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | null> {
  const current = await getOrder(id);
  if (!current) return null;
  const next: Order = { ...current, ...patch, updatedAt: new Date().toISOString() };
  // Al pasar a pagado se emite la factura (una sola vez)
  if (isPaid(next) && !next.invoiceNumber) {
    next.invoiceNumber = nextInvoiceNumber(await listOrders());
    next.invoiceDate ??= new Date().toISOString();
  }
  if (ORDERS_API_URL) return api<Order>(`/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(next) });
  writeLocal(readLocal().map((o) => (o.id === id ? next : o)));
  return next;
}

export async function deleteOrder(id: string) {
  if (ORDERS_API_URL) return api(`/${encodeURIComponent(id)}`, { method: "DELETE" });
  writeLocal(readLocal().filter((o) => o.id !== id));
}

/** Suscripción a cambios (otras pestañas incluidas) */
export function onOrdersChange(cb: () => void) {
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export const fmtDate = (iso: string, withTime = false) =>
  new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(iso));
