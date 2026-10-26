"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, FileText, LogOut, RefreshCw, Search } from "lucide-react";
import { ADMIN_PIN, COMPANY, ORDERS_API_URL, money } from "@/lib/shop-config";
import {
  STATUS_LABEL,
  deleteOrder,
  fmtDate,
  isPaid,
  listOrders,
  onOrdersChange,
  type Order,
  type OrderStatus,
} from "@/lib/orders";
import SalesChart, { type Bucket } from "./SalesChart";
import OrderDetail from "./OrderDetail";
import { StatusChip } from "./StatusChip";
import ProductThumb from "../ProductThumb";
import { createDemoOrders } from "./demo";

const AUTH_KEY = "dt-admin-ok";
type Tab = "resumen" | "pedidos" | "facturacion";
type Range = 7 | 30 | 90 | 0;
const RANGES: { v: Range; label: string }[] = [
  { v: 7, label: "7 días" },
  { v: 30, label: "30 días" },
  { v: 90, label: "90 días" },
  { v: 0, label: "Todo" },
];

const DAY = 86_400_000;
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

function csv(rows: (string | number | null | undefined)[][]) {
  return rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
}
function download(name: string, content: string) {
  const url = URL.createObjectURL(new Blob(["﻿" + content], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}

function Gate({ onOk }: { onOk: () => void }) {
  const [pin, setPin] = useState("");
  const [bad, setBad] = useState(false);
  return (
    <div className="dt-adm-gate">
      <form
        className={bad ? "is-bad" : ""}
        onSubmit={(e) => {
          e.preventDefault();
          if (pin === ADMIN_PIN) {
            sessionStorage.setItem(AUTH_KEY, "1");
            onOk();
          } else {
            setBad(true);
            window.setTimeout(() => setBad(false), 500);
          }
        }}
      >
        <img src={COMPANY.logo} alt={COMPANY.brand} />
        <h1>Panel de pedidos</h1>
        <p>Ingresa el PIN de administración</p>
        <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} autoFocus aria-label="PIN" />
        <button className="dt-adm-btn dt-adm-btn--primary">Entrar</button>
      </form>
    </div>
  );
}

export default function Dashboard() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("resumen");
  const [range, setRange] = useState<Range>(30);
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState<OrderStatus | "todos">("todos");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => setAuthed(sessionStorage.getItem(AUTH_KEY) === "1"), []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await listOrders());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar los pedidos");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authed) return;
    load();
    return onOrdersChange(load);
  }, [authed, load]);

  const inRange = useMemo(() => {
    const from = range ? Date.now() - range * DAY : 0;
    return orders.filter((o) => new Date(o.createdAt).getTime() >= from);
  }, [orders, range]);

  const stats = useMemo(() => {
    const paid = inRange.filter(isPaid);
    const billed = paid.reduce((s, o) => s + (o.totals.total ?? 0), 0);
    const pending = inRange.filter((o) => o.status === "por_cotizar" || o.status === "pendiente_pago");
    const pendingValue = pending.reduce((s, o) => s + (o.totals.total ?? 0), 0);
    const shipping = inRange.filter((o) => o.status !== "cancelado");
    const free = shipping.filter((o) => o.totals.freeShipping).length;
    return {
      count: inRange.length,
      paid: paid.length,
      billed,
      iva: paid.reduce((s, o) => s + (o.totals.iva ?? 0), 0),
      avg: paid.length ? billed / paid.length : 0,
      pending: pending.length,
      toQuote: pending.filter((o) => o.status === "por_cotizar").length,
      pendingValue,
      freePct: shipping.length ? Math.round((free / shipping.length) * 100) : 0,
      shippingBilled: paid.reduce((s, o) => s + (o.totals.shipping ?? 0), 0),
    };
  }, [inRange]);

  // Ventas facturadas por día (≤ 30 días) o por semana
  const buckets = useMemo<Bucket[]>(() => {
    const days = range || Math.max(7, Math.ceil((Date.now() - Math.min(...orders.map((o) => +new Date(o.createdAt)), Date.now())) / DAY) + 1);
    const weekly = days > 31;
    const size = weekly ? 7 : 1;
    const n = Math.ceil(days / size);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const out: Bucket[] = Array.from({ length: n }, (_, i) => {
      const start = new Date(today.getTime() - (n - 1 - i) * size * DAY);
      const fmt = (d: Date) => new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" }).format(d);
      return {
        label: fmt(start),
        full: weekly ? `Semana del ${fmt(start)}` : new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" }).format(start),
        value: 0,
        orders: 0,
      };
    });
    const first = today.getTime() - (n - 1) * size * DAY;
    for (const o of orders.filter(isPaid)) {
      const d = new Date(o.invoiceDate ?? o.createdAt);
      d.setHours(0, 0, 0, 0);
      const idx = Math.floor((d.getTime() - first) / (size * DAY));
      if (idx >= 0 && idx < n) {
        out[idx].value += o.totals.total ?? 0;
        out[idx].orders += 1;
      }
    }
    return out;
  }, [orders, range]);

  const byStatus = useMemo(() => {
    const m = new Map<OrderStatus, number>();
    inRange.forEach((o) => m.set(o.status, (m.get(o.status) ?? 0) + 1));
    return (Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => ({ s, n: m.get(s) ?? 0 }));
  }, [inRange]);

  const topProducts = useMemo(() => {
    const m = new Map<string, { id: string; name: string; image: string; qty: number; unit: string; value: number }>();
    inRange
      .filter((o) => o.status !== "cancelado")
      .forEach((o) =>
        o.lines.forEach((l) => {
          const cur = m.get(l.id) ?? { id: l.id, name: l.name, image: l.image, qty: 0, unit: l.unit, value: 0 };
          cur.qty += l.qty;
          cur.value += (l.unitPrice ?? 0) * l.qty;
          m.set(l.id, cur);
        }),
      );
    return [...m.values()].sort((a, b) => b.qty - a.qty).slice(0, 6);
  }, [inRange]);

  const byCity = useMemo(() => {
    const m = new Map<string, number>();
    inRange.forEach((o) => m.set(o.shipping.city || "—", (m.get(o.shipping.city || "—") ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [inRange]);

  const filtered = useMemo(() => {
    const nq = q.trim().toLowerCase();
    return inRange.filter(
      (o) =>
        (statusF === "todos" || o.status === statusF) &&
        (!nq ||
          [o.id, o.invoiceNumber, o.customer.name, o.customer.email, o.customer.phone, o.customer.docNumber, o.shipping.city]
            .join(" ")
            .toLowerCase()
            .includes(nq)),
    );
  }, [inRange, q, statusF]);

  const invoices = useMemo(
    () => inRange.filter((o) => o.invoiceNumber).sort((a, b) => (b.invoiceNumber ?? "").localeCompare(a.invoiceNumber ?? "")),
    [inRange],
  );

  const byMonth = useMemo(() => {
    const m = new Map<string, { label: string; n: number; total: number; iva: number }>();
    invoices.forEach((o) => {
      const d = new Date(o.invoiceDate ?? o.createdAt);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const cur = m.get(k) ?? { label: new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(d), n: 0, total: 0, iva: 0 };
      cur.n++;
      cur.total += o.totals.total ?? 0;
      cur.iva += o.totals.iva ?? 0;
      m.set(k, cur);
    });
    return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([, v]) => v);
  }, [invoices]);

  function exportOrders() {
    download(
      `pedidos-decortiles-${dayKey(new Date())}.csv`,
      csv([
        ["Pedido", "Fecha", "Estado", "Factura", "Cliente", "Documento", "Email", "Teléfono", "Ciudad", "Envío", "Productos", "Subtotal", "Envío $", "IVA", "Total", "Notas"],
        ...filtered.map((o) => [
          o.id,
          fmtDate(o.createdAt, true),
          STATUS_LABEL[o.status],
          o.invoiceNumber,
          o.customer.company || o.customer.name,
          `${o.customer.docType} ${o.customer.docNumber}`,
          o.customer.email,
          o.customer.phone,
          o.shipping.city,
          o.shipping.label,
          o.lines.map((l) => `${l.qty}x ${l.name}`).join(" | "),
          o.totals.subtotal,
          o.totals.shipping,
          o.totals.iva,
          o.totals.total,
          o.notes,
        ]),
      ]),
    );
  }
  function exportInvoices() {
    download(
      `facturas-decortiles-${dayKey(new Date())}.csv`,
      csv([
        ["Factura", "Fecha", "Pedido", "Cliente", "Documento", "Base", "IVA", "Envío", "Total"],
        ...invoices.map((o) => [
          o.invoiceNumber,
          fmtDate(o.invoiceDate ?? o.createdAt),
          o.id,
          o.customer.company || o.customer.name,
          `${o.customer.docType} ${o.customer.docNumber}`,
          (o.totals.total ?? 0) - (o.totals.iva ?? 0),
          o.totals.iva,
          o.totals.shipping,
          o.totals.total,
        ]),
      ]),
    );
  }

  async function clearDemo() {
    if (!window.confirm("¿Borrar todos los pedidos de ejemplo?")) return;
    for (const o of orders.filter((o) => o.demo)) await deleteOrder(o.id);
  }

  if (authed === null) return null;
  if (!authed) return <Gate onOk={() => setAuthed(true)} />;

  const open = orders.find((o) => o.id === openId) ?? null;
  const hasDemo = orders.some((o) => o.demo);
  const maxCity = Math.max(1, ...byCity.map(([, n]) => n));

  return (
    <div className="dt-adm">
      <header className="dt-adm-top">
        <Link href="/" className="dt-adm-brand">
          <img src={COMPANY.logo} alt="" />
          <span>
            Decor<b>tiles</b>
            <small>Pedidos y facturación</small>
          </span>
        </Link>
        <nav className="dt-adm-tabs" role="tablist">
          {(["resumen", "pedidos", "facturacion"] as Tab[]).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "is-active" : ""} onClick={() => setTab(t)}>
              {t === "resumen" ? "Resumen" : t === "pedidos" ? `Pedidos${stats.pending ? ` · ${stats.pending}` : ""}` : "Facturación"}
            </button>
          ))}
        </nav>
        <div className="dt-adm-top__actions">
          <button className="dt-adm-icon" onClick={load} aria-label="Actualizar" title="Actualizar">
            <RefreshCw size={16} className={loading ? "is-spin" : ""} />
          </button>
          <button
            className="dt-adm-icon"
            onClick={() => {
              sessionStorage.removeItem(AUTH_KEY);
              setAuthed(false);
            }}
            aria-label="Salir"
            title="Salir"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="dt-adm-main">
        {/* Filtros en una fila sobre el contenido */}
        <div className="dt-adm-filters">
          <div className="dt-adm-seg" role="group" aria-label="Periodo">
            {RANGES.map((r) => (
              <button key={r.v} className={range === r.v ? "is-active" : ""} onClick={() => setRange(r.v)}>
                {r.label}
              </button>
            ))}
          </div>
          {tab === "pedidos" && (
            <>
              <label className="dt-adm-search">
                <Search size={14} />
                <input placeholder="Buscar pedido, cliente, ciudad…" value={q} onChange={(e) => setQ(e.target.value)} />
              </label>
              <select value={statusF} onChange={(e) => setStatusF(e.target.value as OrderStatus | "todos")} aria-label="Estado">
                <option value="todos">Todos los estados</option>
                {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </>
          )}
          <div className="dt-adm-filters__end">
            {tab === "pedidos" && (
              <button className="dt-adm-btn" onClick={exportOrders}>
                <Download size={14} /> CSV
              </button>
            )}
            {tab === "facturacion" && (
              <button className="dt-adm-btn" onClick={exportInvoices}>
                <Download size={14} /> CSV
              </button>
            )}
          </div>
        </div>

        {error && <div className="dt-adm-error">{error}</div>}
        {!ORDERS_API_URL && (
          <div className="dt-adm-info">
            Modo local: los pedidos se guardan en este navegador. Conecta <code>NEXT_PUBLIC_ORDERS_API_URL</code> para verlos desde
            cualquier equipo.
            {!hasDemo ? (
              <button onClick={() => createDemoOrders()}>Cargar pedidos de ejemplo</button>
            ) : (
              <button onClick={clearDemo}>Borrar pedidos de ejemplo</button>
            )}
          </div>
        )}

        {/* ===== RESUMEN ===== */}
        {tab === "resumen" && (
          <div className="dt-adm-fade" key={`r${range}`}>
            <div className="dt-adm-kpis">
              <div className="dt-kpi">
                <span>Facturado</span>
                <strong>{money(stats.billed)}</strong>
                <small>{stats.paid} pedidos pagados</small>
              </div>
              <div className="dt-kpi">
                <span>Pedidos</span>
                <strong>{stats.count}</strong>
                <small>en el periodo</small>
              </div>
              <div className="dt-kpi">
                <span>Por gestionar</span>
                <strong>{stats.pending}</strong>
                <small>
                  {stats.toQuote} por cotizar · {money(stats.pendingValue)} en espera
                </small>
              </div>
              <div className="dt-kpi">
                <span>Ticket promedio</span>
                <strong>{money(Math.round(stats.avg))}</strong>
                <small>IVA facturado {money(stats.iva)}</small>
              </div>
              <div className="dt-kpi">
                <span>Envío gratis</span>
                <strong>{stats.freePct}%</strong>
                <small>Fletes cobrados {money(stats.shippingBilled)}</small>
              </div>
            </div>

            <section className="dt-adm-card">
              <div className="dt-adm-card__head">
                <h2>Ventas facturadas</h2>
                <span className="dt-adm-muted">{(range || 91) > 31 ? "por semana" : "por día"}</span>
              </div>
              <SalesChart data={buckets} />
            </section>

            <div className="dt-adm-grid3">
              <section className="dt-adm-card">
                <h2>Pedidos por estado</h2>
                <ul className="dt-adm-list">
                  {byStatus.map(({ s, n }) => (
                    <li key={s}>
                      <button
                        onClick={() => {
                          setStatusF(s);
                          setTab("pedidos");
                        }}
                      >
                        <StatusChip status={s} />
                        <b>{n}</b>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="dt-adm-card">
                <h2>Productos más pedidos</h2>
                {topProducts.length === 0 ? (
                  <p className="dt-adm-muted">Sin datos aún.</p>
                ) : (
                  <ul className="dt-adm-topprod">
                    {topProducts.map((p) => (
                      <li key={p.name}>
                        <ProductThumb id={p.id} src={p.image} alt={p.name} className="dt-adm-topprod__img" />
                        <span>
                          {p.name}
                          <small>
                            {p.qty} {p.unit === "caja" ? "cajas" : "unid."} · {money(p.value)}
                          </small>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <section className="dt-adm-card">
                <h2>Pedidos por ciudad</h2>
                <ul className="dt-adm-bars">
                  {byCity.map(([city, n]) => (
                    <li key={city}>
                      <span>{city}</span>
                      <i style={{ width: `${(n / maxCity) * 100}%` }} />
                      <b>{n}</b>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="dt-adm-card">
              <div className="dt-adm-card__head">
                <h2>Últimos pedidos</h2>
                <button className="dt-adm-link" onClick={() => setTab("pedidos")}>
                  Ver todos →
                </button>
              </div>
              <OrdersTable orders={inRange.slice(0, 6)} onOpen={setOpenId} />
            </section>
          </div>
        )}

        {/* ===== PEDIDOS ===== */}
        {tab === "pedidos" && (
          <section className="dt-adm-card dt-adm-fade" key="p">
            <div className="dt-adm-card__head">
              <h2>{filtered.length} pedidos</h2>
              <span className="dt-adm-muted">Total {money(filtered.reduce((s, o) => s + (o.totals.total ?? 0), 0))}</span>
            </div>
            <OrdersTable orders={filtered} onOpen={setOpenId} />
          </section>
        )}

        {/* ===== FACTURACIÓN ===== */}
        {tab === "facturacion" && (
          <div className="dt-adm-fade" key="f">
            <div className="dt-adm-kpis dt-adm-kpis--3">
              <div className="dt-kpi">
                <span>Total facturado</span>
                <strong>{money(invoices.reduce((s, o) => s + (o.totals.total ?? 0), 0))}</strong>
                <small>{invoices.length} facturas</small>
              </div>
              <div className="dt-kpi">
                <span>Base gravable</span>
                <strong>{money(invoices.reduce((s, o) => s + (o.totals.total ?? 0) - (o.totals.iva ?? 0), 0))}</strong>
              </div>
              <div className="dt-kpi">
                <span>IVA generado</span>
                <strong>{money(invoices.reduce((s, o) => s + (o.totals.iva ?? 0), 0))}</strong>
              </div>
            </div>
            <div className="dt-adm-grid2">
              <section className="dt-adm-card">
                <h2>Facturas emitidas</h2>
                <div className="dt-adm-tablewrap">
                  <table className="dt-adm-table">
                    <thead>
                      <tr>
                        <th>Factura</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th className="num">IVA</th>
                        <th className="num">Total</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((o) => (
                        <tr key={o.id}>
                          <td>
                            <b>{o.invoiceNumber}</b>
                            <small>{o.id}</small>
                          </td>
                          <td>{fmtDate(o.invoiceDate ?? o.createdAt)}</td>
                          <td>
                            {o.customer.company || o.customer.name}
                            <small>
                              {o.customer.docType} {o.customer.docNumber}
                            </small>
                          </td>
                          <td className="num">{money(o.totals.iva)}</td>
                          <td className="num">
                            <b>{money(o.totals.total)}</b>
                          </td>
                          <td>
                            <Link className="dt-adm-icon" href={`/factura/?id=${encodeURIComponent(o.id)}`} target="_blank" aria-label="Ver factura">
                              <FileText size={15} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                      {invoices.length === 0 && (
                        <tr>
                          <td colSpan={6} className="dt-adm-empty">
                            Aún no hay facturas. Se emiten al marcar un pedido como Pagado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
              <section className="dt-adm-card">
                <h2>Por mes</h2>
                <table className="dt-adm-table">
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th className="num">Fact.</th>
                      <th className="num">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byMonth.map((m) => (
                      <tr key={m.label}>
                        <td style={{ textTransform: "capitalize" }}>{m.label}</td>
                        <td className="num">{m.n}</td>
                        <td className="num">
                          <b>{money(m.total)}</b>
                          <small>IVA {money(m.iva)}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </div>
          </div>
        )}
      </main>

      {open && <OrderDetail order={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}

function OrdersTable({ orders, onOpen }: { orders: Order[]; onOpen: (id: string) => void }) {
  return (
    <div className="dt-adm-tablewrap">
      <table className="dt-adm-table dt-adm-table--click">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Entrega</th>
            <th className="num">Productos</th>
            <th className="num">Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={o.id} onClick={() => onOpen(o.id)} style={{ animationDelay: `${Math.min(i, 12) * 25}ms` }}>
              <td>
                <b>{o.id}</b>
                {o.invoiceNumber && <small>{o.invoiceNumber}</small>}
              </td>
              <td>{fmtDate(o.createdAt, true)}</td>
              <td>
                {o.customer.company || o.customer.name}
                <small>{o.customer.phone}</small>
              </td>
              <td>
                {o.shipping.city}
                <small>{o.shipping.label}</small>
              </td>
              <td className="num">{o.lines.reduce((s, l) => s + l.qty, 0)}</td>
              <td className="num">
                <b>{money(o.totals.total)}</b>
              </td>
              <td>
                <StatusChip status={o.status} />
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={7} className="dt-adm-empty">
                No hay pedidos en este periodo.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
