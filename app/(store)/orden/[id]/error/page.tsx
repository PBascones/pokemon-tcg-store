import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'

type PageProps = {
  params: { id: string }
}

export default async function OrderErrorPage({ params }: PageProps) {
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
        <h1 className="text-2xl text-gray-900 font-bold mb-2">No pudimos procesar el pago</h1>
        <p className="text-gray-700 mb-4">
          Orden <span className="font-semibold">{order.orderNumber}</span>.
        </p>
        <p className="text-gray-700 mb-6">Revisa tus datos o intenta nuevamente. Si el problema persiste, contáctanos.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <Link href="/carrito">Volver al carrito</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">Ir al inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}


