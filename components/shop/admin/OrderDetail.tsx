"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Copy, FileText, Mail, Trash2, X } from "lucide-react";
import ProductThumb from "../ProductThumb";
import { WhatsAppSvg } from "@/components/decortiles/icons";
import { waLink } from "@/lib/site";
import { IVA_RATE, MP_ENABLED, PRICES_INCLUDE_IVA, money, unitLabel } from "@/lib/shop-config";
import {
  STATUS_LABEL,
  computeTotals,
  deleteOrder,
  fmtDate,
  shippingMethod,
  updateOrder,
  type Order,
  type OrderStatus,
  type Totals,
} from "@/lib/orders";
import { createPreference } from "@/lib/mercadopago";
import { StatusChip } from "./StatusChip";

/** Totales con costo de envío ajustado a mano por el asesor */
function withShipping(t: Totals, shipping: number | null): Totals {
  if (shipping == null) return t;
  const total = t.subtotal != null ? t.subtotal + shipping : null;
  const iva = total == null ? null : PRICES_INCLUDE_IVA ? Math.round(total - total / (1 + IVA_RATE)) : Math.round(total * IVA_RATE);
  return { ...t, shipping, freeShipping: shipping === 0, total: total != null && !PRICES_INCLUDE_IVA ? total + (iva ?? 0) : total, iva };
}

