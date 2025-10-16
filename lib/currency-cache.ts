// Sistema de caché para el precio del dólar
// Evita múltiples fetches a la API externa

interface CurrencyCache {
  usdPrice: number
  lastUpdated: number
  isUpdating: boolean
}

// Cache global en memoria
let currencyCache: CurrencyCache = {
  usdPrice: 1000, // Valor por defecto fallback
  lastUpdated: 0,
  isUpdating: false
}

// Tiempo de vida del cache: 30 minutos
const CACHE_TTL = 30 * 60 * 1000 // 30 minutos en ms

// Función para verificar si el cache está expirado
function isCacheExpired(): boolean {
  return Date.now() - currencyCache.lastUpdated > CACHE_TTL
}

// Función para actualizar el precio del dólar
async function updateUSDPrice(): Promise<number> {
  try {
    const response = await fetch('https://criptoya.com/api/dolar', {
      next: { revalidate: 1800 } // 30 minutos
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    const newPrice = data.oficial?.price || data.oficial || 1000
    
    // Actualizar cache
    currencyCache = {
      usdPrice: newPrice,
      lastUpdated: Date.now(),
      isUpdating: false
    }
    
    console.log(`💱 Precio USD actualizado: $${newPrice}`)
    return newPrice
    
  } catch (error) {
    console.error('❌ Error actualizando precio USD:', error)
    currencyCache.isUpdating = false
    
    // Si falla, usar el último valor conocido o fallback
    return currencyCache.usdPrice || 1000
  }
}

// Función principal para obtener el precio USD (SÍNCRONA)
export function getUSDPriceSync(): number {
  // Si el cache está expirado y no se está actualizando, iniciar actualización en background
  if (isCacheExpired() && !currencyCache.isUpdating) {
    currencyCache.isUpdating = true
    
    // Actualizar en background sin bloquear
    updateUSDPrice().catch(console.error)
  }
  
  // Retornar inmediatamente el valor cacheado
  return currencyCache.usdPrice
}

// Función para forzar actualización (útil para cron jobs o webhooks)
export async function forceUpdateUSDPrice(): Promise<number> {
  currencyCache.isUpdating = true
  return await updateUSDPrice()
}

// Función para obtener info del cache
export function getCacheInfo() {
  return {
    usdPrice: currencyCache.usdPrice,
    lastUpdated: new Date(currencyCache.lastUpdated).toISOString(),
    isExpired: isCacheExpired(),
    isUpdating: currencyCache.isUpdating,
    cacheAge: Date.now() - currencyCache.lastUpdated
  }
}

// Función para convertir USD a ARS (SÍNCRONA)
export function convertUSDToARS(usdAmount: number): number {
  const usdPrice = getUSDPriceSync()
  return Math.round(usdAmount * usdPrice)
}

// Función para convertir ARS a USD (SÍNCRONA)
export function convertARSToUSD(arsAmount: number): number {
  const usdPrice = getUSDPriceSync()
  return Math.round((arsAmount / usdPrice) * 100) / 100 // Redondear a 2 decimales
}

// Inicializar cache al importar el módulo
if (typeof window === 'undefined') {
  // Solo en servidor
  updateUSDPrice().catch(() => {
    console.warn('⚠️ No se pudo inicializar el precio USD, usando fallback')
  })
}
