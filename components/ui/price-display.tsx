'use client'

import { formatPrice, convertToARS } from '@/lib/utils'

interface PriceDisplayProps {
  usdPrice: number
  exchangeRate?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  layout?: 'inline' | 'stacked'
}

export function PriceDisplay({ 
  usdPrice, 
  exchangeRate, 
  size = 'md',
  className = '',
  layout = 'inline'
}: PriceDisplayProps) {
  const arsAmount = convertToARS(usdPrice, exchangeRate)
  const arsFormatted = formatPrice(arsAmount)
  const usdFormatted = `${usdPrice.toFixed(0)} USD`

  // Tamaños
  const sizeClasses = {
    sm: {
      ars: 'text-base font-bold',
      usd: 'text-xs'
    },
    md: {
      ars: 'text-lg font-bold',
      usd: 'text-sm'
    },
    lg: {
      ars: 'text-2xl font-bold',
      usd: 'text-base'
    }
  }

  if (layout === 'stacked') {
    return (
      <div className={`flex flex-col ${className}`}>
        <span className={`${sizeClasses[size].ars} text-primary-600`}>
          {arsFormatted}
        </span>
        <span className={`${sizeClasses[size].usd} text-gray-500`}>
          {usdFormatted}
        </span>
      </div>
    )
  }

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className={`${sizeClasses[size].ars} text-primary-600`}>
        {arsFormatted}
      </span>
      <span className={`${sizeClasses[size].usd} text-gray-500`}>
        {usdFormatted}
      </span>
    </div>
  )
}

