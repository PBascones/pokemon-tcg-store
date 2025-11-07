'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { DataTable, ColumnDef } from '@/components/ui/data-table'
import { formatPrice } from '@/lib/utils'
import { Eye } from 'lucide-react'
import { MarkOrderAsPaidButton } from '@/components/admin/mark-order-paid-button'
import { OrderDetailsModal } from '@/components/admin/order-details-modal'

interface ProductImage {
  id: string
  url: string
  alt: string | null
  order: number
}

interface Product {
  id: string
  name: string
  slug: string
  images: ProductImage[]
}

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  product: Product
}

interface Order {
  id: string
  orderNumber: string
  shippingName: string
  phone: string | null
  email: string
  total: number
  subtotal: number
  shipping: number
  tax: number
  paymentStatus: string
  status: string
  paymentMethod: string | null
  createdAt: Date
  items: OrderItem[]
}

interface OrdersTableProps {
  orders: Order[]
  itemsPerPage?: number
}

const getOrderStatusColor = (status: string) => {
  switch (status) {
    case 'PROCESSING':
      return 'default'
    case 'SHIPPED':
      return 'secondary'
    case 'DELIVERED':
      return 'success'
    case 'CANCELLED':
      return 'destructive'
    default:
      return 'outline'
  }
}

export function OrdersTable({ orders, itemsPerPage = 10 }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const columns: ColumnDef<Order>[] = [
    {
      key: 'orderNumber',
      header: '📝 Número',
      cell: (order) => (
        <div className="font-semibold">#{order.orderNumber}</div>
      )
    },
    {
      key: 'customer',
      header: '👤 Cliente',
      cell: (order) => (
        <div className="text-sm">
          <div className="font-medium">{order.shippingName}</div>
          <div className="text-gray-500">{order.phone}</div>
        </div>
      )
    },
    {
      key: 'items',
      header: '🎴 Unidades',
      cell: (order) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          {order.items.length} {order.items.length === 1 ? 'ítem' : 'ítems'}
        </span>
      )
    },
    {
      key: 'total',
      header: '💰 Total',
      cell: (order) => (
        <span className="font-semibold">{formatPrice(order.total)}</span>
      )
    },
    {
      key: 'status',
      header: '📦 Estado',
      cell: (order) => (
        <Badge variant={getOrderStatusColor(order.status) as any}>
          {order.status}
        </Badge>
      )
    },
    {
      key: 'date',
      header: '📅 Fecha',
      cell: (order) => (
        <span className="text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleDateString('es-AR')}
        </span>
      )
    },
    {
      key: 'actions',
      header: '⚙️ Acciones',
      cell: (order) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedOrder(order)}
            className="text-primary-600 hover:text-primary-900 inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            Ver
          </button>
          <MarkOrderAsPaidButton
            orderId={order.id}
            orderNumber={order.orderNumber}
            paymentStatus={order.paymentStatus}
            paymentMethod={order.paymentMethod}
          />
        </div>
      )
    }
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={orders}
        getRowKey={(order) => order.id}
        itemsPerPage={itemsPerPage}
      />
      
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  )
}

