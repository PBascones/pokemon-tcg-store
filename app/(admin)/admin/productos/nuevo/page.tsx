import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/admin/product-form'

export default async function NewProductPage() {
  const expansions = await prisma.expansion.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Agregar Producto</h1>
        <p className="text-gray-600">
          Completá los datos del nuevo sobre para agregarlo a la tienda
        </p>
      </div>

      <ProductForm expansions={expansions} />
    </div>
  )
}

