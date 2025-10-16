import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
export function convertToARS(usdPrice: number): number {
  // Importamos dinámicamente para evitar problemas de SSR
  const { convertUSDToARS } = require('./currency-cache')
  return convertUSDToARS(usdPrice)
}

export function convertToUSD(arsPrice: number): number {
  const { convertARSToUSD } = require('./currency-cache')
  return convertARSToUSD(arsPrice)
}

export function getUSDPriceSync(): number {
  const { getUSDPriceSync } = require('./currency-cache')
  return getUSDPriceSync()
}

// Función para formatear precios con ambas monedas
export function formatPriceWithBothCurrencies(usdPrice: number): {
  usd: string
  ars: string
  arsAmount: number
} {
  const arsAmount = convertToARS(usdPrice)
  
  return {
    usd: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(usdPrice),
    ars: formatPrice(arsAmount),
    arsAmount
  }
}
