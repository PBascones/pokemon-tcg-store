import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL, APP_URL } from '@/lib/resend'
import ResetPasswordEmail from '@/emails/reset-password-email'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      )
    }

    // Buscar el usuario por email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Por seguridad, siempre devolvemos success aunque el usuario no exista
    // Esto previene que alguien enumere emails válidos
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Si el email existe, recibirás las instrucciones',
      })
    }

    // Generar token único
    const token = randomBytes(32).toString('hex')

    // Guardar el token en la base de datos (expira en 1 hora)
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
        used: false,
      },
    })

    // Crear el link de reset
    const resetLink = `${APP_URL}/auth/reset-password?token=${token}`

    // Enviar el email
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: 'Restablecer contraseña - Poke Addiction',
        react: ResetPasswordEmail({
          userName: user.name || 'Usuario',
          resetLink,
        }),
      })
    } catch (emailError) {
      console.error('Error al enviar email:', emailError)
      return NextResponse.json(
        { error: 'Error al enviar el email. Por favor, intentá nuevamente.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Email enviado exitosamente',
    })
  } catch (error) {
    console.error('Error en forgot-password:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}

