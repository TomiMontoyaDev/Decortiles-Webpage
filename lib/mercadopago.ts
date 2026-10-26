// ============================================================
// Mercado Pago — Checkout Pro
// El navegador NUNCA usa el Access Token. Envía el pedido a MP_PREFERENCE_URL
// (backend propio, ver MERCADOPAGO.md), que crea la preferencia con el SDK oficial
// y devuelve { id, init_point }. Luego se redirige al cliente a init_point.
// ============================================================

import { MP_ENABLED, MP_PREFERENCE_URL } from "./shop-config";
import type { Order } from "./orders";

/** Cuerpo de la preferencia en el formato de la API de Mercado Pago */
export function buildPreference(order: Order, origin: string) {
  const back = `${origin}/checkout/resultado/`;
  const [firstName, ...rest] = order.customer.name.trim().split(/\s+/);
  return {
    external_reference: order.id,
    items: [
      ...order.lines.map((l) => ({
        id: l.id,
        title: l.name,
        description: `${l.collection} · ${l.unit}`,
        picture_url: `${origin}${encodeURI(l.image)}`,
        category_id: "home",
        quantity: l.qty,
        currency_id: "COP",
        unit_price: l.unitPrice ?? 0,
      })),
    ],
    shipments: order.totals.shipping ? { cost: order.totals.shipping, mode: "not_specified" } : undefined,
    payer: {
      name: firstName,
      surname: rest.join(" "),
      email: order.customer.email,
      phone: { area_code: "57", number: order.customer.phone.replace(/\D/g, "").replace(/^57/, "") },
      identification: { type: order.customer.docType, number: order.customer.docNumber },
      address: { street_name: order.shipping.address, zip_code: "" },
    },
    back_urls: { success: back, pending: back, failure: back },
    auto_return: "approved",
    statement_descriptor: "DECORTILES",
    metadata: { order_id: order.id },
  };
}

export interface PreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
}

export async function createPreference(order: Order): Promise<PreferenceResponse> {
  if (!MP_ENABLED) throw new Error("Mercado Pago no está configurado");
  const r = await fetch(MP_PREFERENCE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order, preference: buildPreference(order, window.location.origin) }),
  });
  if (!r.ok) throw new Error(`No se pudo iniciar el pago (${r.status})`);
  return r.json();
}

/** Parámetros con los que Mercado Pago regresa a back_urls */
export function readReturnParams(sp: URLSearchParams) {
  return {
    status: sp.get("collection_status") || sp.get("status") || "",
    paymentId: sp.get("payment_id") || sp.get("collection_id") || "",
    orderId: sp.get("external_reference") || sp.get("order") || "",
    preferenceId: sp.get("preference_id") || "",
  };
}
