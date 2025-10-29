import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET - Validar token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token no proporcionado' },
        { status: 400 }
      )
    }

    // Buscar el token en la base de datos
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    // Verificar que el token existe, no ha sido usado y no ha expirado
    if (!resetToken || resetToken.used || resetToken.expires < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'Token inválido o expirado' },
        { status: 400 }
      )
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Error al validar token:', error)
    return NextResponse.json(
      { valid: false, error: 'Error al validar el token' },
      { status: 500 }
    )
  }
}

// POST - Restablecer contraseña
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token y contraseña son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Buscar el token en la base de datos
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    // Verificar que el token existe, no ha sido usado y no ha expirado
    if (!resetToken || resetToken.used || resetToken.expires < new Date()) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      )
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Actualizar la contraseña del usuario y marcar el token como usado
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { token },
        data: { used: true },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
    })
  } catch (error) {
    console.error('Error al restablecer contraseña:', error)
    return NextResponse.json(
      { error: 'Error al restablecer la contraseña' },
      { status: 500 }
    )
  }
}

