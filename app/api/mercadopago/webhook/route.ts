import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPayment } from '@/lib/mercadopago'
import { updateOrderStatus, mapMercadoPagoStatus } from '@/lib/order-service'

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const params = url.searchParams
    let body: any = {}

    try {
      body = await request.json()
    } catch {
      body = {}
    }
    
    // Soportar múltiples formatos de notificación: body.type/action o query params topic/id
    const type = body.type || body.topic || params.get('topic')
    const action = body.action
    const idFromBody = body?.data?.id || body?.data?.resource || body?.id
    const idFromQuery = params.get('id') || params.get('data.id')
    const paymentId = idFromBody || idFromQuery

    if (type === 'payment' || action?.startsWith('payment.')) {
      if (!paymentId) {
        console.error('No payment id in webhook payload')
        return NextResponse.json({ received: true })
      }

      // Obtener información del pago
      const paymentInfo = await getPayment(paymentId)
      
      const externalReference = paymentInfo.external_reference
      if (!externalReference) {
        console.error('No external reference found')
        return NextResponse.json({ received: true })
      }

      // Buscar orden
      const order = await prisma.order.findUnique({
        where: { id: externalReference },
        include: {
          items: true,
        },
      })

      if (!order) {
        console.error('Order not found:', externalReference)
        return NextResponse.json({ received: true })
      }

      // Verificar que tengamos un status válido
      const mpStatus = paymentInfo.status
      if (!mpStatus) {
        console.error('No payment status found in payment info')
        return NextResponse.json({ received: true })
      }

      // Mapear estado de MercadoPago a estados internos
      const { paymentStatus, orderStatus } = mapMercadoPagoStatus(mpStatus)

      // Actualizar orden usando el servicio (maneja stock automáticamente)
      await updateOrderStatus({
        orderId: order.id,
        paymentStatus,
        orderStatus,
        mercadoPagoStatus: mpStatus,
        paymentMethod: 'MercadoPago',
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
