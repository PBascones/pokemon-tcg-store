# 🚀 Guía de Configuración: Vercel + Supabase

## 🔴 Solución al Error de Conexión a Base de Datos

Si estás viendo el error: `Can't reach database server at db.tjrrxslvcjvzihpmvidy.supabase.co:5432`, sigue estos pasos:

## ✅ Paso 1: Obtener las URLs Correctas de Supabase

Supabase tiene **DOS URLs diferentes** y necesitas ambas:

### 1.1 Connection String (Transaction Mode - Puerto 6543)

1. Ir a tu proyecto en [Supabase](https://supabase.com)
2. Click en **Settings** → **Database**
3. Bajar hasta **Connection String**
4. Seleccionar la pestaña **"Session"** o **"Transaction"** (NO "Direct connection")
5. Copiar la URL que se ve así:
   ```
   postgresql://postgres.[reference-id]:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

**IMPORTANTE:** Reemplazar `[YOUR-PASSWORD]` con tu contraseña real.

### 1.2 Direct Connection URL (Puerto 5432)

1. En la misma sección **Connection String**
2. Seleccionar la pestaña **"Direct connection"**
3. Copiar la URL que se ve así:
   ```
   postgresql://postgres.[reference-id]:[YOUR-PASSWORD]@db.tjrrxslvcjvzihpmvidy.supabase.co:5432/postgres
   ```

**IMPORTANTE:** También reemplazar `[YOUR-PASSWORD]` con tu contraseña.

## ✅ Paso 2: Configurar Variables de Entorno en Vercel

1. **Ir a tu proyecto en Vercel**
   - https://vercel.com/dashboard

2. **Seleccionar tu proyecto** (pokemon-store)

3. **Ir a Settings → Environment Variables**

4. **Agregar TODAS estas variables** (una por una):

### Variables Requeridas:

| Variable | Valor | Ejemplo |
|----------|-------|---------|
| `DATABASE_URL` | Tu URL de Supabase con **puerto 6543** (pooled) | `postgresql://postgres.[id]:[pass]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | Tu URL de Supabase con **puerto 5432** (direct) | `postgresql://postgres.[id]:[pass]@db.tjrrxslvcjvzihpmvidy.supabase.co:5432/postgres` |
| `NEXTAUTH_SECRET` | Generar uno nuevo (ver abajo) | `tu-secret-super-seguro-y-largo` |
| `NEXTAUTH_URL` | URL de tu app en Vercel | `https://tu-proyecto.vercel.app` |
| `MERCADOPAGO_ACCESS_TOKEN` | Token de MercadoPago | `APP_USR-...` |
| `MERCADOPAGO_PUBLIC_KEY` | Public key de MercadoPago | `APP_USR-...` |
| `NEXT_PUBLIC_APP_URL` | Misma URL que NEXTAUTH_URL | `https://tu-proyecto.vercel.app` |

### Cómo agregar cada variable:

1. Click en **"Add New"** → **"Environment Variable"**
2. Poner el **nombre** (ej: `DATABASE_URL`)
3. Pegar el **valor**
4. Seleccionar los **3 ambientes**: Production, Preview, Development
5. Click en **"Save"**
6. Repetir para cada variable

### Generar NEXTAUTH_SECRET:

En tu terminal local, ejecutar:

```bash
openssl rand -base64 32
```

O usar este sitio: https://generate-secret.vercel.app/32

## ✅ Paso 3: Actualizar schema.prisma

El archivo `prisma/schema.prisma` necesita saber sobre la URL directa:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

Ya debería estar configurado así, pero verificar.

## ✅ Paso 4: Hacer las Migraciones

Una vez configuradas las variables, necesitas correr las migraciones en tu base de datos:

### Opción A: Desde tu computadora (Recomendado)

1. Crear un archivo `.env` local con tus variables:

```env
DATABASE_URL="postgresql://postgres.[id]:[pass]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[id]:[pass]@db.tjrrxslvcjvzihpmvidy.supabase.co:5432/postgres"
```

2. Ejecutar migraciones:

```bash
cd pokemon-store
npm install
npx prisma migrate deploy
npx prisma generate
npm run db:seed
```

### Opción B: Desde Vercel (si ya corriste las migraciones localmente)

Si ya tienes las tablas en Supabase, solo necesitas regenerar el cliente de Prisma en Vercel.

## ✅ Paso 5: Forzar Redeploy en Vercel

1. Ir a tu proyecto en Vercel
2. Click en **"Deployments"**
3. Buscar el último deployment
4. Click en los 3 puntos "..." → **"Redeploy"**
5. Asegurar que **"Use existing Build Cache"** esté **DESMARCADO**
6. Click en **"Redeploy"**

## ✅ Paso 6: Verificar el Deploy

1. Ver los logs del deploy en tiempo real
2. Buscar que no haya errores de conexión
3. Una vez completado, abrir tu sitio: `https://tu-proyecto.vercel.app`

---

## 🐛 Troubleshooting

### Error: "Invalid `prisma.xxx.findMany()` invocation"

**Causa:** Las migraciones no se corrieron en la base de datos.

**Solución:**
```bash
npx prisma migrate deploy
```

### Error: "Authentication failed for user"

**Causa:** La contraseña en la URL es incorrecta.

**Solución:**
1. Ir a Supabase → Settings → Database
2. Buscar **"Reset database password"**
3. Crear una nueva contraseña
4. Actualizar ambas URLs en Vercel
5. Redeploy

### Error: "Can't reach database server"

**Causas posibles:**

1. **Variable no configurada:** Verificar que `DATABASE_URL` esté en Vercel
2. **URL incorrecta:** Debe usar puerto **6543** (pooled), no 5432
3. **Falta pgbouncer:** La URL debe terminar en `?pgbouncer=true`

**Solución correcta:**
```
DATABASE_URL="postgresql://postgres.[id]:[pass]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### La página principal carga pero las rutas dinámicas no

**Causa:** Prisma Client no se generó correctamente.

**Solución:** Agregar script de postinstall.

Verificar en `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Build exitoso pero errores en runtime

**Causa:** Variables de entorno solo configuradas para "Production" y no para "Preview".

**Solución:** Asegurar que TODAS las variables estén en los 3 ambientes.

---

## 📋 Checklist Final

Antes de hacer el deploy, verificar:

- [ ] `DATABASE_URL` configurado en Vercel (puerto 6543, con `?pgbouncer=true`)
- [ ] `DIRECT_URL` configurado en Vercel (puerto 5432)
- [ ] `NEXTAUTH_SECRET` generado y configurado
- [ ] `NEXTAUTH_URL` con tu dominio de Vercel
- [ ] `NEXT_PUBLIC_APP_URL` con tu dominio de Vercel
- [ ] Credenciales de MercadoPago configuradas
- [ ] Todas las variables en los 3 ambientes (Production, Preview, Development)
- [ ] Migraciones corridas: `npx prisma migrate deploy`
- [ ] Seed corrido: `npm run db:seed`
- [ ] Redeploy sin caché
- [ ] Sitio funcionando correctamente

---

## 🔍 Verificar Conexión a Supabase

Desde tu computadora, probar la conexión:

```bash
# Con la URL pooled (puerto 6543)
psql "postgresql://postgres.[id]:[pass]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Listar tablas
\dt

# Salir
\q
```

Si esto funciona, entonces tu URL es correcta.

---

## 📞 Soporte

Si seguiste todos los pasos y aún tienes problemas:

1. Verificar logs en Vercel (Deployments → Click en el deploy → View Function Logs)
2. Verificar que Supabase esté activo (no en pausa por inactividad)
3. Verificar límites de conexión en Supabase
4. Considerar upgrade a plan Pro de Supabase si tienes muchas conexiones

---

## ✨ Configuración Correcta Final

Tu configuración debería verse así:

**En Vercel (Environment Variables):**
```
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:5432/postgres
NEXTAUTH_SECRET=tu-secret-largo-y-seguro
NEXTAUTH_URL=https://tu-proyecto.vercel.app
NEXT_PUBLIC_APP_URL=https://tu-proyecto.vercel.app
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxx
```

**En schema.prisma:**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

¡Tu app debería deployarse sin problemas! 🎉
