'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        toast.success('Email enviado', {
          description: 'Revisá tu casilla de correo para restablecer tu contraseña',
        })
      } else {
        toast.error('Error', {
          description: data.error || 'Ocurrió un error al enviar el email',
        })
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Ocurrió un error al procesar tu solicitud',
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Email enviado</CardTitle>
            <CardDescription>
              Revisá tu casilla de correo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
                <p>
                  Te enviamos un email a <strong>{email}</strong> con las instrucciones
                  para restablecer tu contraseña.
                </p>
                <p className="mt-2">
                  El enlace expira en 1 hora.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 text-center">
                  ¿No recibiste el email?
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSuccess(false)
                    setEmail('')
                  }}
                >
                  Enviar nuevamente
                </Button>
              </div>

              <div className="text-center pt-4">
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Volver al inicio de sesión
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">¿Olvidaste tu contraseña?</CardTitle>
          <CardDescription>
            Ingresá tu email y te enviaremos instrucciones para restablecerla
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar instrucciones'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al inicio de sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

