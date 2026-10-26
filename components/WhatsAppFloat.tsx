"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface WhatsAppFloatProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppFloat({
  phoneNumber = "+573128019754",
  message = "¡Hola! Me interesa conocer más sobre sus productos de cerámica y porcelanatos.",
}: WhatsAppFloatProps) {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname() || "/";
  // No se muestra en el panel interno ni en la factura imprimible
  if (pathname.startsWith("/admin") || pathname.startsWith("/factura")) return null;

  const openWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={openWhatsApp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group"
        aria-label="Contactar por WhatsApp"
      >
        {/* Círculo de fondo con efecto de pulso */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>

        {/* Botón principal */}
        <div
          className={`relative flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-all duration-300 transform ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        >
          <Image
            src="/images/icons/whatsapp-icon.png"
            alt="WhatsApp"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </div>

        {/* Tooltip */}
        <div
          className={`absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap transition-all duration-300 ${
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          ¡Chatea con nosotros!
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </button>
    </div>
  );
}
