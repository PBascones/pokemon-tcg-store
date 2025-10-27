'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag } from 'lucide-react'
import { MarkOrderAsPaidButton } from '@/components/admin/mark-order-paid-button'

interface OrderItem {
  id: string
  quantity: number
  price: number
}

interface User {
  id: string
  email: string
}

interface Order {
  id: string
  orderNumber: string
  total: number
  paymentStatus: string
  paymentMethod: string | null
  user: User
  items: OrderItem[]
}

interface RecentOrdersCardProps {
  orders: Order[]
}

export function RecentOrdersCard({ orders }: RecentOrdersCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <ShoppingBag className="h-5 w-5" />
          Órdenes Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border rounded-lg gap-3"
            >
              <div className="flex-1">
                <p className="font-semibold">#{order.orderNumber}</p>
                <p className="text-sm text-gray-600">{order.user.email}</p>
              </div>
              <div className="flex-shrink-0">
                <MarkOrderAsPaidButton
                  orderId={order.id}
                  orderNumber={order.orderNumber}
                  paymentStatus={order.paymentStatus}
                  paymentMethod={order.paymentMethod}
                  size="sm"
                />
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold">{formatPrice(order.total)}</p>
                <p className="text-sm">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs ${
                      order.paymentStatus === 'PAID'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

