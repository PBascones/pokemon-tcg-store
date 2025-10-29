'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })

  // Validar el token al cargar la página
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setValidating(false)
        setTokenValid(false)
        return
      }

      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`)
        const data = await response.json()

        if (response.ok && data.valid) {
          setTokenValid(true)
        } else {
          setTokenValid(false)
        }
      } catch (error) {
        setTokenValid(false)
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Error', {
        description: 'Las contraseñas no coinciden',
      })
      return
    }

    if (formData.password.length < 6) {
      toast.error('Error', {
        description: 'La contraseña debe tener al menos 6 caracteres',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        toast.success('Contraseña actualizada', {
          description: 'Tu contraseña fue restablecida exitosamente',
        })
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      } else {
        toast.error('Error', {
          description: data.error || 'Ocurrió un error al restablecer la contraseña',
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

  // Mostrar loading mientras valida el token
  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <p className="text-sm text-gray-600">Validando token...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Token inválido o expirado
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Token inválido</CardTitle>
            <CardDescription>
              El enlace de restablecimiento es inválido o ha expirado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm">
                <p>
                  El enlace que utilizaste es inválido o ha expirado.
                  Los enlaces de restablecimiento expiran después de 1 hora.
                </p>
              </div>

              <Link href="/auth/forgot-password">
                <Button className="w-full" variant="outline">
                  Solicitar nuevo enlace
                </Button>
              </Link>

              <div className="text-center">
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">
                  Volver al inicio de sesión
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Éxito
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">¡Contraseña actualizada!</CardTitle>
            <CardDescription>
              Tu contraseña fue restablecida exitosamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm">
                <p>
                  Serás redirigido al inicio de sesión en unos segundos...
                </p>
              </div>

              <Link href="/auth/login">
                <Button className="w-full">
                  Ir al inicio de sesión
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Formulario de reset
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Restablecer contraseña</CardTitle>
          <CardDescription>
            Ingresá tu nueva contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nueva contraseña
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 6 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirmar contraseña
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={loading}
                minLength={6}
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
                  Actualizando...
                </>
              ) : (
                'Restablecer contraseña'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">
              Volver al inicio de sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}

