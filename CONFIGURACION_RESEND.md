# Configuración de Resend para Reset de Contraseña

Este documento explica cómo configurar Resend para enviar emails de restablecimiento de contraseña.

## 📋 ¿Qué es Resend?

Resend es un servicio moderno de envío de emails diseñado para desarrolladores. Ofrece:
- 3,000 emails/mes GRATIS
- API simple y directa
- Excelente documentación
- Usado por Next.js y otras empresas líderes

## 🚀 Paso 1: Crear cuenta en Resend

1. Ve a [resend.com](https://resend.com)
2. Registrate con tu email
3. Confirma tu email

## 🔑 Paso 2: Obtener tu API Key

1. Una vez dentro del dashboard de Resend, ve a **API Keys**
2. Clic en **Create API Key**
3. Dale un nombre (ej: "Poke Addiction - Production")
4. Selecciona los permisos (deja "Full access" para desarrollo)
5. Copia la API key que te muestra (solo la verás una vez)

## 📧 Paso 3: Verificar tu dominio (Opcional pero Recomendado)

### Opción A: Usando tu propio dominio

1. Ve a **Domains** en Resend
2. Clic en **Add Domain**
3. Ingresa tu dominio (ej: `pokeaddiction.com`)
4. Resend te mostrará los registros DNS que debes agregar
5. Agrega estos registros en tu proveedor de dominio (Vercel, GoDaddy, Namecheap, etc.)
6. Espera a que se verifique (puede tomar unos minutos)

**Ventajas:**
- Emails más profesionales (`noreply@tudominio.com`)
- Mejor deliverability
- No aparece "via resend.dev"

### Opción B: Usar el dominio de prueba (Solo desarrollo)

Si no querés configurar un dominio ahora, Resend te da un dominio de prueba: `onboarding@resend.dev`

**Limitaciones:**
- Solo podés enviar emails a tu propio email verificado
- No es profesional para producción
- Sirve para testing

## ⚙️ Paso 4: Configurar variables de entorno

Agrega estas variables a tu archivo `.env`:

```bash
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email del remitente (usar el dominio verificado)
RESEND_FROM_EMAIL=noreply@tudominio.com
# O si usas el dominio de prueba:
# RESEND_FROM_EMAIL=onboarding@resend.dev

# URL de tu aplicación (importante para los links)
NEXT_PUBLIC_APP_URL=https://tudominio.com
# Para desarrollo local:
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🗄️ Paso 5: Ejecutar la migración de base de datos

Como agregamos el modelo `PasswordResetToken` a Prisma, necesitás ejecutar la migración:

```bash
npx prisma migrate dev --name add_password_reset_token
```

Esto creará la tabla en tu base de datos.

## ✅ Paso 6: Verificar que funciona

1. Inicia tu aplicación: `npm run dev`
2. Ve a `/auth/login`
3. Haz clic en "¿Olvidaste tu contraseña?"
4. Ingresa tu email
5. Deberías recibir un email con el link de reset

## 🔍 Paso 7: Monitorear envíos (Dashboard de Resend)

En el dashboard de Resend podés ver:
- Todos los emails enviados
- Estado de entrega (delivered, bounced, etc.)
- Abrir rates
- Clicks en links
- Errores

## 🎨 Personalizar el template del email

El template del email está en: `/emails/reset-password-email.tsx`

Podés personalizar:
- Colores
- Textos
- Logo (agregando un componente `<Img>`)
- Estilos

## 💰 Límites y Pricing

**Plan Gratuito:**
- 3,000 emails/mes
- 100 emails/día
- Soporte por email

**Plan Pro ($20/mes):**
- 50,000 emails/mes
- Sin límite diario
- Soporte prioritario
- Webhooks
- Analytics avanzados

Para una tienda pequeña-mediana, el plan gratuito es más que suficiente.

## 🐛 Troubleshooting

### "Error al enviar email"

1. Verifica que la API key es correcta en `.env`
2. Verifica que el email del remitente está verificado
3. Revisa los logs en el dashboard de Resend
4. Si usas el dominio de prueba, solo podés enviar a tu email verificado

### "Token inválido o expirado"

- Los tokens expiran después de 1 hora
- Solicita un nuevo reset de contraseña

### "Can't reach database server"

- Verifica que tu base de datos está corriendo
- Verifica las variables de entorno `DATABASE_URL` y `DIRECT_URL`
- Ejecuta la migración: `npx prisma migrate dev`

## 📚 Recursos adicionales

- [Documentación de Resend](https://resend.com/docs)
- [Ejemplos de React Email](https://react.email/examples)
- [Dashboard de Resend](https://resend.com/dashboard)

## 🔐 Seguridad

El sistema implementado incluye:
- Tokens únicos generados con `crypto.randomBytes(32)`
- Tokens expiran en 1 hora
- Los tokens solo se pueden usar una vez
- Las contraseñas se hashean con bcrypt
- No se revela si un email existe o no (previene enumeración)

---

**¡Listo!** Ya tenés un sistema profesional de reset de contraseña con emails.

