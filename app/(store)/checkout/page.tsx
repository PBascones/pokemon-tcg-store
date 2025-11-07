'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/stores/cart-store'
import { PriceDisplay } from '@/components/ui/price-display'
import { Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items, getTotalPrice, clearCart } = useCartStore()

  const [loading, setLoading] = useState(false)
  const [whatsappLoading, setWhatsappLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  })

  const subtotal = getTotalPrice()
  const total = subtotal // Sin costo de envío - se coordina por WhatsApp

  const hasOpeningProducts = items.some(item => item.isOpening)
  
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      </div>
    )
  }

  if (!session) {
    router.push('/auth/login?callbackUrl=/checkout')
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingInfo: formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pago')
      }

      // Limpiar carrito
      clearCart()

      // Redirigir a MercadoPago
      window.location.href = data.initPoint
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar el pago. Por favor intenta nuevamente.')
      setLoading(false)
    }
  }

  const handleWhatsAppPayment = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setWhatsappLoading(true)

    try {
      // Crear la orden con paymentMethod WhatsApp (esto reduce stock automáticamente)
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingInfo: formData,
          paymentMethod: 'WhatsApp', // Indica que es pago offline
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Error al crear la orden')
      }

      // Limpiar carrito
      clearCart()

      // Redirigir a la página de confirmación
      router.push(`/orden/${orderData.order.id}/confirmacion?offlinePayment=true`)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar el pago. Por favor intenta nuevamente.')
    } finally {
      setWhatsappLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nombre Completo *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Juan Pérez"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="email@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Teléfono *
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="11 1234-5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dirección *
                  </label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Calle 123, Piso 4, Depto B"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ciudad *
                    </label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="Buenos Aires"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Provincia *
                    </label>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      placeholder="CABA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Código Postal *
                    </label>
                    <Input
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                      placeholder="1234"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* MercadoPago */}
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="bg-primary-100 p-3 rounded">
                    <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">MercadoPago</p>
                    <p className="text-sm text-gray-600">
                      Tarjeta, efectivo o transferencia.
                    </p>
                  </div>
                </div>

                {/* Pago Offline */}
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="bg-primary-100 p-3 rounded">
                    <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Pago Offline</p>
                    <p className="text-sm text-gray-600">
                      Transferencia, USD, USDT o Crypto (+10%)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-sm gap-2">
                      <span className="flex-1">
                        {item.name} <span className="text-gray-500">x{item.quantity}</span>
                      </span>
                      <PriceDisplay 
                        usdPrice={item.price * item.quantity} 
                        size="sm" 
                        layout="stacked"
                        className="text-right"
                      />
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <PriceDisplay usdPrice={subtotal} size="sm" />
                  </div>

                  {/* Información de envío */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                    <h4 className="font-semibold text-blue-800 mb-2">📦 Envío por Correo Argentino</h4>
                    <div className="text-blue-700 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Buenos Aires (domicilio):</span>
                        <span className="font-medium">$6.000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Buenos Aires (sucursal):</span>
                        <span className="font-medium">$4.000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interior (domicilio):</span>
                        <span className="font-medium">$10.000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interior (sucursal):</span>
                        <span className="font-medium">$6.000</span>
                      </div>
                    </div>
                    <p className="text-blue-800 font-medium mt-2 text-xs">
                      💬 Se coordina por WhatsApp después del pago. Los costos son estimativos.
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-lg font-bold">Total a Pagar</span>
                    <PriceDisplay usdPrice={total} size="md" layout="stacked" className="text-right" />
                  </div>
                  <p className="text-xs text-gray-500">
                    * Envío no incluido
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={handleWhatsAppPayment}
                  className="w-full"
                  size="lg"
                  variant="outline"
                  disabled={loading || whatsappLoading}
                >
                  {whatsappLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Coordinar pago por WhatsApp'
                  )}
                </Button>

                <div className={hasOpeningProducts ? "group relative w-full" : "w-full"}>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading || whatsappLoading || hasOpeningProducts}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      'Pagar con MercadoPago'
                    )}
                  </Button>
                  {hasOpeningProducts && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 w-[240px] bg-blue-50 text-blue-800 text-xs rounded px-3 py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity shadow-lg text-center">
                      Por el momento los productos de aperturas en vivo no pueden abonarse por MercadoPago
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Al continuar, serás redirigido a MercadoPago para completar tu pago de forma segura.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
