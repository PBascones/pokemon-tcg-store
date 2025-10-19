import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePaths } from '@/lib/server-utils'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const set = await prisma.set.findUnique({
      where: { id },
      include: {
        expansion: true,
        products: {
          include: {
            images: {
              orderBy: {
                order: 'asc',
              },
              take: 1,
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    if (!set) {
      return NextResponse.json(
        { error: 'Set no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(set)
  } catch (error: any) {
    console.error('Error fetching set:', error)
    return NextResponse.json(
      { error: 'Error al obtener set' },
      { status: 500 }
    )
  }
}

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
      expansionId,
      imageUrl,
    } = body

    // Verificar que el set existe
    const existingSet = await prisma.set.findUnique({
      where: { id },
    })

    if (!existingSet) {
      return NextResponse.json(
        { error: 'Set no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si el slug ya está en uso por otro set
    if (slug !== existingSet.slug) {
      const slugInUse = await prisma.set.findUnique({
        where: { slug },
      })

      if (slugInUse) {
        return NextResponse.json(
          { error: 'Ya existe un set con ese slug' },
          { status: 400 }
        )
      }
    }

    // Verificar que la expansión existe
    if (expansionId) {
      const expansion = await prisma.expansion.findUnique({
        where: { id: expansionId },
      })

      if (!expansion) {
        return NextResponse.json(
          { error: 'Expansión no encontrada' },
          { status: 400 }
        )
      }
    }

    // Actualizar set
    const set = await prisma.set.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        expansionId,
        image: imageUrl || null,
      },
      include: {
        expansion: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    // Revalidar páginas que muestran sets
    revalidatePaths('/', '/productos', '/admin/sets', `/admin/sets/${id}`)

    return NextResponse.json(set)
  } catch (error: any) {
    console.error('Error updating set:', error)
    return NextResponse.json(
      { error: error.message || 'Error al actualizar set' },
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

    // Verificar que el set existe
    const existingSet = await prisma.set.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    if (!existingSet) {
      return NextResponse.json(
        { error: 'Set no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que no hay productos asociados
    if (existingSet._count.products > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar un set que tiene productos asociados' },
        { status: 400 }
      )
    }

    // Eliminar set
    await prisma.set.delete({
      where: { id },
    })

    // Revalidar páginas que muestran sets
    revalidatePaths('/', '/productos', '/admin/sets')

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting set:', error)
    return NextResponse.json(
      { error: error.message || 'Error al eliminar set' },
      { status: 500 }
    )
  }
}
