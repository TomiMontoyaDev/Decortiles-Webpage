"use client";

import { CartProvider } from "./CartContext";
import CartDrawer from "./CartDrawer";
import AddedModal from "./AddedModal";
import CartReminder from "./CartReminder";

/** Envuelve el sitio con el carrito y monta sus piezas globales */
export default function ShopUI({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <AddedModal />
      <CartReminder />
    </CartProvider>
  );
}
