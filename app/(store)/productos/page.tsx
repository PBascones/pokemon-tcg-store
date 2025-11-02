import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/store/product-card'
import { Card } from '@/components/ui/card'
import { getUSDPriceForSSR } from '@/lib/currency-cache'
import { calculateProductPrices } from '@/lib/utils'

interface SearchParams {
  expansion?: string
  set?: string
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

  if (params.set) {
    where.set = {
      slug: params.set,
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
  const [products, total, expansions, sets] = await Promise.all([
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
    prisma.expansion.findMany({
      orderBy: {
        releaseDate: { sort: 'desc', nulls: 'last' },
      },
    }),
    prisma.set.findMany({
      orderBy: {
        releaseDate: { sort: 'desc', nulls: 'last' },
      },
    }),
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

            {/* Search */}
            <div className="mb-6">
              <form action="/productos" method="get" className="space-y-2">
                <input
                  type="text"
                  id="search"
                  name="search"
                  defaultValue={params.search}
                  placeholder="Nombre del producto..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {params.expansion && (
                  <input type="hidden" name="expansion" value={params.expansion} />
                )}
                {params.set && (
                  <input type="hidden" name="set" value={params.set} />
                )}
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary-600 cursor-pointer text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Buscar
                </button>
                {params.search && (
                  <a
                    href={`/productos?${new URLSearchParams(
                      Object.fromEntries(
                        Object.entries(params).filter(([key]) => key !== 'search' && key !== 'page')
                      )
                    )}`}
                    className="block text-center text-sm text-gray-600 hover:text-primary-600"
                  >
                    Limpiar búsqueda
                  </a>
                )}
              </form>
            </div>

            <div className="space-y-4">
              {/* Sets Filter */}
              <details className="group">
                <summary className="font-semibold mb-2 cursor-pointer flex items-center justify-between hover:text-primary-600 transition">
                  <span>Sets</span>
                  <svg
                    className="w-4 h-4 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                  <a
                    href={`/productos?${new URLSearchParams(
                      Object.fromEntries(
                        Object.entries(params).filter(([key]) => key !== 'set' && key !== 'page')
                      )
                    )}`}
                    className={`block text-sm py-1 hover:text-primary-600 transition ${!params.set ? 'text-primary-600 font-semibold' : ''
                      }`}
                  >
                    Todos
                  </a>
                  {sets.map((set) => (
                    <a
                      key={set.id}
                      href={`/productos?${new URLSearchParams({
                        ...Object.fromEntries(
                          Object.entries(params).filter(([key]) => key !== 'page')
                        ),
                        set: set.slug,
                      })}`}
                      className={`block text-sm py-1 hover:text-primary-600 transition ${params.set === set.slug ? 'text-primary-600 font-semibold' : ''
                        }`}
                    >
                      {set.name}
                    </a>
                  ))}
                </div>
              </details>

              {/* Expansions Filter */}
              <details className="group">
                <summary className="font-semibold mb-2 cursor-pointer flex items-center justify-between hover:text-primary-600 transition">
                  <span>Expansiones</span>
                  <svg
                    className="w-4 h-4 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="space-y-2 mt-2">
                  <a
                    href={`/productos?${new URLSearchParams(
                      Object.fromEntries(
                        Object.entries(params).filter(([key]) => key !== 'expansion' && key !== 'page')
                      )
                    )}`}
                    className={`block text-sm py-1 hover:text-primary-600 transition ${!params.expansion ? 'text-primary-600 font-semibold' : ''
                      }`}
                  >
                    Todas
                  </a>
                  {expansions.map((expansion) => (
                    <a
                      key={expansion.id}
                      href={`/productos?${new URLSearchParams({
                        ...Object.fromEntries(
                          Object.entries(params).filter(([key]) => key !== 'page')
                        ),
                        expansion: expansion.slug,
                      })}`}
                      className={`block text-sm py-1 hover:text-primary-600 transition ${params.expansion === expansion.slug ? 'text-primary-600 font-semibold' : ''
                        }`}
                    >
                      {expansion.name}
                    </a>
                  ))}
                </div>
              </details>
            </div>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {params.set
                  ? sets.find((s) => s.slug === params.set)?.name || 'Productos'
                  : params.expansion
                  ? expansions.find((e) => e.slug === params.expansion)?.name || 'Productos'
                  : 'Todos los Productos'}
              </h1>
              <p className="text-gray-600">
                {total} {total === 1 ? 'producto encontrado' : 'productos encontrados'}
              </p>
              {params.search && (
                <p className="text-sm text-gray-500 mt-1">
                  Resultados para: &quot;{params.search}&quot;
                </p>
              )}
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
