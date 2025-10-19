import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { Plus, Pencil, Trash2, Package } from 'lucide-react'
import { DeleteProductButton } from '@/components/admin/delete-product-button'

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
              Agregar Sobre
            </Button>
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors">
          <CardContent className="p-12 text-center">
            <div className="bg-primary-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Package className="h-10 w-10 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">🎴 No hay sobres aún</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Comenzá agregando tu primer sobre Pokémon a la tienda. ¡Los coleccionistas te estarán esperando!
            </p>
            <Link href="/admin/productos/nuevo">
              <Button size="lg" className="shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                ✨ Agregar Primer Sobre
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              📋 Lista de Sobres ({products.length} productos)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">
                    🎴 Sobre
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">
                    🏷️ Expansión
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">
                    💰 Precio
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">
                    📦 Stock
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">
                    🔄 Estado
                  </th>
                  <th className="text-right py-4 px-6 font-semibold text-sm text-gray-700">
                    ⚙️ Acciones
                  </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={product.images[0]?.url || '/placeholder.png'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {product.name}
                        </p>
                        {product.set && (
                          <p className="text-xs text-gray-500">{product.set.name}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm">{product.expansion.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-sm">
                      {formatPrice(product.price, 'USD')}
                    </span>
                    {product.compareAtPrice && (
                      <p className="text-xs text-gray-400 line-through">
                        {formatPrice(product.compareAtPrice, 'USD')}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`font-semibold text-sm ${
                        product.stock === 0
                          ? 'text-red-600'
                          : product.stock <= 5
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {product.isActive ? (
                      <Badge variant="success">Activo</Badge>
                    ) : (
                      <Badge variant="secondary">Inactivo</Badge>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/productos/${product.id}/editar`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Productos</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Productos Activos</p>
            <p className="text-2xl font-bold text-green-600">
              {products.filter((p) => p.isActive).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Stock Bajo</p>
            <p className="text-2xl font-bold text-yellow-600">
              {products.filter((p) => p.stock > 0 && p.stock <= 5).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Sin Stock</p>
            <p className="text-2xl font-bold text-red-600">
              {products.filter((p) => p.stock === 0).length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

