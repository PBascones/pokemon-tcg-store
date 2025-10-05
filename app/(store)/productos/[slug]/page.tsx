import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/store/add-to-cart-button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Package, Shield, Truck } from 'lucide-react'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: {
          order: 'asc',
        },
      },
      category: true,
    },
  })

  if (!product || !product.isActive) {
    notFound()
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={product.images[0]?.url || '/placeholder.png'}
              alt={product.images[0]?.alt || product.name}
              fill
              className="object-cover"
              priority
            />
            {discount > 0 && (
              <Badge variant="destructive" className="absolute top-4 left-4 text-lg">
                -{discount}%
              </Badge>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((image, index) => (
                <div
                  key={image.id}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-75 transition"
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${product.name} - ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">
              {product.category.name}
            </Badge>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            {product.set && (
              <p className="text-gray-600">Set: {product.set}</p>
            )}
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            
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
              {product.cardNumber && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Número de Carta:</dt>
                  <dd className="font-semibold">{product.cardNumber}</dd>
                </div>
              )}
              {product.rarity && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Rareza:</dt>
                  <dd className="font-semibold">{product.rarity}</dd>
                </div>
              )}
              {product.condition && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Condición:</dt>
                  <dd className="font-semibold">{product.condition}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-600">Idioma:</dt>
                <dd className="font-semibold">{product.language}</dd>
              </div>
              {product.isGraded && product.gradeScore && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Grado:</dt>
                  <dd className="font-semibold">{product.gradeScore}</dd>
                </div>
              )}
            </dl>
          </Card>

          {/* Add to Cart */}
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
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
