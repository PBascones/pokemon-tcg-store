import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Obtener todas las imágenes hero
export async function GET() {
  try {
    const heroImages = await prisma.heroImage.findMany({
      orderBy: {
        order: 'asc',
      },
    })

    return NextResponse.json(heroImages)
  } catch (error) {
    console.error('Error fetching hero images:', error)
    return NextResponse.json(
      { error: 'Error al obtener imágenes' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva imagen hero
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { title, subtitle, imageUrl, buttonText, buttonLink, order, isActive } = body

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Título e imagen son requeridos' },
        { status: 400 }
      )
    }

    const heroImage = await prisma.heroImage.create({
      data: {
        title,
        subtitle,
        imageUrl,
        buttonText,
        buttonLink,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return NextResponse.json(heroImage)
  } catch (error) {
    console.error('Error creating hero image:', error)
    return NextResponse.json(
      { error: 'Error al crear imagen' },
      { status: 500 }
    )
  }
}
