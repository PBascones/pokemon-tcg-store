# Guía de Componentes UI - Sistema de Diseño Uniforme

Esta guía explica cómo usar los componentes genéricos creados para mantener un estilo uniforme y consistente en toda la plataforma admin.

## 🎯 Objetivo

Mantener un diseño consistente, moderno y fácil de mantener en todas las páginas admin mediante el uso de componentes reutilizables.

## 📦 Componentes Principales

### 1. DataTable (Tablas de Datos)

**Ubicación:** `components/ui/data-table.tsx`

Componente genérico para mostrar tablas de datos con TypeScript generics, lo que garantiza type-safety completo.

#### Características:
- TypeScript generics para seguridad de tipos
- Estado vacío personalizable
- Estilos consistentes
- Hover effects y transiciones
- Responsive design

#### Uso:

```tsx
import { DataTable, ColumnDef } from '@/components/ui/data-table'

// Define tus columnas con type-safety
const columns: ColumnDef<TuTipo>[] = [
  {
    key: 'nombre',                      // Identificador único
    header: '📋 Nombre',                // Puede ser string o ReactNode
    cell: (item) => <div>...</div>,    // Función render con el item
    className: 'text-right'             // (Opcional) Clases adicionales
  },
  // ... más columnas
]

// Usa el componente
<DataTable
  columns={columns}
  data={tusDatos}
  getRowKey={(item) => item.id}       // Función para obtener key única
  emptyState={{                        // (Opcional) Estado vacío
    icon: <Icon className="..." />,
    title: 'No hay datos',
    description: 'Descripción...',
    action: <Button>...</Button>       // (Opcional) Acción CTA
  }}
/>
```

#### Ejemplo Real:

```tsx
// Ver: components/admin/products-table.tsx
const columns: ColumnDef<Product>[] = [
  {
    key: 'product',
    header: '🎴 Sobre',
    cell: (product) => (
      <div className="flex items-center gap-4">
        <Image src={product.images[0]?.url} ... />
        <div>
          <p>{product.name}</p>
        </div>
      </div>
    )
  },
  // ...
]
```

### 2. StatsCard (Tarjetas de Métricas)

**Ubicación:** `components/ui/stats-card.tsx`

Componentes para mostrar métricas y estadísticas de forma consistente.

#### Componentes:
- `StatsCard`: Tarjeta individual
- `StatsCardGrid`: Grid container para las tarjetas

#### Características:
- 6 colores predefinidos (blue, green, purple, yellow, red, orange)
- Iconos de Lucide React
- Hover effects
- Responsive
- Opción de trends/tendencias

#### Uso:

```tsx
import { StatsCard, StatsCardGrid } from '@/components/ui/stats-card'
import { Package } from 'lucide-react'

// Grid de estadísticas
<StatsCardGrid className="mb-8">
  <StatsCard
    title="Total Productos"
    value={products.length}
    icon={Package}
    iconColor="blue"
    description="Opcional: descripción adicional"
    trend={{                           // (Opcional) Mostrar tendencia
      value: "+12%",
      isPositive: true
    }}
  />
  // ... más tarjetas
</StatsCardGrid>

// Cambiar cantidad de columnas
<StatsCardGrid className="mb-8 md:grid-cols-4">
  {/* 4 columnas en desktop */}
</StatsCardGrid>
```

#### Colores Disponibles:

| Color    | Uso Recomendado                    |
|----------|-----------------------------------|
| `blue`   | Totales generales, información    |
| `green`  | Activos, completados, éxito       |
| `purple` | Características especiales        |
| `yellow` | Advertencias, stock bajo          |
| `red`    | Errores, sin stock, cancelados    |
| `orange` | Pendientes, en proceso            |

### 3. DataFilters (Filtros de Datos)

**Ubicación:** `components/ui/data-filters.tsx`

Componente para filtros consistentes con contador de resultados.

#### Características:
- Múltiples filtros
- Ordenamiento opcional
- Contador de resultados filtrados
- Diseño moderno con iconos

#### Uso:

```tsx
import { DataFilters, FilterConfig } from '@/components/ui/data-filters'

const filters: FilterConfig[] = [
  {
    key: 'expansion',
    label: 'Expansión',
    options: [
      { value: 'id1', label: 'Scarlet & Violet' },
      // ...
    ],
    placeholder: 'Todas las expansiones'
  }
]

<DataFilters
  filters={filters}
  onFilterChange={handleFilterChange}
  filterValues={filterValues}
  totalItems={totalItems}
  filteredItems={filteredItems}
/>
```

## 🎨 Patrones de Diseño

### Headers de Página

Mantén un header consistente con gradiente:

