import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { Package, ShoppingBag, DollarSign, Users } from 'lucide-react'

export default async function AdminDashboard() {
  // Obtener estadísticas
  const [
    totalProducts,
    totalOrders,
    totalRevenue,
    totalUsers,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: {
        paymentStatus: 'PAID',
      },
      _sum: {
        total: true,
      },
    }),
    prisma.user.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    }),
    prisma.product.findMany({
      where: {
        stock: {
          lte: 5,
        },
        isActive: true,
      },
      take: 5,
      orderBy: {
        stock: 'asc',
      },
    }),
  ])

  const stats = [
    {
      title: 'Total Productos',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Órdenes',
      value: totalOrders,
      icon: ShoppingBag,
      color: 'bg-green-500',
    },
    {
      title: 'Ingresos Totales',
      value: formatPrice(totalRevenue._sum.total || 0),
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Usuarios',
      value: totalUsers,
      icon: Users,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Órdenes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">{order.user.email}</p>
                  </div>
                  <div className="text-right">
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

        {/* Low Stock Products */}
        <Card>
          <CardHeader>
            <CardTitle>Productos con Poco Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        product.stock === 0 ? 'text-red-600' : 'text-yellow-600'
                      }`}
                    >
                      {product.stock} unidades
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
