import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePaths } from '@/lib/server-utils'

export async function GET() {
  try {
    const sets = await prisma.set.findMany({
      include: {
        expansion: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(sets)
  } catch (error: any) {
    console.error('Error fetching sets:', error)
    return NextResponse.json(
      { error: 'Error al obtener sets' },
      { status: 500 }
    )
  }
}

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
      expansionId,
      imageUrl,
    } = body

    // Validar campos requeridos
    if (!name || !slug || !expansionId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el slug ya existe
    const existingSet = await prisma.set.findUnique({
      where: { slug },
    })

    if (existingSet) {
      return NextResponse.json(
        { error: 'Ya existe un set con ese slug' },
        { status: 400 }
      )
    }

    // Verificar que la expansión existe
    const expansion = await prisma.expansion.findUnique({
      where: { id: expansionId },
    })

    if (!expansion) {
      return NextResponse.json(
        { error: 'Expansión no encontrada' },
        { status: 400 }
      )
    }

    // Crear set
    const set = await prisma.set.create({
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
    revalidatePaths('/', '/productos', '/admin/sets')

    return NextResponse.json(set, { status: 201 })
  } catch (error: any) {
    console.error('Error creating set:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear set' },
      { status: 500 }
    )
  }
}
