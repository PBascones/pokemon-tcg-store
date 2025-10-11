import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/store/product-card'
import { Badge } from '@/components/ui/badge'
import { HeroCarousel } from '@/components/store/hero-carousel'
import { prisma } from '@/lib/prisma'
import { Sparkles, Package, Shield, Truck } from 'lucide-react'

export default async function HomePage() {
  // Obtener productos (unificado) - del más nuevo al más reciente
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      images: {
        orderBy: {
          order: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 8,
  })

  // Obtener categorías
  const categories = await prisma.category.findMany({
    take: 6,
  })

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary-600 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">100% Original</h3>
                <p className="text-sm text-gray-700">Productos auténticos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-primary-600 p-3 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Envío Rápido</h3>
                <p className="text-sm text-gray-700">A todo el país</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-primary-600 p-3 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Empaque Seguro</h3>
                <p className="text-sm text-gray-700">Protección garantizada</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-primary-600 p-3 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Stock Actualizado</h3>
                <p className="text-sm text-gray-700">Siempre al día</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productos (unificado) */}
      {products.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Productos</h2>
                <p className="text-gray-600">Últimos agregados, ordenados del más nuevo al más reciente</p>
              </div>
              <Link href="/productos">
                <Button variant="default">Ver Todos</Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2 text-gray-900">Explora por Categoría</h2>
              <p className="text-gray-600">Encuentra exactamente lo que buscás</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categorias/${category.slug}`}
                  className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition group"
                >
                  {category.image && (
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* (Sección unificada reemplaza la de Recién Llegados) */}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">
            ¿Buscás sobres de sets antiguos?
          </h2>
          <p className="text-xl mb-8 text-white font-medium drop-shadow-md">
            Contactanos y te conseguimos los sobres que necesitás
          </p>
          <Link href="/contacto">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold">
              Solicitar Sobres
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
