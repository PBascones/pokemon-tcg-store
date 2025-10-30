# 📊 Guía de Logs en Vercel para Webhook de Mercado Pago

## 🎯 Cómo Ver Logs en Vercel

### Método 1: Dashboard Web (Más Fácil)

1. **Andá a tu proyecto en Vercel:**
   ```
   https://vercel.com/dashboard
   ```

2. **Seleccioná tu proyecto** (pokemon-store)

3. **Andá a la pestaña "Logs":**
   - Opción A: Click en **"Logs"** en el menú superior
   - Opción B: Click en **"Deployments"** → Seleccioná el deployment actual → **"Functions"** tab

4. **Filtrá por función:**
   - En el buscador, escribí: `/api/mercadopago/webhook`
   - O filtrá por "Error" para ver solo errores

5. **Logs en tiempo real:**
   - Los logs se actualizan automáticamente
   - Podés ver los últimos 100 logs

### Método 2: CLI de Vercel (Tiempo Real)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Loguearte (si no lo hiciste)
vercel login

# Ver logs en tiempo real
vercel logs --follow

# Ver logs de las últimas 24 horas
vercel logs --since 24h

# Ver solo errores
vercel logs --output error
```

### Método 3: Logs por Deployment

1. Andá a: https://vercel.com/[tu-usuario]/pokemon-store/deployments
2. Click en el deployment actual (el primero de la lista)
3. Click en **"Functions"**
4. Buscá la función: `api/mercadopago/webhook.func`
5. Click en ella para ver logs específicos

---

## 📋 Formato de Logs Estructurados

Con los cambios que hice, tus logs ahora son **JSON estructurado** y se ven así en Vercel:

```json
{
  "timestamp": "2025-01-30T15:30:45.123Z",
  "level": "info",
  "message": "🔔 WEBHOOK RECIBIDO - Inicio",
  "data": {
    "url": "https://tu-dominio.com/api/mercadopago/webhook"
  }
}
```

Esto hace que sea **MUY fácil filtrar y buscar** en Vercel.

---

## 🔍 Qué Buscar en los Logs

### ✅ Flujo Exitoso (lo que DEBERÍAS ver):

```json
// 1. Webhook recibido
{"level":"info","message":"🔔 WEBHOOK RECIBIDO - Inicio"}

// 2. Payload parseado
{"level":"info","message":"📦 Payload recibido","data":{"body":{...}}}

// 3. Datos extraídos
{"level":"info","message":"🔍 Datos extraídos","data":{"type":"payment","paymentId":"123"}}

// 4. Info del pago obtenida
{"level":"info","message":"💰 Payment info obtenida","data":{"status":"approved"}}

// 5. Orden encontrada
{"level":"info","message":"📦 Orden encontrada","data":{"orderId":"abc123"}}

// 6. Status mapeado
{"level":"info","message":"🔄 Mapeando status","data":{"mpStatus":"approved","paymentStatus":"PAID"}}

// 7. Orden actualizada
{"level":"info","message":"✅ Orden actualizada exitosamente","data":{"durationMs":234}}

// 8. Webhook completado
{"level":"info","message":"✅ WEBHOOK PROCESADO CORRECTAMENTE","data":{"durationMs":250}}
```

### ❌ Errores Comunes:

#### Error 1: No llega el webhook
```
No hay logs en absoluto
```
**Causa:** Mercado Pago no está enviando notificaciones
**Solución:** Verificar URL del webhook en MP

#### Error 2: No payment id
```json
{"level":"error","message":"❌ No payment id in webhook payload"}
```
**Causa:** El formato del payload no es el esperado
**Solución:** Revisar el payload completo en logs anteriores

#### Error 3: Order not found
```json
{"level":"error","message":"Order not found","data":{"externalReference":"xyz"}}
```
**Causa:** El external_reference no coincide con ninguna orden
**Solución:** Verificar que la orden existe en la DB

#### Error 4: Error general
```json
{"level":"error","message":"❌ Webhook error","data":{"error":"..."}}
```
**Causa:** Puede ser error de DB, timeout, etc.
**Solución:** Revisar el stack trace en `data.stack`

---

## 🔎 Filtros Útiles en Vercel

### Buscar por nivel de log:
- `level:error` - Solo errores
- `level:info` - Solo info
- `level:warn` - Solo warnings

### Buscar por mensaje:
- `WEBHOOK RECIBIDO` - Ver todas las llamadas al webhook
- `Orden actualizada exitosamente` - Ver actualizaciones exitosas
- `Order not found` - Ver órdenes no encontradas

### Buscar por orden específica:
- `orderId:abc123` - Ver todos los logs de una orden
- `orderNumber:1234` - Ver logs por número de orden

### Buscar por payment ID:
- `paymentId:123456` - Ver logs de un pago específico

---

## 📊 Monitoreo en Tiempo Real

### Durante una compra de prueba:

1. **Abrí los logs en Vercel:**
   ```
   https://vercel.com/[tu-usuario]/pokemon-store/logs
   ```

2. **Activá "Auto-refresh"** (botón arriba a la derecha)

3. **Hacé una compra de prueba en tu sitio**

4. **Mirá los logs aparecer en tiempo real:**
   - Deberías ver el flujo completo en ~1-2 segundos
   - Si no ves nada después de 30 segundos, hay un problema

---

## 🚨 Troubleshooting

### Problema: "No veo logs del webhook"

**Verificá:**
1. ¿El webhook está configurado en MP?
   - Andá a: https://www.mercadopago.com.ar/developers/panel/app
   - Tu app → Webhooks → Verificá la URL

2. ¿La URL es correcta?
   - Debe ser: `https://tu-dominio.vercel.app/api/mercadopago/webhook`
   - NO debe tener espacios ni caracteres raros

