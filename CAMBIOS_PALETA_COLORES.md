# 🎨 Cambios de Paleta de Colores - Poke Addiction

## ✅ Paleta Actualizada

Se actualizó toda la paleta de colores para alinearla con el branding de "Poke Addiction".

### Colores Anteriores vs Nuevos:

| Elemento | Antes | Ahora |
|----------|-------|-------|
| **Color Primario** | Azul (#3B82F6) | Naranja (#F25430) |
| **Hover Primario** | Azul Oscuro (#2563EB) | Naranja Oscuro (#D94722) |
| **Secundario** | Gris (#6B7280) | Gris Oscuro (#1F2937) |
| **Acento** | Púrpura (#A855F7) | Naranja Claro (#FF8B6D) |

---

## 📝 Escala de Colores Completa

### Primary (Naranja - Del Logo)
```css
primary-50:  #FFF3F0  /* Naranja muy claro */
primary-100: #FFE5DE  /* Naranja claro */
primary-200: #FFCFC2  /* Naranja suave */
primary-300: #FFB09B  /* Naranja medio claro */
primary-400: #FF8B6D  /* Naranja medio */
primary-500: #F25430  /* Naranja principal (del logo) */
primary-600: #D94722  /* Naranja oscuro */
primary-700: #B8381B  /* Naranja muy oscuro */
primary-800: #8F2C15  /* Naranja profundo */
primary-900: #6B2110  /* Naranja casi negro */
```

### Secondary (Gris)
```css
secondary-50:  #F9FAFB
secondary-100: #F3F4F6
secondary-200: #E5E7EB
secondary-300: #D1D5DB
secondary-400: #9CA3AF
secondary-500: #6B7280
secondary-600: #4B5563
secondary-700: #374151
secondary-800: #1F2937  /* Principal */
secondary-900: #111827
```

---

## 🔄 Cambios Aplicados

### 1. Componentes UI Base
- ✅ **Button** - Naranja como color por defecto
- ✅ **Badge** - Naranja en lugar de azul
- ✅ **Input** - Focus ring naranja
- ✅ **Card** - Sin cambios (neutral)

### 2. Navbar
- ✅ Logo de "Poke Addiction" agregado
- ✅ Links hover: naranja
- ✅ Búsqueda focus: naranja
- ✅ Active states: naranja

### 3. Homepage
- ✅ Hero section: gradiente naranja
- ✅ Icons de features: naranja
- ✅ CTA section: gradiente naranja oscuro
- ✅ Badges: naranja

### 4. Productos
- ✅ Precio: naranja
- ✅ Hover en cards: naranja
- ✅ Botones: naranja
- ✅ Filtros activos: naranja

### 5. Carrito
- ✅ Totales: naranja
- ✅ Links: naranja
- ✅ Botones: naranja

### 6. Checkout
- ✅ Total price: naranja
- ✅ Botón de pago: naranja
- ✅ Focus states: naranja

### 7. Auth Pages
- ✅ Links: naranja
- ✅ Botones: naranja
- ✅ Focus states: naranja

### 8. Admin Panel
- ✅ Stats cards (mantiene colores propios)
- ✅ Botones: naranja
- ✅ Links: naranja

---

## 🎯 Uso de Colores

### Cuándo usar cada color:

**primary-500 (Naranja Principal)**
- Botones primarios
- Precios destacados
- Badges importantes
- CTAs principales

**primary-600 (Naranja Hover)**
- Estados hover de botones
- Links hover
- Estados activos

**primary-50/100 (Naranja Claro)**
- Fondos de hover suaves
- Highlights
- Backgrounds de features

**secondary-800/900 (Gris Oscuro)**
- Textos principales
- Sidebar admin
- Footer

**Mantener colores existentes:**
- ✅ Verde para success (#10b981)
- ✅ Rojo para destructive/error (#DC2626)
- ✅ Amarillo para warnings (#EAB308)

---

## 🔧 Implementación Técnica

Los colores están definidos en:
```css
/* app/globals.css */
:root {
  --primary: #F25430;
  --primary-hover: #D94722;
  --primary-light: #FF6B47;
  --secondary: #1F2937;
  --accent: #FF8B6D;
}

@theme inline {
  --color-primary-*: initial;
  --color-primary-50: #FFF3F0;
  /* ... resto de la escala */
}
```

Y se usan con clases de Tailwind:
```tsx
className="bg-primary-500 text-white hover:bg-primary-600"
className="text-primary-600 hover:text-primary-700"
className="border-primary-500 focus:ring-primary-500"
```

---

## 📊 Antes y Después

### Antes (Azul)
- Botones azules (#3B82F6)
- Links azules
- Hero azul/púrpura
- Sin coherencia con el logo

### Después (Naranja)
- Botones naranjas (#F25430)
- Links naranjas
- Hero naranja (del logo)
- **100% alineado con el branding**

---

## ✨ Beneficios

1. **Coherencia Visual** - Todo el sitio refleja el logo
2. **Identidad Fuerte** - Los usuarios reconocen "Poke Addiction"
3. **Diferenciación** - Naranja destaca vs competidores con azul
4. **Energía** - Colores cálidos transmiten pasión y emoción
5. **Profesional** - Paleta bien definida y consistente

---

## 🎨 Ejemplos de Uso

### Botón Primario
```tsx
<Button>Agregar al Carrito</Button>
// bg-primary-500 hover:bg-primary-600
```

### Link
```tsx
<Link className="text-primary-600 hover:text-primary-700">
  Ver más
</Link>
```

### Badge
```tsx
<Badge>Destacado</Badge>
// bg-primary-500 text-white
```

### Input Focus
```tsx
<Input />
// focus:ring-primary-500 focus:border-primary-500
```

---

## 🚀 Próximos Pasos (Opcional)

Si querés llevar el branding aún más lejos:

1. **Micro-animaciones** con los colores naranjas
2. **Gradientes personalizados** en más secciones
3. **Iconografía** con el tono naranja
4. **Ilustraciones** que usen la paleta
5. **Emails** con el mismo esquema de colores

---

**Actualizado:** Octubre 2025
**Paleta basada en:** Logo de Poke Addiction (@pokeaddictionok)
