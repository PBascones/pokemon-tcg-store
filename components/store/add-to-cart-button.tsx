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
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(product)
    
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
  }

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={handleAddToCart}
      disabled={product.stock === 0}
    >
      <ShoppingCart className="h-5 w-5 mr-2" />
      {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
    </Button>
  )
}
