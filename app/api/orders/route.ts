import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
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

    const shipping = 0 // Sin costo de envío - se coordina por WhatsApp
    const total = subtotal

    // Crear orden en la base de datos
    const orderNumber = generateOrderNumber()

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
      include: {
        items: true,
      },
    })

    return NextResponse.json({ order: order }, { status: 200 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error al crear la orden' },
      { status: 500 }
    )
  }
}