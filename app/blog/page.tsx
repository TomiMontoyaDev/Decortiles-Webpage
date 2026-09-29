"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Calendar, ArrowRight, Tag, Clock, ChevronRight } from "lucide-react";
import {
  getFeaturedPosts,
  getRegularPosts,
  categories,
  blogPosts,
  BlogPost,
} from "@/lib/blog-data";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const featuredPosts = getFeaturedPosts();

  // Filtrar posts basado en la categoría seleccionada
  const filteredPosts =
    selectedCategory === "Todas"
      ? getRegularPosts()
      : blogPosts.filter(
          (post: BlogPost) =>
            post.category === selectedCategory && !post.featured
        );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-16 pb-8 bg-gradient-to-br from-[var(--silver-blue-50)] via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center bg-[var(--silver-blue-100)] rounded-full px-6 py-3 mb-8">
              <Tag className="w-5 h-5 mr-2 text-[var(--silver-blue-600)]" />
              <span className="text-[var(--silver-blue-800)] font-medium">
                Blog
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Inspiración y
              <span className="silver-blue-text-gradient"> Conocimiento</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Descubre las últimas tendencias, consejos de expertos y guías
              completas sobre el mundo de las cerámicas premium
            </p>

            {/* Categories Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    category === selectedCategory ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 py-2 ${
                    category === selectedCategory
                      ? "bg-[var(--silver-blue-600)] hover:bg-[var(--silver-blue-700)] text-white"
                      : "border-gray-300 text-gray-700 hover:border-[var(--silver-blue-600)] hover:text-[var(--silver-blue-600)]"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Artículos Destacados
            </h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-[var(--silver-blue-600)] to-transparent ml-8 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Card
                key={post.id}
                className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden h-80">
                    <Image
                      src={post.image || "/logo.png"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      priority={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-[var(--silver-blue-600)] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center space-x-4 mb-3 text-sm opacity-90">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {post.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--silver-blue-300)] transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-gray-200 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-end">
                        <Link href={`/blog/${post.id}`}>
                          <Button
                            size="sm"
                            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                          >
                            Leer Más
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regular Posts Grid */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Últimos Artículos
            </h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-[var(--silver-blue-600)] to-transparent ml-8 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white"
              >
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image || "/logo.png"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[var(--silver-blue-600)] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--silver-blue-600)] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <Link href={`/blog/${post.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="group-hover:bg-[var(--silver-blue-600)] group-hover:text-white group-hover:border-[var(--silver-blue-600)] transition-all bg-transparent"
                        >
                          Leer Más
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-8">
            <Button
              size="lg"
              className="silver-blue-gradient hover:opacity-90 text-white px-8 py-4"
            >
              Cargar Más Artículos
            </Button>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 silver-blue-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            ¿Listo para Transformar tu Espacio?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Descubre nuestro catálogo completo y encuentra la cerámica perfecta
            para tu proyecto. Nuestros expertos están listos para asesorarte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalogo">
              <Button
                size="lg"
                className="bg-white text-[var(--silver-blue-700)] hover:bg-gray-100 px-8 py-4 text-lg shadow-xl"
              >
                Ver Catálogo Completo
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contacto">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[var(--silver-blue-700)] px-8 py-4 text-lg bg-transparent"
              >
                Contactar Asesor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
