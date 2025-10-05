# 🚀 Guía de Deployment a Producción

Esta guía te ayudará a subir tu e-commerce de cartas Pokémon a producción.

## 🎯 Opciones de Hosting

### Opción 1: Vercel (Recomendada - Más Fácil)

**Ventajas:**
- Deploy automático desde GitHub
- SSL gratis
- CDN global
- Fácil configuración
- Plan gratuito generoso

**Pasos:**

1. **Crear cuenta en Vercel**
   - Ir a https://vercel.com
   - Registrarse con GitHub

2. **Subir código a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/pokemon-store.git
   git push -u origin main
   ```

3. **Importar proyecto en Vercel**
   - Click en "Add New Project"
   - Seleccionar tu repositorio
   - Vercel detecta automáticamente que es Next.js

4. **Configurar Variables de Entorno**
   En Vercel, ir a Settings → Environment Variables y agregar:
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=tu-secret-super-seguro
   NEXTAUTH_URL=https://tu-dominio.vercel.app
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
   MERCADOPAGO_PUBLIC_KEY=APP_USR-...
   NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
   ```

5. **Deploy**
   - Click en "Deploy"
   - Esperar 2-3 minutos
   - ¡Listo! Tu sitio está online

### Opción 2: Railway

**Ventajas:**
- Incluye base de datos PostgreSQL
- Deploy automático
- Fácil de usar
- $5 de crédito gratis al mes

**Pasos:**

1. Crear cuenta en https://railway.app
2. Crear nuevo proyecto
3. Agregar PostgreSQL database
4. Deploy desde GitHub
5. Configurar variables de entorno
6. Copiar la DATABASE_URL de Railway

### Opción 3: VPS (Digital Ocean, AWS, etc.)

**Ventajas:**
- Control total
- Más personalizable
- Puedes alojar múltiples proyectos

**Requiere más conocimientos técnicos:**
- Configurar servidor
- Instalar Node.js
- Configurar Nginx
- Configurar SSL
- Configurar PM2 para mantener la app corriendo

## 🗄️ Base de Datos en Producción

### Opción A: Supabase (Recomendada - Gratis)

1. Crear cuenta en https://supabase.com
2. Crear nuevo proyecto
3. Copiar la "Connection String" (PostgreSQL)
4. Pegar en `DATABASE_URL`

**Ventajas:**
- Plan gratuito
- Backups automáticos
- Dashboard para ver datos
- Alta disponibilidad

### Opción B: Railway PostgreSQL

1. En tu proyecto de Railway, agregar PostgreSQL
2. Railway genera automáticamente la URL
3. Usar esa URL en `DATABASE_URL`

### Opción C: Neon

1. Crear cuenta en https://neon.tech
2. Crear proyecto
3. Copiar connection string

## 🔧 Checklist Pre-Deployment

### Seguridad
- [ ] Cambiar password del admin
- [ ] Generar nuevo `NEXTAUTH_SECRET` seguro
- [ ] Usar credenciales de producción de MercadoPago
- [ ] Configurar CORS apropiadamente
- [ ] Revisar que no haya secrets en el código

### Base de Datos
- [ ] Migrar schema a producción: `npm run db:migrate`
- [ ] Ejecutar seed si es necesario: `npm run db:seed`
- [ ] Configurar backups automáticos

### MercadoPago
- [ ] Cambiar a credenciales de producción
- [ ] Configurar webhook con URL de producción
- [ ] Probar un pago de prueba

### Performance
- [ ] Optimizar imágenes
- [ ] Configurar caché
- [ ] Revisar queries de base de datos

### SEO
- [ ] Configurar meta tags
- [ ] Crear sitemap.xml
- [ ] Configurar robots.txt
- [ ] Agregar Google Analytics (opcional)

## 📱 Configuración de Dominio Personalizado

### En Vercel

1. Comprar dominio (ej: en GoDaddy, Namecheap)
2. En Vercel, ir a Settings → Domains
3. Agregar tu dominio
4. Configurar DNS según instrucciones de Vercel
5. Esperar propagación (puede tomar 24-48 horas)

### Registradores de Dominios Populares en Argentina

