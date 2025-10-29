# ✅ Sistema de Reset de Contraseña - Implementación Completa

## 📦 Lo que se implementó

### 1. **Base de datos**
- ✅ Modelo `PasswordResetToken` agregado a Prisma
- ✅ Tabla con tokens únicos, fecha de expiración y control de uso

### 2. **Páginas creadas**
- ✅ `/auth/forgot-password` - Solicitar reset de contraseña
- ✅ `/auth/reset-password` - Restablecer contraseña con token
- ✅ `/auth/login` - Actualizado con link "¿Olvidaste tu contraseña?"

### 3. **API Endpoints**
- ✅ `POST /api/auth/forgot-password` - Generar token y enviar email
- ✅ `GET /api/auth/reset-password` - Validar token
- ✅ `POST /api/auth/reset-password` - Actualizar contraseña

### 4. **Email Template**
- ✅ Template profesional en React con `@react-email/components`
- ✅ Diseño responsive y moderno
- ✅ Botón de acción + link alternativo

### 5. **Dependencias instaladas**
- ✅ `resend` - Cliente para enviar emails
- ✅ `@react-email/components` - Componentes para templates

### 6. **Archivos de configuración**
- ✅ `lib/resend.ts` - Configuración de Resend
- ✅ `emails/reset-password-email.tsx` - Template del email

---

## 🚀 Próximos pasos (Para que funcione)

### Paso 1: Ejecutar la migración de la base de datos ⚠️

```bash
cd /Users/pablobasconesbusch/Documents/Pablo/Projects/Joa/pokemon-store
npx prisma migrate dev --name add_password_reset_token
```

Esto creará la tabla `PasswordResetToken` en tu base de datos.

### Paso 2: Crear cuenta en Resend

1. Ve a: https://resend.com
2. Registrate gratis (3,000 emails/mes)
3. Verifica tu email

### Paso 3: Obtener tu API Key

1. En el dashboard de Resend, ve a **API Keys**
2. Crea una nueva API key
3. Cópiala (solo la verás una vez)

### Paso 4: Configurar variables de entorno

Agrega estas variables a tu archivo `.env`:

```bash
# API Key de Resend (la que copiaste en el paso anterior)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email del remitente
# Opción A: Usar dominio de prueba (solo para testing)
RESEND_FROM_EMAIL=onboarding@resend.dev

# Opción B: Usar tu dominio (recomendado para producción)
# RESEND_FROM_EMAIL=noreply@tudominio.com

# URL de tu aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Para producción: https://tudominio.com
```

### Paso 5: (Opcional) Verificar tu dominio en Resend

Para emails más profesionales:

1. En Resend, ve a **Domains**
2. Agrega tu dominio
3. Configura los registros DNS que te indican
4. Espera la verificación
5. Actualiza `RESEND_FROM_EMAIL=noreply@tudominio.com`

**Nota:** Si no querés hacer esto ahora, podés usar `onboarding@resend.dev` para testing (solo enviará a tu email verificado).

### Paso 6: Probar el sistema

1. Inicia tu aplicación: `npm run dev`
2. Ve a: http://localhost:3000/auth/login
3. Haz clic en "¿Olvidaste tu contraseña?"
4. Ingresa tu email
5. Revisa tu casilla de correo
6. Haz clic en el link del email
7. Establece tu nueva contraseña

---

## 📊 Flujo completo del sistema

```
1. Usuario hace clic en "¿Olvidaste tu contraseña?"
   ↓
2. Ingresa su email en /auth/forgot-password
   ↓
3. Sistema genera token único y lo guarda en BD
   ↓
4. Resend envía email con link al usuario
   ↓
5. Usuario hace clic en el link (llega a /auth/reset-password?token=xxx)
   ↓
6. Sistema valida que el token sea válido y no haya expirado
   ↓
7. Usuario ingresa su nueva contraseña
   ↓
8. Sistema actualiza la contraseña y marca el token como usado
   ↓
9. Usuario es redirigido a /auth/login
```

---

## 🔐 Características de seguridad implementadas

✅ **Tokens únicos** - Generados con `crypto.randomBytes(32)`  
✅ **Expiración** - Los tokens expiran en 1 hora  
✅ **Uso único** - Los tokens solo se pueden usar una vez  
✅ **Hashing** - Las contraseñas se hashean con bcrypt  
✅ **No revelación** - No se indica si un email existe o no (previene enumeración)  
✅ **Validación** - Token se valida antes de permitir cambio de contraseña  

---

## 📁 Archivos creados/modificados

### Nuevos archivos:
- `prisma/schema.prisma` - Modelo PasswordResetToken
- `lib/resend.ts` - Configuración de Resend
- `emails/reset-password-email.tsx` - Template del email
- `app/auth/forgot-password/page.tsx` - Página solicitar reset
- `app/auth/reset-password/page.tsx` - Página restablecer contraseña
- `app/api/auth/forgot-password/route.ts` - API solicitar reset
- `app/api/auth/reset-password/route.ts` - API restablecer contraseña
- `CONFIGURACION_RESEND.md` - Documentación completa

### Archivos modificados:
- `app/auth/login/page.tsx` - Agregado link "¿Olvidaste tu contraseña?"

---

## 💰 Costos

**Plan Gratuito de Resend:**
- 3,000 emails/mes
- 100 emails/día
- Perfecto para empezar

**Estimación para tu tienda:**
- Si tenés 10 usuarios/día que olvidan su contraseña = 300 emails/mes
- Estás muy dentro del límite gratuito

---

## 🐛 Troubleshooting común

### Error: "Can't reach database server"
- Verifica que tu base de datos Supabase esté activa
- Ejecuta la migración cuando tengas conexión

### Error: "Error al enviar email"
- Verifica que `RESEND_API_KEY` esté configurada correctamente
- Verifica que `RESEND_FROM_EMAIL` sea válido
- Si usas `onboarding@resend.dev`, solo podés enviar a tu email verificado

### "Token inválido o expirado"
- Los tokens expiran en 1 hora
- Solo se pueden usar una vez
- Solicita un nuevo reset

---

## 📚 Documentación de referencia

- [Resend Docs](https://resend.com/docs)
- [React Email Examples](https://react.email/examples)
- [CONFIGURACION_RESEND.md](./CONFIGURACION_RESEND.md) - Guía detallada

---

## ✨ Próximas mejoras opcionales

1. **Agregar cambio de contraseña desde el perfil** (cuando tengas perfil de usuario)
2. **Email de confirmación al cambiar contraseña** (notificar sobre el cambio)
3. **Logs de intentos de reset** (para monitoreo de seguridad)
4. **Rate limiting** (limitar intentos por IP)
5. **Template personalizado con tu logo** (más branding)

---

**¡Todo listo!** Seguí los pasos y tendrás un sistema profesional de reset de contraseña funcionando. 🚀

