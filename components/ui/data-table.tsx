'use client'

import React, { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface ColumnDef<T> {
  key: string
  header: string | ReactNode
  cell: (item: T) => ReactNode
  className?: string
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  getRowKey: (item: T) => string
  emptyState?: {
    icon?: ReactNode
    title: string
    description: string
    action?: ReactNode
  }
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  emptyState,
  className
}: DataTableProps<T>) {
  
  if (data.length === 0 && emptyState) {
    return (
      <Card className={cn("overflow-hidden shadow-sm", className)}>
        <CardContent className="p-12 text-center">
          {emptyState.icon && (
            <div className="mb-4">{emptyState.icon}</div>
          )}
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {emptyState.title}
          </h3>
          <p className="text-gray-500 mb-4">
            {emptyState.description}
          </p>
          {emptyState.action}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("overflow-hidden shadow-sm", className)}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "text-left py-4 px-6 font-semibold text-sm text-gray-700",
                      column.className
                    )}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={getRowKey(item)}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn("py-4 px-6", column.className)}
                    >
                      {column.cell(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

