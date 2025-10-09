# 💰 Costos, Mantenimiento y Pricing del Proyecto

## 📊 1. Desglose de Costos Custom (5 años)

### Año 1

```
HOSTING - Vercel Pro
├─ Costo: USD $20/mes
├─ Total anual: USD $240
├─ En ARS (al ~$1,250): ~ARS $300,000
└─ Incluye:
    ├─ Unlimited deployments
    ├─ 100GB bandwidth/mes
    ├─ DDoS protection
    ├─ SSL automático
    ├─ Edge Functions
    └─ Analytics

BASE DE DATOS - Supabase Pro
├─ Costo: USD $25/mes
├─ Total anual: USD $300
├─ En ARS (al ~$1,250): ~ARS $375,000
└─ Incluye:
    ├─ 8GB database
    ├─ 100GB storage
    ├─ 250GB bandwidth
    ├─ Backups diarios automáticos
    ├─ Point-in-time recovery
    └─ 99.9% uptime SLA

DOMINIO
├─ Opción A: .com.ar (recomendado)
│   └─ ~ARS $5,000/año
├─ Opción B: .com
│   └─ ~USD $12/año = ~ARS $15,000
└─ Elegimos: .com.ar = ARS $5,000

TOTAL AÑO 1: ~ARS $680,000
```

### Años 2-5

```
Mismo costo anual: ~ARS $680,000/año

Consideraciones:
├─ Tipo de cambio puede variar
├─ Precios pueden ajustarse (históricamente poco)
└─ Estimación conservadora: +10% anual

Año 2: $680,000 × 1.1 = $748,000
Año 3: $748,000 × 1.1 = $822,800
Año 4: $822,800 × 1.1 = $905,080
Año 5: $905,080 × 1.1 = $995,588

TOTAL 5 AÑOS: ~ARS $3,831,468
```

**Redondeado: ~ARS $3.4M - $3.8M**

---

### Alternativas para Ahorrar Más

#### Opción Budget (Año 1 más barato)

```
HOSTING - Vercel Hobby (GRATIS)
├─ Límites:
│   ├─ 100GB bandwidth/mes (suficiente para empezar)
│   ├─ Sin analytics avanzado
│   └─ Solo 1 usuario
└─ Costo: $0

BASE DE DATOS - Supabase Free
├─ Límites:
│   ├─ 500MB database (suficiente para empezar)
│   ├─ 1GB storage
│   ├─ 2GB bandwidth
│   └─ Backups cada 7 días
└─ Costo: $0

DOMINIO
└─ .com.ar: ARS $5,000

TOTAL AÑO 1 (Budget): ~ARS $5,000 (!!)
```

**Recomendación:**
- Empezar con FREE para testear
- Upgradeár a Pro cuando superes límites o vendas más
- Probablemente en 2-3 meses ya necesites Pro

---

#### Opción Media (Recomendada para empezar)

```
HOSTING - Vercel Hobby (GRATIS)
└─ $0

BASE DE DATOS - Supabase Pro
└─ USD $25/mes = ~ARS $375,000/año

DOMINIO
└─ .com.ar: ARS $5,000

TOTAL AÑO 1 (Media): ~ARS $380,000
```

**Esta es la que yo recomendaría inicialmente.**

Cuando el negocio crezca (más tráfico, más ventas), upgradeás Vercel a Pro.

---

## 🔧 2. Mantenimiento Requerido - Detallado

### Mantenimiento Mensual (2-4 horas)

#### Cada Mes (1 hora)

```typescript
// 1. Revisar y actualizar dependencias
// Frecuencia: 1 vez/mes
// Tiempo: 20-30 min

npm outdated                    // Ver qué está desactualizado
npm update                      // Update menor/patch versions
// Revisar breaking changes en major updates
npm run build                   // Verificar que todo compile
npm run dev                     // Probar localmente
```

**¿Por qué?**
- Seguridad (patches de vulnerabilidades)
- Performance (mejoras de Next.js, React, etc)
- Bug fixes

