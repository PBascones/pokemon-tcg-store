import { NextResponse } from 'next/server'
import { createPreference, type PreferenceData, type MercadoPagoItem } from '@/lib/mercadopago'
import { prisma } from '@/lib/prisma'
import { getUSDPriceForSSR } from '@/lib/currency-cache'
import { convertToARS } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    // Obtener tipo de cambio para convertir precios USD a ARS
    const exchangeRate = await getUSDPriceForSSR()

    // Ir a crear la orden
    const body = await request.json()

    const origin = new URL(request.url).origin
    const orderResponse = await fetch(`${origin}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: request.headers.get('cookie') || '',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    })
    const orderData = await orderResponse.json();
    if (!orderResponse.ok) {
      throw new Error(orderData.error || 'Error al crear la orden')
    }

    const order = orderData.order;

    // Preparar items para MercadoPago - CONVERTIR USD A ARS
    const mpItems: MercadoPagoItem[] = order.items.map((item: any) => {
      const priceInARS = convertToARS(item.price, exchangeRate) // item.price está en USD
      
      return {
        id: item.productId,
        title: item.name,
        quantity: item.quantity,
        unit_price: priceInARS, // Ahora en ARS
        currency_id: 'ARS',
        picture_url: item.images[0]?.url,
        description: item.description || undefined,
        category_id: 'others',
      }
    })

    // No agregamos envío a MercadoPago - se coordina por WhatsApp
    // El envío se maneja por separado después del pago

    // Crear preferencia de MercadoPago
    const preferenceData: PreferenceData = {
      items: mpItems,
      payer: {
        name: order.shippingName,
        email: order.email,
        phone: {
          number: order.phone || '',
        },
        address: {
          zip_code: order.shippingZip || '',
          street_name: order.shippingAddress || '',
          street_number: order.shippingCity || '',
        },
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/orden/${order.id}/confirmacion`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/orden/${order.id}/error`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/orden/${order.id}/pendiente`,
      },
      auto_return: 'approved',
      external_reference: order.id,
      statement_descriptor: 'POKESTORE',
    }

    const mpPreference = await createPreference(preferenceData)

    // Actualizar orden con ID de MercadoPago
    await prisma.order.update({
      where: { id: order.id },
      data: {
        mercadoPagoId: mpPreference.id,
      },
    })

    return NextResponse.json({
      orderId: order.id,
      preferenceId: mpPreference.id,
      initPoint: mpPreference.init_point,
    })
  } catch (error) {
    console.error('Error creating preference:', error)
    return NextResponse.json(
      { error: 'Error al crear preferencia de pago' },
      { status: 500 }
    )
  }
}
