import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/shared/Header"
import Footer from "@/components/shared/Footer"
import { Calendar, ArrowLeft, Clock } from "lucide-react"
import { getBlogPost, getRelatedPosts, blogPosts } from "@/lib/blog-data"

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id,
  }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = getBlogPost(id)
  const relatedPosts = getRelatedPosts(id)

  if (!post) {
    return <div>Post no encontrado</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Back Button */}
      <div className="pt-20 pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-[var(--silver-blue-600)] hover:text-[var(--silver-blue-700)] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Blog
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 mb-8">
        <Image
          src={post.image || "/logo.png"}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-6 left-6">
          <span className="bg-[var(--silver-blue-600)] text-white px-4 py-2 rounded-full text-sm font-medium">
            {post.category}
          </span>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <header className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-gray-500 mb-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {post.date}
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              {post.readTime}
            </div>
          </div>

          <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>
        </header>

        <div className="prose prose-lg max-w-none">
          <p>
            En el mundo del diseño de interiores y la arquitectura, la elección de los materiales correctos puede
            transformar completamente un espacio. Las cerámicas premium han emergido como una opción versátil y
            elegante que combina durabilidad, belleza y funcionalidad.
          </p>

          <h2>¿Qué hace especiales a las cerámicas premium?</h2>
          
          <p>
            Las cerámicas premium se distinguen por su proceso de fabricación avanzado, que incluye:
          </p>

          <ul>
            <li>Materiales de primera calidad seleccionados cuidadosamente</li>
            <li>Tecnología de cocción a altas temperaturas</li>
            <li>Acabados especializados que resisten el desgaste</li>
            <li>Diseños únicos creados por expertos en diseño</li>
          </ul>

          <h2>Aplicaciones versátiles</h2>

          <p>
            La versatilidad de las cerámicas premium permite su uso en múltiples aplicaciones:
          </p>

          <h3>Espacios residenciales</h3>
          <p>
            Desde cocinas modernas hasta baños de lujo, las cerámicas premium aportan elegancia y funcionalidad
            a cualquier hogar.
          </p>

          <h3>Proyectos comerciales</h3>
          <p>
            En espacios comerciales, las cerámicas premium ofrecen durabilidad excepcional y facilidad de
            mantenimiento, ideal para áreas de alto tráfico.
          </p>

          <h2>Tendencias actuales</h2>

          <p>
            Las tendencias actuales en cerámicas premium incluyen:
          </p>

          <ul>
            <li>Acabados que imitan materiales naturales como madera y piedra</li>
            <li>Formatos grandes que crean espacios más amplios</li>
            <li>Texturas innovadoras que añaden dimensión visual</li>
            <li>Colores neutros que se adaptan a cualquier estilo</li>
          </ul>

          <h2>Mantenimiento y cuidado</h2>

          <p>
            Una de las ventajas más significativas de las cerámicas premium es su facilidad de mantenimiento.
            Con el cuidado adecuado, pueden mantener su belleza durante décadas.
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-r from-[var(--silver-blue-50)] to-[var(--silver-blue-100)] rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Interesado en nuestras cerámicas premium?
          </h3>
          <p className="text-gray-600 mb-6">
            Explora nuestro catálogo completo y descubre cómo transformar tu espacio con nuestras soluciones de alta calidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/catalogo">
              <Button className="silver-blue-gradient hover:opacity-90 text-white">
                Ver Catálogo
              </Button>
            </Link>
            <Link href="/contacto">
              <Button variant="outline" className="border-[var(--silver-blue-600)] text-[var(--silver-blue-600)] hover:bg-[var(--silver-blue-600)] hover:text-white">
                Contactar Asesor
              </Button>
            </Link>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Artículos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={relatedPost.image || "/logo.png"}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[var(--silver-blue-600)] text-white px-3 py-1 rounded-full text-sm font-medium">
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {relatedPost.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {relatedPost.readTime}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[var(--silver-blue-600)] transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                      <Link href={`/blog/${relatedPost.id}`} className="inline-block mt-4">
                        <Button size="sm" variant="outline" className="border-[var(--silver-blue-600)] text-[var(--silver-blue-600)] hover:bg-[var(--silver-blue-600)] hover:text-white">
                          Leer Más
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
