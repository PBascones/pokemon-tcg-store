import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPayment } from '@/lib/mercadopago'
import { updateOrderStatus, mapMercadoPagoStatus } from '@/lib/order-service'
import crypto from 'crypto'

/**
 * Valida la firma de seguridad del webhook de Mercado Pago
 * Documentación: https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks#editor_6
 */
function validateWebhookSignature(request: Request, body: any): boolean {
  try {
    // Obtener headers necesarios
    const xSignature = request.headers.get('x-signature')
    const xRequestId = request.headers.get('x-request-id')
    
    if (!xSignature || !xRequestId) {
      console.warn('Missing x-signature or x-request-id headers')
      return false
    }

    // Extraer ts y hash del header x-signature
    // Formato: "ts=1234567890,v1=hash_value"
    const parts = xSignature.split(',')
    let ts: string | null = null
    let hash: string | null = null

    for (const part of parts) {
      const [key, value] = part.split('=')
      if (key === 'ts') ts = value
      if (key === 'v1') hash = value
    }

    if (!ts || !hash) {
      console.warn('Invalid x-signature format')
      return false
    }

    // Obtener el secret de la aplicación desde variables de entorno
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
    
    if (!secret) {
      console.warn('MERCADOPAGO_WEBHOOK_SECRET not configured - skipping signature validation')
      // En desarrollo, permitir sin validación si no está configurado
      return process.env.NODE_ENV === 'development'
    }

    // Construir el manifest (cadena a firmar)
    // Formato: id;request-id;ts
    const dataId = body?.data?.id || body?.id || ''
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`

    // Generar HMAC SHA256
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(manifest)
    const calculatedHash = hmac.digest('hex')

    // Comparar hashes
    const isValid = calculatedHash === hash

    if (!isValid) {
      console.error('Invalid webhook signature', {
        expected: hash,
        calculated: calculatedHash,
        manifest
      })
    }

    return isValid
  } catch (error) {
    console.error('Error validating webhook signature:', error)
    return false
  }
}

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

    // Validar firma de seguridad
    const isValidSignature = validateWebhookSignature(request, body)
    
    if (!isValidSignature) {
      console.error('Webhook signature validation failed')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
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
