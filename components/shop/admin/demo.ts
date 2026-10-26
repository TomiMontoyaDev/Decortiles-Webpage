// Pedidos de ejemplo para probar el dashboard (se marcan con demo: true y se pueden borrar)
import { PRODUCTS } from "@/lib/catalog-data";
import { kgPerUnit, unitOf } from "@/lib/shop-config";
import { computeTotals, saveOrder, shippingMethod, updateOrder, type Order, type OrderStatus } from "@/lib/orders";

const NAMES = [
  "Laura Gómez Restrepo", "Carlos Andrés Pérez", "Natalia Ríos", "Jorge Mario Cárdenas", "Valentina Herrera",
  "Andrés Felipe Ochoa", "María José Barrios", "Camilo Torres", "Paula Andrea Mejía", "Santiago Villa",
  "Constructora Altos del Río", "Daniela Charris", "Esteban Londoño", "Luisa Fernanda Polo",
];
const CITIES: [string, string, "local" | "nacional" | "recoger"][] = [
  ["Medellín", "Antioquia", "local"], ["Envigado", "Antioquia", "local"], ["Barranquilla", "Atlántico", "local"],
  ["Soledad", "Atlántico", "local"], ["Bogotá", "Bogotá D.C.", "nacional"], ["Cartagena", "Bolívar", "nacional"],
  ["Medellín", "Antioquia", "recoger"], ["Santa Marta", "Magdalena", "nacional"],
];
const STATUSES: OrderStatus[] = ["entregado", "entregado", "enviado", "pagado", "en_preparacion", "pendiente_pago", "por_cotizar", "cancelado"];

const pick = <T,>(a: T[], r: () => number) => a[Math.floor(r() * a.length)];

export async function createDemoOrders(n = 28) {
  let seed = 7;
  const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < n; i++) {
    const d = new Date(Date.now() - Math.floor(r() * 45) * 86_400_000 - Math.floor(r() * 36_000_000));
    const [city, department, method] = pick(CITIES, r);
    const lines = Array.from({ length: 1 + Math.floor(r() * 3) }, () => {
      const p = pick(PRODUCTS, r);
      const unit = unitOf(p);
      return {
        id: p.id,
        name: p.name,
        collection: p.collection,
        image: p.image,
        unit,
        qty: unit === "caja" ? 4 + Math.floor(r() * 30) : 1 + Math.floor(r() * 3),
        unitPrice: (unit === "caja" ? 70 + Math.floor(r() * 160) : 350 + Math.floor(r() * 900)) * 1000,
        kgPerUnit: kgPerUnit(p),
      };
    });
    const status = pick(STATUSES, r);
    const name = pick(NAMES, r);
    const company = name.startsWith("Constructora");
    const order: Order = {
      id: `DT-DEMO-${String(i + 1).padStart(3, "0")}`,
      createdAt: d.toISOString(),
      updatedAt: d.toISOString(),
      status: status === "por_cotizar" ? "por_cotizar" : "pendiente_pago",
      customer: {
        name,
        docType: company ? "NIT" : "CC",
        docNumber: String(10_000_000 + Math.floor(r() * 89_999_999)),
        email: `${name.split(" ")[0].toLowerCase()}@ejemplo.com`,
        phone: `3${Math.floor(100_000_000 + r() * 899_999_999)}`,
        company: company ? name : undefined,
      },
      shipping: {
        method,
        label: shippingMethod(method)!.label,
        department: method === "recoger" ? "" : department,
        city,
        address: method === "recoger" ? "Cl. 50 #56B-22" : `Cra. ${10 + Math.floor(r() * 70)} #${Math.floor(r() * 90)}-${Math.floor(r() * 90)}`,
        addressExtra: "",
        neighborhood: "",
        pickupSede: method === "recoger" ? "Medellín" : undefined,
        deliveryWindow: "Cualquier horario",
      },
      lines: status === "por_cotizar" ? lines.map((l) => ({ ...l, unitPrice: null })) : lines,
      notes: r() > 0.6 ? "Entrega en obra, llamar antes de llegar." : "",
      totals: computeTotals(status === "por_cotizar" ? lines.map((l) => ({ ...l, unitPrice: null })) : lines, shippingMethod(method)),
      payment: { provider: r() > 0.3 ? "mercadopago" : "asesor" },
      demo: true,
    };
    await saveOrder(order);
    if (status !== "por_cotizar" && status !== "pendiente_pago") await updateOrder(order.id, { status, invoiceDate: d.toISOString(), updatedAt: d.toISOString() });
  }
}
