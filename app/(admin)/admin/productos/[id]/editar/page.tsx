import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/admin/product-form'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Editar Producto</h1>
        <p className="text-gray-600">
          Modificá los datos del sobre "{product.name}"
        </p>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  )
}

