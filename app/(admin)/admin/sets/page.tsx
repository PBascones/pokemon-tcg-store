'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataFilters, FilterConfig, SortConfig, FilterOption } from '@/components/ui/data-filters'
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

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      switch (sortValue) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'expansion':
          return a.expansion.name.localeCompare(b.expansion.name)
        case 'products':
          return b._count.products - a._count.products
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredSets(filtered)
  }

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [filterKey]: value
    }))
  }

  const handleSortChange = (value: string) => {
    setSortValue(value)
  }

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

  // Configuración de ordenamiento
  const sortConfig: SortConfig = {
    key: 'sort',
    label: 'Ordenar por',
    options: [
      { value: 'createdAt', label: 'Fecha de creación' },
      { value: 'name', label: 'Nombre' },
      { value: 'expansion', label: 'Expansión' },
      { value: 'products', label: 'Cantidad de productos' }
    ]
  }

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

      {/* Filtros */}
      <DataFilters
        filters={filters}
        sortConfig={sortConfig}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        filterValues={filterValues}
        sortValue={sortValue}
        totalItems={sets.length}
        filteredItems={filteredSets.length}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sets</p>
                <p className="text-2xl font-bold text-gray-900">{filteredSets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sets con Productos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSets.filter(set => set._count.products > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Layers className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSets.reduce((total, set) => total + set._count.products, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      

      {/* Sets Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">
                    🎴 Set
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">
                    🏷️ Expansión
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">
                    📦 Productos
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">
                    📅 Creado
                  </th>
                  <th className="text-right py-4 px-6 font-semibold text-sm text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSets.map((set) => (
                  <tr key={set.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
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
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="outline" className="text-xs">
                        {set.expansion.name}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium">
                        {set._count.products} productos
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {new Date(set.createdAt).toLocaleDateString('es-AR')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/admin/sets/${set.id}/editar`}>
                          <Button size="sm" variant="outline">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={set._count.products > 0}
                          title={set._count.products > 0 ? "No se puede eliminar un set con productos" : "Eliminar set"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSets.length === 0 && sets.length > 0 && (
            <div className="text-center py-12">
              <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron sets</h3>
              <p className="text-gray-500 mb-4">
                Probá cambiando los filtros para ver más resultados.
              </p>
            </div>
          )}

          {sets.length === 0 && (
            <div className="text-center py-12">
              <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay sets</h3>
              <p className="text-gray-500 mb-4">
                Comenzá creando tu primer set de cartas Pokémon.
              </p>
              <Link href="/admin/sets/nuevo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Set
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
