# 🚀 Cómo Agregar Features Nuevas

Guía práctica con ejemplos reales para extender el e-commerce.

---

## 📋 Proceso General

```
1. Modificar Base de Datos (si es necesario)
   ↓
2. Crear/Modificar API Endpoints
   ↓
3. Crear/Modificar Componentes UI
   ↓
4. Conectar Frontend con Backend
   ↓
5. Testing
   ↓
6. Commit
```

---

## 🎯 Ejemplo 1: Agregar Wishlist (Lista de Deseos)

### Paso 1: Modificar Schema de Prisma

```typescript
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  // ... campos existentes
  
  // ➕ AGREGAR:
  wishlistItems WishlistItem[]
}

// ➕ NUEVO MODELO:
model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  productId String
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([userId, productId]) // No permitir duplicados
  @@index([userId])
}

model Product {
  // ... campos existentes
  
  // ➕ AGREGAR:
  wishlistItems WishlistItem[]
}
```

**Ejecutar migración:**
```bash
npx prisma migrate dev --name add-wishlist
```

---

### Paso 2: Crear API Endpoints

```typescript
// app/api/wishlist/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/wishlist - Obtener wishlist del usuario
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        wishlistItems: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(user?.wishlistItems || [])
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json({ error: 'Error al obtener wishlist' }, { status: 500 })
  }
}

// POST /api/wishlist - Agregar a wishlist
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { productId } = await request.json()
    
    if (!productId) {
      return NextResponse.json({ error: 'productId requerido' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar que el producto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    // Agregar a wishlist (ignora si ya existe por el unique constraint)
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId,
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    })

    return NextResponse.json(wishlistItem, { status: 201 })
  } catch (error: any) {
    // Si es error de unique constraint (ya existe)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ya está en tu wishlist' }, { status: 400 })
    }
    
    console.error('Error adding to wishlist:', error)
    return NextResponse.json({ error: 'Error al agregar' }, { status: 500 })
  }
}

// DELETE /api/wishlist - Eliminar de wishlist
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { productId } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    await prisma.wishlistItem.deleteMany({
      where: {
        userId: user.id,
        productId,
      },
    })

    return NextResponse.json({ message: 'Eliminado de wishlist' })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
```

---

### Paso 3: Crear State Management (Zustand)

```typescript
// stores/wishlist-store.ts

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface WishlistItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: { url: string }[]
  }
}

interface WishlistStore {
  items: WishlistItem[]
  isLoading: boolean
  fetchWishlist: () => Promise<void>
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      
      fetchWishlist: async () => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/wishlist')
          if (response.ok) {
            const items = await response.json()
            set({ items })
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error)
        } finally {
          set({ isLoading: false })
        }
      },
      
      addToWishlist: async (productId: string) => {
        try {
          const response = await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
          })
          
          if (response.ok) {
            const newItem = await response.json()
            set({ items: [...get().items, newItem] })
          }
        } catch (error) {
          console.error('Error adding to wishlist:', error)
          throw error
        }
      },
      
      removeFromWishlist: async (productId: string) => {
        try {
          const response = await fetch('/api/wishlist', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
          })
          
          if (response.ok) {
            set({ items: get().items.filter(item => item.productId !== productId) })
          }
        } catch (error) {
          console.error('Error removing from wishlist:', error)
          throw error
        }
      },
      
      isInWishlist: (productId: string) => {
        return get().items.some(item => item.productId === productId)
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

---

### Paso 4: Crear Componente UI

```typescript
// components/store/wishlist-button.tsx

'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWishlistStore } from '@/stores/wishlist-store'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface WishlistButtonProps {
  productId: string
  variant?: 'icon' | 'button'
}