- **NIC.ar** - Dominios .ar (https://nic.ar/)
- **DonWeb** - https://www.donweb.com/es-ar/
- **Neolo** - https://www.neolo.com/

## 🔒 SSL/HTTPS

Vercel y Railway proporcionan SSL automáticamente. Si usás VPS:

1. Usar Let's Encrypt (gratis)
2. Instalar Certbot
3. Configurar renovación automática

## 📊 Monitoreo

### Herramientas Recomendadas

1. **Vercel Analytics** - Ya incluido en Vercel
2. **Google Analytics** - Para tráfico
3. **Sentry** - Para errores
4. **Uptime Robot** - Para monitorear disponibilidad

### Configurar Sentry (opcional)

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## 🔄 CI/CD (Deploy Automático)

Con Vercel o Railway:
- Cada push a `main` hace deploy automático
- Branches crean previews automáticos
- No configuración necesaria

## 📧 Email (Opcional)

Para enviar emails de confirmación:

### Opción 1: Resend (Recomendado)
```bash
npm install resend
```

### Opción 2: SendGrid
- Plan gratuito: 100 emails/día

### Opción 3: Nodemailer + Gmail
- Usar SMTP de Gmail

## 💾 Backups

### Base de Datos

**Supabase:**
- Backups diarios automáticos (plan Pro)
- Puedes hacer backups manuales

**Manual:**
```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Código
- Git automáticamente respalda el código
- Considerar múltiples remotes (GitHub + GitLab)

## 📈 Escalabilidad

Cuando tu tienda crezca:

### 1. Optimizar Imágenes
- Usar servicio CDN (Cloudflare, Cloudinary)
- Optimizar tamaño y formato (WebP)

### 2. Caché
- Next.js tiene caché incorporado
- Considerar Redis para caché adicional

### 3. Base de Datos
- Índices en queries frecuentes
- Connection pooling
- Read replicas si es necesario

### 4. Búsqueda
- Implementar Algolia o ElasticSearch
- Para búsquedas más rápidas

## 🐛 Troubleshooting Producción

### "Database connection failed"
- Verificar DATABASE_URL
- Verificar que la DB esté accesible desde Vercel/Railway
- Verificar límite de conexiones

### "Build failed"
- Verificar que todas las dependencias estén en package.json
- Verificar TypeScript errors
- Ver logs de build

### "Environment variable not found"
- Verificar que todas las variables estén en Vercel/Railway
- Redeploy después de agregar variables

### Pagos no funcionan
- Verificar credenciales de MercadoPago (producción, no TEST)
- Verificar que webhook esté configurado con HTTPS
- Ver logs en panel de MercadoPago

## 📱 Testing en Producción

Antes de anunciar tu sitio:

1. **Probar flujo completo:**
   - Registro de usuario
   - Agregar al carrito
   - Checkout completo
   - Pago con MercadoPago
   - Verificar que llegue notificación

2. **Probar en diferentes dispositivos:**
   - Desktop (Chrome, Firefox, Safari)
   - Mobile (iOS, Android)
   - Tablet

3. **Verificar emails:**
   - Confirmación de orden
   - Actualización de estado

## 🎉 Post-Launch

### Primeras Tareas

1. **Configurar Google Search Console**
   - Enviar sitemap
   - Verificar indexación

2. **Redes Sociales**
   - Crear página de Facebook
   - Instagram para productos
   - WhatsApp Business

3. **Analytics**
   - Configurar Google Analytics
   - Configurar píxel de Facebook

4. **Marketing**
   - Anuncio en grupos de Pokémon
   - Promociones de lanzamiento
   - Cupones de descuento

### Mantenimiento Regular

- Actualizar dependencias mensualmente
- Revisar logs de errores
- Backup manual mensual
- Revisar performance
- Agregar nuevos productos

## 📞 Soporte Post-Deployment

Si tenés problemas después del deploy:

1. Revisar logs en Vercel/Railway
2. Verificar variables de entorno
3. Revisar panel de MercadoPago
4. Verificar estado de la base de datos

---

## 🎯 Comando Rápido de Deploy

```bash
# 1. Asegurate de tener todo commiteado
git add .
git commit -m "Ready for production"
git push

# 2. Si usas Vercel CLI
vercel --prod

# 3. Verificar que funcione
# Abrir tu-dominio.vercel.app en el navegador
```

---

¡Tu tienda está lista para vender! 🎉🎴
