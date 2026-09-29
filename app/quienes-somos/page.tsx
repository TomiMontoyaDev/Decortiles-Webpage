import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/shared/Header"
import Footer from "@/components/shared/Footer"
import { Target, Heart, Users, Shield, Lightbulb, Star, Eye, ZoomIn } from "lucide-react"

export default function QuienesSomosPage() {
  const valores = [
    { name: "Respeto", icon: Heart, color: "from-[var(--silver-blue-400)] to-[var(--silver-blue-600)]" },
    { name: "Integridad", icon: Shield, color: "from-[var(--silver-blue-500)] to-[var(--silver-blue-700)]" },
    { name: "Transparencia", icon: Eye, color: "from-[var(--silver-blue-300)] to-[var(--silver-blue-500)]" },
    { name: "Innovación", icon: Lightbulb, color: "from-[var(--silver-blue-600)] to-[var(--silver-blue-800)]" },
    { name: "Calidad", icon: Star, color: "from-[var(--silver-blue-400)] to-[var(--silver-blue-700)]" },
    { name: "Trabajo en equipo", icon: Users, color: "from-[var(--silver-blue-500)] to-[var(--silver-blue-600)]" },
    { name: "Orientación al cliente", icon: Target, color: "from-[var(--silver-blue-300)] to-[var(--silver-blue-600)]" },
    { name: "Atención al Detalle", icon: ZoomIn, color: "from-[var(--silver-blue-600)] to-[var(--silver-blue-900)]" },
  ]


  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Header />

      {/* Hero Section - Con tipografías Geist */}
      <section className="pt-20 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            
            {/* Contenido del texto */}
            <div className="space-y-8">
              <div className="inline-block">
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-gray-900 font-serif">Creamos</span>
                <span className="block silver-blue-text-gradient font-serif font-light">
                  Espacios Únicos
                </span>
              </h1>

              <div className="space-y-6">
                <p className="text-xl text-gray-700 leading-relaxed font-light">
                  Con más de 13 años transformando hogares y espacios comerciales, 
                  somos especialistas en cerámica y porcelanatos de calidad premium.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Cada proyecto que emprendemos es una oportunidad de crear algo extraordinario, 
                  combinando innovación, calidad y un servicio excepcional.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/catalogo">
                  <Button size="lg" className="silver-blue-gradient hover:opacity-90 text-white px-8 py-4 rounded-full font-medium">
                    Explorar Catálogo
                  </Button>
                </Link>
                <Link href="/contacto">
                  <Button size="lg" variant="outline" className="border-2 border-[var(--silver-blue-300)] hover:border-[var(--silver-blue-500)] hover:text-[var(--silver-blue-600)] px-8 py-4 rounded-full font-medium">
                    Contactar Ahora
                  </Button>
                </Link>
              </div>
            </div>

            {/* Logo */}
            <div className="relative">
                <Image
                  src="/logo.png"
                  alt="DECORTILES - Transformamos tus espacios"
                  width={400}
                  height={200}
                  className="mx-auto h-auto max-w-full"
                  quality={95}
                />
              </div>
            </div>
          </div>
      </section>


            {/* Misión y Visión - Diseño Grande y Destacado */}
      <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
        {/* Fondo dinámico */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--silver-blue-50)] via-white to-[var(--silver-blue-100)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Misión */}
          <div className="mb-16 md:mb-24 lg:mb-32 text-center">
            <div className="relative inline-block">
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-[var(--silver-blue-200)] font-serif select-none">
                MISIÓN
              </h2>
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold silver-blue-text-gradient font-serif">
                  Misión
                </h2>
              </div>
            </div>
            
            <div className="mt-8 md:mt-12 max-w-5xl mx-auto">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 leading-relaxed font-light">
                Importar y ofrecer productos de <span className="font-semibold text-[var(--silver-blue-700)]">alta calidad</span> para la construcción y remodelación, 
                con un portafolio <span className="font-semibold text-[var(--silver-blue-700)]">innovador, confiable y estético</span> que transforme los espacios 
                de nuestros clientes en toda Colombia.
              </p>
            </div>
          </div>

          {/* Separador visual */}
          <div className="flex justify-center mb-16 md:mb-24 lg:mb-32">
            <div className="w-20 md:w-32 h-0.5 md:h-1 bg-gradient-to-r from-transparent via-[var(--silver-blue-400)] to-transparent"></div>
          </div>

          {/* Visión */}
          <div className="text-center">
            <div className="relative inline-block">
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-[var(--silver-blue-200)] font-serif select-none">
                VISIÓN
              </h2>
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold silver-blue-text-gradient font-serif">
                  Visión
                </h2>
              </div>
            </div>
            
            <div className="mt-8 md:mt-12 max-w-5xl mx-auto">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 leading-relaxed font-light">
                Ser <span className="font-semibold text-[var(--silver-blue-700)]">líderes nacionales</span> en pisos y revestimientos, 
                destacando por nuestra <span className="font-semibold text-[var(--silver-blue-700)]">calidad, confianza y atención al cliente</span>, 
                con presencia sólida en las principales ciudades del país.
              </p>
            </div>
          </div>
          
        </div>
      </section>

      {/* Valores - Diseño Moderno */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-serif">
              Nuestros Valores
            </h2>
            <p className="text-xl text-[var(--silver-blue-600)] max-w-3xl mx-auto leading-relaxed">
              Los principios que guían cada decisión y nos definen como empresa
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {valores.map((valor) => {
              const IconComponent = valor.icon
              return (
                <Card 
                  key={valor.name}
                  className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden"
                >
                  <CardContent className="p-6 text-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--silver-blue-50)]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br ${valor.color}`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[var(--silver-blue-600)] transition-colors leading-tight">
                      {valor.name}
                    </h3>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>


      <Footer />
    </div>
  )
} 