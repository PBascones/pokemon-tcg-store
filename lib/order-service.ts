import { prisma } from '@/lib/prisma'
import { OrderStatus, PaymentStatus } from '@prisma/client'

interface UpdateOrderStatusParams {
  orderId: string
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  mercadoPagoStatus?: string | null
  paymentMethod?: string | null
}

/**
 * Actualiza el estado de una orden y maneja la lógica de stock según el estado del pago
 * @param orderId - ID de la orden a actualizar
 * @param paymentStatus - Nuevo estado del pago
 * @param orderStatus - Nuevo estado de la orden
 * @param mercadoPagoStatus - Estado de MercadoPago (opcional)
 * @param paymentMethod - Método de pago utilizado (opcional)
 * @returns La orden actualizada
 */
export async function updateOrderStatus({
  orderId,
  paymentStatus,
  orderStatus,
  mercadoPagoStatus = null,
  paymentMethod = null,
}: UpdateOrderStatusParams) {
  // Buscar la orden con sus items
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  })

  if (!order) {
    throw new Error(`Orden ${orderId} no encontrada`)
  }

  // Determinar si necesitamos actualizar stock
  // Para pagos offline (WhatsApp/Transferencia), el stock ya fue reducido al crear la orden
  const isOfflinePayment = order.paymentMethod === 'WhatsApp' || order.paymentMethod === 'Transferencia'
  const shouldReduceStock =
    paymentStatus === 'PAID' && 
    order.paymentStatus !== 'PAID' && 
    !isOfflinePayment // No reducir si ya se redujo en orden offline
  
  const shouldRestoreStock =
    (paymentStatus === 'REFUNDED' && order.paymentStatus === 'PAID') ||
    (orderStatus === 'CANCELLED' && order.paymentStatus === 'PAID')

  // Usar transacción para garantizar consistencia
  const updatedOrder = await prisma.$transaction(async (tx) => {
    // Actualizar orden
    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        status: orderStatus,
        paymentStatus,
        mercadoPagoStatus,
        paymentMethod,
      },
      include: {
        items: true,
      },
    })

    // Reducir stock si el pago fue aprobado
    if (shouldReduceStock) {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }
    }

    // Restaurar stock si hay reembolso o cancelación después del pago
    if (shouldRestoreStock) {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        })
      }
    }

    return updated
  })

  return updatedOrder
}

/**
 * Mapea el estado de MercadoPago a los estados internos de la orden
 * @param mercadoPagoStatus - Estado recibido de MercadoPago
 * @returns Objeto con el estado de pago y orden correspondientes
 */
export function mapMercadoPagoStatus(mercadoPagoStatus: string): {
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
} {
  switch (mercadoPagoStatus) {
    case 'approved':
      return {
        paymentStatus: 'PAID',
        orderStatus: 'PROCESSING',
      }

    case 'pending':
    case 'in_process':
      return {
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
      }

    case 'rejected':
    case 'cancelled':
      return {
        paymentStatus: 'FAILED',
        orderStatus: 'CANCELLED',
      }

    case 'refunded':
      return {
        paymentStatus: 'REFUNDED',
        orderStatus: 'CANCELLED',
      }

    default:
      return {
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
      }
  }
}

