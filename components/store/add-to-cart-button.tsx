'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    slug: string
    stock: number
  }
  // Opciones para personalizar el comportamiento
  variant?: 'default' | 'simple'
  showIcon?: boolean
  className?: string
  size?: 'default' | 'sm' | 'lg'
}

export function AddToCartButton({ 
  product,
  variant = 'default',
  showIcon = true,
  className = '',
  size = 'lg'
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault() // Prevenir navegación cuando se usa dentro de un Link
    addItem(product)
    
    // Toast elaborado solo en modo 'default' (página de detalle)
    if (variant === 'default') {
      toast.success('Producto agregado', {
        description: `${product.name} se agregó al carrito`,
        duration: 2000,
        action: {
          label: 'Ver carrito',
          onClick: () => window.location.href = '/carrito',
        },
        actionButtonStyle: {
          backgroundColor: '#10b981',
          color: 'white',
        },
      })
    } else {
      // Toast simple para ProductCard
      toast.success('Producto agregado', {
        description: `${product.name} se agregó al carrito`,
        duration: 2000,
      })
    }
  }

  return (
    <Button
      size={size}
      className={`w-full ${className}`}
      onClick={handleAddToCart}
      disabled={product.stock === 0}
    >
      {showIcon && <ShoppingCart className={size === 'lg' ? 'h-5 w-5 mr-2' : 'h-4 w-4 mr-2'} />}
      {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
    </Button>
  )
}
