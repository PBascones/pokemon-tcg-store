import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'

type PageProps = {
  params: { id: string }
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    select: { orderNumber: true },
  })

  if (!order) {
    notFound()
  }

  const message = `¡Hola! Mi número de orden es ${order.orderNumber}. ¿Coordinamos el envío?`
  const waLink = `https://wa.me/${process.env.NEXT_PUBLIC_WSP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="text-2xl text-gray-900 font-bold mb-2">¡Gracias por tu compra!</h1>
        <p className="text-gray-700 mb-4">
          Tu número de orden es <span className="font-semibold">{order.orderNumber}</span>.
        </p>
        <p className="text-gray-700 mb-6">
          Ya registramos tu pago. Solo resta coordinar el envío cuando te quede cómodo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              Coordinar envío por WhatsApp
            </a>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">Seguir explorando</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}


