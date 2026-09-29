import { useRef, useState, MouseEvent, TouchEvent } from "react";
import Image from "next/image";

interface ImageZoomProps {
  src: string;
  alt: string;
}

export default function ImageZoom({ src, alt }: ImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [isZoomed, setIsZoomed] = useState(false);

  const updateZoom = (clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    setZoomStyle({
      backgroundImage: `url(${src})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "200%",
      display: "block",
      opacity: 1,
    });
  };

  // Eventos de mouse para desktop
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 768) { // Solo en desktop/tablet
      updateZoom(e.clientX, e.clientY);
    }
  };

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      setIsZoomed(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      setZoomStyle({ display: "none", opacity: 0 });
      setIsZoomed(false);
    }
  };

  // Eventos táctiles para móvil
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) { // Solo en móvil
      e.preventDefault();
      setIsZoomed(!isZoomed);
      
      if (!isZoomed) {
        const touch = e.touches[0];
        updateZoom(touch.clientX, touch.clientY);
      } else {
        setZoomStyle({ display: "none", opacity: 0 });
      }
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768 && isZoomed) {
      e.preventDefault();
      const touch = e.touches[0];
      updateZoom(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      // En móvil, mantenemos el zoom hasta que toquen de nuevo
    }
  };

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-md border border-gray-200">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full h-full cursor-zoom-in"
      >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover pointer-events-none"
          />
        <div
          className="absolute inset-0 transition-opacity duration-200 pointer-events-none"
          style={{
            ...zoomStyle,
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>
      
      {/* Indicador para móvil */}
      <div className="md:hidden absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        {isZoomed ? "Toca para salir" : "Toca para ampliar"}
      </div>
    </div>
  );
}
