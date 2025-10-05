import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/store/product-card'
import { Card } from '@/components/ui/card'

interface SearchParams {
  category?: string
  search?: string
  page?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = 12
  const skip = (page - 1) * limit

  // Build where clause
  const where: any = {
    isActive: true,
  }

  if (params.category) {
    where.category = {
      slug: params.category,
    }
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
      { set: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  // Get products and count
  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany(),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="md:w-64 flex-shrink-0">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Filtros</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Categorías</h3>
                <div className="space-y-2">
                  <a
                    href="/productos"
                    className={`block text-sm py-1 hover:text-primary-600 transition ${
                      !params.category ? 'text-primary-600 font-semibold' : ''
                    }`}
                  >
                    Todas
                  </a>
                  {categories.map((category) => (
                    <a
                      key={category.id}
                      href={`/productos?category=${category.slug}`}
                      className={`block text-sm py-1 hover:text-primary-600 transition ${
                        params.category === category.slug ? 'text-primary-600 font-semibold' : ''
                      }`}
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {params.category
                  ? categories.find((c) => c.slug === params.category)?.name || 'Productos'
                  : 'Todos los Productos'}
              </h1>
              <p className="text-gray-600">
                {total} {total === 1 ? 'producto encontrado' : 'productos encontrados'}
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-600 text-lg">
                No se encontraron productos.
              </p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  {page > 1 && (
                    <a
                      href={`/productos?${new URLSearchParams({ ...params, page: String(page - 1) })}`}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                      Anterior
                    </a>
                  )}
                  
                  <span className="px-4 py-2">
                    Página {page} de {totalPages}
                  </span>
                  
                  {page < totalPages && (
                    <a
                      href={`/productos?${new URLSearchParams({ ...params, page: String(page + 1) })}`}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                      Siguiente
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
