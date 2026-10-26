import type { Metadata } from "next";
import Dashboard from "@/components/shop/admin/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard — Pedidos y facturación DECORTILES",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <Dashboard />;
}
