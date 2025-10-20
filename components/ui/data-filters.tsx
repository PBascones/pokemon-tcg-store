'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectOption } from '@/components/ui/select'
import { Filter } from 'lucide-react'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig {
  key: string
  label: string
  options: FilterOption[]
  placeholder?: string
}

export interface SortConfig {
  key: string
  label: string
  options: FilterOption[]
}

export interface DataFiltersProps {
  filters: FilterConfig[]
  sortConfig: SortConfig
  onFilterChange: (filterKey: string, value: string) => void
  onSortChange: (value: string) => void
  filterValues: Record<string, string>
  sortValue: string
  totalItems: number
  filteredItems: number
  className?: string
}

export function DataFilters({
  filters,
  sortConfig,
  onFilterChange,
  onSortChange,
  filterValues,
  sortValue,
  totalItems,
  filteredItems,
  className = ''
}: DataFiltersProps) {
  return (
    <Card className={`mb-8 shadow-sm border-gray-100 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-6 flex-wrap">
          {/* Icono y título */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-2.5 rounded-full shadow-sm">
              <Filter className="h-5 w-5 text-primary-600" />
            </div>
            <span className="font-semibold text-gray-800 text-base">Filtros:</span>
          </div>
          
          {/* Filtros */}
          {filters.map((filter) => (
            <div key={filter.key} className="flex items-center gap-3">
              <label htmlFor={`filter-${filter.key}`} className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                {filter.label}:
              </label>
              <Select
                id={`filter-${filter.key}`}
                value={filterValues[filter.key] || ''}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                size="sm"
                variant="ghost"
                className="min-w-[170px]"
              >
                <SelectOption value="">
                  {filter.placeholder || `Todas las ${filter.label.toLowerCase()}`}
                </SelectOption>
                {filter.options.map((option) => (
                  <SelectOption key={option.value} value={option.value}>
                    {option.label}
                  </SelectOption>
                ))}
              </Select>
            </div>
          ))}

          {/* Ordenamiento */}
          <div className="flex items-center gap-3">
            <label htmlFor="sort-by" className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              {sortConfig.label}:
            </label>
            <Select
              id="sort-by"
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value)}
              size="sm"
              variant="ghost"
              className="min-w-[190px]"
            >
              {sortConfig.options.map((option) => (
                <SelectOption key={option.value} value={option.value}>
                  {option.label}
                </SelectOption>
              ))}
            </Select>
          </div>

          {/* Contador de resultados */}
          <div className="ml-auto">
            <div className="bg-primary-50 px-3 py-2 rounded-lg border border-primary-200">
              <span className="text-sm font-medium text-primary-700">
                Mostrando {filteredItems} de {totalItems} elementos
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
