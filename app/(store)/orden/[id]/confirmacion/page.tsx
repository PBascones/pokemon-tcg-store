import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'

type PageProps = {
  params: { id: string },
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function OrderConfirmationPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { offlinePayment } = await searchParams;

  const order = await prisma.order.findUnique({
    where: { id },
    select: { orderNumber: true },
  })

  if (!order) {
    notFound()
  }

  const hasOfflinePayment = offlinePayment === 'true';
  const message = `¡Hola! Mi número de orden es ${order.orderNumber}. ¿Coordinamos el ${hasOfflinePayment ? 'pago' : 'envío'}?`
  const waLink = `https://wa.me/${process.env.NEXT_PUBLIC_WSP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`

  const shippingInfo = (
    <div className="text-blue-700 text-sm space-y-1">
      <p><strong>Correo Argentino - Opciones disponibles:</strong></p>
      <ul className="ml-4 space-y-1">
        <li>• Buenos Aires: $6.000 (domicilio) / $4.000 (sucursal)</li>
        <li>• Interior del país: $10.000 (domicilio) / $6.000 (sucursal)</li>
      </ul>
    </div>
  )

  const nextStepInfo = (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
        {hasOfflinePayment ? '💰 Próximo paso: Coordinar el pago' : '📦 Próximo paso: Coordinar envío'}
      </h3>
      <p className="text-blue-700 text-sm mb-3">
        {hasOfflinePayment ?
          'Ya registramos tu pedido exitosamente. Ahora coordinemos el pago y envío por WhatsApp para finalizar la compra:' :
          'Ya registramos tu pago exitosamente. Ahora coordinemos el envío por WhatsApp:'}
      </p>
      {shippingInfo}
    </div>
  )

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-lg border bg-white p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl text-gray-900 font-bold mb-2">¡Gracias por tu compra!</h1>
          <p className="text-gray-700 mb-4">
            Tu número de orden es <span className="font-semibold text-primary-600">{order.orderNumber}</span>
          </p>
        </div>

        {nextStepInfo}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
            passHref
          >
            <Button className="flex-1 w-full h-full block">
              {`📱 Coordinar ${hasOfflinePayment ? 'pago' : 'envío'} por WhatsApp`}
            </Button>
          </Link>
          {!hasOfflinePayment && (
            <Link
              href="/"
              className="flex-1"
              passHref
            >
              <Button variant="secondary" className="flex-1">
                Seguir explorando
              </Button>
            </Link>
          )}
        </div>
        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> Guardá tu número de orden para futuras consultas
          </p>
        </div>
      </div>
    </div>
  )
}
