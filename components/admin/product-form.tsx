'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

interface Expansion {
  id: string
  name: string
  slug: string
}

interface Set {
  id: string
  name: string
  slug: string
  expansionId: string
}

interface ProductImage {
  id?: string
  url: string
  alt: string | null
  order: number
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compareAtPrice: number | null
  stock: number
  expansionId: string
  setId: string | null
  language: string | null
  featured: boolean
  isActive: boolean
  images: ProductImage[]
}

interface ProductFormProps {
  product?: Product
  expansions: Expansion[]
  sets: Set[]
}

export function ProductForm({ product, expansions, sets }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<ProductImage[]>(
    product?.images || []
  )
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    compareAtPrice: product?.compareAtPrice || 0,
    stock: product?.stock || 0,
    expansionId: product?.expansionId || expansions[0]?.id || '',
    setId: product?.setId || '',
    language: product?.language || 'Inglés',
    featured: product?.featured || false,
    isActive: product?.isActive ?? true,
  })
  
  // Filtrar sets por expansión seleccionada
  const availableSets = sets.filter(set => set.expansionId === formData.expansionId)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Auto-generate slug from name
    if (name === 'name' && !product) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setFormData((prev) => ({ ...prev, slug }))
    }
    
    // Reset setId when expansion changes
    if (name === 'expansionId') {
      setFormData((prev) => ({ ...prev, setId: '' }))
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const uploadedImages: ProductImage[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validar tipo
        if (!file.type.startsWith('image/')) {
          toast.error('Error', {
            description: `${file.name} no es una imagen válida`,
          })
          continue
        }

        // Validar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Error', {
            description: `${file.name} supera el tamaño máximo de 5MB`,
          })
          continue
        }

        // Upload a Vercel Blob
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Error al subir imagen')
        }

        uploadedImages.push({
          url: data.url,
          alt: formData.name || file.name || '',
          order: images.length + uploadedImages.length,
        })
      }

      if (uploadedImages.length > 0) {
        setImages((prev) => [...prev, ...uploadedImages])
        toast.success(`${uploadedImages.length} imagen${uploadedImages.length > 1 ? 'es' : ''} subida${uploadedImages.length > 1 ? 's' : ''}`, {
          description: 'Las imágenes se cargaron correctamente',
        })
      }
    } catch (error: any) {
      toast.error('Error', {
        description: error.message,
      })
    } finally {
      setUploading(false)
      // Limpiar el input para permitir subir el mismo archivo nuevamente
      e.target.value = ''
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index)
      // Reordenar los índices
      return newImages.map((img, i) => ({ ...img, order: i }))
    })
    toast.success('Imagen eliminada')
  }

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    setImages((prev) => {
      const newImages = [...prev]
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      
      if (targetIndex < 0 || targetIndex >= newImages.length) return prev
      
      // Intercambiar posiciones
      ;[newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]]
      
      // Actualizar orden
      return newImages.map((img, i) => ({ ...img, order: i }))
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar que haya al menos una imagen
    if (images.length === 0) {
      toast.error('Error', {
        description: 'Debes subir al menos una imagen del producto',
      })
      return
    }

    setLoading(true)

    try {
      const url = product
        ? `/api/admin/productos/${product.id}`
        : '/api/admin/productos'
      
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: images,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar producto')
      }

      toast.success(
        product ? 'Producto actualizado' : 'Producto creado',
        {
          description: `${formData.name} fue ${
            product ? 'actualizado' : 'creado'
          } correctamente`,
        }
      )

      router.push('/admin/productos')
      router.refresh()
    } catch (error: any) {
      toast.error('Error', {
        description: error.message,
      })
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre del Sobre *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Scarlet & Violet Base Set - Booster Pack"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Slug (URL) *
                </label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  placeholder="scarlet-violet-base-booster"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se genera automáticamente del nombre
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  placeholder="Descripción del sobre. Ej: Incluye 10 cartas con posibilidad de obtener cartas ex, Full Art y Secret Rare."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Set
                  </label>
                  <select
                    name="setId"
                    value={formData.setId}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    <option value="">Sin set específico</option>
                    {availableSets.map((set) => (
                      <option key={set.id} value={set.id}>
                        {set.name}
                      </option>
                    ))}
                  </select>
                  {availableSets.length === 0 && formData.expansionId && (
                    <p className="text-xs text-gray-500 mt-1">
                      No hay sets disponibles para esta expansión.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Idioma *
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    <option value="Inglés">Inglés</option>
                    <option value="Español">Español</option>
                    <option value="Japonés">Japonés</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Precio y Stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Precio (USD) *
                  </label>
                  <Input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="5500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Precio Comparación (opcional)
                  </label>
                  <Input
                    name="compareAtPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.compareAtPrice || ''}
                    onChange={handleChange}
                    placeholder="6500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Para mostrar descuento tachado
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Stock (unidades) *
                </label>
                <Input
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  placeholder="50"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imágenes del Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subir Imágenes {images.length > 0 && `(${images.length})`}
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  {uploading && (
                    <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, WEBP. Máximo 5MB por imagen. Podés subir múltiples imágenes.
                </p>
              </div>

              {images.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-3">
                    Imágenes ({images.length}):
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative group border-2 border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div className="relative aspect-square">
                          <img
                            src={image.url}
                            alt={image.alt || `Imagen ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.png'
                            }}
                          />
                          {index === 0 && (
                            <Badge
                              variant="default"
                              className="absolute top-2 left-2"
                            >
                              Principal
                            </Badge>
                          )}
                        </div>
                        
                        {/* Controles */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveImage(index, 'up')}
                              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100"
                              title="Mover adelante"
                            >
                              ←
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                            title="Eliminar"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          {index < images.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveImage(index, 'down')}
                              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100"
                              title="Mover atrás"
                            >
                              →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 La primera imagen es la principal. Usá las flechas para reordenar.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expansión</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                name="expansionId"
                value={formData.expansionId}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                {expansions.map((expansion) => (
                  <option key={expansion.id} value={expansion.id}>
                    {expansion.name}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium">
                  Producto Activo
                </span>
              </label>
              <p className="text-xs text-gray-500">
                Los productos inactivos no se muestran en la tienda
              </p>

              <label className="flex items-center gap-3 mt-4">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium">
                  Producto Destacado
                </span>
              </label>
              <p className="text-xs text-gray-500">
                Se muestra en la página principal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>{product ? 'Actualizar' : 'Crear'} Producto</>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-3"
                onClick={() => router.push('/admin/productos')}
                disabled={loading}
              >
                Cancelar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}

