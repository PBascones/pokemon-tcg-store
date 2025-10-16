import { NextResponse } from 'next/server'
import { getCacheInfo, forceUpdateUSDPrice } from '@/lib/currency-cache'

// GET: Obtener precio USD actual y info del cache
export async function GET() {
  try {
    const cacheInfo = getCacheInfo()
    
    return NextResponse.json({
      success: true,
      data: cacheInfo
    })
  } catch (error) {
    console.error('Error getting USD price:', error)
    return NextResponse.json(
      { success: false, error: 'Error obteniendo precio USD' },
      { status: 500 }
    )
  }
}

// POST: Forzar actualización del precio USD (útil para webhooks o cron jobs)
export async function POST() {
  try {
    const newPrice = await forceUpdateUSDPrice()
    
    return NextResponse.json({
      success: true,
      message: 'Precio USD actualizado',
      data: {
        usdPrice: newPrice,
        updatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error forcing USD price update:', error)
    return NextResponse.json(
      { success: false, error: 'Error actualizando precio USD' },
      { status: 500 }
    )
  }
}
