import { prisma } from '@/lib/prisma'
import { ShoppingBag } from 'lucide-react'
import { OrdersTable } from '@/components/admin/orders-table'

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

  return (
    <div>
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold">Gestión de Órdenes</h1>
        </div>
        <p className="text-green-100">
          Administrá todas las ventas y pedidos de tu tienda
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            📊 Total: {orders.length} órdenes
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            🟢 Pagadas: {orders.filter(o => o.paymentStatus === 'PAID').length}
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable orders={orders} />
    </div>
  )
}