**¿Es complicado?**
No. La mayoría son updates automáticos sin breaking changes.

---

```typescript
// 2. Revisar logs y errores
// Frecuencia: 1 vez/mes
// Tiempo: 15 min

// En Vercel Dashboard:
- Ver errores en "Runtime Logs"
- Revisar "Analytics" (páginas más visitadas, performance)
- Ver "Functions" (API routes performance)

// En Supabase Dashboard:
- Revisar "Database" (uso de espacio)
- Ver "Storage" (imágenes subidas)
- Checkear "API" (requests/día)
```

**¿Por qué?**
- Detectar problemas antes que los usuarios
- Optimizar lo que va lento
- Ver si necesitas upgrade de plan

---

```typescript
// 3. Backup manual (opcional, Supabase ya hace automático)
// Frecuencia: 1 vez/mes
// Tiempo: 10 min

// En Supabase:
Project > Database > Backups > Download

// O con CLI:
npx supabase db dump > backup-$(date +%Y%m%d).sql
```

**¿Por qué?**
- Extra safety
- Backup local por las dudas

---

#### Cada Trimestre (3 meses) - 1 hora extra

```typescript
// 1. Major updates de dependencias
// Tiempo: 30 min

// Updates mayores que pueden tener breaking changes:
npm install next@latest          // Next.js major version
npm install react@latest         // React major version
npm install prisma@latest        // Prisma major version

// Leer changelogs:
// - https://nextjs.org/blog
// - https://react.dev/blog

// Testing exhaustivo después de major updates
```

---

```typescript
// 2. Limpieza de base de datos
// Tiempo: 15 min

// Eliminar órdenes abandonadas muy antiguas (> 6 meses)
await prisma.order.deleteMany({
  where: {
    paymentStatus: 'PENDING',
    createdAt: { lt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
  }
})

// Vaciar logs viejos si los tenés
```

---

```typescript
// 3. Optimización de imágenes
// Tiempo: 15 min

// Si hay muchas imágenes nuevas:
- Comprimir imágenes grandes
- Convertir a WebP si no están
- Limpiar imágenes no usadas
```

---

#### Cada Año - 2 horas extra

```typescript
// 1. Renovar dominio
// Tiempo: 5 min
// Costo: ~ARS $5,000

// 2. Audit de seguridad
// Tiempo: 1 hora

// Correr audit tools:
npm audit                        // Vulnerabilidades
npm audit fix                    // Auto-fix

// Revisar:
- Variables de entorno (.env)
- Permisos de DB
- API keys rotation (si aplica)

// 3. Performance audit
// Tiempo: 30 min

// Lighthouse en Chrome DevTools
// Optimizar:
- Tiempos de carga
- Core Web Vitals
- SEO score

// 4. Backup completo
// Tiempo: 15 min

// Backup de:
- Base de datos completa
- Código (ya está en Git)
- Imágenes/assets
- Variables de entorno (.env)
```

---

### Tareas Ad-Hoc (Cuando Surgen)

#### Agregar Productos (Tu amigo lo hace)

```
Tiempo: 5 min/producto
Hecho por: Tu amigo en el panel de admin

No es mantenimiento técnico.
```

#### Bugs Reportados

```
Frecuencia: 1-2 veces/año (si tenés suerte, 0)
Tiempo: 1-4 horas según complejidad

Proceso:
1. Reproducir el bug
2. Debuggear
3. Fix
4. Testing
5. Deploy (automático con Vercel)
```

#### Agregar Features Nuevas

```
Frecuencia: A demanda
Tiempo: Variable (1 día a 1 semana según feature)

Esto NO es mantenimiento, es desarrollo nuevo.
Cobraría aparte.
```

---

### Resumen de Tiempo

