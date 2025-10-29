import { Resend } from 'resend'

// Inicializar Resend con la API key
export const resend = new Resend(process.env.RESEND_API_KEY)

// Email del remitente (debe ser verificado en Resend)
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

// URL base de la aplicación
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://pokeaddiction.com.ar'

