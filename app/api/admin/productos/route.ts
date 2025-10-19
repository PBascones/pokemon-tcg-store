import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePaths } from '@/lib/server-utils'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()

    const {
      name,
      slug,
      description,
      price,
      compareAtPrice,
      stock,
      expansionId,
      set,
      language,
      featured,
      isActive,
      imageUrl,
      imageAlt,
    } = body

    // Validar campos requeridos
    if (!name || !slug || !expansionId || price === undefined || stock === undefined) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el slug ya existe
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Ya existe un producto con ese slug' },
        { status: 400 }
      )
    }

    // Crear producto
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        stock: parseInt(stock),
        expansionId,
        set: set || null,
        language: language || null,
        featured: featured || false,
        isActive: isActive !== undefined ? isActive : true,
        images: {
          create: {
            url: imageUrl || '/placeholder.png',
            alt: imageAlt || name,
            order: 0,
          },
        },
      },
      include: {
        images: true,
        expansion: true,
      },
    })

    // Revalidar páginas que muestran productos
    revalidatePaths('/', '/productos', '/admin/productos')

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear producto' },
      { status: 500 }
    )
  }
}

