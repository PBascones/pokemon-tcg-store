import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { StatsCard, StatsCardGrid } from '@/components/ui/stats-card'
import { Plus, Package } from 'lucide-react'
import { ProductsTable } from '@/components/admin/products-table'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      expansion: true,
      set: true,
      images: {
        orderBy: {
          order: 'asc',
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div>
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Package className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">Catálogo de Sobres</h1>
            </div>
            <p className="text-primary-100">
              Gestioná todos los sobres Pokémon de tu tienda
            </p>
          </div>
          <Link href="/admin/productos/nuevo">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              Agregar Producto
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCardGrid className="mb-8 md:grid-cols-4">
        <StatsCard
          title="Total Productos"
          value={products.length}
          icon={Package}
          iconColor="blue"
        />
        <StatsCard
          title="Productos Activos"
          value={products.filter((p) => p.isActive).length}
          icon={Package}
          iconColor="green"
        />
        <StatsCard
          title="Stock Bajo"
          value={products.filter((p) => p.stock > 0 && p.stock <= 5).length}
          icon={Package}
          iconColor="yellow"
        />
        <StatsCard
          title="Sin Stock"
          value={products.filter((p) => p.stock === 0).length}
          icon={Package}
          iconColor="red"
        />
      </StatsCardGrid>

      {/* Products Table */}
      <ProductsTable products={products} />
    </div>
  )
}

