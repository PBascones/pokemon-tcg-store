# 📦 Cambios: De Cartas Individuales a Sobres (Booster Packs)

## ✅ Cambios Completados

### 1. **Wordings y Textos**
- **Navbar:** "Buscar cartas" → "Buscar sobres"
- **Footer:** "cartas Pokémon" → "sobres Pokémon"
- **Hero (Homepage):** "Coleccioná las mejores cartas" → "Los mejores Sobres Pokémon de Argentina"
- **Metadata (SEO):** Actualizado title y description para "sobres" en lugar de "cartas"
- **CTA Section:** Cambio de "¿Tenés cartas para vender?" a "¿Buscás sobres de sets antiguos?"

### 2. **Categorías**
Cambiadas de tipos de cartas (Base, EX, GX, V, VMAX) a **Sets/Expansiones**:
- Scarlet & Violet
- Sword & Shield
- Sun & Moon
- XY Series
- Black & White
- Sets Especiales

### 3. **Productos en Seed**
Creados **16 sobres realistas** con precios en ARS:

#### Scarlet & Violet Series
- Scarlet & Violet Base Set - Booster Pack ($5,500)
- Paldea Evolved - Booster Pack ($6,000)
- Obsidian Flames - Booster Pack ($5,800)
- Paradox Rift - Booster Pack ($6,200)

#### Sword & Shield Series
- Evolving Skies - Booster Pack ($8,500) ⭐ MÁS POPULAR
- Lost Origin - Booster Pack ($6,500)
- Brilliant Stars - Booster Pack ($7,000)
- Fusion Strike - Booster Pack ($5,200)
- Chilling Reign - Booster Pack ($5,500)

#### Sun & Moon Series
- Cosmic Eclipse - Booster Pack ($9,000)
- Hidden Fates - Booster Pack ($12,000) ⭐ MUY BUSCADO
- Team Up - Booster Pack ($7,500)

#### Sets Especiales
- Crown Zenith - Booster Pack ($7,800)
- Shining Fates - Booster Pack ($10,000)

#### XY Series (Vintage)
- XY Evolutions - Booster Pack ($8,000)

### 4. **Página de Detalle del Producto**
Campos actualizados para sobres:
- ✅ Set/Expansión
- ✅ Idioma
- ✅ Tipo: "Booster Pack (Sobre)"
- ✅ Estado: "Sellado de fábrica"

Campos **removidos** (específicos de cartas individuales):
- ❌ Número de Carta
- ❌ Rareza
- ❌ Condición
- ❌ Grado (PSA/CGC)

---

## 🚀 Próximos Pasos para Aplicar los Cambios

### 1. Configurar Base de Datos (si no lo hiciste ya)

Si ya tenés Supabase configurado, asegurate que tu archivo `.env` tenga:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.tjrrxslvcjvzihpmvidy.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.tjrrxslvcjvzihpmvidy.supabase.co:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui"
MERCADOPAGO_ACCESS_TOKEN="tu-token-de-mercadopago"
```

Si **NO** tenés base de datos configurada, seguí: `CONFIGURAR_SUPABASE.md`

### 2. Limpiar y Cargar Nuevos Datos

Una vez que tu base de datos esté configurada y accesible:

```bash
# Opción 1: Reset completo (borra todo y recrea)
npm run db:push
npm run db:seed

# Opción 2: Si ya tenés datos, solo actualizar estructura
npm run db:push
# Luego borrar productos manualmente desde Prisma Studio y correr:
npm run db:seed
```

### 3. Verificar los Datos

```bash
# Abrir Prisma Studio para ver los datos
npm run db:studio
```

Deberías ver:
- **6 categorías** (Scarlet & Violet, Sword & Shield, etc.)
- **16 productos** (sobres)
- **2 usuarios** (admin@pokestore.com y cliente@test.com)

### 4. Probar la Aplicación

```bash
npm run dev
```

Visitá:
- **Home:** http://localhost:3000 → Ver hero con "Los mejores Sobres Pokémon"
- **Productos:** http://localhost:3000/productos → Ver sobres con nuevas categorías
- **Detalle:** Click en un sobre → Ver detalles actualizados (Set, Idioma, Estado)

---

## 📝 Notas Importantes

### Para tu Amigo (Alta de Stock)

Ahora que venden **sobres en lugar de cartas individuales**, el proceso de carga de productos es **mucho más simple**:

**Datos necesarios por producto:**
1. **Nombre del sobre** (ej: "Scarlet & Violet Base Set - Booster Pack")
2. **Set/Expansión** (ej: "Scarlet & Violet Base")
3. **Idioma** (Inglés/Español/Japonés)
4. **Precio** (en ARS)
5. **Stock** (cantidad de sobres disponibles)
6. **Imagen** (foto del sobre)
7. **Descripción** (opcional, ej: "Sobre con 10 cartas, posibilidad de cartas ex")

**NO necesitan:**
- Número de carta
- Rareza
- Condición
- Grado (PSA/CGC)

### Schema de Base de Datos

El schema actual (`prisma/schema.prisma`) **NO necesita cambios**. El modelo `Product` es genérico y sirve tanto para cartas como para sobres. Los campos específicos de cartas (cardNumber, rarity, condition, etc.) simplemente quedarán en `null` para sobres.

Si en el futuro quieren vender cartas individuales, solo tienen que:
1. Crear una categoría "Cartas Individuales"
2. Completar los campos opcionales (cardNumber, rarity, condition)

---

## 🎯 Resumen de Archivos Modificados

### Componentes UI
- ✅ `components/store/navbar.tsx`
- ✅ `components/store/footer.tsx`

### Páginas
- ✅ `app/(store)/page.tsx` (Homepage/Hero)
- ✅ `app/(store)/productos/[slug]/page.tsx` (Detalle del producto)
- ✅ `app/layout.tsx` (Metadata SEO)

### Base de Datos
- ✅ `prisma/seed.ts` (Nuevas categorías y productos de sobres)

### Documentación
- ✅ Este archivo (`CAMBIOS_SOBRES.md`)

---

## ❓ FAQs

### ¿Puedo volver a vender cartas individuales después?
**Sí**, el schema sigue soportando ambos. Solo tenés que:
1. Crear productos con los campos opcionales llenos (cardNumber, rarity, etc.)
2. Actualizar la página de detalle para mostrar esos campos condicionalmente

### ¿Qué pasa con los datos viejos de cartas?
Los datos viejos se borrarán cuando corras `npm run db:seed` (si la DB está vacía) o podés borrarlos manualmente desde Prisma Studio.

### ¿Necesito cambiar algo en el admin?
**No**, el panel admin funciona genéricamente con "productos". Tu amigo podrá cargar sobres como productos normales.

---

## 🎉 Listo!

Con estos cambios, tu tienda está **100% optimizada para vender sobres**. El flujo es:

1. Tu amigo carga sobres desde el admin (nombre, precio, stock, imagen)
2. Los clientes navegan por sets/expansiones
3. Agregan sobres al carrito
4. Pagan con MercadoPago
5. Tu amigo ve la orden y envía los sobres

**Mucho más simple que gestionar cartas individuales** 🚀