export default function OrderDetail({ order, onClose }: { order: Order; onClose: () => void }) {
  const [prices, setPrices] = useState<(string)[]>([]);
  const [ship, setShip] = useState("");
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setPrices(order.lines.map((l) => (l.unitPrice == null ? "" : String(l.unitPrice))));
    setShip(order.totals.shipping == null ? "" : String(order.totals.shipping));
    setStatus(order.status);
  }, [order]);
  useEffect(() => setMsg(""), [order.id]);

  const lines = useMemo(
    () => order.lines.map((l, i) => ({ ...l, unitPrice: prices[i] === "" || prices[i] == null ? null : Number(prices[i]) })),
    [order.lines, prices],
  );
  const totals = useMemo(
    () => withShipping(computeTotals(lines, shippingMethod(order.shipping.method)), ship === "" ? null : Number(ship)),
    [lines, ship, order.shipping.method],
  );
  const dirty =
    status !== order.status ||
    lines.some((l, i) => l.unitPrice !== order.lines[i].unitPrice) ||
    totals.shipping !== order.totals.shipping;

  async function save() {
    setSaving(true);
    // Al cotizar todos los precios, el pedido pasa solo a "pendiente de pago"
    const auto = status === "por_cotizar" && totals.subtotal != null ? "pendiente_pago" : status;
    await updateOrder(order.id, { lines, totals, status: auto });
    setSaving(false);
    setMsg(auto !== status ? "Guardado · el pedido pasó a Pendiente de pago" : "Guardado");
  }

  async function payLink() {
    try {
      const pref = await createPreference({ ...order, lines, totals });
      await updateOrder(order.id, { payment: { ...order.payment, provider: "mercadopago", preferenceId: pref.id } });
      await navigator.clipboard.writeText(pref.init_point);
      setMsg("Link de pago copiado al portapapeles");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "No se pudo crear el link");
    }
  }

  async function remove() {
    if (!window.confirm(`¿Eliminar el pedido ${order.id}? Esta acción no se puede deshacer.`)) return;
    await deleteOrder(order.id);
    onClose();
  }

  const c = order.customer;
  const s = order.shipping;
  const phone = c.phone.replace(/\D/g, "");

  return (
    <div className="dt-adm-detail-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="dt-adm-detail" role="dialog" aria-label={`Pedido ${order.id}`}>
        <header>
          <div>
            <div className="dt-adm-muted">{fmtDate(order.createdAt, true)}</div>
            <h2>{order.id}</h2>
            <StatusChip status={order.status} />
            {order.invoiceNumber && <span className="dt-adm-inv">{order.invoiceNumber}</span>}
          </div>
          <button onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </header>

        <div className="dt-adm-detail__body">
          <section className="dt-adm-two">
            <div>
              <h3>Cliente</h3>
              <p>
                <strong>{c.company || c.name}</strong>
                <br />
                {c.docType} {c.docNumber}
                {c.company && (
                  <>
                    <br />
                    {c.name}
                  </>
                )}
                <br />
                {c.email}
                <br />
                {c.phone}
              </p>
            </div>
            <div>
              <h3>{s.label}</h3>
              <p>
                {s.method === "recoger" ? (
                  <>Sede {s.pickupSede}</>
                ) : (
                  <>
                    {s.address} {s.addressExtra}
                    <br />
                    {s.neighborhood && `${s.neighborhood}, `}
                    {s.city}, {s.department}
                    <br />
                    {s.deliveryWindow}
                  </>
                )}
              </p>
            </div>
          </section>

          {order.notes && (
            <section className="dt-adm-note">
              <h3>Notas del cliente</h3>
              <p>{order.notes}</p>
            </section>
          )}

          <section>
            <h3>Productos y cotización</h3>
            <ul className="dt-adm-lines">
              {lines.map((l, i) => (
                <li key={l.id}>
                  <ProductThumb id={l.id} src={l.image} alt={l.name} className="dt-adm-lines__img" zoomable />
                  <span className="dt-adm-lines__name">
                    {l.name}
                    <small>
                      {l.qty} {unitLabel(l.unit, l.qty)} · {Math.round(l.kgPerUnit * l.qty)} kg
                    </small>
                  </span>
                  <label className="dt-adm-money">
                    <span>$</span>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="Precio unit."
                      value={prices[i] ?? ""}
                      onChange={(e) => setPrices((p) => p.map((v, j) => (j === i ? e.target.value : v)))}
                    />
                  </label>
                  <strong>{l.unitPrice == null ? "—" : money(l.unitPrice * l.qty)}</strong>
                </li>
              ))}
            </ul>
            <dl className="dt-adm-totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{money(totals.subtotal)}</dd>
              </div>
              <div>
                <dt>Envío ({totals.weightKg} kg)</dt>
                <dd>
                  <label className="dt-adm-money">
                    <span>$</span>
                    <input type="number" min={0} step={1000} value={ship} onChange={(e) => setShip(e.target.value)} />
                  </label>
                </dd>
              </div>
              <div>
                <dt>IVA incluido</dt>
                <dd>{money(totals.iva)}</dd>
              </div>
              <div className="dt-adm-totals__total">
                <dt>Total</dt>
                <dd>{money(totals.total)}</dd>
              </div>
            </dl>
          </section>

          <section className="dt-adm-status">
            <h3>Estado</h3>
            <div className="dt-adm-statusgrid">
              {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((st) => (
                <button key={st} className={status === st ? "is-active" : ""} onClick={() => setStatus(st)}>
                  <StatusChip status={st} />
                </button>
              ))}
            </div>
            <p className="dt-adm-muted">Al marcar como Pagado se emite la factura con el siguiente consecutivo.</p>
          </section>
        </div>

        <footer>
          {msg && <div className="dt-adm-msg">{msg}</div>}
          <div className="dt-adm-actions">
            <button className="dt-adm-btn dt-adm-btn--primary" disabled={!dirty || saving} onClick={save}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
            <Link className="dt-adm-btn" href={`/factura/?id=${encodeURIComponent(order.id)}`} target="_blank">
              <FileText size={14} /> {order.invoiceNumber ? "Factura" : "Proforma"}
            </Link>
            <a
              className="dt-adm-btn"
              target="_blank"
              rel="noopener noreferrer"
              href={waLink(
                `Hola ${c.name.split(" ")[0]}, te escribimos de DECORTILES sobre tu pedido ${order.id}.${totals.total != null ? ` Total: ${money(totals.total)}.` : ""}`,
                phone.startsWith("57") ? phone : `57${phone}`,
              )}
            >
              <WhatsAppSvg size={14} /> WhatsApp
            </a>
            <a className="dt-adm-btn" href={`mailto:${c.email}?subject=${encodeURIComponent(`Tu pedido DECORTILES ${order.id}`)}`}>
              <Mail size={14} /> Correo
            </a>
            {MP_ENABLED && totals.total != null && (
              <button className="dt-adm-btn" onClick={payLink}>
                <Copy size={14} /> Link de pago
              </button>
            )}
            <button className="dt-adm-btn dt-adm-btn--danger" onClick={remove} aria-label="Eliminar pedido">
              <Trash2 size={14} />
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
