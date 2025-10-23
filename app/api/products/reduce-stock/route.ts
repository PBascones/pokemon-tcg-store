import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
      const body = await request.json()
      const { items } = body
  
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        })
      }
  
      return NextResponse.json({ success: true, message: 'Stock reducido correctamente' }, { status: 200 });
    } catch (error) {
      console.error('Error reducing stock:', error)
      return NextResponse.json(
        { success: false, error: 'Error al reducir el stock de los productos' },
        { status: 500 }
      )
    }
  }