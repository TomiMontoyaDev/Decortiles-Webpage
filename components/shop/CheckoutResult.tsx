"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Clock, FileText, XCircle } from "lucide-react";
import { WhatsAppSvg } from "@/components/decortiles/icons";
import { waLink } from "@/lib/site";
import { money, unitLabel } from "@/lib/shop-config";
import { STATUS_LABEL, getOrder, updateOrder, type Order } from "@/lib/orders";
import { readReturnParams } from "@/lib/mercadopago";
import { useCart } from "./CartContext";

function waOrderMessage(o: Order) {
  return [
    `¡Hola DECORTILES! Acabo de hacer el pedido ${o.id}.`,
    ...o.lines.map((l) => `• ${l.qty} ${unitLabel(l.unit, l.qty)} — ${l.name}`),
    `Entrega: ${o.shipping.label} (${o.shipping.city})`,
    `A nombre de: ${o.customer.name}`,
  ].join("\n");
}

export default function CheckoutResult() {
  const sp = useSearchParams();
  const { clear } = useCart();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const ret = readReturnParams(sp);

  useEffect(() => {
    const id = ret.orderId;
    if (!id) return setOrder(null);
    (async () => {
      let o = await getOrder(id);
      // Regreso desde Mercado Pago. La confirmación definitiva debe venir del webhook (ver MERCADOPAGO.md).
      if (o && ret.status) {
        const patch: Partial<Order> = {
          payment: { ...o.payment, status: ret.status, paymentId: ret.paymentId || o.payment.paymentId },
        };
        if (ret.status === "approved") patch.status = "pagado";
        o = (await updateOrder(o.id, patch)) ?? o;
        if (ret.status === "approved") clear();
      }
      setOrder(o);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (order === undefined) return <div className="dt-result dt-result--loading" />;
  if (!order)
    return (
      <div className="dt-result">
        <h1 className="dt-sec-title">Pedido no encontrado</h1>
        <p>Si ya pagaste, escríbenos con el número de tu pedido y lo revisamos.</p>
        <a className="dt-btn dt-btn--wa" href={waLink("Hola DECORTILES, necesito ayuda con mi pedido.")} target="_blank" rel="noopener noreferrer">
          <WhatsAppSvg size={16} /> Escribir a un asesor
        </a>
      </div>
    );

  const rejected = ret.status === "rejected" || ret.status === "null";
  const pendingPay = ret.status === "pending" || ret.status === "in_process";
  const paid = order.status === "pagado";

  return (
    <div className="dt-result">
      {rejected ? (
        <span className="dt-result__icon is-bad">
          <XCircle size={44} strokeWidth={1.4} />
        </span>
      ) : pendingPay ? (
        <span className="dt-result__icon">
          <Clock size={44} strokeWidth={1.4} />
        </span>
      ) : (
        <span className="dt-check dt-check--xl" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
      )}
      <div className="dt-eyebrow">Pedido {order.id}</div>
      <h1 className="dt-result__title">
        {rejected
          ? "El pago no se completó"
          : pendingPay
            ? "Pago en proceso"
            : paid
              ? "¡Pago recibido!"
              : "¡Pedido recibido!"}
      </h1>
      <p className="dt-result__text">
        {rejected
          ? "No se realizó ningún cobro. Puedes intentar de nuevo o pagar con un asesor."
          : pendingPay
            ? "Mercado Pago está confirmando tu pago. Te avisaremos por correo apenas se apruebe."
            : paid
              ? `Gracias, ${order.customer.name.split(" ")[0]}. Tu factura ${order.invoiceNumber} está lista y preparamos tu pedido.`
              : `Gracias, ${order.customer.name.split(" ")[0]}. Un asesor te contactará al ${order.customer.phone} para confirmar disponibilidad, precio y envío.`}
      </p>

      <div className="dt-result__card">
        <div>
          <span>Estado</span>
          <strong>{STATUS_LABEL[order.status]}</strong>
        </div>
        <div>
          <span>Productos</span>
          <strong>{order.lines.reduce((s, l) => s + l.qty, 0)}</strong>
        </div>
        <div>
          <span>Entrega</span>
          <strong>{order.shipping.label}</strong>
        </div>
        <div>
          <span>Total</span>
          <strong>{money(order.totals.total)}</strong>
        </div>
      </div>

      <div className="dt-btns dt-btns--center">
        <Link className="dt-btn dt-btn--primary" href={`/factura/?id=${encodeURIComponent(order.id)}`}>
          <FileText size={15} /> {paid ? "Ver factura" : "Ver resumen del pedido"}
        </Link>
        <a className="dt-btn dt-btn--wa" href={waLink(waOrderMessage(order))} target="_blank" rel="noopener noreferrer">
          <WhatsAppSvg size={16} /> Enviar por WhatsApp
        </a>
        <Link className="dt-btn dt-btn--ghost" href="/catalogo/">
          Seguir viendo
        </Link>
      </div>
    </div>
  );
}
