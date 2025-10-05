'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'

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
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(product)
    setAdded(true)
    
    setTimeout(() => {
      setAdded(false)
    }, 2000)
  }

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={handleAddToCart}
      disabled={product.stock === 0 || added}
    >
      {added ? (
        <>
          <Check className="h-5 w-5 mr-2" />
          Agregado al Carrito
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5 mr-2" />
          {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
        </>
      )}
    </Button>
  )
}
