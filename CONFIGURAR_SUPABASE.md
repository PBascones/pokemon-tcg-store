# 🌟 Guía Paso a Paso - Configurar Supabase

## ✅ Paso 1: Crear Cuenta en Supabase

1. Ir a: **https://supabase.com**
2. Click en **"Start your project"**
3. Registrarte con:
   - GitHub (recomendado - 1 click)
   - O con email y contraseña

## ✅ Paso 2: Crear Nuevo Proyecto

1. Una vez dentro, click en **"New Project"**

2. Completar el formulario:
   ```
   Name: pokemon-store
   Database Password: [ELEGIR UNA CONTRASEÑA SEGURA Y ANOTARLA]
   Region: South America (São Paulo)
   Pricing Plan: Free ($0/month)
   ```

3. Click en **"Create new project"**

4. **ESPERAR 2-3 MINUTOS** mientras se crea el proyecto
   - Vas a ver una pantalla de "Setting up your project"
   - Tomá un café ☕

## ✅ Paso 3: Obtener la Connection String

1. Una vez creado el proyecto, ir al menú lateral izquierdo:
   - Click en **"Project Settings"** (ícono de engranaje)

2. En el menú de settings, click en **"Database"**

3. Bajar hasta la sección **"Connection string"**

4. Seleccionar la pestaña **"URI"** (no JDBC ni otras)

5. Vas a ver algo como esto:
   ```
   postgresql://postgres.[reference-id]:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   ```

6. **IMPORTANTE:** 
   - Donde dice `[YOUR-PASSWORD]`, reemplazar con la contraseña que elegiste en el Paso 2
   - Copiar TODO el string completo

## ✅ Paso 4: Configurar en tu Proyecto

1. Abrir el archivo `.env` en la raíz del proyecto

2. Buscar la línea que dice:
   ```
   DATABASE_URL="postgresql://usuario:password@localhost:5432/pokemon_store?schema=public"
   ```

3. Reemplazarla con tu connection string de Supabase:
   ```
   DATABASE_URL="postgresql://postgres.[reference-id]:[TU-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
   ```

4. **Asegurate de:**
   - Que esté entre comillas
   - Que no tenga espacios extras
   - Que la contraseña sea correcta

## ✅ Paso 5: Probar la Conexión

Abrir terminal en el proyecto y ejecutar:

```bash
cd pokemon-store
npm run db:migrate
```

Si todo está bien, vas a ver:
```
✔ Generated Prisma Client
✔ Applied migration(s)
```

## ✅ Paso 6: Poblar con Datos

```bash
npm run db:seed
```

Deberías ver:
```
🌱 Iniciando seed de la base de datos...
✅ Usuario administrador creado: admin@pokestore.com
✅ Usuario de prueba creado: cliente@test.com
✅ Categorías creadas
✅ Producto creado: Charizard V
...
🎉 Seed completado exitosamente!
```

## ✅ Paso 7: Verificar en Supabase

1. Volver a Supabase (supabase.com)
2. Ir a tu proyecto
3. Click en **"Table Editor"** en el menú lateral
4. Deberías ver tus tablas: User, Product, Category, Order, etc.
5. Click en cualquier tabla para ver los datos

## 🎉 ¡Listo!

Tu base de datos está configurada y funcionando en la nube.

Ahora podés:
```bash
npm run dev
```

Y abrir http://localhost:3000

---

## 🐛 Solución de Problemas

### Error: "Can't reach database server"
- Verificar que la contraseña en DATABASE_URL sea correcta
- Verificar que no haya espacios extras
- Verificar que tengas internet

### Error: "Invalid database URL"
- Asegurate de usar la URL completa con "postgresql://"
- Verificar que esté entre comillas en el .env

### Error: "Authentication failed"
- La contraseña en la URL debe ser exactamente la que pusiste al crear el proyecto
- Si la olvidaste, podés resetearla en Project Settings → Database → Database password

### No veo las tablas en Supabase
- Asegurate de haber corrido `npm run db:migrate`
- Refresca el Table Editor en Supabase

---

## 💡 Tips

- **Ver tus datos:** Supabase Table Editor es súper útil
- **Backups:** Supabase hace backups automáticos (plan gratis: diarios)
- **Connection Pooling:** Ya está incluido en la URL de Supabase
- **Límites gratuitos:** 500 MB de storage, 2 GB de transferencia/mes (más que suficiente para empezar)

---

## 🔒 Seguridad

⚠️ **NUNCA subas el archivo `.env` a GitHub**

El `.gitignore` ya está configurado para ignorarlo, pero siempre verificá.

---

## 📊 Usar Prisma Studio

Para ver/editar tu base de datos desde tu computadora:

```bash
npm run db:studio
```

Se abre en: http://localhost:5555

---

¡Tu base de datos en la nube está lista! 🚀