3. ¿MP está enviando notificaciones?
   - En el panel de MP → Webhooks → Historial
   - Ahí verás si MP está intentando llamar y qué respuestas recibe

### Problema: "Veo el webhook pero no se actualiza la orden"

**Buscá en los logs:**
1. ¿Dice "Order not found"?
   → La orden no existe o el external_reference es incorrecto

2. ¿Dice "No payment status"?
   → El pago no tiene status (raro, pero puede pasar)

3. ¿Hay un error de DB?
   → Puede ser timeout o problema de conexión

### Problema: "Los logs son difíciles de leer"

**Usá el CLI con jq:**
```bash
# Instalar jq (para formatear JSON)
brew install jq  # Mac
# o
sudo apt install jq  # Linux

# Ver logs formateados
vercel logs --follow | jq '.'
```

---

## 📈 Métricas Importantes

En los logs, ahora tenés `durationMs` que te dice cuánto tardó cada operación:

- **< 500ms**: Excelente ✅
- **500ms - 2s**: Bueno 👍
- **2s - 5s**: Lento ⚠️
- **> 5s**: Muy lento, puede timeout ❌

Si ves tiempos altos, puede ser:
- Query de DB lenta
- Timeout de MP API
- Cold start de Vercel (primera llamada)

---

## 🔗 Links Útiles

- **Tu proyecto en Vercel:** https://vercel.com/dashboard
- **Logs en tiempo real:** https://vercel.com/[tu-usuario]/pokemon-store/logs
- **Functions:** https://vercel.com/[tu-usuario]/pokemon-store/functions
- **Panel MP:** https://www.mercadopago.com.ar/developers/panel/app
- **Historial Webhooks MP:** Panel MP → Tu app → Webhooks → Historial

---

## 💡 Tips Pro

1. **Guardá los logs importantes:**
   - Vercel solo guarda logs por 24-48 horas
   - Para logs permanentes, considerá usar Datadog o Sentry

2. **Monitoreá el "Historial de Webhooks" en MP:**
   - Te muestra si MP está intentando llamar
   - Te muestra qué respuestas está recibiendo
   - Te muestra cuántos reintentos hizo

3. **Testeá con el simulador de MP:**
   - Panel MP → Webhooks → Simulador
   - Podés enviar notificaciones de prueba sin hacer un pago real

4. **Usá Vercel Analytics:**
   - Te muestra cuántas veces se llamó la función
   - Tiempo promedio de respuesta
   - Tasa de errores

---

## 🎯 Checklist de Debugging

- [ ] Logs en Vercel muestran "WEBHOOK RECIBIDO"
- [ ] Logs muestran el payload completo
- [ ] Logs muestran "Payment info obtenida"
- [ ] Logs muestran "Orden encontrada"
- [ ] Logs muestran "Orden actualizada exitosamente"
- [ ] En MP Panel → Webhooks → Historial muestra respuestas 200
- [ ] La orden en la DB tiene el status correcto
- [ ] El stock se redujo correctamente

Si todos estos puntos están ✅, tu webhook está funcionando perfecto!

