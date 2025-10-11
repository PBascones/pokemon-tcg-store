import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener imágenes hero activas para el frontend
export async function GET() {
  try {
    const heroImages = await prisma.heroImage.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    })

    return NextResponse.json(heroImages)
  } catch (error) {
    console.error('Error fetching active hero images:', error)
    return NextResponse.json(
      { error: 'Error al obtener imágenes' },
      { status: 500 }
    )
  }
}
