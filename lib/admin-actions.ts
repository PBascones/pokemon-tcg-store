'use server'

import { revalidatePath } from 'next/cache'
import { updateOrderStatus } from '@/lib/order-service'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * Marca una orden como PAID desde el panel de admin
 * Solo permite actualizar órdenes PENDING a PAID
 * @param orderId - ID de la orden a actualizar
 */
export async function markOrderAsPaid(orderId: string) {
  try {
    // Verificar que el usuario sea admin
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return { success: false, error: 'No autenticado' }
    }

    // Verificar que sea admin (ajusta según tu lógica de roles)
    console.log('session.user', session.user)
    const isAdmin = (session.user as any).role === 'ADMIN'
    
    if (!isAdmin) {
      return { success: false, error: 'No autorizado' }
    }

    // Actualizar orden a PAID usando el OrderService
    await updateOrderStatus({
      orderId,
      paymentStatus: 'PAID',
      orderStatus: 'PROCESSING',
      paymentMethod: null, // Mantener el método existente
    })

    // Revalidar las páginas que muestran órdenes
    revalidatePath('/admin/ordenes')
    revalidatePath('/admin')

    return { success: true }
  } catch (error) {
    console.error('Error marking order as paid:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error al actualizar la orden' 
    }
  }
}

/**
 * Cancela una orden y restaura el stock si ya estaba pagada
 * @param orderId - ID de la orden a cancelar
 */
export async function cancelOrder(orderId: string) {
  try {
    // Verificar que el usuario sea admin
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return { success: false, error: 'No autenticado' }
    }

    // Verificar que sea admin
    const isAdmin = (session.user as any).role === 'ADMIN'
    
    if (!isAdmin) {
      return { success: false, error: 'No autorizado' }
    }

    // Cancelar orden usando el OrderService
    await updateOrderStatus({
      orderId,
      paymentStatus: 'FAILED',
      orderStatus: 'CANCELLED',
    })

    // Revalidar las páginas que muestran órdenes
    revalidatePath('/admin/ordenes')
    revalidatePath('/admin')

    return { success: true }
  } catch (error) {
    console.error('Error cancelling order:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error al cancelar la orden' 
    }
  }
}

