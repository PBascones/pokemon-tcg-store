'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Upload, Eye, EyeOff, Images } from 'lucide-react'
import { toast } from 'sonner'

interface HeroImage {
  id: string
  title: string
  subtitle?: string
  imageUrl: string
  buttonText?: string
  buttonLink?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function HeroAdminPage() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    buttonText: '',
    buttonLink: '',
    order: 0,
    isActive: true,
  })

  useEffect(() => {
    fetchHeroImages()
  }, [])

  const fetchHeroImages = async () => {
    try {
      const response = await fetch('/api/admin/hero-images')
      const data = await response.json()
      setHeroImages(data)
    } catch (error) {
      toast.error('Error al cargar imágenes')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        setFormData(prev => ({ ...prev, imageUrl: data.url }))
        toast.success('Imagen subida correctamente')
      } else {
        toast.error(data.error || 'Error al subir imagen')
      }
    } catch (error) {
      toast.error('Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.imageUrl) {
      toast.error('Título e imagen son requeridos')
      return
    }

    try {
      const url = editingImage 
        ? `/api/admin/hero-images/${editingImage.id}`
        : '/api/admin/hero-images'
      
      const method = editingImage ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingImage ? 'Imagen actualizada' : 'Imagen creada')
        fetchHeroImages()
        resetForm()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Error al guardar')
      }
    } catch (error) {
      toast.error('Error al guardar imagen')
    }
  }

  const handleEdit = (image: HeroImage) => {
    setEditingImage(image)
    setFormData({
      title: image.title,
      subtitle: image.subtitle || '',
      imageUrl: image.imageUrl,
      buttonText: image.buttonText || '',
      buttonLink: image.buttonLink || '',
      order: image.order,
      isActive: image.isActive,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return

    try {
      const response = await fetch(`/api/admin/hero-images/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Imagen eliminada')
        fetchHeroImages()
      } else {
        toast.error('Error al eliminar imagen')
      }
    } catch (error) {
      toast.error('Error al eliminar imagen')
    }
  }

  const toggleActive = async (image: HeroImage) => {
    try {
      const response = await fetch(`/api/admin/hero-images/${image.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...image, isActive: !image.isActive }),
      })

      if (response.ok) {
        toast.success(image.isActive ? 'Imagen desactivada' : 'Imagen activada')
        fetchHeroImages()
      } else {
        toast.error('Error al cambiar estado')
      }
    } catch (error) {
      toast.error('Error al cambiar estado')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      imageUrl: '',
      buttonText: '',
      buttonLink: '',
      order: 0,
      isActive: true,
    })
    setEditingImage(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Images className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">Carrousel Hero</h1>
            </div>
            <p className="text-purple-100">
              Gestioná las imágenes principales de tu tienda
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Imagen
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            📊 Total: {heroImages.length} imágenes
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            ✅ Activas: {heroImages.filter(img => img.isActive).length}
          </span>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <Card className="mb-8 border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Images className="h-5 w-5" />
              {editingImage ? 'Editar Imagen' : 'Nueva Imagen Hero'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Título *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título principal del slide"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subtítulo
                  </label>
                  <Input
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Subtítulo opcional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Texto del Botón
                  </label>
                  <Input
                    value={formData.buttonText}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                    placeholder="Ver Productos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enlace del Botón
                  </label>
                  <Input
                    value={formData.buttonLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                    placeholder="/productos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Orden
                  </label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Imagen activa
                  </label>
                </div>
              </div>

              {/* Upload de imagen */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Imagen *
                </label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label
                      htmlFor="imageUpload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Subiendo...' : 'Subir Imagen'}
                    </label>
                  </div>

                  {formData.imageUrl && (
                    <div className="relative w-full max-w-md">
                      <Image
                        src={formData.imageUrl}
                        alt="Preview"
                        width={400}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={uploading}>
                  {editingImage ? 'Actualizar' : 'Crear'} Imagen
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de imágenes */}
      <Card className="shadow-lg">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            🖼️ Imágenes del Carrousel ({heroImages.length})
          </h2>
        </div>
        <CardContent className="p-0">
          {heroImages.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-purple-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Images className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">🎠 No hay imágenes aún</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Creá tu primer slide para el carrousel principal de la tienda
              </p>
              <Button onClick={() => setShowForm(true)} size="lg">
                <Plus className="h-5 w-5 mr-2" />
                ✨ Crear Primera Imagen
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {heroImages.map((image) => (
                <div key={image.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-6">
                    {/* Imagen */}
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={image.imageUrl}
                        alt={image.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg truncate">{image.title}</h3>
                        <Badge variant={image.isActive ? 'success' : 'secondary'}>
                          {image.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          Orden: {image.order}
                        </span>
                      </div>
                      {image.subtitle && (
                        <p className="text-gray-600 text-sm mb-2">{image.subtitle}</p>
                      )}
                      {image.buttonText && (
                        <div className="text-xs text-gray-500">
                          Botón: "{image.buttonText}" → {image.buttonLink || 'Sin enlace'}
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActive(image)}
                        title={image.isActive ? 'Desactivar' : 'Activar'}
                      >
                        {image.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(image)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(image.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
