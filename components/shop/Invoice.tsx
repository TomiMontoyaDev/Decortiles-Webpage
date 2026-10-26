/* eslint-disable @next/next/no-img-element */
import { COMPANY, IVA_RATE, money, unitLabel } from "@/lib/shop-config";
import { STATUS_LABEL, fmtDate, isPaid, type Order } from "@/lib/orders";

/** Factura de venta DECORTILES (o proforma si el pedido aún no está pagado). Lista para imprimir / PDF. */
export default function Invoice({ order }: { order: Order }) {
  const paid = isPaid(order);
  const t = order.totals;
  const c = order.customer;
  const s = order.shipping;
  const base = t.total != null && t.iva != null ? t.total - t.iva : null;

  return (
    <article className="dt-inv">
      <header className="dt-inv__head">
        <div className="dt-inv__brand">
          <img src={COMPANY.logo} alt={COMPANY.brand} />
          <div>
            <strong>{COMPANY.legalName}</strong>
            <span>{COMPANY.nit}</span>
            <span>{COMPANY.regime}</span>
            <span>{COMPANY.address}</span>
            <span>
              {COMPANY.phone} · {COMPANY.email}
            </span>
          </div>
        </div>
        <div className="dt-inv__doc">
          <div className="dt-inv__kind">{paid ? "Factura de venta" : "Proforma / Cotización"}</div>
          <div className="dt-inv__num">{paid ? order.invoiceNumber : order.id}</div>
          <dl>
            <div>
              <dt>Fecha</dt>
              <dd>{fmtDate(order.invoiceDate ?? order.createdAt, true)}</dd>
            </div>
            <div>
              <dt>Pedido</dt>
              <dd>{order.id}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{STATUS_LABEL[order.status]}</dd>
            </div>
            {order.payment.paymentId && (
              <div>
                <dt>Pago MP</dt>
                <dd>{order.payment.paymentId}</dd>
              </div>
            )}
          </dl>
        </div>
      </header>

      <section className="dt-inv__parties">
        <div>
          <h3>Cliente</h3>
          <p>
            <strong>{c.company || c.name}</strong>
            <br />
            {c.docType} {c.docNumber}
            {c.company && (
              <>
                <br />
                Contacto: {c.name}
              </>
            )}
            <br />
            {c.email}
            <br />
            {c.phone}
          </p>
        </div>
        <div>
          <h3>Entrega · {s.label}</h3>
          <p>
            {s.method === "recoger" ? (
              <>Recoge en sede {s.pickupSede}</>
            ) : (
              <>
                {s.address} {s.addressExtra}
                <br />
                {s.neighborhood && `${s.neighborhood}, `}
                {s.city}
                {s.department && `, ${s.department}`}
                {s.deliveryWindow && (
                  <>
                    <br />
                    {s.deliveryWindow}
                  </>
                )}
              </>
            )}
          </p>
        </div>
      </section>

      <table className="dt-inv__table">
        <thead>
          <tr>
            <th>Ref.</th>
            <th>Descripción</th>
            <th>Cant.</th>
            <th>V. unitario</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((l) => (
            <tr key={l.id}>
              <td>{l.id.toUpperCase()}</td>
              <td>
                {l.name}
                <small>{l.collection}</small>
              </td>
              <td>
                {l.qty} {unitLabel(l.unit, l.qty)}
              </td>
              <td>{money(l.unitPrice)}</td>
              <td>{l.unitPrice == null ? "—" : money(l.unitPrice * l.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="dt-inv__foot">
        <div className="dt-inv__notes">
          {order.notes && (
            <>
              <h3>Notas</h3>
              <p>{order.notes}</p>
            </>
          )}
          <p className="dt-inv__legal">{COMPANY.legalNote}</p>
        </div>
        <dl className="dt-inv__totals">
          <div>
            <dt>Subtotal productos</dt>
            <dd>{money(t.subtotal)}</dd>
          </div>
          <div>
            <dt>Envío ({t.weightKg} kg)</dt>
            <dd>{t.shipping === 0 ? "Gratis" : money(t.shipping)}</dd>
          </div>
          <div>
            <dt>Base gravable</dt>
            <dd>{money(base)}</dd>
          </div>
          <div>
            <dt>IVA {IVA_RATE * 100}%</dt>
            <dd>{money(t.iva)}</dd>
          </div>
          <div className="dt-inv__total">
            <dt>Total</dt>
            <dd>{money(t.total)}</dd>
          </div>
        </dl>
      </section>

      <footer className="dt-inv__bottom">
        Gracias por elegir {COMPANY.brand} · {COMPANY.web}
      </footer>
    </article>
  );
}