export function WishlistButton({ productId, variant = 'icon' }: WishlistButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(productId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      toast.error('Inicia sesión para usar wishlist')
      router.push('/auth/login')
      return
    }

    setLoading(true)
    try {
      if (inWishlist) {
        await removeFromWishlist(productId)
        toast.success('Eliminado de favoritos')
      } else {
        await addToWishlist(productId)
        toast.success('Agregado a favoritos', {
          action: {
            label: 'Ver wishlist',
            onClick: () => router.push('/wishlist'),
          },
        })
      }
    } catch (error) {
      toast.error('Error al actualizar wishlist')
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`p-2 rounded-full transition ${
          inWishlist 
            ? 'bg-primary-500 text-white' 
            : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600'
        }`}
      >
        <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
      </button>
    )
  }

  return (
    <Button
      variant={inWishlist ? 'default' : 'outline'}
      onClick={handleClick}
      disabled={loading}
    >
      <Heart className={`h-4 w-4 mr-2 ${inWishlist ? 'fill-current' : ''}`} />
      {inWishlist ? 'En Favoritos' : 'Agregar a Favoritos'}
    </Button>
  )
}
```

---

### Paso 5: Agregar a ProductCard

```typescript
// components/store/product-card.tsx

import { WishlistButton } from './wishlist-button'

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="relative">
          {/* Imagen del producto */}
          
          {/* ➕ AGREGAR botón de wishlist */}
          <div className="absolute top-2 right-2">
            <WishlistButton productId={product.id} />
          </div>
        </div>
        
        {/* Resto del card... */}
      </CardContent>
    </Card>
  )
}
```

---

### Paso 6: Crear Página de Wishlist

```typescript
// app/(store)/wishlist/page.tsx

'use client'

import { useEffect } from 'react'
import { useWishlistStore } from '@/stores/wishlist-store'
import { ProductCard } from '@/components/store/product-card'
import { Card } from '@/components/ui/card'
import { Heart } from 'lucide-react'

export default function WishlistPage() {
  const { items, isLoading, fetchWishlist } = useWishlistStore()

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center p-12">
          <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tu wishlist está vacía</h2>
          <p className="text-gray-600">
            Agregá productos a favoritos para guardarlos aquí
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Mis Favoritos ({items.length})
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <ProductCard key={item.id} product={item.product} />
        ))}
      </div>
    </div>
  )
}
```

---

## 🎯 Ejemplo 2: Agregar Reviews (Más Complejo)

### Paso 1: Schema

```typescript
// prisma/schema.prisma

model Review {
  id        String   @id @default(cuid())
  rating    Int      // 1-5 estrellas
  comment   String?  @db.Text
  
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([productId, userId]) // Un review por usuario por producto
  @@index([productId])
}

model Product {
  // ... campos existentes
  reviews   Review[]
}

model User {
  // ... campos existentes
  reviews   Review[]
}
```

```bash
npx prisma migrate dev --name add-reviews
```

---

### Paso 2: API Endpoints

```typescript
// app/api/products/[productId]/reviews/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/products/[productId]/reviews
export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: params.productId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener reviews' }, { status: 500 })
  }
}

// POST /api/products/[productId]/reviews
export async function POST(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { rating, comment } = await request.json()

    // Validar rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating debe ser entre 1 y 5' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar que el usuario haya comprado el producto
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: params.productId,
        order: {
          userId: user.id,
          paymentStatus: 'PAID',
        },
      },
    })

    if (!hasPurchased) {
      return NextResponse.json(
        { error: 'Solo podés dejar reviews de productos que compraste' },
        { status: 403 }
      )
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        productId: params.productId,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ya dejaste un review para este producto' }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Error al crear review' }, { status: 500 })
  }
}
```

---

## 📦 Ejemplo 3: Agregar Cupones de Descuento

### Paso 1: Schema

```typescript
// prisma/schema.prisma