```
MES PROMEDIO:
├─ Updates de dependencias: 30 min
├─ Revisar logs/analytics: 15 min
├─ Backup manual: 10 min
└─ TOTAL: ~1 hora/mes

MES CON TRIMESTRAL:
└─ TOTAL: ~2 horas/mes

MES CON ANUAL:
└─ TOTAL: ~3 horas/mes

PROMEDIO ANUAL: ~15-20 horas/año
```

**En términos de tu tiempo:**
- 1-2 horas por mes en promedio
- No es todos los días
- Puedes hacerlo el fin de semana
- La mayoría son chequeos visuales

---

### Automatizaciones que Reducen Mantenimiento

```yaml
# .github/dependabot.yml
# Dependabot actualiza dependencias automáticamente

version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

**Esto hace:**
- Revisa dependencias semanalmente
- Crea PRs automáticos con updates
- Tú solo revisas y apruebas (5 min)

---

```typescript
// Monitoreo automático con Sentry (opcional)
// Costo: Free tier hasta 5,000 errores/mes

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
})

// Te llega email cuando hay errores
// No necesitas revisar logs manualmente
```

---

## 💵 3. Cuánto Cobrarle a Tu Amigo

### Contexto Importante

Antes de dar números, consideremos:

1. **Es tu amigo** (no un cliente random)
2. **Ya invertiste tiempo** (¿cuántas horas? ~50-60h?)
3. **Sos dev desde 2016** (experiencia = valor)
4. **Es un e-commerce completo** (no un sitio simple)
5. **Stack profesional** (Next.js, TypeScript, Prisma, etc)
6. **Incluye admin panel** (CRUD completo)
7. **Integración MercadoPago** (no trivial)
8. **Es Argentina** (mercado diferente a USA/Europa)

---

### ¿Qué Cobrar en el Mercado Argentino?

#### Precios de Mercado (Argentina 2025)

**E-commerce básico (Freelancers):**
```
Sitio básico (WordPress/WooCommerce):
├─ Junior: $300k - $500k ARS
├─ Semi-senior: $500k - $800k ARS
└─ Senior: $800k - $1.2M ARS
```

**E-commerce custom (React/Next.js):**
```
Sitio custom completo:
├─ Junior: $600k - $1M ARS
├─ Semi-senior: $1M - $1.8M ARS
└─ Senior: $1.8M - $3M ARS
```

**E-commerce custom con admin panel completo:**
```
Como el tuyo (con panel admin, integración MP, etc):
├─ Semi-senior: $1.5M - $2.5M ARS
└─ Senior: $2.5M - $4M ARS
```

**Agencias/Estudios:**
```
Un proyecto así en agencia:
└─ $3M - $6M ARS
```

---

### Análisis de Tu Situación

#### Valor de Mercado vs Valor de Amistad

**Valor real de mercado (siendo objetivo):**

```
Tu proyecto incluye:
├─ Next.js 14 (App Router) - Stack moderno
├─ TypeScript - Type safety
├─ Panel de Admin completo - CRUD de productos, órdenes, categorías
├─ Autenticación (NextAuth) - Login, registro, roles
├─ Carrito (Zustand) - Con persistencia
├─ Integración MercadoPago - SDK completo + webhook
├─ Base de datos (Prisma + PostgreSQL) - Schema completo
├─ UI profesional (Tailwind + Shadcn) - Responsive
├─ SEO optimizado
├─ Documentación completa
├─ Deploy configurado (Vercel)
└─ Tiempo estimado: 60-80 horas

Precio de mercado: $2M - $3.5M ARS (siendo conservador)
Precio de agencia: $4M - $6M ARS
```

**Pero es tu amigo, así que...**

---

### Opciones de Pricing

#### Opción 1: Precio de Amigo (Recomendada)

```
Precio total: $800,000 - $1,200,000 ARS

Pago en etapas:
├─ 30% al acordar: $240k - $360k
├─ 40% al terminar desarrollo: $320k - $480k
└─ 30% al lanzar (en producción): $240k - $360k

