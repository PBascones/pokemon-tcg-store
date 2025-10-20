# 📄 Ejemplo: Cómo Usar Paginación Client-Side

## ✅ Ya Implementado

La paginación client-side ya está integrada en `DataTable`. Solo necesitas agregar un prop.

## 🚀 Uso Básico

### Sin Paginación (actual)
```tsx
<DataTable
  columns={columns}
  data={products}
  getRowKey={(p) => p.id}
/>
// Muestra TODOS los productos
```

### Con Paginación (nuevo)
```tsx
<DataTable
  columns={columns}
  data={products}
  getRowKey={(p) => p.id}
  itemsPerPage={20}  // 👈 Agregar esta línea
/>
// Muestra 20 productos por página con controles de paginación
```

## 📝 Ejemplo Real: Productos

### Archivo: `app/(admin)/admin/productos/page.tsx`

```tsx
export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ ... })

  return (
    <div>
      <Header />
      <StatsCardGrid>...</StatsCardGrid>
      
      {/* Agregar paginación aquí */}
      <ProductsTable 
        products={products}
        itemsPerPage={25}  // 👈 Pasar el prop
      />
    </div>
  )
}
```

### Actualizar el componente tabla:

```tsx
// components/admin/products-table.tsx
interface ProductsTableProps {
  products: Product[]
  itemsPerPage?: number  // 👈 Agregar prop opcional
}

export function ProductsTable({ products, itemsPerPage }: ProductsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={products}
      getRowKey={(product) => product.id}
      itemsPerPage={itemsPerPage}  // 👈 Pasar al DataTable
      emptyState={{...}}
    />
  )
}
```

## 🎨 Personalización

### Cantidad de Items por Página

```tsx
// Productos: 25 por página
<ProductsTable products={products} itemsPerPage={25} />

// Sets: 15 por página (menos porque tienen imágenes grandes)
<DataTable data={sets} itemsPerPage={15} />

// Órdenes: 50 por página (son más livianas)
<OrdersTable orders={orders} itemsPerPage={50} />
```

### Sin Mostrar Números de Página (solo prev/next)

```tsx
import { SimplePagination } from '@/components/ui/pagination'

// Usa SimplePagination directamente si quieres
<SimplePagination 
  currentPage={page}
  totalPages={total}
  onPageChange={setPage}
/>
```

## 🔧 Configuración Recomendada por Página

| Página       | Items/Página | Razón                                    |
|-------------|--------------|------------------------------------------|
| Productos   | 20-25        | Balance entre scroll y navegación        |
| Sets        | 15-20        | Tienen imágenes, mejor menos por página  |
| Órdenes     | 30-50        | Son livianas, más por página es ok       |
| Usuarios    | 25           | Estándar para admin                      |

## ⚡ Características Automáticas

### 1. Reset Automático
Cuando filtras datos, automáticamente vuelve a página 1:
```tsx
// Usuario filtra por expansión "Scarlet & Violet"
// DataTable detecta cambio en data.length
// → Automáticamente va a página 1
```

### 2. Ocultar si No Necesario
```tsx
// Si data.length <= itemsPerPage
// → No muestra paginación (automático)

<DataTable data={[1,2,3]} itemsPerPage={10} />
// Solo 3 items, no muestra paginación ✅
```

### 3. Responsive
```tsx
// Desktop: Muestra "Anterior | 1 2 3 4 5 | Siguiente"
// Mobile: Muestra "← | Página 2 de 5 | →"
// (Automático según viewport)
```

## 🎯 Ejemplo Completo: Sets Page

