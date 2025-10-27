'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { markOrderAsPaid } from '@/lib/admin-actions'

interface MarkOrderAsPaidButtonProps {
  orderId: string
  orderNumber: string
  paymentStatus: string
  paymentMethod: string | null
  size?: 'sm' | 'default' | 'lg'
}

export function MarkOrderAsPaidButton({
  orderId,
  orderNumber,
  paymentStatus,
  paymentMethod,
  size = 'sm'
}: MarkOrderAsPaidButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleMarkAsPaid = async () => {
    if (!confirm(`¿Confirmar pago de orden #${orderNumber}?`)) {
      return
    }

    setLoading(true)
    try {
      const result = await markOrderAsPaid(orderId)

      if (result.success) {
        alert('Orden marcada como pagada correctamente')
        router.refresh()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar la orden')
    } finally {
      setLoading(false)
    }
  }

  // Solo mostrar botón si la orden está PENDING y es pago offline
  const canMarkAsPaid = paymentStatus === 'PENDING' && 
                        (paymentMethod === 'WhatsApp' || paymentMethod === 'Transferencia')

  if (!canMarkAsPaid) {
    return null
  }

  return (
    <Button
      size={size}
      variant="ghost"
      onClick={handleMarkAsPaid}
      disabled={loading}
      className="text-green-600 hover:text-green-700 hover:bg-green-50"
    >
      {loading ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
          {size === 'sm' ? 'Actualizando...' : 'Actualizando orden...'}
        </>
      ) : (
        <>
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Confirmar
        </>
      )}
    </Button>
  )
}

