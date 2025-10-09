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
      category: true,
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Productos</h1>
          <p className="text-gray-600">
            Gestioná el catálogo de sobres de la tienda
          </p>
        </div>
        <Link href="/admin/productos/nuevo">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Agregar Producto
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No hay productos</h3>
            <p className="text-gray-600 mb-6">
              Comenzá agregando tu primer sobre a la tienda
            </p>
            <Link href="/admin/productos/nuevo">
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                Agregar Primer Producto
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-sm">
                  Producto
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm">
                  Categoría
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm">
                  Precio
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm">
                  Stock
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm">
                  Estado
                </th>
                <th className="text-right py-4 px-6 font-semibold text-sm">
                  Acciones
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
                          <p className="text-xs text-gray-500">{product.set}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm">{product.category.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-sm">
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && (
                      <p className="text-xs text-gray-400 line-through">
                        {formatPrice(product.compareAtPrice)}
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

