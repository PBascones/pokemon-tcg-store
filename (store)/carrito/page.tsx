'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCartStore } from '@/stores/cart-store'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  
  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id)
    toast.success('Producto eliminado', {
      description: `${name} se eliminó del carrito`,
    })
  }
  
  const handleClearCart = () => {
    clearCart()
    toast.success('Carrito vaciado', {
      description: 'Se eliminaron todos los productos',
    })
  }

  const subtotal = getTotalPrice()
  const total = subtotal // Sin costo de envío - se coordina por WhatsApp

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center p-12">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">
            Agregá productos para comenzar tu compra
          </p>
          <Link href="/productos">
            <Button>Ver Productos</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-4">
                {/* Image */}
                <div className="relative flex-shrink-0 bg-gray-100 rounded-lg" style={{ width: '6rem', aspectRatio: '3 / 4' }}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-1 rounded-lg"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <Link
                    href={`/productos/${item.slug}`}
                    className="font-semibold hover:text-primary-600 transition"
                  >
                    {item.name}
                  </Link>
                  <p className="text-lg font-bold text-primary-600 mt-1">
                    {formatPrice(item.price)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Stock disponible: {item.stock}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-4">
                  <button
                    onClick={() => handleRemoveItem(item.id, item.name)}
                    className="text-gray-400 hover:text-red-600 transition cursor-pointer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-2 border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 rounded-l-lg cursor-pointer disabled:cursor-not-allowed"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 rounded-r-lg cursor-pointer disabled:cursor-not-allowed"
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={handleClearCart}
            className="w-full"
          >
            Vaciar Carrito
          </Button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              
              {/* Información de envío */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <h4 className="font-semibold text-blue-800 mb-2">📦 Información de Envío</h4>
                <p className="text-blue-700 mb-2">
                  <strong>Correo Argentino:</strong>
                </p>
                <ul className="text-blue-700 space-y-1 text-xs">
                  <li>• Buenos Aires: $6.000 a domicilio / $4.000 a sucursal</li>
                  <li>• Interior: $10.000 a domicilio / $6.000 a sucursal</li>
                </ul>
                <p className="text-blue-800 font-medium mt-2 text-xs">
                  💬 El envío se coordina por WhatsApp después del pago. Los costos son estimativos.
                </p>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total a Pagar</span>
                  <span className="text-primary-600">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  * Envío no incluido
                </p>
              </div>
            </div>

            <Link href="/checkout">
              <Button className="w-full" size="lg">
                Proceder al Pago
              </Button>
            </Link>

            <Link href="/productos">
              <Button variant="outline" className="w-full mt-3">
                Seguir Comprando
              </Button>
            </Link>

            {/* Security Badges */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 text-center mb-3">
                Compra 100% segura
              </p>
              <div className="flex justify-center gap-2">
                <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold">
                  MercadoPago
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold">
                  SSL
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
