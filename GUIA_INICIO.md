# 🚀 Guía de Inicio Rápido - PokéStore

Esta guía te ayudará a poner en marcha el e-commerce de cartas Pokémon en pocos pasos.

## 📋 Prerrequisitos

Asegurate de tener instalado:
- **Node.js 18+** - [Descargar](https://nodejs.org/)
- **PostgreSQL 14+** - [Descargar](https://www.postgresql.org/download/)
- **Git** (opcional) - Para control de versiones

## 🔧 Paso 1: Configurar Base de Datos PostgreSQL

### Opción A: PostgreSQL Local

1. Instalar PostgreSQL en tu sistema
2. Abrir pgAdmin o la terminal de PostgreSQL
3. Crear una nueva base de datos:

```sql
CREATE DATABASE pokemon_store;
```

4. Crear un usuario (opcional pero recomendado):

```sql
CREATE USER pokestore_user WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE pokemon_store TO pokestore_user;
```

### Opción B: PostgreSQL en la Nube (Supabase, Railway, etc.)

1. Crear cuenta en [Supabase](https://supabase.com/) o [Railway](https://railway.app/)
2. Crear un nuevo proyecto de PostgreSQL
3. Copiar la URL de conexión que te proporcionan

## 📦 Paso 2: Instalar Dependencias

```bash
cd pokemon-store
npm install
```

## ⚙️ Paso 3: Configurar Variables de Entorno

El archivo `.env` ya está creado con valores de ejemplo. Editalo con tus datos reales:

```bash
# Ejemplo con nano (o usa tu editor favorito)
nano .env
```

Configura estos valores:

### 1. DATABASE_URL
Reemplazar con tu conexión real:
```
DATABASE_URL="postgresql://usuario:password@localhost:5432/pokemon_store?schema=public"
```

### 2. NEXTAUTH_SECRET
Generar un secret seguro:
```bash
# En terminal ejecutá:
openssl rand -base64 32
```
Copiar el resultado y pegarlo en `NEXTAUTH_SECRET`

### 3. MercadoPago (Importante para Argentina)

#### Cómo obtener las credenciales de MercadoPago:

1. Ir a [MercadoPago Developers](https://www.mercadopago.com.ar/developers/es)
2. Iniciar sesión o crear cuenta
3. Ir a "Tus integraciones" → "Credenciales"
4. Copiar:
   - **Access Token** → pegar en `MERCADOPAGO_ACCESS_TOKEN`
   - **Public Key** → pegar en `MERCADOPAGO_PUBLIC_KEY`

**Nota:** Empezá con las credenciales de **TEST** para desarrollo. Luego cambiá a las de **PRODUCCIÓN**.

## 🗄️ Paso 4: Configurar la Base de Datos

Ejecutar las migraciones de Prisma:

```bash
npm run db:migrate
```

Esto creará todas las tablas necesarias.

## 🌱 Paso 5: Poblar la Base de Datos (Seed)

Cargar datos de ejemplo (productos, categorías, usuario admin):

```bash
npm run db:seed
```

Esto creará:
- **Usuario Administrador:**
  - Email: `admin@pokestore.com`
  - Password: `admin123`
  
- **Usuario de Prueba:**
  - Email: `cliente@test.com`
  - Password: `test123`

- **8 Categorías** de productos
- **8 Productos** de ejemplo

⚠️ **IMPORTANTE:** Cambiar la contraseña del admin antes de subir a producción.

## 🚀 Paso 6: Iniciar el Servidor

```bash
npm run dev
```

El servidor estará corriendo en: **http://localhost:3000**

## ✅ Verificar que Todo Funcione

### 1. Página Principal
- Abrir http://localhost:3000
- Deberías ver la homepage con productos destacados

### 2. Catálogo
- Ir a http://localhost:3000/productos
- Deberías ver 8 productos de ejemplo

### 3. Panel de Administración
- Ir a http://localhost:3000/admin
- Iniciar sesión con:
  - Email: `admin@pokestore.com`
  - Password: `admin123`
- Deberías ver el dashboard con estadísticas

### 4. Carrito de Compras
- Agregar un producto al carrito
- Ir a http://localhost:3000/carrito
- Verificar que el producto esté en el carrito

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Base de Datos
npm run db:studio        # Abrir Prisma Studio (UI para ver la DB)
npm run db:migrate       # Crear/aplicar migraciones
npm run db:push          # Push schema sin crear migración
npm run db:seed          # Poblar base de datos

# Build
npm run build            # Build para producción
npm run start            # Iniciar en modo producción
```

## 🎨 Próximos Pasos

Una vez que todo esté funcionando:

1. **Personalizar el diseño:**
   - Cambiar colores en `tailwind.config.js`
   - Modificar logo en `components/store/navbar.tsx`
   - Agregar imágenes reales de productos

2. **Agregar productos reales:**
   - Usar el panel de admin para agregar productos
   - O modificar `prisma/seed.ts` con tus productos

3. **Configurar MercadoPago:**
   - Completar el proceso de verificación en MercadoPago
   - Configurar el webhook URL en el panel de MercadoPago:
     - URL: `https://tu-dominio.com/api/mercadopago/webhook`

4. **Agregar más funcionalidades:**
   - Sistema de búsqueda avanzada
   - Wishlist (lista de deseos)
   - Reviews de productos
   - Sistema de cupones de descuento
   - Newsletter

## 🐛 Solución de Problemas

### Error: "Can't reach database server"
- Verificar que PostgreSQL esté corriendo
- Verificar que la URL de conexión en `.env` sea correcta
- Verificar que el usuario tenga permisos

### Error: "NEXTAUTH_SECRET is not defined"
- Asegurate de tener el archivo `.env` en la raíz del proyecto
- Verificar que `NEXTAUTH_SECRET` tenga un valor

### Error al hacer checkout
- Verificar que las credenciales de MercadoPago estén configuradas
- Verificar que estés usando las credenciales de TEST para desarrollo

### Los productos no tienen imágenes
- El seed crea productos con una imagen placeholder
- Agregar imágenes reales desde el panel de admin

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de MercadoPago](https://www.mercadopago.com.ar/developers/es/docs)
- [Documentación de NextAuth.js](https://next-auth.js.org/)

## 🆘 Soporte

Si tenés problemas o preguntas, revisá:
1. Los logs en la terminal
2. El archivo `README.md` para más detalles
3. La documentación oficial de las tecnologías usadas

---

¡Listo! Tu e-commerce de cartas Pokémon está funcionando 🎉
