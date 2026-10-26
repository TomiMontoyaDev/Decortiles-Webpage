import { STATUS_LABEL, type OrderStatus } from "@/lib/orders";

/** Estado con punto de color + texto (nunca solo color) */
export function StatusChip({ status }: { status: OrderStatus }) {
  return <span className={`dt-chip dt-chip--${status}`}>{STATUS_LABEL[status]}</span>;
}