model Coupon {
  id              String    @id @default(cuid())
  code            String    @unique
  discountType    DiscountType // PERCENTAGE o FIXED
  discountValue   Float     // 10 (%) o 5000 ($)
  minPurchase     Float?    // Compra mínima requerida
  maxDiscount     Float?    // Descuento máximo (para %)
  usageLimit      Int?      // Límite de usos totales
  usageCount      Int       @default(0)
  
  validFrom       DateTime  @default(now())
  validUntil      DateTime?
  
  isActive        Boolean   @default(true)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum DiscountType {
  PERCENTAGE
  FIXED
}

model Order {
  // ... campos existentes
  
  couponCode      String?
  discount        Float     @default(0)
}
```

```bash
npx prisma migrate dev --name add-coupons
```

---

### Paso 2: API Endpoint

```typescript
// app/api/coupons/validate/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json()

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    // Validaciones
    if (!coupon) {
      return NextResponse.json({ error: 'Cupón inválido' }, { status: 404 })
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'Cupón inactivo' }, { status: 400 })
    }

    const now = new Date()
    if (coupon.validUntil && coupon.validUntil < now) {
      return NextResponse.json({ error: 'Cupón expirado' }, { status: 400 })
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'Cupón agotado' }, { status: 400 })
    }

    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return NextResponse.json(
        { error: `Compra mínima requerida: $${coupon.minPurchase}` },
        { status: 400 }
      )
    }

    // Calcular descuento
    let discount = 0
    if (coupon.discountType === 'PERCENTAGE') {
      discount = subtotal * (coupon.discountValue / 100)
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount)
      }
    } else {
      discount = coupon.discountValue
    }

    return NextResponse.json({
      valid: true,
      discount,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error al validar cupón' }, { status: 500 })
  }
}
```

---

## ✅ Checklist General para Agregar Features

```markdown
📋 Antes de Empezar:
- [ ] ¿Necesito cambios en la DB? → Modificar schema.prisma
- [ ] ¿Necesito autenticación? → Usar getServerSession
- [ ] ¿Necesito estado global? → Crear store en Zustand

🔨 Durante el Desarrollo:
- [ ] Crear migración de Prisma (si aplica)
- [ ] Crear API Route en app/api/
- [ ] Validar datos de entrada
- [ ] Manejar errores apropiadamente
- [ ] Crear componentes UI necesarios
- [ ] Agregar Toast notifications
- [ ] Actualizar tipos de TypeScript

✅ Antes de Commitear:
- [ ] Probar el flujo completo
- [ ] Verificar que no haya console.errors
- [ ] Verificar responsive en mobile
- [ ] Actualizar documentación (si es feature grande)
```

---

## 🎯 Resumen del Flujo

```
Feature Nueva
    ↓
¿Necesita DB? → prisma/schema.prisma + migrate
    ↓
Backend → app/api/.../route.ts
    ↓
Frontend → components/...tsx
    ↓
Estado (si necesita) → stores/...ts
    ↓
Página (si necesita) → app/(store)/.../page.tsx
    ↓
Commit
```

---

## 📚 Recursos Útiles

### Documentación:
- **Prisma:** https://www.prisma.io/docs
- **Next.js API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Zustand:** https://docs.pmnd.rs/zustand
- **NextAuth:** https://next-auth.js.org/

### Patrones Comunes:
```typescript
// Patrón de API Route
export async function GET/POST/PUT/DELETE(request: Request) {
  // 1. Autenticación (si aplica)
  // 2. Validación de datos
  // 3. Lógica de negocio
  // 4. Query a DB (Prisma)
  // 5. Return NextResponse.json()
}

// Patrón de Component con estado
'use client'
const [loading, setLoading] = useState(false)
const handleAction = async () => {
  setLoading(true)
  try {
    const response = await fetch('/api/...')
    if (response.ok) {
      toast.success('Éxito')
    }
  } catch (error) {
    toast.error('Error')
  } finally {
    setLoading(false)
  }
}
```

---

¡Listo! Con esto podés agregar cualquier feature nueva al proyecto. 🚀


