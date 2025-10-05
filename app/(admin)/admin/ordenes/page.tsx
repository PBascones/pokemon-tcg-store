import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { Eye } from 'lucide-react'

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Órdenes</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold">#{order.orderNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium">{order.shippingName}</div>
                        <div className="text-gray-500">{order.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(order.paymentStatus) as any}>
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getOrderStatusColor(order.status) as any}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/admin/ordenes/${order.id}`}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
