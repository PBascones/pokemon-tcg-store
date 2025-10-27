'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DataTable, ColumnDef } from '@/components/ui/data-table'
import { DataFilters, FilterConfig, SortConfig } from '@/components/ui/data-filters'
import { formatPrice } from '@/lib/utils'
import { Search, Mail, Calendar, ShoppingBag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface UserOrder {
  id: string
  total: number
  paymentStatus: string
}

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
  orders: UserOrder[]
  _count: {
    orders: number
  }
}

interface UsersTableProps {
  users: User[]
  itemsPerPage?: number
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'destructive'
    case 'USER':
      return 'default'
    default:
      return 'outline'
  }
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return '👑 Admin'
    case 'USER':
      return '👤 Cliente'
    default:
      return role
  }
}

export function UsersTable({ users, itemsPerPage = 10 }: UsersTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    role: '',
    hasOrders: '',
  })
  const [sortValue, setSortValue] = useState('createdAt-desc')

  // Configuración de filtros
  const filters: FilterConfig[] = [
    {
      key: 'role',
      label: 'Rol',
      options: [
        { value: 'USER', label: '👤 Cliente' },
        { value: 'ADMIN', label: '👑 Admin' },
      ],
      placeholder: 'Todos los roles',
    },
    {
      key: 'hasOrders',
      label: 'Estado de compras',
      options: [
        { value: 'with-orders', label: '🛒 Con compras' },
        { value: 'no-orders', label: '📭 Sin compras' },
      ],
      placeholder: 'Todos los usuarios',
    },
  ]

  // Configuración de ordenamiento
  const sortConfig: SortConfig = {
    key: 'sort',
    label: 'Ordenar por',
    options: [
      { value: 'createdAt-desc', label: '📅 Más recientes' },
      { value: 'createdAt-asc', label: '📅 Más antiguos' },
      { value: 'name-asc', label: '🔤 Nombre (A-Z)' },
      { value: 'name-desc', label: '🔤 Nombre (Z-A)' },
      { value: 'orders-desc', label: '🛒 Más compras' },
      { value: 'orders-asc', label: '🛒 Menos compras' },
    ],
  }

  // Aplicar búsqueda y filtros
  const filteredUsers = useMemo(() => {
    let filtered = users

    // Búsqueda por texto (nombre o email)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      )
    }

    // Filtro por rol
    if (filterValues.role) {
      filtered = filtered.filter((user) => user.role === filterValues.role)
    }

    // Filtro por compras
    if (filterValues.hasOrders === 'with-orders') {
      filtered = filtered.filter((user) => user._count.orders > 0)
    } else if (filterValues.hasOrders === 'no-orders') {
      filtered = filtered.filter((user) => user._count.orders === 0)
    }

    // Ordenamiento
    const [sortKey, sortOrder] = sortValue.split('-')
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0

      switch (sortKey) {
        case 'createdAt':
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '')
          break
        case 'orders':
          comparison = a._count.orders - b._count.orders
          break
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [users, searchQuery, filterValues, sortValue])

  // Calcular total gastado por usuario
  const getTotalSpent = (user: User) => {
    return user.orders
      .filter((order) => order.paymentStatus === 'PAID')
      .reduce((sum, order) => sum + order.total, 0)
  }

  // Definición de columnas
  const columns: ColumnDef<User>[] = [
    {
      key: 'user',
      header: '👤 Usuario',
      cell: (user) => (
        <div className="text-sm">
          <div className="font-medium">{user.name || 'Sin nombre'}</div>
          <div className="text-gray-500 flex items-center gap-1 mt-1">
            <Mail className="h-3 w-3" />
            {user.email}
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: '🎭 Rol',
      cell: (user) => (
        <Badge variant={getRoleColor(user.role) as any}>
          {getRoleLabel(user.role)}
        </Badge>
      ),
    },
    {
      key: 'orders',
      header: '🛒 Órdenes',
      cell: (user) => (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {user._count.orders} {user._count.orders === 1 ? 'orden' : 'órdenes'}
          </span>
        </div>
      ),
    },
    {
      key: 'totalSpent',
      header: '💰 Total gastado',
      cell: (user) => {
        const totalSpent = getTotalSpent(user)
        return (
          <span className="font-semibold">
            {totalSpent > 0 ? formatPrice(totalSpent) : '-'}
          </span>
        )
      },
    },
    {
      key: 'createdAt',
      header: '📅 Fecha registro',
      cell: (user) => (
        <div className="text-sm">
          <div className="text-gray-900">
            {new Date(user.createdAt).toLocaleDateString('es-AR')}
          </div>
          <div className="text-gray-500 text-xs">
            {new Date(user.createdAt).toLocaleTimeString('es-AR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ),
    },
  ]

  return (
    <div>
      {/* Buscador de texto libre */}
      <Card className="mb-6 shadow-sm border-gray-100">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="🔍 Buscar por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-6 text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-3 text-sm text-gray-600">
              Se encontraron <strong>{filteredUsers.length}</strong> resultado
              {filteredUsers.length !== 1 ? 's' : ''} para &quot;
              <strong>{searchQuery}</strong>&quot;
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filtros y ordenamiento */}
      <DataFilters
        filters={filters}
        sortConfig={sortConfig}
        onFilterChange={(key, value) =>
          setFilterValues((prev) => ({ ...prev, [key]: value }))
        }
        onSortChange={setSortValue}
        filterValues={filterValues}
        sortValue={sortValue}
        totalItems={users.length}
        filteredItems={filteredUsers.length}
      />

      {/* Tabla */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        getRowKey={(user) => user.id}
        itemsPerPage={itemsPerPage}
        emptyState={{
          icon: <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto" />,
          title: 'No se encontraron usuarios',
          description:
            searchQuery || Object.values(filterValues).some((v) => v)
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Aún no hay usuarios registrados en el sistema',
        }}
      />
    </div>
  )
}

