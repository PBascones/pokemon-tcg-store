import { prisma } from '@/lib/prisma'
import { Users as UsersIcon } from 'lucide-react'
import { UsersTable } from '@/components/admin/users-table'

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      orders: {
        select: {
          id: true,
          total: true,
          paymentStatus: true,
        },
      },
      _count: {
        select: {
          orders: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Calcular estadísticas
  const totalUsers = users.length
  const adminUsers = users.filter(u => u.role === 'ADMIN').length
  const usersWithOrders = users.filter(u => u._count.orders > 0).length

  return (
    <div>
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <UsersIcon className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        </div>
        <p className="text-blue-100">
          Administrá todos los clientes registrados en tu tienda
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            👥 Total: {totalUsers} usuarios
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            👑 Admins: {adminUsers}
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            🛒 Con compras: {usersWithOrders}
          </span>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable users={users} />
    </div>
  )
}

