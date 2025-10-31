'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

interface ProductImage {
  id: string
  url: string
  alt: string | null
  order: number
}

interface Product {
  id: string
  name: string
  slug: string
  images: ProductImage[]
}

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  product: Product
}

interface Order {
  id: string
  orderNumber: string
  shippingName: string
  email: string
  total: number
  subtotal: number
  shipping: number
  tax: number
  paymentStatus: string
  status: string
  createdAt: Date
  items: OrderItem[]
}

interface OrderDetailsModalProps {
  order: Order
  isOpen: boolean
  onClose: () => void
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Orden #{order.orderNumber}</h2>
              <p className="text-green-100 text-sm mt-1">
                {new Date(order.createdAt).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Customer Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">👤 Información del Cliente</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Nombre:</span>
                <p className="font-medium">{order.shippingName}</p>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>
                <p className="font-medium">{order.email}</p>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">🎴 Productos</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-gray-600">Producto</th>
                    <th className="text-center p-3 text-sm font-semibold text-gray-600">Cantidad</th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-600">Precio Unit.</th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item) => {
                    const firstImage = item.product.images.sort((a, b) => a.order - b.order)[0]
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            {firstImage && (
                              <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                  src={firstImage.url}
                                  alt={firstImage.alt || item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-800 font-semibold">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="p-3 text-right font-medium text-gray-900">
                          {formatPrice(item.price)}
                        </td>
                        <td className="p-3 text-right font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4">
            <div className="max-w-sm ml-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              {order.shipping > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-medium">{formatPrice(order.shipping)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Impuestos:</span>
                  <span className="font-medium">{formatPrice(order.tax)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span className="text-green-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

