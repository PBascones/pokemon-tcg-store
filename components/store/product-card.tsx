'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ProductImageGallery } from '@/components/store/product-image-gallery'
import { formatPriceWithBothCurrencies } from '@/lib/utils'
import { AddToCartButton } from '@/components/store/add-to-cart-button'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice?: number | null
    openingPrice?: number | null
    images: { url: string; alt?: string | null }[]
    rarity?: string | null
    stock: number
    featured: boolean
    isOpening: boolean
    calculatedPrices?: {
      displayPrice: { usd: string; ars: string; arsAmount: number }
      strikePrice: { usd: string; ars: string; arsAmount: number } | null
      discount: number
    }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  // Usar precios pre-calculados si están disponibles, sino calcular dinámicamente
  const prices = product.calculatedPrices || {
    displayPrice: formatPriceWithBothCurrencies(product.price),
    strikePrice: product.compareAtPrice ? formatPriceWithBothCurrencies(product.compareAtPrice) : null,
    discount: product.compareAtPrice 
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0
  }

  return (
    <Link href={`/productos/${product.slug}`}>
      <Card className="group hover:shadow-lg transition-shadow duration-300 h-full">
        <CardContent className="p-4">
          {/* Image Gallery - Reutilizando el componente unificado */}
          <div className="relative">
            <ProductImageGallery
              images={product.images as Array<{ url: string; alt?: string | null; id?: string }>}
              productName={product.name}
              discount={prices.discount}
              isOpening={product.isOpening}
              variant="card"
              showThumbnails={false}
              additionalBadges={
                <>
                  {product.featured && (
                    <Badge variant="warning">Destacado</Badge>
                  )}
                  {product.stock === 0 && (
                    <Badge variant="secondary">Sin Stock</Badge>
                  )}
                </>
              }
            />

            {/* Wishlist Button */}
            <button 
              onClick={(e) => e.preventDefault()}
              className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer hover:bg-gray-50 z-20">
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
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary-600">
                  {prices.displayPrice.ars}
                </span>
                {prices.strikePrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {prices.strikePrice.ars}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {prices.displayPrice.usd}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <AddToCartButton 
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              openingPrice: product.openingPrice,
              isOpening: product.isOpening,
              image: product.images[0]?.url || '/placeholder.png',
              slug: product.slug,
              stock: product.stock,
            }}
            size="default"
          />
        </CardFooter>
      </Card>
    </Link>
  )
}
