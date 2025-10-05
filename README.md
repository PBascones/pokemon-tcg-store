# 🎴 Poke Addiction - E-commerce de Cartas Pokémon

E-commerce completo para venta de cartas Pokémon en Argentina. Construido con Next.js 14, TypeScript, Prisma y MercadoPago.

## 🚀 Características

- ✅ Catálogo de productos con filtros y búsqueda
- ✅ Sistema de categorías
- ✅ Carrito de compras con persistencia
- ✅ Integración con MercadoPago (Argentina)
- ✅ Sistema de autenticación (admin/usuario)
- ✅ Panel de administración completo
- ✅ Gestión de stock en tiempo real
- ✅ Sistema de órdenes y facturación
- ✅ Diseño responsive y moderno
- ✅ SEO optimizado

## 🛠️ Stack Tecnológico

- **Frontend & Backend:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma
- **Autenticación:** NextAuth.js
- **Pagos:** MercadoPago SDK
- **Estilos:** Tailwind CSS
- **Componentes UI:** Radix UI + Custom
- **State Management:** Zustand

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- Cuenta de MercadoPago (Argentina)

## 🔧 Instalación

1. **Clonar el repositorio:**
```bash
git clone <repo-url>
cd pokemon-store
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**

Crear archivo `.env` en la raíz del proyecto:

```env
# Database
DATABASE_URL="postgresql://usuario:password@localhost:5432/pokemon_store?schema=public"

# NextAuth
NEXTAUTH_SECRET="genera-un-secret-con-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# MercadoPago Argentina
MERCADOPAGO_ACCESS_TOKEN="tu-access-token"
MERCADOPAGO_PUBLIC_KEY="tu-public-key"

# URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Configurar la base de datos:**

```bash
# Ejecutar migraciones
npx prisma migrate dev --name init

# Generar Prisma Client
npx prisma generate
```

5. **Crear usuario administrador:**

```bash
npm run seed
```

Esto creará un usuario admin con:
- Email: admin@pokestore.com
- Password: admin123

⚠️ **IMPORTANTE:** Cambiar estas credenciales en producción.

6. **Iniciar el servidor de desarrollo:**

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 📊 Base de Datos

### Modelos Principales:

- **User:** Usuarios del sistema (clientes y admins)
- **Product:** Cartas Pokémon
- **Category:** Categorías de productos
- **Order:** Órdenes de compra
- **OrderItem:** Items dentro de cada orden

### Comandos Útiles de Prisma:

```bash
# Ver base de datos en navegador
npx prisma studio

# Crear una nueva migración
npx prisma migrate dev --name nombre_migracion

# Resetear base de datos (⚠️ elimina todos los datos)
npx prisma migrate reset

# Actualizar Prisma Client después de cambios en schema
npx prisma generate
```

## 🔐 Autenticación

El sistema usa NextAuth.js con credenciales.

### Roles:
- **USER:** Cliente estándar (puede comprar)
- **ADMIN:** Administrador (acceso al panel de admin)

### Endpoints:
- `/api/auth/signin` - Login
- `/api/auth/signout` - Logout
- `/api/auth/signup` - Registro (crear endpoint custom)

## 💳 MercadoPago

### Configuración:

1. Crear cuenta en [MercadoPago Argentina](https://www.mercadopago.com.ar/)
2. Obtener credenciales en [Tus integraciones](https://www.mercadopago.com.ar/developers/panel)
3. Copiar Access Token y Public Key al `.env`

### Flujo de Pago:

1. Usuario completa checkout
2. Se crea preferencia de pago en MercadoPago
3. Usuario es redirigido a MercadoPago
4. Después del pago, webhook notifica al sistema
5. Orden se actualiza con estado de pago

## 🏗️ Estructura del Proyecto

```
pokemon-store/
├── app/
│   ├── (store)/              # Páginas públicas de la tienda
│   │   ├── page.tsx          # Homepage
│   │   ├── productos/        # Catálogo
│   │   ├── carrito/          # Carrito de compras
│   │   └── checkout/         # Proceso de pago
│   ├── (admin)/              # Panel de administración
│   │   └── admin/
│   │       ├── productos/    # CRUD de productos
│   │       ├── ordenes/      # Gestión de órdenes
│   │       └── categorias/   # CRUD de categorías
│   └── api/                  # API Routes
│       ├── auth/             # Autenticación
│       ├── products/         # Endpoints de productos
│       ├── orders/           # Endpoints de órdenes
│       └── mercadopago/      # Integración pagos
├── components/
│   ├── ui/                   # Componentes base
│   ├── store/                # Componentes de tienda
│   └── admin/                # Componentes de admin
├── lib/
│   ├── prisma.ts             # Cliente de Prisma
│   ├── auth.ts               # Configuración NextAuth
│   └── utils.ts              # Utilidades
├── prisma/
│   ├── schema.prisma         # Schema de base de datos
│   └── seed.ts               # Datos iniciales
└── stores/
    └── cart-store.ts         # Estado del carrito (Zustand)
```

## 📱 Funcionalidades

### Para Clientes:

- Navegar catálogo de productos
- Filtrar por categoría, precio, rareza
- Buscar productos
- Agregar al carrito
- Ver carrito y modificar cantidades
- Checkout con MercadoPago
- Ver historial de órdenes

### Para Administradores:

- Agregar/editar/eliminar productos
- Gestionar categorías
- Control de stock
- Ver todas las órdenes
- Actualizar estado de órdenes
- Ver estadísticas de ventas

## 🚀 Deploy a Producción

### Vercel (Recomendado):

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

### Variables de Entorno en Producción:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="secret-super-seguro"
NEXTAUTH_URL="https://tu-dominio.com"
MERCADOPAGO_ACCESS_TOKEN="..."
MERCADOPAGO_PUBLIC_KEY="..."
NEXT_PUBLIC_APP_URL="https://tu-dominio.com"
```

## 🧪 Testing

```bash
# Correr tests (cuando se implementen)
npm test

# Correr tests en watch mode
npm test:watch
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Linter
npm run seed         # Poblar base de datos
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: nueva característica'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y de uso exclusivo para el cliente.

## 📞 Soporte

Para consultas sobre el proyecto, contactar al desarrollador.

---

**Desarrollado con ❤️ para coleccionistas de Pokémon en Argentina**