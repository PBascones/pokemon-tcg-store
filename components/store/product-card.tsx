'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice?: number | null
    images: { url: string; alt?: string | null }[]
    rarity?: string | null
    stock: number
    featured: boolean
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || '/placeholder.png',
      slug: product.slug,
      stock: product.stock,
    })
    
    const { toast } = await import('sonner')
    toast.success('Producto agregado', {
      description: `${product.name} se agregó al carrito`,
      duration: 2000,
    })
  }

  return (
    <Link href={`/productos/${product.slug}`}>
      <Card className="group hover:shadow-lg transition-shadow duration-300 h-full">
        <CardContent className="p-4">
          {/* Image Container: portrait ratio to show full booster */}
          <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-100" style={{ aspectRatio: '3 / 4' }}>
            <Image
              src={product.images[0]?.url || '/placeholder.png'}
              alt={product.images[0]?.alt || product.name}
              fill
              className="object-contain p-2"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {discount > 0 && (
                <Badge variant="destructive">-{discount}%</Badge>
              )}
              {product.featured && (
                <Badge variant="warning">Destacado</Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="secondary">Sin Stock</Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <button className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer hover:bg-gray-50">
              <Heart className="h-4 w-4 text-gray-700" />
            </button>
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            {product.rarity && (
              <p className="text-xs text-gray-700 uppercase font-medium">{product.rarity}</p>
            )}
            <h3 className="font-bold text-sm line-clamp-2 text-gray-900 group-hover:text-primary-600 transition">
              {product.name}
            </h3>
            
            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
