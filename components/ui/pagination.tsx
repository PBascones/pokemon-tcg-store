import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showPageNumbers?: boolean
  maxPageButtons?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showPageNumbers = true,
  maxPageButtons = 5
}: PaginationProps) {
  if (totalPages <= 1) return null

  // Calcular qué páginas mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= maxPageButtons) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Lógica para mostrar páginas con ellipsis
      const leftOffset = Math.floor(maxPageButtons / 2)
      const rightOffset = maxPageButtons - leftOffset - 1
      
      if (currentPage <= leftOffset + 1) {
        // Near start
        for (let i = 1; i <= maxPageButtons - 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - rightOffset) {
        // Near end
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - maxPageButtons + 2; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Middle
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className={cn("flex items-center justify-center gap-2 mt-6", className)}>
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      {/* Page Numbers */}
      {showPageNumbers && (
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-sm text-gray-400"
                >
                  ...
                </span>
              )
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "min-w-[40px]",
                  currentPage === page && "font-semibold"
                )}
              >
                {page}
              </Button>
            )
          })}
        </div>
      )}

      {/* Simple page indicator (mobile fallback) */}
      {!showPageNumbers && (
        <span className="text-sm text-gray-600 px-3">
          Página {currentPage} de {totalPages}
        </span>
      )}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="gap-1"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Variante simple sin números de página (para mobile o espacios reducidos)
export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className
}: Omit<PaginationProps, 'showPageNumbers' | 'maxPageButtons'>) {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      showPageNumbers={false}
      className={className}
    />
  )
}

