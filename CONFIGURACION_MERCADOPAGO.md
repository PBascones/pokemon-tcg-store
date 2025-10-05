# 💳 Guía Completa de Configuración de MercadoPago para Argentina

Esta guía detalla paso a paso cómo configurar MercadoPago para tu tienda de cartas Pokémon.

## 📋 Requisitos Previos

1. **Cuenta de MercadoPago Argentina**
   - Si no tenés, crear en: https://www.mercadopago.com.ar/
   - Completar el proceso de verificación de identidad

2. **CUIT/CUIL**
   - Necesario para recibir pagos
   - Debe estar asociado a tu cuenta de MercadoPago

## 🔑 Paso 1: Obtener Credenciales de Desarrollo (TEST)

### 1.1 Acceder al Panel de Desarrolladores

1. Ir a: https://www.mercadopago.com.ar/developers/
2. Iniciar sesión con tu cuenta de MercadoPago
3. Hacer clic en "Tus integraciones"

### 1.2 Crear una Aplicación

1. Click en "Crear aplicación"
2. Completar:
   - **Nombre:** Poke Addiction (o el nombre de tu tienda)
   - **Descripción:** E-commerce de cartas Pokémon
   - **Tipo:** Marketplace o E-commerce

### 1.3 Obtener Credenciales de TEST

1. En el panel, ir a "Credenciales"
2. Seleccionar **"Credenciales de prueba"**
3. Copiar:
   - **Public Key:** Comienza con `TEST-...`
   - **Access Token:** Comienza con `TEST-...`

### 1.4 Configurar en tu Proyecto

Pegar en el archivo `.env`:

```env
# Credenciales de TEST (para desarrollo)
MERCADOPAGO_ACCESS_TOKEN="TEST-1234567890-123456-xxxxxxxxxxxxxxxx"
MERCADOPAGO_PUBLIC_KEY="TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## 🧪 Paso 2: Probar en Modo TEST

### 2.1 Usuarios de Prueba

MercadoPago crea automáticamente usuarios de prueba. Para verlos:

1. Ir a "Credenciales de prueba"
2. Ver "Cuentas de prueba"
3. Usar estos usuarios para probar pagos:
   - **Vendedor:** Para recibir pagos
   - **Comprador:** Para hacer compras

### 2.2 Tarjetas de Prueba

Usar estas tarjetas para simular pagos:

#### Tarjetas que APRUEBAN el pago:
```
VISA
Número: 4509 9535 6623 3704
CVV: 123
Fecha: 11/25
Nombre: APRO (importante!)

Mastercard
Número: 5031 7557 3453 0604
CVV: 123
Fecha: 11/25
Nombre: APRO
```

#### Tarjetas que RECHAZAN el pago:
```
VISA
Número: 4509 9535 6623 3704
CVV: 123
Fecha: 11/25
Nombre: OTHE (rechazado por otro motivo)
```

Más tarjetas de prueba: https://www.mercadopago.com.ar/developers/es/docs/checkout-api/additional-content/test-cards

### 2.3 Probar el Flujo Completo

1. Agregar productos al carrito en tu tienda
2. Ir a checkout
3. Completar datos de envío
4. Hacer clic en "Pagar con MercadoPago"
5. Usar las tarjetas de prueba
6. Verificar que la orden se crea correctamente

## 🚀 Paso 3: Configurar Webhook (Importante!)

El webhook permite que MercadoPago notifique a tu sistema sobre cambios en los pagos.

### 3.1 En Desarrollo (Local)

Para testing local, usar **ngrok**:

```bash
# Instalar ngrok
brew install ngrok  # en Mac
# o descargar de: https://ngrok.com/

# Exponer tu localhost
ngrok http 3000

# Copiar la URL que te da (ej: https://xxxx.ngrok.io)
```

### 3.2 Configurar el Webhook en MercadoPago

1. Ir a: https://www.mercadopago.com.ar/developers/panel/ipn/ipn-webhooks
2. Click en "Crear webhook"
3. Configurar:
   - **URL:** `https://tu-dominio.com/api/mercadopago/webhook`
     - En desarrollo con ngrok: `https://xxxx.ngrok.io/api/mercadopago/webhook`
   - **Eventos:** Seleccionar "Pagos"
   - **Tipo:** "Webhook"

### 3.3 Verificar el Webhook

1. Hacer un pago de prueba
2. Verificar en los logs del servidor que llegue la notificación
3. En el panel de MercadoPago, ver "Historial de notificaciones"

## 🔐 Paso 4: Configuración para PRODUCCIÓN

⚠️ **IMPORTANTE:** Solo hacer esto cuando estés listo para recibir pagos reales.

### 4.1 Requisitos

