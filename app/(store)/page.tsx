import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/store/product-card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma'
import { Sparkles, Package, Shield, Truck } from 'lucide-react'

export default async function HomePage() {
  // Obtener productos destacados
  const featuredProducts = await prisma.product.findMany({
    where: {
      featured: true,
      isActive: true,
    },
    include: {
      images: {
        orderBy: {
          order: 'asc',
        },
      },
    },
    take: 8,
  })

  // Obtener productos recientes
  const recentProducts = await prisma.product.findMany({
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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white text-gray-900">
              <Sparkles className="h-3 w-3 mr-1" />
              Nuevos productos cada semana
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Coleccioná las mejores cartas Pokémon
            </h1>
            <p className="text-xl mb-8 text-white font-medium drop-shadow-md">
              Productos 100% originales. Envíos a todo Argentina. 
              Los mejores precios del mercado.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/productos">
                <Button size="lg" className="text-gray-900 hover:font-semibold">
                  Ver Catálogo
                </Button>
              </Link>
              <Link href="/ofertas">
                <Button size="lg" variant="outline" className="bg-white text-primary-600 border-white hover:bg-gray-100 font-semibold">
                  Ver Ofertas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

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

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Productos Destacados</h2>
                <p className="text-gray-600">Las cartas más buscadas por coleccionistas</p>
              </div>
              <Link href="/productos?featured=true">
                <Button variant="default">Ver Todos</Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
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

      {/* Recent Products */}
      {recentProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Recién Llegados</h2>
                <p className="text-gray-600">Los últimos productos agregados</p>
              </div>
              <Link href="/productos">
                <Button variant="default">Ver Todos</Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">
            ¿Tenés cartas para vender?
          </h2>
          <p className="text-xl mb-8 text-white font-medium drop-shadow-md">
            Compramos tus cartas Pokémon al mejor precio del mercado
          </p>
          <Link href="/vender">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold">
              Vender mis Cartas
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
