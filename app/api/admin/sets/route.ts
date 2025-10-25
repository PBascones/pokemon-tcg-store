import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Obtener expansiones para los filtros
    const expansions = await prisma.expansion.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Obtener sets con información relacionada
    const sets = await prisma.set.findMany({
      include: {
        expansion: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      sets,
      expansions,
    })
  } catch (error) {
    console.error('Error fetching sets data:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description, releaseDate, expansionId, imageUrl } = body

    // Validar campos requeridos
    if (!name || !slug || !expansionId) {
      return NextResponse.json(
        { error: 'Nombre, slug y expansión son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que la expansión existe
    const expansion = await prisma.expansion.findUnique({
      where: { id: expansionId },
    })

    if (!expansion) {
      return NextResponse.json(
        { error: 'La expansión especificada no existe' },
        { status: 400 }
      )
    }

    // Verificar que el slug no esté en uso
    const existingSet = await prisma.set.findUnique({
      where: { slug },
    })

    if (existingSet) {
      return NextResponse.json(
        { error: 'Ya existe un set con ese slug' },
        { status: 400 }
      )
    }

    // Crear el set
    const newSet = await prisma.set.create({
      data: {
        name,
        slug,
        description: description || null,
        image: imageUrl || null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        expansionId,
      },
      include: {
        expansion: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(newSet, { status: 201 })
  } catch (error) {
    console.error('Error creating set:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}