1. **Cuenta verificada:** Completar verificación de identidad en MercadoPago
2. **CUIT/CUIL:** Asociado y validado
3. **Dominio propio:** No usar localhost
4. **SSL (HTTPS):** Obligatorio para pagos reales

### 4.2 Obtener Credenciales de PRODUCCIÓN

1. Ir a "Credenciales"
2. Seleccionar **"Credenciales de producción"**
3. Copiar:
   - **Public Key:** NO comienza con TEST
   - **Access Token:** NO comienza con TEST

### 4.3 Actualizar .env en Producción

```env
# Credenciales de PRODUCCIÓN
MERCADOPAGO_ACCESS_TOKEN="APP_USR-1234567890-123456-xxxxxxxxxxxxxxxx"
MERCADOPAGO_PUBLIC_KEY="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 4.4 Actualizar Webhook URL

Cambiar la URL del webhook a tu dominio real:
```
https://tu-tienda.com/api/mercadopago/webhook
```

## 💰 Comisiones de MercadoPago

### Argentina (2024)

- **Tarjeta de crédito:** ~4.99% + IVA
- **Tarjeta de débito:** ~3.49% + IVA
- **Transferencia bancaria:** ~1.5% + IVA
- **MercadoPago (saldo en cuenta):** ~2.9% + IVA

**Nota:** Las comisiones pueden variar. Verificar en: https://www.mercadopago.com.ar/costs-section/

## 📊 Monitoreo y Gestión

### Panel de MercadoPago

Desde el panel podés:
- Ver todas las transacciones
- Descargar reportes
- Gestionar reembolsos
- Ver disputas

### En tu Dashboard Admin

Tu panel de admin mostrará:
- Estado de cada pago
- Órdenes pendientes de confirmación
- Historial completo

## 🔧 Configuraciones Adicionales

### Personalizar la Experiencia de Pago

En `lib/mercadopago.ts` podés configurar:

```typescript
const preferenceData = {
  // ... otros campos
  statement_descriptor: "POKESTORE", // Aparece en el resumen de tarjeta
  binary_mode: true, // Solo aprobar o rechazar (sin pendientes)
  expires: true,
  expiration_date_from: new Date(),
  expiration_date_to: new Date(Date.now() + 1000 * 60 * 60), // Expira en 1 hora
}
```

### Métodos de Pago Específicos

Podés limitar los métodos de pago:

```typescript
payment_methods: {
  excluded_payment_methods: [
    { id: "amex" } // Excluir American Express
  ],
  excluded_payment_types: [
    { id: "ticket" } // Excluir Rapipago/Pago Fácil
  ],
  installments: 12 // Máximo de cuotas
}
```

## 🐛 Solución de Problemas Comunes

### Error: "Invalid access token"
- Verificar que el token esté bien copiado (sin espacios)
- Verificar que sea el token correcto (TEST para dev, producción para prod)

### Webhook no recibe notificaciones
- Verificar que la URL sea accesible desde internet (no localhost)
- Verificar que la URL tenga HTTPS (obligatorio en producción)
- Ver logs en el panel de MercadoPago

### Pago aprobado pero orden no se actualiza
- Verificar que el webhook esté configurado
- Ver logs del servidor
- Verificar que el `external_reference` coincida con el ID de la orden

### Error: "Currency not supported"
- Asegurate de usar "ARS" para Argentina
- Verificar que los precios estén en pesos argentinos

## 📱 Opciones Adicionales

### MercadoPago Point

Si querés vender también presencialmente:
- Solicitar un Point (dispositivo lector de tarjetas)
- Integrar con la app de MercadoPago Point

### QR Codes

Para pagos en persona:
- Generar QR codes desde el panel
- Los clientes escanean y pagan con la app

## 📚 Documentación Oficial

- **API Reference:** https://www.mercadopago.com.ar/developers/es/reference
- **Checkout API:** https://www.mercadopago.com.ar/developers/es/docs/checkout-api/landing
- **Webhooks:** https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
- **Tarjetas de prueba:** https://www.mercadopago.com.ar/developers/es/docs/checkout-api/additional-content/test-cards

## ✅ Checklist Final antes de Producción

- [ ] Cuenta de MercadoPago verificada
- [ ] CUIT/CUIL asociado
- [ ] Credenciales de producción configuradas
- [ ] Webhook configurado con HTTPS
- [ ] Probado flujo completo de pago
- [ ] Probado webhook de notificaciones
- [ ] Configurado backup de base de datos
- [ ] Configurado SSL/HTTPS en el sitio
- [ ] Revisado comisiones y costos
- [ ] Configurado sistema de facturación

---

¡Todo listo para recibir pagos! 💳✨
