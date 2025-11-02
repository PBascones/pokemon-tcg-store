import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/store/product-card'
import { Card } from '@/components/ui/card'
import { getUSDPriceForSSR } from '@/lib/currency-cache'
import { calculateProductPrices } from '@/lib/utils'

interface SearchParams {
  expansion?: string
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

  // Obtener tipo de cambio
  const exchangeRate = await getUSDPriceForSSR()

  // Build where clause
  const where: any = {
    isActive: true,
  }

  if (params.expansion) {
    where.expansion = {
      slug: params.expansion,
    }
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
      { set: { name: { contains: params.search, mode: 'insensitive' } } },
    ]
  }

  // Get products and count
  const [products, total, expansions] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        expansion: true,
        set: true,
      },
      orderBy: [
        { featured: 'desc' },
        { set: { releaseDate: { sort: 'desc', nulls: 'last' } } },
      ],
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.expansion.findMany(),
  ])

  // Pre-calcular precios
  const productsWithPrices = products.map(product => ({
    ...product,
    calculatedPrices: calculateProductPrices(
      product.price, 
      product.compareAtPrice, 
      product.openingPrice, 
      exchangeRate,
      product.isOpening
    )
  }))

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
                <h3 className="font-semibold mb-2">Expansiones</h3>
                <div className="space-y-2">
                  <a
                    href="/productos"
                    className={`block text-sm py-1 hover:text-primary-600 transition ${!params.expansion ? 'text-primary-600 font-semibold' : ''
                      }`}
                  >
                    Todas
                  </a>
                  {expansions.map((expansion) => (
                    <a
                      key={expansion.id}
                      href={`/productos?expansion=${expansion.slug}`}
                      className={`block text-sm py-1 hover:text-primary-600 transition ${params.expansion === expansion.slug ? 'text-primary-600 font-semibold' : ''
                        }`}
                    >
                      {expansion.name}
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
                {params.expansion
                  ? expansions.find((e) => e.slug === params.expansion)?.name || 'Productos'
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
                {productsWithPrices.map((product) => (
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
