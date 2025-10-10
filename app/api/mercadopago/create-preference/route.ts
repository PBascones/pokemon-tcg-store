import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createPreference, type PreferenceData } from '@/lib/mercadopago'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { items, shippingInfo } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No hay items en el carrito' },
        { status: 400 }
      )
    }

    // Verificar stock y obtener información de productos
    const productIds = items.map((item: any) => item.id)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
      include: {
        images: true,
      },
    })

    // Validar stock
    for (const item of items) {
      const product = products.find(p => p.id === item.id)
      if (!product) {
        return NextResponse.json(
          { error: `Producto ${item.name} no encontrado` },
          { status: 400 }
        )
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${product.name}` },
          { status: 400 }
        )
      }
    }

    // Calcular totales
    const subtotal = items.reduce(
      (sum: number, item: any) => {
        const product = products.find(p => p.id === item.id)
        return sum + (product?.price || 0) * item.quantity
      },
      0
    )

    const shipping = subtotal > 50000 ? 0 : 5000
    const total = subtotal + shipping

    // Crear orden en la base de datos
    const orderNumber = generateOrderNumber()
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        email: session.user.email,
        phone: shippingInfo.phone || '',
        shippingName: shippingInfo.name,
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        shippingState: shippingInfo.state,
        shippingZip: shippingInfo.zip,
        subtotal,
        shipping,
        total,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: items.map((item: any) => {
            const product = products.find(p => p.id === item.id)
            return {
              productId: item.id,
              name: product?.name || item.name,
              price: product?.price || item.price,
              quantity: item.quantity,
            }
          }),
        },
      },
    })

    // Preparar items para MercadoPago
    const mpItems = products.map((product) => {
      const cartItem = items.find((i: any) => i.id === product.id)
      return {
        id: product.id,
        title: product.name,
        quantity: cartItem.quantity,
        unit_price: product.price,
        currency_id: 'ARS',
        picture_url: product.images[0]?.url,
      }
    })

    // Agregar envío si corresponde
    if (shipping > 0) {
      mpItems.push({
        id: 'shipping',
        title: 'Envío',
        quantity: 1,
        unit_price: shipping,
        currency_id: 'ARS',
        picture_url: '',
      })
    }

    // Crear preferencia de MercadoPago
    const preferenceData: PreferenceData = {
      items: mpItems,
      payer: {
        name: shippingInfo.name,
        email: session.user.email,
        phone: {
          number: shippingInfo.phone || '',
        },
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/orden/${order.id}/confirmacion`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/orden/${order.id}/error`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/orden/${order.id}/pendiente`,
      },
      auto_return: 'approved',
      external_reference: order.id,
      // notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhook`,
      statement_descriptor: 'POKESTORE',
    }

    const mpPreference = await createPreference(preferenceData)

    // Actualizar orden con ID de MercadoPago
    await prisma.order.update({
      where: { id: order.id },
      data: {
        mercadoPagoId: mpPreference.id,
      },
    })

    return NextResponse.json({
      orderId: order.id,
      preferenceId: mpPreference.id,
      initPoint: mpPreference.init_point,
    })
  } catch (error) {
    console.error('Error creating preference:', error)
    return NextResponse.json(
      { error: 'Error al crear preferencia de pago' },
      { status: 500 }
    )
  }
}
