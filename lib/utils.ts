import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { convertUSDToARS, convertARSToUSD, getUSDPriceSync as getUSDPriceSyncFromCache } from './currency-cache'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency?: string): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency || 'ARS',
  }).format(price)
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `PKM-${timestamp}-${random}`
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

// Funciones de conversión de moneda optimizadas
export function convertToARS(usdPrice: number, exchangeRate?: number): number {
  if (exchangeRate) {
    return Math.round(usdPrice * exchangeRate)
  }
  return convertUSDToARS(usdPrice)
}

export function convertToUSD(arsPrice: number, exchangeRate?: number): number {
  if (exchangeRate) {
    return Math.round((arsPrice / exchangeRate) * 100) / 100
  }
  return convertARSToUSD(arsPrice)
}

export function getUSDPriceSync(): number {
  return getUSDPriceSyncFromCache()
}

// Función para formatear precios con ambas monedas (con tipo de cambio fijo)
export function formatPriceWithBothCurrencies(usdPrice: number, exchangeRate?: number): {
  usd: string
  ars: string
  arsAmount: number
} {
  const arsAmount = convertToARS(usdPrice, exchangeRate)
  
  return {
    usd: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(usdPrice),
    ars: formatPrice(arsAmount),
    arsAmount
  }
}

// Función para pre-calcular precios en server components
export function calculateProductPrices(usdPrice: number, compareAtPrice: number | null, exchangeRate: number) {
  const prices = formatPriceWithBothCurrencies(usdPrice, exchangeRate)
  const comparePrices = compareAtPrice ? formatPriceWithBothCurrencies(compareAtPrice, exchangeRate) : null
  
  return {
    main: prices,
    compare: comparePrices,
    discount: compareAtPrice ? Math.round(((compareAtPrice - usdPrice) / compareAtPrice) * 100) : 0
  }
}

// Función para formatear precio con ARS principal y USD secundario (para carrito/checkout)
export function formatPriceARSWithUSD(usdPrice: number, exchangeRate?: number): string {
  const arsAmount = convertToARS(usdPrice, exchangeRate)
  const arsFormatted = formatPrice(arsAmount).replace(/\s/g, '') // Eliminar espacios: $1.500,00 -> $1.500,00
  const usdFormatted = usdPrice.toFixed(0) // Sin decimales para USD
  
  return `${arsFormatted} ${usdFormatted} USD`
}
