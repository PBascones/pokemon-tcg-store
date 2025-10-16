# Optimización de Precios USD/ARS

## 📋 Resumen

Se implementó un sistema optimizado para manejar la conversión de precios USD a ARS sin hacer múltiples fetches a la API externa, mejorando significativamente la performance.

## 🚀 Solución Implementada

### 1. Sistema de Caché Inteligente (`lib/currency-cache.ts`)

- **Caché en memoria** con TTL de 30 minutos
- **Actualización en background** sin bloquear la UI
- **Fallback robusto** en caso de errores de API
- **Funciones síncronas** para evitar async/await en componentes

### 2. Funciones Optimizadas (`lib/utils.ts`)

- `getUSDPriceSync()`: Obtiene precio USD de forma síncrona
- `convertUSDToARS()`: Convierte USD a ARS instantáneamente
- `formatPriceWithBothCurrencies()`: Formatea precios en ambas monedas
- Mantiene compatibilidad con código existente

### 3. API Endpoint (`/api/currency/usd-price`)

- **GET**: Obtiene info del caché y estado
- **POST**: Fuerza actualización (útil para webhooks/cron jobs)

## 💡 Beneficios

### Performance
- ❌ **Antes**: 1 fetch por producto = 100+ requests
- ✅ **Ahora**: 1 fetch cada 30 minutos = ~48 requests/día

### UX Mejorada
- **Precios instantáneos** sin loading states
- **Ambas monedas visibles**: ARS prominente + USD como referencia
- **Actualizaciones automáticas** en background

### Robustez
- **Fallback inteligente** si falla la API
- **Cache persistente** durante la sesión
- **Logs informativos** para debugging

## 🎨 Visualización de Precios

### En Product Cards
```
$45.990 ARS  ← Precio principal
$50 USD      ← Precio de referencia
```

### En Página de Producto
```
$45.990 ARS  $49.990 ARS (tachado si hay descuento)
$50 USD      $55 USD (tachado si hay descuento)
```

## 🔧 Uso en Código

```typescript
// Obtener precio USD actual (síncrono)
const usdPrice = getUSDPriceSync()

// Convertir USD a ARS (síncrono)
const arsPrice = convertUSDToARS(50)

// Formatear ambas monedas
const prices = formatPriceWithBothCurrencies(50)
// { usd: "$50.00", ars: "$45.990", arsAmount: 45990 }
```

## 📊 Monitoreo

### Verificar Estado del Caché
```bash
curl http://localhost:3000/api/currency/usd-price
```

### Forzar Actualización
```bash
curl -X POST http://localhost:3000/api/currency/usd-price
```

## 🔄 Flujo de Actualización

1. **Inicio**: Cache se inicializa con valor fallback
2. **Background**: Fetch automático al importar el módulo
3. **Runtime**: Si cache expira, actualiza en background
4. **Seamless**: Usuario siempre ve precios instantáneos

## 🎯 Próximos Pasos Opcionales

1. **Cron Job**: Configurar actualización programada
2. **Webhook**: Actualizar cuando cambie el dólar oficial
3. **Redis**: Cache distribuido para múltiples instancias
4. **Analytics**: Tracking de conversiones USD/ARS

## 🚨 Notas Importantes

- Los precios en BD siguen siendo **USD** (para admin)
- Los clientes ven **ARS** como precio principal
- El sistema es **backward compatible**
- Cache se reinicia con cada deploy (normal)

## 🧪 Testing

```bash
# Verificar que no hay errores de linting
npm run lint

# Probar en desarrollo
npm run dev

# Verificar precios en:
# - /productos (cards)
# - /productos/[slug] (página individual)
# - /admin/productos (sigue en USD)
```
