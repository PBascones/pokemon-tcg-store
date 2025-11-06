import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { calculateProductPrices } from '@/lib/utils'
import { getUSDPriceForSSR } from '@/lib/currency-cache'
import { AddToCartButton } from '@/components/store/add-to-cart-button'
import { ProductImageGallery } from '@/components/store/product-image-gallery'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Package, Shield, Truck, Video } from 'lucide-react'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  // Obtener tipo de cambio y producto en paralelo
  const [exchangeRate, product] = await Promise.all([
    getUSDPriceForSSR(),
    prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        expansion: true,
        set: true,
      },
    })
  ])

  if (!product || !product.isActive) {
    notFound()
  }

  // Pre-calcular precios
  const prices = calculateProductPrices(
    product.price, 
    product.compareAtPrice, 
    product.openingPrice, 
    exchangeRate,
    product.isOpening
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery with Carousel */}
        <ProductImageGallery
          images={product.images}
          productName={product.name}
          discount={prices.discount}
        />

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <Badge variant="default" className="mb-2">
              {product.expansion.name}
            </Badge>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            {product.set && (
              <p className="text-gray-600">Set: {product.set.name}</p>
            )}
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold text-primary-600">
                {prices.displayPrice.ars}
              </span>
              {prices.strikePrice && (
                <span className="text-xl text-gray-400 line-through">
                  {prices.strikePrice.ars}
                </span>
              )}
            </div>
            <div className="text-lg text-gray-600 mb-2">
              {prices.displayPrice.usd} USD
              {prices.strikePrice && (
                <span className="text-sm text-gray-400 line-through ml-2">
                  {prices.strikePrice.usd} USD
                </span>
              )}
            </div>

            {/*  Leyenda de Aperturas */}
            {product.isOpening && (
              <div className="mb-3 inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
                <Video className="h-4 w-4 text-purple-600" />
                <span className="text-md font-medium text-purple-700">
                  Precio exclusivo de aperturas en vivo
                </span>
              </div>
            )} 

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <Badge variant="success">En Stock</Badge>
                  <span className="text-sm text-gray-600">
                    {product.stock} {product.stock === 1 ? 'unidad disponible' : 'unidades disponibles'}
                  </span>
                </>
              ) : (
                <Badge variant="destructive">Sin Stock</Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <Card className="p-6 mb-6">
            <h3 className="font-semibold mb-4">Detalles del Producto</h3>
            <dl className="space-y-2 text-sm">
              {product.set && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Set:</dt>
                  <dd className="font-semibold">{product.set.name}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-600">Idioma:</dt>
                <dd className="font-semibold">{product.language || 'No especificado'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Tipo:</dt>
                <dd className="font-semibold">Booster Pack (Sobre)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Estado:</dt>
                <dd className="font-semibold">Sellado de fábrica</dd>
              </div>
            </dl>
          </Card>

          {/* Add to Cart */}
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
          />

          {/* Features */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-primary-600" />
              <p className="text-sm font-semibold">100% Original</p>
            </div>
            <div className="text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-primary-600" />
              <p className="text-sm font-semibold">Empaque Seguro</p>
            </div>
            <div className="text-center">
              <Truck className="h-8 w-8 mx-auto mb-2 text-primary-600" />
              <p className="text-sm font-semibold">Envío Rápido</p>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <Card className="p-6 mt-6">
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
