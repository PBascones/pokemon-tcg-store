'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ProductImage {
  id?: string
  url: string
  alt?: string | null
}

interface ProductImageGalleryProps {
  images: ProductImage[]
  productName: string
  discount?: number
  variant?: 'card' | 'detail' // Nueva prop para controlar el estilo
  showThumbnails?: boolean // Nueva prop para mostrar/ocultar thumbnails
  additionalBadges?: React.ReactNode // Badges adicionales a mostrar
}

export function ProductImageGallery({
  images,
  productName,
  discount = 0,
  variant = 'detail',
  showThumbnails = true,
  additionalBadges,
}: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Si no hay imágenes, usar placeholder
  const displayImages = images.length > 0 
    ? images 
    : [{ id: 'placeholder', url: '/placeholder.png', alt: productName }]

  const goToPrevious = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setCurrentIndex((prev) => 
      prev === 0 ? displayImages.length - 1 : prev - 1
    )
  }

  const goToNext = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setCurrentIndex((prev) => 
      prev === displayImages.length - 1 ? 0 : prev + 1
    )
  }

  const goToImage = (index: number, e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setCurrentIndex(index)
  }

  // Estilos según la variante
  const isCard = variant === 'card'
  const containerClass = isCard 
    ? 'relative mb-4 overflow-hidden rounded-lg bg-gray-100 group w-full'
    : 'relative w-full max-w-[520px] mb-4 rounded-lg overflow-hidden bg-gray-100 group'
  
  const containerStyle = isCard 
    ? { aspectRatio: '3 / 4' }
    : { aspectRatio: '3 / 4', maxHeight: '70vh' }

  const buttonSize = isCard ? 'p-1.5' : 'p-2'
  const iconSize = isCard ? 'h-4 w-4' : 'h-6 w-6'
  const badgeClass = isCard 
    ? 'absolute top-2 left-2 z-10'
    : 'absolute top-4 left-4 text-lg z-10'
  const dotsPosition = isCard ? 'bottom-2' : 'bottom-4'
  const dotSize = isCard ? 'w-1.5 h-1.5' : 'w-2 h-2'
  const dotActiveWidth = isCard ? 'w-4' : 'w-8'
  const dotsGap = isCard ? 'gap-1.5' : 'gap-2'

  return (
    <div className={isCard ? '' : 'flex flex-col items-center lg:items-start'}>
      {/* Imagen Principal con Carousel */}
      <div className={containerClass} style={containerStyle}>
        <Image
          src={displayImages[currentIndex].url}
          alt={displayImages[currentIndex].alt || productName}
          fill
          className="object-contain p-2 transition-opacity duration-300"
          priority={!isCard}
        />
        
        {/* Badges (descuento y adicionales) */}
        <div className={`${badgeClass.replace('absolute', 'absolute')} flex flex-col gap-2`}>
          {discount > 0 && (
            <Badge variant="destructive">
              -{discount}%
            </Badge>
          )}
          {additionalBadges}
        </div>

        {/* Botones de navegación (solo si hay más de 1 imagen) */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={(e) => goToPrevious(e)}
              className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white ${buttonSize} rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10`}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className={iconSize} />
            </button>
            <button
              onClick={(e) => goToNext(e)}
              className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white ${buttonSize} rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10`}
              aria-label="Siguiente imagen"
            >
              <ChevronRight className={iconSize} />
            </button>

            {/* Indicadores de posición */}
            <div className={`absolute ${dotsPosition} left-1/2 -translate-x-1/2 flex ${dotsGap} z-10`}>
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToImage(index, e)}
                  className={`${dotSize} rounded-full transition-all ${
                    index === currentIndex
                      ? `bg-white ${dotActiveWidth}`
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails (solo si hay más de 1 imagen Y se pide mostrarlos) */}
      {displayImages.length > 1 && showThumbnails && (
        <div className="grid grid-cols-4 gap-3 w-full max-w-[520px]">
          {displayImages.map((image, index) => (
            <button
              key={image.id || index}
              onClick={(e) => goToImage(index, e)}
              className={`relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer transition-all ${
                index === currentIndex
                  ? 'ring-2 ring-primary-600 ring-offset-2'
                  : 'hover:opacity-75'
              }`}
              style={{ aspectRatio: '3 / 4' }}
            >
              <Image
                src={image.url}
                alt={image.alt || `${productName} - ${index + 1}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

