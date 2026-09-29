// Datos generales del sitio — editar aquí y se actualiza en todo el sitio.

export const YEARS_EXPERIENCE = 13;
export const CURRENT_YEAR = 2026;

export const WHATSAPP_MAIN = "573128019754";
export const EMAIL = "contacto@decorcolombiatiles.com";

export const waLink = (message: string, phone: string = WHATSAPP_MAIN) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

export const WA_ASESOR = waLink(
  "¡Hola DECORTILES! Quiero hablar con un asesor para elegir el acabado de mi proyecto.",
);
export const WA_COTIZAR = waLink(
  "¡Hola DECORTILES! Quiero cotizar mi proyecto.\n• Espacio: \n• Medidas aproximadas (m²): \n• Estilo / producto de interés: \n• Ciudad: ",
);

export interface Sede {
  city: string;
  addresses: string[];
  zone?: string;
  mapsUrl: string;
  phones: { label: string; wa: string }[];
}

export const SEDES: Sede[] = [
  {
    city: "Medellín",
    addresses: ["Cl. 50 #56B-22"],
    zone: "La Candelaria",
    mapsUrl: "https://maps.app.goo.gl/9qjm1brWzKf7HE2y8",
    phones: [{ label: "+57 312 801 9754", wa: "573128019754" }],
  },
  {
    city: "Barranquilla",
    addresses: ["Cra. 35 #29B-42", "Cra. 30 #24-58"],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Carrera 35 #29B-42, Barranquilla, Atlántico"),
    phones: [
      { label: "+57 312 801 9754", wa: "573128019754" },
      { label: "+57 301 331 0178", wa: "573013310178" },
    ],
  },
];

export const HORARIO = [
  "Lun – Vie: 8:00 a.m. – 6:00 p.m.",
  "Sáb: 9:00 a.m. – 5:00 p.m.",
];

export const SOCIAL = {
  facebook: "https://www.facebook.com/decortilesceramica/",
  instagram: "https://www.instagram.com/decortilesceramica/",
};
