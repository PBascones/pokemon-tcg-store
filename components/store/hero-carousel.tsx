'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HeroImage {
  id: string
  title: string
  subtitle?: string
  imageUrl: string
  buttonText?: string
  buttonLink?: string
  order: number
  isActive: boolean
}

export function HeroCarousel() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHeroImages()
  }, [])

  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length)
      }, 5000) // Cambiar cada 5 segundos

      return () => clearInterval(interval)
    }
  }, [heroImages.length])

  const fetchHeroImages = async () => {
    try {
      const response = await fetch('/api/hero-images')
      const data = await response.json()
      setHeroImages(data)
    } catch (error) {
      console.error('Error fetching hero images:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-6 bg-white/20 rounded w-1/2 mx-auto mb-8"></div>
            <div className="h-12 bg-white/20 rounded w-40 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  // Si no hay imágenes, mostrar el hero por defecto
  if (heroImages.length === 0) {
    return (
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Los mejores Sobres Pokémon de Argentina
            </h1>
            <p className="text-xl mb-8 text-white font-medium drop-shadow-md">
              Booster packs 100% originales. Envíos a todo el país. 
              Los mejores precios del mercado.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/productos">
                <Button size="lg" className="text-gray-900 hover:font-semibold">
                  Ver Catálogo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[500px] md:h-[600px]">
        {heroImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Imagen de fondo */}
            <div className="relative w-full h-full">
              <Image
                src={image.imageUrl}
                alt={image.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay para mejorar legibilidad del texto */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Contenido del slide */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl text-white">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                    {image.title}
                  </h1>
                  {image.subtitle && (
                    <p className="text-xl md:text-2xl mb-8 drop-shadow-md font-medium">
                      {image.subtitle}
                    </p>
                  )}
                  {image.buttonText && image.buttonLink && (
                    <Link href={image.buttonLink}>
                      <Button 
                        size="lg" 
                        className="bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {image.buttonText}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de navegación */}
      {heroImages.length > 1 && (
        <>
          {/* Botones anterior/siguiente */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
            aria-label="Siguiente slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Información adicional para SEO y accesibilidad */}
      <div className="sr-only">
        <h2>Carrousel de imágenes principales</h2>
        <p>Slide {currentSlide + 1} de {heroImages.length}</p>
      </div>
    </section>
  )
}
