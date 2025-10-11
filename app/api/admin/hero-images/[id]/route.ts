import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Actualizar imagen hero
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
    const { title, subtitle, imageUrl, buttonText, buttonLink, order, isActive } = body

    const heroImage = await prisma.heroImage.update({
      where: { id },
      data: {
        title,
        subtitle,
        imageUrl,
        buttonText,
        buttonLink,
        order,
        isActive,
      },
    })

    return NextResponse.json(heroImage)
  } catch (error) {
    console.error('Error updating hero image:', error)
    return NextResponse.json(
      { error: 'Error al actualizar imagen' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar imagen hero
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
    await prisma.heroImage.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting hero image:', error)
    return NextResponse.json(
      { error: 'Error al eliminar imagen' },
      { status: 500 }
    )
  }
}
