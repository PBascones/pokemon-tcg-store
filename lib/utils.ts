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
  const now = new Date()
  
  // Formato: MM DD HH mm (8 dígitos numéricos)
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  
  // 3 caracteres aleatorios A-Z (17,576 combinaciones posibles)
  const randomChars = Array.from({ length: 3 }, () => 
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('')
  
  return `PKM-PKADD-${randomChars}-${month}${day}${hour}${minute}`
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
export function calculateProductPrices(
  price: number,
  compareAtPrice: number | null,
  openingPrice: number | null, 
  exchangeRate: number,
  isOpening: boolean = false
) {
  let displayPrice: ReturnType<typeof formatPriceWithBothCurrencies>
  let strikePrice: ReturnType<typeof formatPriceWithBothCurrencies> | null = null
  let discount = 0

  // Lógica de precios según las reglas:
  // 1. Si compareAtPrice es null, y openingPrice es null → mostrar Price
  if (!compareAtPrice && !openingPrice) {
    displayPrice = formatPriceWithBothCurrencies(price, exchangeRate)
  }
  // 2. Si compareAtPrice tiene valor, y openingPrice es null → mostrar compareAtPrice tachado, y Price
  else if (compareAtPrice && !openingPrice) {
    displayPrice = formatPriceWithBothCurrencies(price, exchangeRate)
    strikePrice = formatPriceWithBothCurrencies(compareAtPrice, exchangeRate)
    discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
  }
  // 3. Si openingPrice tiene valor, e isOpening es true → mostrar openingPrice y tachar Price
  // 4. Si openingPrice tiene valor e isOpening es true, y compareAtPrice tiene valor → mostrar openingPrice y tachar compareAtPrice
  else if (openingPrice && isOpening) {
    displayPrice = formatPriceWithBothCurrencies(openingPrice, exchangeRate)
    // Si hay compareAtPrice, tachar compareAtPrice, sino tachar price
    const priceToStrike = compareAtPrice || price
    strikePrice = formatPriceWithBothCurrencies(priceToStrike, exchangeRate)
    discount = Math.round(((priceToStrike - openingPrice) / priceToStrike) * 100)
  }
  // Si openingPrice existe pero isOpening es false, ignorar openingPrice
  else {
    if (compareAtPrice) {
      displayPrice = formatPriceWithBothCurrencies(price, exchangeRate)
      strikePrice = formatPriceWithBothCurrencies(compareAtPrice, exchangeRate)
      discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    } else {
      displayPrice = formatPriceWithBothCurrencies(price, exchangeRate)
    }
  }
  
  return {
    displayPrice,
    strikePrice,
    discount
  }
}

// Función para formatear precio con ARS principal y USD secundario (para carrito/checkout)
export function formatPriceARSWithUSD(usdPrice: number, exchangeRate?: number): string {
  const arsAmount = convertToARS(usdPrice, exchangeRate)
  const arsFormatted = formatPrice(arsAmount).replace(/\s/g, '') // Eliminar espacios: $1.500,00 -> $1.500,00
  const usdFormatted = usdPrice.toFixed(0) // Sin decimales para USD
  
  return `${arsFormatted} ${usdFormatted} USD`
}
