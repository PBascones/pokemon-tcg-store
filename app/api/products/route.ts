import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const expansion = searchParams.get('expansion')
    const featured = searchParams.get('featured') === 'true'
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isActive: true,
    }

    if (expansion) {
      where.expansion = {
        slug: expansion,
      }
    }

    if (featured) {
      where.featured = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { set: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    // Get products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: {
            orderBy: {
              order: 'asc',
            },
          },
          expansion: true,
          set: true,
        },
        orderBy: {
          [sortBy]: order,
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}
