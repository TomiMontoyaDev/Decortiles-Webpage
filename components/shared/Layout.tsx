import Header from "./Header";
import Footer from "./Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  /** true = fondo oscuro (catálogo). false = páginas de contenido claras */
  dark?: boolean;
  /** Se mantiene por compatibilidad con páginas existentes */
  fixedHeader?: boolean;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
}

export default function Layout({
  children,
  dark = false,
  showBackButton = false,
  backButtonText = "Volver",
  backButtonHref = "/",
}: LayoutProps) {
  return (
    <div className={dark ? "min-h-screen dt-page-dark" : "min-h-screen bg-white"}>
      <Header />

      {showBackButton && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href={backButtonHref}
            className="inline-flex items-center text-[var(--silver-blue-500)] hover:text-[var(--silver-blue-700)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backButtonText}
          </Link>
        </div>
      )}

      {children}

      <Footer />
    </div>
  );
}