O en cuotas:
└─ $200k - $300k/mes × 4 meses
```

**Justificación:**
- Es ~60% del valor de mercado
- Considerás la amistad
- Es un precio justo para ambos
- Cubre tu tiempo y expertise

**Qué incluye:**
- ✅ Desarrollo completo hasta lanzamiento
- ✅ Deploy inicial
- ✅ Configuración de MercadoPago
- ✅ Training del panel de admin (1 sesión)
- ✅ Documentación completa
- ✅ 1 mes de soporte post-lanzamiento (bugs)

**Qué NO incluye:**
- ❌ Mantenimiento mensual (se cobra aparte)
- ❌ Features nuevas (se cobran aparte)
- ❌ Agregar productos (lo hace él)
- ❌ Soporte 24/7

---

#### Opción 2: Precio Muy Amigo (Si es muy amigo)

```
Precio total: $400,000 - $600,000 ARS

Pago en etapas:
├─ 50% al terminar: $200k - $300k
└─ 50% al lanzar: $200k - $300k
```

**Justificación:**
- Es ~20% del valor de mercado
- Solo cubre tus costos de tiempo
- Es casi un favor

**Consideración:**
⚠️ No subvalúes tu trabajo. Sos senior desde 2016.

---

#### Opción 3: Precio de Mercado (Si no es tan amigo)

```
Precio total: $2,000,000 - $2,500,000 ARS

Pago en etapas:
├─ 20% al acordar: $400k - $500k
├─ 40% al 50% completado: $800k - $1M
├─ 30% al terminar: $600k - $750k
└─ 10% post-lanzamiento (1 mes): $200k - $250k
```

**Justificación:**
- Precio de mercado real
- Valuás tu expertise
- Es lo que cobraría un freelancer senior

---

### Mantenimiento Mensual - Pricing

Una vez lanzado, el mantenimiento se cobra aparte.

#### Opción A: Retainer Mensual

```
Mantenimiento básico: $50,000 - $80,000 ARS/mes

Incluye:
├─ Updates de dependencias (mensual)
├─ Revisión de logs/errores
├─ Optimizaciones menores
├─ Soporte técnico (bugs)
└─ ~2-4 horas/mes

No incluye:
├─ Features nuevas (se cotiza aparte)
├─ Cambios grandes de diseño
└─ Migraciones/upgrades mayores
```

#### Opción B: Pago Por Hora

```
Tarifa: $15,000 - $25,000 ARS/hora

Usás cuando:
├─ Necesita algo específico
├─ Bug urgente
└─ Feature nueva

Ventaja:
└─ Solo paga cuando lo necesita

Desventaja:
└─ Puede acumular deuda técnica si no hace mantenimiento regular
```

#### Opción C: Híbrido (Recomendado)

```
Retainer bajo: $30,000 - $50,000 ARS/mes
└─ Incluye: Updates básicos, monitoreo

+ Por hora para extras: $15,000 - $20,000 ARS/hora
└─ Para: Features nuevas, urgencias, etc
```

---

### Features Nuevas - Pricing

Cuando tu amigo quiera agregar features (ej: sistema de reviews, wishlist, etc):

```
Tarifa por feature:
├─ Feature simple (1-2 días): $80k - $150k
├─ Feature media (3-5 días): $150k - $300k
└─ Feature compleja (1-2 semanas): $300k - $600k

Ejemplos:
├─ Wishlist: ~$150k (3-4 días)
├─ Reviews: ~$180k (4-5 días)
├─ Cupones de descuento: ~$200k (5-6 días)
└─ "Compramos tus cartas": ~$400k (1-2 semanas)
```

---

## 💡 Mi Recomendación Personal

### Para el Desarrollo Inicial

```
Precio: $1,000,000 ARS

Pago:
├─ $300k al acordar (30%)
├─ $400k al terminar desarrollo (40%)
└─ $300k 1 mes después del lanzamiento (30%)

