import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPayment } from '@/lib/mercadopago'

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

      // Actualizar orden según el estado del pago
      let orderStatus = order.status
      let paymentStatus = order.paymentStatus

      switch (paymentInfo.status) {
        case 'approved':
          paymentStatus = 'PAID'
          orderStatus = 'PROCESSING'
          
          // Reducir stock de productos
          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            })
          }
          break
        
        case 'pending':
        case 'in_process':
          paymentStatus = 'PENDING'
          break
        
        case 'rejected':
        case 'cancelled':
          paymentStatus = 'FAILED'
          orderStatus = 'CANCELLED'
          break
        
        case 'refunded':
          paymentStatus = 'REFUNDED'
          orderStatus = 'CANCELLED'
          
          // Restaurar stock
          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            })
          }
          break
      }

      // Actualizar orden
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: orderStatus,
          paymentStatus,
          mercadoPagoStatus: paymentInfo.status,
          paymentMethod: 'MercadoPago',
        },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
