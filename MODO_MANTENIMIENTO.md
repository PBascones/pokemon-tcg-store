# 🔧 Modo Mantenimiento

## ¿Qué es?

El modo mantenimiento bloquea **COMPLETAMENTE** el acceso a todo el sitio web para usuarios normales. Todas las rutas (home, productos, admin, checkout, APIs, etc.) redirigen automáticamente a una página de mantenimiento con la imagen personalizada.

**⚠️ Excepción importante:** Los usuarios con rol **ADMIN** pueden acceder al sitio normalmente incluso durante el mantenimiento. Esto permite trabajar en el sitio (actualizar stock, gestionar productos, etc.) sin que esté abierto al público.

## ¿Cómo activarlo?

### Opción 1: Modificar el archivo `.env`

1. Abre el archivo `.env` en la raíz del proyecto
2. Busca la línea `PUBLIC_MAINTENANCE_MODE`
3. Cambia el valor a `"true"`:
   ```
   PUBLIC_MAINTENANCE_MODE="true"
   ```
4. Guarda el archivo
5. Reinicia el servidor de desarrollo o haz redeploy

### Opción 2: Modificar en Vercel (Producción)

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**
3. Busca `PUBLIC_MAINTENANCE_MODE`
4. Cambia el valor a `true`
5. Guarda y haz redeploy del sitio

## ¿Cómo desactivarlo?

Simplemente cambia el valor de `PUBLIC_MAINTENANCE_MODE` a `"false"`:

```
PUBLIC_MAINTENANCE_MODE="false"
```

O elimina la variable por completo.

## Acceso ADMIN durante mantenimiento

Los usuarios con rol **ADMIN** pueden ingresar al sitio normalmente:

1. Ve a `/auth/login`
2. Inicia sesión con tu cuenta ADMIN
3. Accede a cualquier ruta del sitio (home, admin, productos, etc.)
4. Trabaja normalmente mientras el sitio está cerrado al público

**Nota:** Los usuarios no-admin verán la pantalla de mantenimiento sin importar si tienen sesión o no.

## ¿Qué rutas se bloquean?

**Para usuarios normales**, TODAS las rutas del sitio:
- ✅ Home (`/`)
- ✅ Productos (`/productos`)
- ✅ Carrito (`/carrito`)
- ✅ Checkout (`/checkout`)
- ✅ Autenticación (`/auth/login`, `/auth/register`)
- ✅ APIs (`/api/*`)
- ✅ Cualquier otra ruta personalizada

**Para usuarios ADMIN:**
- ❌ Ninguna ruta se bloquea, acceso completo al sitio

## Imagen de mantenimiento

La imagen mostrada está ubicada en:
```
/public/images/matenaince.png
```

Para cambiar la imagen, simplemente reemplaza ese archivo con otra imagen manteniendo el mismo nombre.

## Personalización de la página

Si quieres personalizar la página de mantenimiento (agregar texto, cambiar estilos, etc.), edita el archivo:
```
/app/maintenance/page.tsx
```

## Notas importantes

- ⚠️ El modo mantenimiento NO afecta los archivos estáticos (imágenes, CSS, JS)
- ⚠️ Para que los cambios tomen efecto en producción, debes hacer redeploy después de cambiar la variable
- ⚠️ En desarrollo local, debes reiniciar el servidor (`npm run dev`)
- ✅ Los ADMIN pueden trabajar normalmente durante el mantenimiento
- ✅ Ideal para actualizar stock, gestionar productos o realizar cambios sin interrumpir el servicio para administradores