Qué incluye:
├─ Todo el desarrollo hasta producción
├─ 1 mes de soporte post-lanzamiento
├─ Training del panel admin
├─ Documentación completa
└─ Deploy y configuración

Qué NO incluye:
├─ Mantenimiento después del 1er mes
└─ Features nuevas futuras
```

**¿Por qué este precio?**
1. Es ~40% del valor de mercado (considerando amistad)
2. Es justo para ambos
3. Cubre tu tiempo (~60h × $16.6k/h = $1M)
4. No estás regalando tu trabajo
5. Pero tampoco lo estás sobrecobrando

---

### Para Mantenimiento

```
Opción: Híbrido

Retainer: $40,000 ARS/mes
└─ Mantenimiento básico mensual
└─ 2-3 horas/mes incluidas
└─ Monitoreo y updates

+ Por hora: $18,000 ARS/hora
└─ Features nuevas
└─ Bugs complejos
└─ Urgencias
```

**¿Por qué este precio?**
1. $40k/mes es razonable para 2-3h/mes ($13-20k/hora efectiva)
2. Le da previsibilidad de costos
3. Vos tenés ingreso recurrente
4. Features extras se pagan aparte (justo)

---

## 📝 Contrato Sugerido (Puntos Clave)

### Alcance del Proyecto Inicial

```markdown
DESARROLLO E-COMMERCE POKE ADDICTION

Precio: $1,000,000 ARS

Forma de Pago:
- 30% ($300k) al firmar acuerdo
- 40% ($400k) al completar desarrollo
- 30% ($300k) 30 días después del lanzamiento

Qué incluye:
✅ Sitio web e-commerce completo en Next.js
✅ Panel de administración (productos, órdenes, categorías)
✅ Integración con MercadoPago Argentina
✅ Sistema de autenticación (admin/clientes)
✅ Carrito de compras
✅ Control de stock automático
✅ Responsive (mobile + desktop)
✅ Hosting configurado (Vercel + Supabase)
✅ Dominio conectado
✅ 1 mes de soporte post-lanzamiento (bugs)
✅ Training del panel de admin (1 sesión)
✅ Documentación técnica completa

Qué NO incluye:
❌ Mantenimiento después del 1er mes (se contrata aparte)
❌ Features no especificadas en este alcance
❌ Carga de productos (lo hace el cliente)
❌ Contenido (textos, imágenes de productos)
❌ Costos de hosting/dominio (paga el cliente)

Tiempo estimado: 1-2 semanas adicionales
(el proyecto ya está 80% completado)
```

### Mantenimiento Post-Lanzamiento (Opcional)

```markdown
MANTENIMIENTO MENSUAL

Precio: $40,000 ARS/mes

Incluye:
✅ Updates de seguridad mensuales
✅ Monitoreo de errores
✅ Backups
✅ Optimizaciones menores
✅ Soporte técnico para bugs
✅ ~2-3 horas de trabajo/mes

No incluye:
❌ Features nuevas (cotización separada)
❌ Rediseños
❌ Cambios mayores de funcionalidad

