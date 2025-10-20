'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataFilters, FilterConfig } from '@/components/ui/data-filters'
import { DataTable, ColumnDef } from '@/components/ui/data-table'
import { StatsCard, StatsCardGrid } from '@/components/ui/stats-card'
import { Plus, Pencil, Trash2, Layers } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Set {
  id: string
  name: string
  slug: string
  image: string | null
  createdAt: Date
  expansion: {
    id: string
    name: string
  }
  _count: {
    products: number
  }
}

interface Expansion {
  id: string
  name: string
}

export default function AdminSetsPage() {
  const [sets, setSets] = useState<Set[]>([])
  const [expansions, setExpansions] = useState<Expansion[]>([])
  const [filteredSets, setFilteredSets] = useState<Set[]>([])
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    expansion: '',
  })
  const [sortValue, setSortValue] = useState<string>('createdAt')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortSets()
  }, [sets, filterValues, sortValue])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/sets')
      const data = await response.json()
      setSets(data.sets)
      setExpansions(data.expansions)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortSets = () => {
    let filtered = [...sets]

    // Aplicar filtros
    if (filterValues.expansion) {
      filtered = filtered.filter(set => set.expansion.id === filterValues.expansion)
    }

    // // Aplicar ordenamiento
    // filtered.sort((a, b) => {
    //   switch (sortValue) {
    //     case 'name':
    //       return a.name.localeCompare(b.name)
    //     case 'expansion':
    //       return a.expansion.name.localeCompare(b.expansion.name)
    //     case 'products':
    //       return b._count.products - a._count.products
    //     case 'createdAt':
    //     default:
    //       return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    //   }
    // })

    setFilteredSets(filtered)
  }

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [filterKey]: value
    }))
  }

  // Definición de columnas para la tabla
  const columns: ColumnDef<Set>[] = [
    {
      key: 'set',
      header: '🎴 Set',
      cell: (set) => (
        <div className="flex items-center space-x-3">
          {set.image ? (
            <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={set.image}
                alt={set.name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <Layers className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div>
            <div className="font-semibold text-gray-900">{set.name}</div>
            <div className="text-sm text-gray-500">/{set.slug}</div>
          </div>
        </div>
      )
    },
    {
      key: 'expansion',
      header: '🏷️ Expansión',
      cell: (set) => (
        <Badge variant="outline" className="text-xs">
          {set.expansion.name}
        </Badge>
      )
    },
    {
      key: 'products',
      header: '📦 Productos',
      cell: (set) => (
        <span className="text-sm font-medium">
          {set._count.products} productos
        </span>
      )
    },
    {
      key: 'createdAt',
      header: '📅 Creado',
      cell: (set) => (
        <span className="text-sm text-gray-600">
          {new Date(set.createdAt).toLocaleDateString('es-AR')}
        </span>
      )
    },
    {
      key: 'actions',
      header: '⚙️ Acciones',
      className: 'text-right',
      cell: (set) => (
        <div className="flex items-center justify-end space-x-2">
          <Link href={`/admin/sets/${set.id}/editar`}>
            <Button size="sm" variant="ghost">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={set._count.products > 0}
            title={set._count.products > 0 ? "No se puede eliminar un set con productos" : "Eliminar set"}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  // Configuración de filtros
  const filters: FilterConfig[] = [
    {
      key: 'expansion',
      label: 'Expansión',
      options: expansions.map(expansion => ({
        value: expansion.id,
        label: expansion.name
      })),
      placeholder: 'Todas las expansiones'
    }
  ]

  // // Configuración de ordenamiento
  // const sortConfig: SortConfig = {
  //   key: 'sort',
  //   label: 'Ordenar por',
  //   options: [
  //     { value: 'createdAt', label: 'Fecha de creación' },
  //     { value: 'name', label: 'Nombre' },
  //     { value: 'expansion', label: 'Expansión' },
  //     { value: 'products', label: 'Cantidad de productos' }
  //   ]
  // }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">Cargando sets...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Layers className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">Gestión de Sets</h1>
            </div>
            <p className="text-blue-100">
              Administrá los sets de cada expansión Pokémon
            </p>
          </div>
          <Link href="/admin/sets/nuevo">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              Agregar Set
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCardGrid className="mb-8">
        <StatsCard
          title="Total Sets"
          value={sets.length}
          icon={Layers}
          iconColor="blue"
        />
        <StatsCard
          title="Sets con Productos"
          value={sets.filter(set => set._count.products > 0).length}
          icon={Plus}
          iconColor="green"
        />
        <StatsCard
          title="Total Productos"
          value={sets.reduce((total, set) => total + set._count.products, 0)}
          icon={Layers}
          iconColor="purple"
        />
      </StatsCardGrid>

      {/* Filtros */}
      <DataFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        filterValues={filterValues}
        totalItems={sets.length}
        filteredItems={filteredSets.length}
      />

      {/* Sets Table */}
      <DataTable
        columns={columns}
        data={filteredSets}
        getRowKey={(set) => set.id}
        emptyState={
          sets.length === 0
            ? {
                icon: <Layers className="h-12 w-12 text-gray-400 mx-auto" />,
                title: 'No hay sets',
                description: 'Comenzá creando tu primer set de cartas Pokémon.',
                action: (
                  <Link href="/admin/sets/nuevo">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Primer Set
                    </Button>
                  </Link>
                )
              }
            : filteredSets.length === 0
            ? {
                icon: <Layers className="h-12 w-12 text-gray-400 mx-auto" />,
                title: 'No se encontraron sets',
                description: 'Probá cambiando los filtros para ver más resultados.',
              }
            : undefined
        }
      />
    </div>
  )
}