```tsx
<div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 mb-8 text-white">
  <div className="flex items-center justify-between">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-white/20 p-2 rounded-lg">
          <Icon className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold">Título</h1>
      </div>
      <p className="text-blue-100">Descripción</p>
    </div>
    <Button>Acción Principal</Button>
  </div>
</div>
```

### Layout de Página Admin

```tsx
export default function AdminPage() {
  return (
    <div>
      {/* 1. Header con gradiente */}
      <div className="bg-gradient-to-r ...">...</div>
      
      {/* 2. Stats Cards (opcional) */}
      <StatsCardGrid className="mb-8">
        <StatsCard ... />
      </StatsCardGrid>
      
      {/* 3. Filtros (opcional) */}
      <DataFilters ... />
      
      {/* 4. Tabla de datos */}
      <DataTable ... />
    </div>
  )
}
```

## 📝 Ejemplos de Implementación

### Página Server Component

```tsx
// app/(admin)/admin/productos/page.tsx
import { ProductsTable } from '@/components/admin/products-table'

export default async function ProductsPage() {
  const products = await prisma.product.findMany()
  
  return (
    <div>
      <Header />
      <StatsCardGrid>...</StatsCardGrid>
      <ProductsTable products={products} />
    </div>
  )
}
```

### Componente Client (Tabla)

```tsx
// components/admin/products-table.tsx
'use client'

export function ProductsTable({ products }: Props) {
  const columns: ColumnDef<Product>[] = [...]
  
  return <DataTable columns={columns} data={products} ... />
}
```

### Página Client Component (con estado)

```tsx
// app/(admin)/admin/sets/page.tsx
'use client'

export default function SetsPage() {
  const [data, setData] = useState([])
  const [filters, setFilters] = useState({})
  
  return (
    <div>
      <Header />
      <StatsCardGrid>...</StatsCardGrid>
      <DataFilters filters={...} />
      <DataTable data={filteredData} ... />
    </div>
  )
}
```

## 🚀 Mejores Prácticas

### 1. **Separación de Componentes**
   - Server components para fetching de datos
   - Client components separados para tablas interactivas
   - Reutiliza los componentes de tabla entre páginas

### 2. **Type Safety**
   - Define interfaces TypeScript para tus datos
   - Usa `ColumnDef<TuTipo>[]` para type-safe columns
   - Los componentes genéricos te ayudarán a detectar errores

### 3. **Consistencia Visual**
   - Usa siempre `StatsCard` para métricas
   - Usa siempre `DataTable` para tablas
   - Mantén los mismos colores para los mismos conceptos
   - Usa emojis consistentemente en headers de tabla

### 4. **Accesibilidad**
   - Los componentes ya incluyen aria-labels básicos
   - Usa títulos descriptivos
   - Asegura buen contraste de colores

### 5. **Performance**
   - Usa `getRowKey` apropiadamente para evitar re-renders
   - Considera paginación para datasets grandes
   - Memoiza funciones de cell render complejas

## 🔧 Personalización

### Extender DataTable

```tsx
// Si necesitas funcionalidad adicional, extiende el componente base
export function ProductsTableWithActions({ products }: Props) {
  return (
    <DataTable
      columns={columns}
      data={products}
      getRowKey={(p) => p.id}
      className="custom-class" // Agrega clases adicionales
    />
  )
}
```

### Crear Variantes de StatsCard

```tsx
// Puedes crear wrappers especializados
export function ProductStatsCard({ products }: Props) {
  return (
    <StatsCard
      title="Total Productos"
      value={products.length}
      icon={Package}
      iconColor="blue"
    />
  )
}
```

## 📚 Referencias

- **DataTable:** `components/ui/data-table.tsx`
- **StatsCard:** `components/ui/stats-card.tsx`
- **DataFilters:** `components/ui/data-filters.tsx`
- **Ejemplo Sets:** `app/(admin)/admin/sets/page.tsx`
- **Ejemplo Productos:** `components/admin/products-table.tsx`
- **Ejemplo Órdenes:** `components/admin/orders-table.tsx`

## ✅ Checklist para Nuevas Páginas Admin

- [ ] Usa `DataTable` para todas las tablas
- [ ] Usa `StatsCard` para métricas
- [ ] Usa `DataFilters` si necesitas filtros
- [ ] Header con gradiente consistente
- [ ] Emojis en headers de tabla
- [ ] Estado vacío apropiado
- [ ] TypeScript interfaces definidas
- [ ] Separación server/client components cuando corresponda
- [ ] Iconos consistentes (colores semánticos)
- [ ] Responsive design (grid adapta a mobile)

---

**Manteniendo estos estándares, toda la plataforma se verá consistente, moderna y será fácil de mantener.**

