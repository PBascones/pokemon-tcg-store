'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable, ColumnDef } from '@/components/ui/data-table'
import { formatPrice } from '@/lib/utils'
import { Plus, Pencil, Package } from 'lucide-react'
import { DeleteProductButton } from '@/components/admin/delete-product-button'

interface ProductImage {
  id: string
  url: string
  order: number
}

interface Product {
  id: string
  name: string
  price: number
  compareAtPrice: number | null
  stock: number
  isActive: boolean
  expansion: {
    id: string
    name: string
  }
  set: {
    id: string
    name: string
  } | null
  images: ProductImage[]
}

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const columns: ColumnDef<Product>[] = [
    {
      key: 'product',
      header: '🎴 Sobre',
      cell: (product) => (
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
      )
    },
    {
      key: 'expansion',
      header: '🏷️ Expansión',
      cell: (product) => (
        <span className="text-sm">{product.expansion.name}</span>
      )
    },
    {
      key: 'price',
      header: '💰 Precio',
      cell: (product) => (
        <div>
          <span className="font-semibold text-sm">
            {formatPrice(product.price, 'USD')}
          </span>
          {product.compareAtPrice && (
            <p className="text-xs text-gray-400 line-through">
              {formatPrice(product.compareAtPrice, 'USD')}
            </p>
          )}
        </div>
      )
    },
    {
      key: 'stock',
      header: '📦 Stock',
      cell: (product) => (
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
      )
    },
    {
      key: 'status',
      header: '🔄 Estado',
      cell: (product) => (
        product.isActive ? (
          <Badge variant="success">Activo</Badge>
        ) : (
          <Badge variant="secondary">Inactivo</Badge>
        )
      )
    },
    {
      key: 'actions',
      header: '⚙️ Acciones',
      className: 'text-right',
      cell: (product) => (
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
      )
    }
  ]

  return (
    <DataTable
      columns={columns}
      data={products}
      getRowKey={(product) => product.id}
      emptyState={{
        icon: (
          <div className="bg-primary-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <Package className="h-10 w-10 text-primary-600" />
          </div>
        ),
        title: '🎴 No hay sobres aún',
        description: 'Comenzá agregando tu primer sobre Pokémon a la tienda. ¡Los coleccionistas te estarán esperando!',
        action: (
          <Link href="/admin/productos/nuevo">
            <Button size="lg" className="shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              ✨ Agregar Primer Sobre
            </Button>
          </Link>
        )
      }}
    />
  )
}

