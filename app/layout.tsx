import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, League_Spartan, Raleway } from "next/font/google";
import "./globals.css";
import "./decortiles.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "DECORTILES — Porcelanatos, cerámicas y pisos importados",
  description: "Encuentra el acabado ideal para transformar tu espacio. Porcelanatos, cerámicas, pisos y revestimientos importados para proyectos residenciales y comerciales. Más de 13 años de experiencia. Sedes en Medellín y Barranquilla.",
  keywords: "porcelanato, cerámica, pisos, revestimientos, sanitarios, lavamanos, Medellín, Barranquilla, DECORTILES",
  authors: [{ name: "DecorTiles" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  openGraph: {
    title: "DecorTiles - Materiales de Primera Calidad",
    description: "¡Encuentra el piso perfecto para tu hogar! Materiales de primera calidad con tecnología de vanguardia.",
    url: "https://decorcolombiatiles.com",
    siteName: "DecorTiles",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "DecorTiles Logo",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DecorTiles - Materiales de Primera Calidad",
    description: "¡Encuentra el piso perfecto para tu hogar! Materiales de primera calidad.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${leagueSpartan.variable} ${raleway.variable} antialiased`}
      >
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