```tsx
'use client'

import { DataTable, ColumnDef } from '@/components/ui/data-table'
import { StatsCardGrid, StatsCard } from '@/components/ui/stats-card'
import { DataFilters } from '@/components/ui/data-filters'

export default function SetsPage() {
  const [sets, setSets] = useState<Set[]>([])
  const [filteredSets, setFilteredSets] = useState<Set[]>([])
  
  // ... lógica de filtrado

  return (
    <div>
      <Header />
      
      <StatsCardGrid>
        <StatsCard title="Total Sets" value={sets.length} ... />
      </StatsCardGrid>

      <DataFilters 
        filters={filters}
        onFilterChange={handleFilter}
        totalItems={sets.length}
        filteredItems={filteredSets.length}
      />

      {/* Paginación client-side */}
      <DataTable
        columns={columns}
        data={filteredSets}
        getRowKey={(set) => set.id}
        itemsPerPage={15}  // 👈 Activa paginación
        emptyState={{...}}
      />
    </div>
  )
}
```

## 🧪 Testing en Dev

### 1. Probar con Pocos Items
```tsx
// Temporal: reducir itemsPerPage para testing
<DataTable data={products} itemsPerPage={3} />
// Verás paginación aunque tengas pocos productos
```

### 2. Verificar Filtros + Paginación
```tsx
// 1. Ir a página 3
// 2. Aplicar filtro
// 3. Debe volver a página 1 automáticamente ✅
```

### 3. Verificar Responsive
```tsx
// 1. Abrir DevTools
// 2. Modo mobile
// 3. Verificar que paginación se adapte
```

## 📊 Comparación: Antes vs Después

### Antes (Sin Paginación)
```
✅ Simple
✅ Sin configuración
❌ Lista larga (scroll infinito)
❌ Difícil encontrar items específicos
❌ Abrumador con 100+ items
```

### Después (Con Paginación Client-Side)
```
✅ Organizado en páginas
✅ Fácil navegación
✅ Mejor UX
✅ Filtros + paginación funcionan juntos
✅ Performance suficiente (<1000 items)
✅ Solo 1 línea de código: itemsPerPage={20}
```

## 🚀 Próximos Pasos

### Fase 1: Habilitar en Productos (5 min)
```tsx
// components/admin/products-table.tsx
interface ProductsTableProps {
  products: Product[]
  itemsPerPage?: number
}

export function ProductsTable({ products, itemsPerPage = 25 }: ProductsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={products}
      itemsPerPage={itemsPerPage}
      // ... resto
    />
  )
}
```

### Fase 2: Habilitar en Sets (ya está, solo agregar prop)
```tsx
// app/(admin)/admin/sets/page.tsx
<DataTable
  columns={columns}
  data={filteredSets}
  getRowKey={(set) => set.id}
  itemsPerPage={15}  // 👈 Agregar
  emptyState={...}
/>
```

### Fase 3: Habilitar en Órdenes (5 min)
```tsx
// components/admin/orders-table.tsx
export function OrdersTable({ orders, itemsPerPage = 30 }: Props) {
  return (
    <DataTable
      columns={columns}
      data={orders}
      itemsPerPage={itemsPerPage}
      // ... resto
    />
  )
}
```

## 💡 Tips

### Ajusta itemsPerPage según tus necesidades
```tsx
// Muchas imágenes → menos items
<DataTable itemsPerPage={10} />

// Datos livianos (solo texto) → más items
<DataTable itemsPerPage={50} />
```

### Prueba qué se siente mejor
```tsx
// Experimenta con diferentes valores
itemsPerPage={15}  // ¿Se siente bien?
itemsPerPage={20}  // ¿Mejor?
itemsPerPage={25}  // ¿Perfecto?
```

### Hazlo opcional para el usuario (futuro)
```tsx
const [perPage, setPerPage] = useState(20)

<Select value={perPage} onChange={setPerPage}>
  <option value={10}>10 por página</option>
  <option value={20}>20 por página</option>
  <option value={50}>50 por página</option>
</Select>

<DataTable itemsPerPage={perPage} />
```

## 🎉 ¡Ya Está Listo!

La paginación está **completamente implementada** en `DataTable`.

Solo necesitas:
1. Agregar `itemsPerPage={20}` donde quieras paginación
2. Disfrutar de mejor UX

**Tiempo total de implementación:** ~30 segundos por página 🚀

