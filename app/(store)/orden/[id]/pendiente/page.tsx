import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'

type PageProps = {
  params: { id: string }
}

export default async function OrderPendingPage({ params }: PageProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    select: { orderNumber: true },
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="text-2xl text-gray-900 font-bold mb-2">Pago en proceso</h1>
        <p className="text-gray-700 mb-4">
          Tu orden <span className="font-semibold">{order.orderNumber}</span> está pendiente de confirmación.
        </p>
        <p className="text-gray-700 mb-6">Apenas se acredite, te avisamos por email.</p>
        <div className="flex gap-3">
          <Button asChild>
            <a href="/" rel="noopener noreferrer">Volver a la tienda</a>
          </Button>
        </div>
      </div>
    </div>
  )
}


