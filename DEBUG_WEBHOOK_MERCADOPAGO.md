# 🔧 Guía de Debugging del Webhook de Mercado Pago

## 🚨 Problema: El webhook no actualiza la orden ni baja stock

### ✅ Checklist de Verificación

#### 1. **¿Estás en localhost?**
- [ ] Si estás en `http://localhost:3000`, Mercado Pago **NO puede enviarte notificaciones**
- [ ] Solución: Usar **ngrok** o **localtunnel** para exponer tu localhost

```bash
# Instalar ngrok
npm install -g ngrok

# Exponer puerto 3000
ngrok http 3000

# Te dará una URL como: https://abc123.ngrok.io
# Usá esa URL en tu .env como NEXT_PUBLIC_APP_URL
```

#### 2. **Verificar credenciales de TEST**
- [ ] Tu `MERCADOPAGO_ACCESS_TOKEN` debe empezar con `TEST-`
- [ ] Si empieza con `APP_USR-` estás en modo producción

```bash
# En tu .env
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-XXXXXX-XXXXXXXXX
NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io  # O tu dominio real
```

#### 3. **Verificar la URL del webhook en Mercado Pago**
- [ ] Andá a: https://www.mercadopago.com.ar/developers/panel/app
- [ ] Seleccioná tu aplicación
- [ ] Andá a "Webhooks" o "Notificaciones"
- [ ] Verificá que la URL sea: `https://tu-dominio.com/api/mercadopago/webhook`

#### 4. **Revisar logs del servidor**
Con los nuevos logs agregados, deberías ver algo como:

```
🔔 WEBHOOK RECIBIDO - Inicio
📦 Body completo: { ... }
🔗 Query params: { ... }
🔍 Type: payment | Action: payment.updated | PaymentID: 1234567890
💳 Obteniendo info del pago: 1234567890
💰 Payment info: { ... }
🔄 Mapeando status: approved → { paymentStatus: 'PAID', orderStatus: 'PROCESSING' }
📝 Actualizando orden: cmhckbxv6000psyv5wjmigjsj
✅ Orden actualizada exitosamente
✅ WEBHOOK PROCESADO CORRECTAMENTE
```

Si **NO ves estos logs**, el webhook **NO está siendo llamado**.

---

## 🧪 Cómo Testear el Webhook Manualmente

### Opción 1: Usar el script de prueba

```bash
# Testear con un payment ID de prueba
node test-webhook.js 1234567890
```

### Opción 2: Usar curl

```bash
curl -X POST http://localhost:3000/api/mercadopago/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "action": "payment.updated",
    "data": { "id": "1234567890" },
    "type": "payment"
  }'
```

### Opción 3: Simular webhook desde Mercado Pago

1. Andá a: https://www.mercadopago.com.ar/developers/panel/app
2. Seleccioná tu aplicación
3. Andá a "Webhooks" → "Simulador de notificaciones"
4. Enviá una notificación de prueba

---

## 🔍 Diagnóstico de Problemas Comunes

### Problema 1: "No veo logs del webhook"
**Causa:** Mercado Pago no está llamando a tu webhook

**Soluciones:**
1. Verificá que estés usando ngrok o un dominio público
2. Verificá que la URL del webhook esté bien configurada en MP
3. Verificá que tu servidor esté corriendo

### Problema 2: "Veo logs pero dice 'No payment id'"
**Causa:** El formato del payload no es el esperado

**Solución:**
- Revisá el log `📦 Body completo:` para ver qué está enviando MP
- Puede ser que MP esté enviando el ID en otro campo

### Problema 3: "Dice 'Order not found'"
**Causa:** El `external_reference` no coincide con ninguna orden

**Solución:**
- Verificá que al crear la preferencia estés enviando el `external_reference` correcto
- Revisá en la base de datos si existe una orden con ese ID

### Problema 4: "Todo parece OK pero no se actualiza"
**Causa:** Puede haber un error en la transacción de base de datos

**Solución:**
- Revisá los logs completos del servidor
- Verificá que la base de datos esté accesible
- Revisá que el usuario de la DB tenga permisos de escritura

---

## 🎯 Flujo Esperado

1. Usuario completa el pago en Mercado Pago
2. MP envía notificación POST a tu webhook
3. Tu webhook recibe la notificación
4. Obtiene info del pago desde MP API
5. Busca la orden por `external_reference`
6. Mapea el status de MP a tus estados internos
7. Actualiza la orden en la DB
8. Si el pago fue aprobado → reduce stock
9. Responde 200 OK a MP

---

## 📊 Estados de Mercado Pago

| Estado MP | Tu PaymentStatus | Tu OrderStatus | ¿Baja Stock? |
|-----------|------------------|----------------|--------------|
| `approved` | `PAID` | `PROCESSING` | ✅ Sí |
| `pending` | `PENDING` | `PENDING` | ❌ No |
| `in_process` | `PENDING` | `PENDING` | ❌ No |
| `rejected` | `FAILED` | `CANCELLED` | ❌ No |
| `cancelled` | `FAILED` | `CANCELLED` | ❌ No |
| `refunded` | `REFUNDED` | `CANCELLED` | ✅ Restaura |

---

## 🆘 Si Nada Funciona

1. **Reiniciá tu servidor Next.js**
   ```bash
   # Ctrl+C para detener
   npm run dev
   ```

2. **Verificá que la orden exista en la DB**
   ```bash
   # Abrí Prisma Studio
   npx prisma studio
   ```

3. **Testeá el webhook manualmente**
   ```bash
   node test-webhook.js <payment-id-real>
   ```

4. **Revisá los logs de Mercado Pago**
   - Andá a: https://www.mercadopago.com.ar/developers/panel/app
   - Seleccioná tu app → "Webhooks" → "Historial"
   - Ahí verás si MP está intentando llamar a tu webhook y qué respuestas está recibiendo

---

## 📝 Notas Importantes

- **Mercado Pago reintenta** enviar el webhook hasta 12 veces si no recibe 200 OK
- **Siempre respondé 200 OK** rápido, incluso si hay error (para evitar reintentos)
- **El webhook puede llegar ANTES** que el usuario vuelva a tu sitio
- **En TEST mode** los webhooks pueden tardar más en llegar
- **Guardá los logs** de cada webhook para debugging

---

## 🔗 Links Útiles

- [Panel de Desarrolladores MP](https://www.mercadopago.com.ar/developers/panel/app)
- [Documentación Webhooks](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/payment-notifications)
- [Tarjetas de Prueba](https://www.mercadopago.com.ar/developers/es/docs/checkout-api/additional-content/your-integrations/test/cards)
- [ngrok](https://ngrok.com/)