Trabajo Extra:
- Tarifa: $18,000 ARS/hora
- Se factura por separado
- Previa aprobación del cliente
```

---

## 🤝 Cómo Presentarlo el Miércoles

### Script Sugerido

> "Che, te armo un presupuesto para que veas los números:
>
> **Desarrollo completo hasta lanzamiento: $1,000,000**
> - Lo podemos hacer en 3 pagos: 300k, 400k, y 300k
> - Incluye todo hasta que esté funcionando en producción
> - Más 1 mes de soporte por cualquier bug
>
> **Después del primer mes:**
> - Mantenimiento básico: $40k/mes
> - Eso cubre updates, monitoreo, backups
> - Si querés agregar features nuevas después, lo cotizo aparte
>
> **Comparado con Shopify:**
> - Shopify te sale $150-200k/mes en USD (más comisiones)
> - Nosotros: desarrollo 1M one-time + $40k/mes
> - En 5-6 meses ya recuperaste la inversión vs Shopify
>
> Te parece razonable?"

---

### Si Pregunta "¿No es Mucho?"

> "Entiendo que suene a mucho, pero te explico por qué es justo:
>
> 1. Un e-commerce así en el mercado sale $2-3 millones
> 2. En una agencia, $4-6 millones
> 3. Te estoy cobrando como amigo, casi la mitad
> 4. Incluye:
>    - Panel de admin completo
>    - Integración con MercadoPago
>    - Todo documentado
>    - Deploy configurado
> 5. Invertí ~60 horas ya
> 6. Soy senior con 9 años de experiencia
>
> Pero si es mucho para tu presupuesto, podemos ver opciones:
> - Pagarlo en más cuotas
> - Reducir el alcance inicial
> - O te puedo hacer un precio más amigo"

---

### Si Pregunta "¿Por Qué No Gratis?" (si es MUY amigo)

> "Te puedo hacer un precio super amigo ($400-500k), pero no puedo hacerlo gratis por varias razones:
>
> 1. Es un proyecto profesional que genera valor comercial
> 2. Invertí ~60 horas de trabajo
> 3. Tengo 9 años de experiencia que valen
> 4. Si lo hago gratis, no voy a poder darle la prioridad que merece
> 5. Un trabajo pago es un trabajo serio
>
> Pensalo como una inversión en tu negocio, no como un gasto.
> Si vendes $50k/día, recuperás la inversión en 1 mes."

---

## 📊 Tabla Resumen

### Opciones de Pricing

| Opción | Precio Inicial | Mantenimiento | Total Año 1 | Para Quién |
|--------|---------------|---------------|-------------|------------|
| **Muy Amigo** | $400k-$600k | $30k/mes | $760k-$960k | Amigo íntimo |
| **Amigo (Recomendada)** | $1M | $40k/mes | $1.48M | Amigo cercano |
| **Mercado** | $2M-$2.5M | $60k/mes | $2.72M-$3.22M | Cliente profesional |

### Comparación con Shopify (5 años)

| | Shopify | Custom (Amigo) | Ahorro |
|---|---|---|---|
| **Desarrollo inicial** | $0 | $1M | -$1M |
| **Año 1** | $2M | $1.48M | -$520k |
| **Años 2-5** | $6.4M | $1.92M | **+$4.48M** |
| **TOTAL 5 años** | $8.4M | $3.4M | **+$5M** |

**Conclusión:** Después de ~2 años, el custom ya es más barato que Shopify.

---

## ✅ Resumen de Respuestas

### 1. ¿Cómo calculé $3.4M?

```
Vercel Pro: $240/año × 5 años = $1,200 USD = ~$1.5M ARS
Supabase Pro: $300/año × 5 años = $1,500 USD = ~$1.9M ARS
Dominio .com.ar: $5k/año × 5 años = $25k ARS

Total: ~$3.4M ARS

(Sin contar ajustes por inflación/dólar)
```

### 2. ¿Qué mantenimiento requiere?

```
Mensual: 1-2 horas
- Updates de dependencias: 30 min
- Revisar logs: 15 min
- Backups: 10 min

Trimestral: +1 hora
- Major updates
- Limpieza DB

Anual: +2 horas
- Audit seguridad
- Performance optimization

TOTAL: ~15-20 horas/año
```

### 3. ¿Cuánto cobrar?

```
Recomendado:
├─ Desarrollo: $1,000,000 ARS
│   ├─ 30% inicial: $300k
│   ├─ 40% al terminar: $400k
│   └─ 30% post-lanzamiento: $300k
│
└─ Mantenimiento: $40,000 ARS/mes
    ├─ Incluye: Updates, monitoreo, soporte
    └─ Extra: $18k/hora para features nuevas

Alternativa muy amigo:
└─ Desarrollo: $400k-$600k (si es muy amigo)
```

---

¿Necesitas que ajuste algo o que prepare el presupuesto formal para mostrarle?

