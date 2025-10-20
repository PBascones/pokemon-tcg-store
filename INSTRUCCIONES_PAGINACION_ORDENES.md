# 📝 Instrucciones: Agregar Paginación a Órdenes

## ✅ Ya Hecho (Sets y Productos)

- ✅ Sets: 10 items por página
- ✅ Productos: 10 items por página

## 🎯 Para Hacer: Órdenes

### Paso 1: Actualizar `components/admin/orders-table.tsx`

**Ubicación:** `components/admin/orders-table.tsx`

#### 1.1 Agregar prop al interface (línea ~23)

```tsx
// ANTES:
interface OrdersTableProps {
  orders: Order[]
}

// DESPUÉS:
interface OrdersTableProps {
  orders: Order[]
  itemsPerPage?: number  // 👈 Agregar esta línea
}
```

#### 1.2 Actualizar la función (línea ~49)

```tsx
// ANTES:
export function OrdersTable({ orders }: OrdersTableProps) {

// DESPUÉS:
export function OrdersTable({ orders, itemsPerPage = 30 }: OrdersTableProps) {
//                                      👆 valor por defecto: 30 órdenes por página
```

#### 1.3 Pasar el prop a DataTable (línea ~140)

```tsx
// ANTES:
return (
  <DataTable
    columns={columns}
    data={orders}
    getRowKey={(order) => order.id}
  />
)

// DESPUÉS:
return (
  <DataTable
    columns={columns}
    data={orders}
    getRowKey={(order) => order.id}
    itemsPerPage={itemsPerPage}  // 👈 Agregar esta línea
  />
)
```

### Paso 2: Listo! 🎉

Eso es todo. La paginación ya funcionará automáticamente.

---

## 📋 Código Completo (para copiar/pegar)

### Cambio 1: Interface

```tsx
interface OrdersTableProps {
  orders: Order[]
  itemsPerPage?: number
}
```

### Cambio 2: Función

```tsx
export function OrdersTable({ orders, itemsPerPage = 30 }: OrdersTableProps) {
```

### Cambio 3: DataTable

```tsx
<DataTable
  columns={columns}
  data={orders}
  getRowKey={(order) => order.id}
  itemsPerPage={itemsPerPage}
/>
```

---

## 🎨 Personalización

Si querés cambiar la cantidad de items por página:

```tsx
// En components/admin/orders-table.tsx, línea de la función:

// 20 órdenes por página
export function OrdersTable({ orders, itemsPerPage = 20 }: OrdersTableProps) {

// 50 órdenes por página
export function OrdersTable({ orders, itemsPerPage = 50 }: OrdersTableProps) {
```

O puedes pasarlo desde la página padre:

```tsx
// En app/(admin)/admin/ordenes/page.tsx
<OrdersTable orders={orders} itemsPerPage={25} />
```

---

## ✅ Checklist

- [ ] Abrir `components/admin/orders-table.tsx`
- [ ] Agregar `itemsPerPage?: number` al interface
- [ ] Agregar `, itemsPerPage = 30` a los parámetros de la función
- [ ] Agregar `itemsPerPage={itemsPerPage}` al `<DataTable>`
- [ ] Guardar archivo
- [ ] Verificar en el navegador (refresh)

---

## 🧪 Cómo Verificar que Funciona

1. Abrí http://localhost:3000/admin/ordenes
2. Si tenés más de 30 órdenes, deberías ver controles de paginación al final de la tabla
3. Si tenés menos de 30, no aparecerá paginación (es correcto)
4. Hacé clic en "Siguiente" para cambiar de página

---

## 💡 Por Qué 30 para Órdenes (vs 10 para Sets/Productos)

- **Sets**: Tienen imágenes grandes → 10 por página
- **Productos**: Tienen imágenes → 10 por página  
- **Órdenes**: Solo texto/badges → 30 por página ✅

Las órdenes son más "livianas" visualmente, por eso podemos mostrar más.

---

## 🐛 Si Algo No Funciona

### Error: "Property 'itemsPerPage' does not exist"

✅ Solución: Asegurate de haber agregado el prop al interface:
```tsx
interface OrdersTableProps {
  orders: Order[]
  itemsPerPage?: number  // 👈 Esta línea
}
```

### No aparece la paginación

✅ Es normal si tenés menos de 30 órdenes. Para probar:
```tsx
// Temporalmente cambia a 5 para testing
export function OrdersTable({ orders, itemsPerPage = 5 }: OrdersTableProps) {
```

### La paginación aparece pero no funciona

✅ Verifica que hayas pasado el prop a DataTable:
```tsx
<DataTable
  itemsPerPage={itemsPerPage}  // 👈 Esta línea
  // ... resto
/>
```

---

## 📸 Resultado Esperado

```
┌─────────────────────────────────────────────┐
│  Órdenes (mostrando 1-30)                   │
├─────────────────────────────────────────────┤
│  Orden #1234                                │
│  Orden #1235                                │
│  ...                                        │
│  Orden #1263 (30 filas)                     │
└─────────────────────────────────────────────┘

     [← Anterior]  [1] [2] [3]  [Siguiente →]
```

---

**Tiempo estimado:** 2 minutos ⏱️

**Dificultad:** ⭐ Muy fácil

¡Éxito! 🚀

