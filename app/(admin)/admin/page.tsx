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
      color: 'bg-primary-500',
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
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <Package className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold">Panel de Control - Poke Addiction</h1>
        </div>
        <p className="text-primary-100">
          Gestioná tu tienda de sobres Pokémon desde aquí
        </p>
      </div>

      {/* Stats Grid mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-4 rounded-xl shadow-lg`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <ShoppingBag className="h-5 w-5" />
              Órdenes Recientes
            </CardTitle>
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
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Package className="h-5 w-5" />
              ⚠️ Productos con Poco Stock
            </CardTitle>
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
