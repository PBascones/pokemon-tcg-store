'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
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
  categoryId: string
  set: string | null
  language: string | null
  featured: boolean
  isActive: boolean
  images: ProductImage[]
}

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.images[0]?.url || null
  )
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    compareAtPrice: product?.compareAtPrice || 0,
    stock: product?.stock || 0,
    categoryId: product?.categoryId || categories[0]?.id || '',
    set: product?.set || '',
    language: product?.language || 'Inglés',
    featured: product?.featured || false,
    isActive: product?.isActive ?? true,
    imageUrl: product?.images[0]?.url || '',
    imageAlt: product?.images[0]?.alt || '',
  })

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
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      toast.error('Error', {
        description: 'El archivo debe ser una imagen',
      })
      return
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Error', {
        description: 'La imagen debe ser menor a 5MB',
      })
      return
    }

    setUploading(true)

    try {
      // Preview local
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload a Vercel Blob
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir imagen')
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: data.url,
        imageAlt: prev.imageAlt || prev.name,
      }))

      toast.success('Imagen subida', {
        description: 'La imagen se cargó correctamente',
      })
    } catch (error: any) {
      toast.error('Error', {
        description: error.message,
      })
      setImagePreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        body: JSON.stringify(formData),
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
                    Set/Expansión *
                  </label>
                  <Input
                    name="set"
                    value={formData.set}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Scarlet & Violet Base"
                  />
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
              <CardTitle>Imagen del Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subir Imagen
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  {uploading && (
                    <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, WEBP. Máximo 5MB.
                </p>
              </div>

              {(imagePreview || formData.imageUrl) && (
                <div>
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <div className="relative w-48 h-48">
                    <img
                      src={imagePreview || formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.png'
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Texto Alternativo (Alt)
                </label>
                <Input
                  name="imageAlt"
                  value={formData.imageAlt}
                  onChange={handleChange}
                  placeholder="Sobre de Scarlet & Violet Base Set"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
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

