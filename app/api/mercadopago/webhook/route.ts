import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPayment } from '@/lib/mercadopago'
import { updateOrderStatus, mapMercadoPagoStatus } from '@/lib/order-service'

// Helper para logs estructurados en Vercel
function log(level: 'info' | 'error' | 'warn', message: string, data?: any) {
  const timestamp = new Date().toISOString()
  const logData = {
    timestamp,
    level,
    message,
    ...(data && { data }),
  }
  console.log(JSON.stringify(logData))
}

export async function POST(request: Request) {
  const startTime = Date.now()
  try {
    log('info', '🔔 WEBHOOK RECIBIDO - Inicio', { url: request.url })
    
    const url = new URL(request.url)
    const params = url.searchParams
    let body: any = {}

    try {
      body = await request.json()
    } catch {
      body = {}
    }
    

    log('info', '📦 Payload recibido', {
      body,
      queryParams: Object.fromEntries(params.entries()),
    })
    
    // Soportar múltiples formatos de notificación: body.type/action o query params topic/id
    const type = body.type || body.topic || params.get('topic')
    const action = body.action
    const idFromBody = body?.data?.id || body?.data?.resource || body?.id
    const idFromQuery = params.get('id') || params.get('data.id')
    const paymentId = idFromBody || idFromQuery

    log('info', '🔍 Datos extraídos', { type, action, paymentId })

    if (type === 'payment' || action?.startsWith('payment.')) {
      if (!paymentId) {
        log('error', '❌ No payment id in webhook payload')
        return NextResponse.json({ received: true })
      }

      log('info', '💳 Obteniendo info del pago', { paymentId })
      // Obtener información del pago
      const paymentInfo = await getPayment(paymentId)
      log('info', '💰 Payment info obtenida', {
        paymentId,
        status: paymentInfo.status,
        external_reference: paymentInfo.external_reference,
      })
      
      const externalReference = paymentInfo.external_reference
      if (!externalReference) {
        log('error', 'No external reference found', { paymentInfo })
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
        log('error', 'Order not found', { externalReference })
        return NextResponse.json({ received: true })
      }

      log('info', '📦 Orden encontrada', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        currentStatus: order.status,
        currentPaymentStatus: order.paymentStatus,
      })

      // Verificar que tengamos un status válido
      const mpStatus = paymentInfo.status
      if (!mpStatus) {
        log('error', 'No payment status found in payment info', { paymentInfo })
        return NextResponse.json({ received: true })
      }

      // Mapear estado de MercadoPago a estados internos
      const { paymentStatus, orderStatus } = mapMercadoPagoStatus(mpStatus)
      log('info', '🔄 Mapeando status', {
        mpStatus,
        paymentStatus,
        orderStatus,
      })

      // Actualizar orden usando el servicio (maneja stock automáticamente)
      log('info', '📝 Actualizando orden', { orderId: order.id })
      await updateOrderStatus({
        orderId: order.id,
        paymentStatus,
        orderStatus,
        mercadoPagoStatus: mpStatus,
        paymentMethod: 'MercadoPago',
      })
      
      const duration = Date.now() - startTime
      log('info', '✅ Orden actualizada exitosamente', {
        orderId: order.id,
        newStatus: orderStatus,
        newPaymentStatus: paymentStatus,
        durationMs: duration,
      })
    }

    const duration = Date.now() - startTime
    log('info', '✅ WEBHOOK PROCESADO CORRECTAMENTE', { durationMs: duration })
    return NextResponse.json({ received: true })
  } catch (error) {
    const duration = Date.now() - startTime
    log('error', '❌ Webhook error', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      durationMs: duration,
    })
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
