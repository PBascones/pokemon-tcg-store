import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePaths } from '@/lib/server-utils'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const {
      name,
      slug,
      description,
      price,
      compareAtPrice,
      openingPrice,
      stock,
      expansionId,
      setId,
      language,
      featured,
      isActive,
      isOpening,
      images,
    } = body

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si el slug ya está en uso por otro producto
    if (slug !== existingProduct.slug) {
      const slugInUse = await prisma.product.findUnique({
        where: { slug },
      })

      if (slugInUse) {
        return NextResponse.json(
          { error: 'Ya existe un producto con ese slug' },
          { status: 400 }
        )
      }
    }

    // Actualizar producto
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        openingPrice: openingPrice ? parseFloat(openingPrice) : null,
        stock: parseInt(stock),
        expansionId,
        setId: setId || null,
        language: language || null,
        featured: featured || false,
        isActive: isActive !== undefined ? isActive : true,
        isOpening: isOpening !== undefined ? isOpening : false,
      },
      include: {
        images: true,
        expansion: true,
        set: true,
      },
    })

    // Actualizar imágenes si se proporcionaron
    if (images && Array.isArray(images)) {
      // Eliminar todas las imágenes existentes
      await prisma.productImage.deleteMany({
        where: { productId: id },
      })

      // Crear las nuevas imágenes
      await prisma.productImage.createMany({
        data: images.map((img: any, index: number) => ({
          productId: id,
          url: img.url,
          alt: img.alt || name,
          order: img.order !== undefined ? img.order : index,
        })),
      })
    }

    // Revalidar páginas que muestran productos
    revalidatePaths('/', '/productos', '/admin/productos', `/productos/${product.slug}`)

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: error.message || 'Error al actualizar producto' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar imágenes asociadas primero
    await prisma.productImage.deleteMany({
      where: { productId: id },
    })

    // Eliminar producto
    await prisma.product.delete({
      where: { id },
    })

    // Revalidar páginas que muestran productos
    revalidatePaths('/', '/productos', '/admin/productos')

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: error.message || 'Error al eliminar producto' },
      { status: 500 }
    )
  }
}

