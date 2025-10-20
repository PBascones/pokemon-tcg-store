'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { DataTable, ColumnDef } from '@/components/ui/data-table'
import { formatPrice } from '@/lib/utils'
import { Eye } from 'lucide-react'

interface OrderItem {
  id: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  shippingName: string
  email: string
  total: number
  paymentStatus: string
  status: string
  createdAt: Date
  items: OrderItem[]
}

interface OrdersTableProps {
  orders: Order[]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAID':
      return 'success'
    case 'PENDING':
      return 'warning'
    case 'FAILED':
      return 'destructive'
    default:
      return 'default'
  }
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

export function OrdersTable({ orders }: OrdersTableProps) {
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
          <div className="text-gray-500">{order.email}</div>
        </div>
      )
    },
    {
      key: 'items',
      header: '🎴 Sobres',
      cell: (order) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          {order.items.length} {order.items.length === 1 ? 'sobre' : 'sobres'}
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
      key: 'paymentStatus',
      header: '💳 Pago',
      cell: (order) => (
        <Badge variant={getStatusColor(order.paymentStatus) as any}>
          {order.paymentStatus}
        </Badge>
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
        <Link
          href={`/admin/ordenes/${order.id}`}
          className="text-primary-600 hover:text-primary-900 inline-flex items-center gap-1"
        >
          <Eye className="h-4 w-4" />
          Ver
        </Link>
      )
    }
  ]

  return (
    <DataTable
      columns={columns}
      data={orders}
      getRowKey={(order) => order.id}
    />
  )
}

