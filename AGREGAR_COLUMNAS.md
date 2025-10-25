# Guía: Cómo Agregar Columnas a la Base de Datos con Prisma

Esta guía documenta el proceso completo para agregar nuevas columnas a las tablas existentes en la base de datos usando Prisma.

## Ejemplo: Agregar columna `releaseDate` a las tablas Expansion y Set

### 📋 Resumen de Cambios

Se agregó una columna `releaseDate` de tipo `DateTime` nullable a las tablas:
- `Expansion`
- `Set`

Esta columna permite almacenar la fecha de lanzamiento de expansiones y sets de Pokémon TCG.

---

## 🔧 Pasos para Agregar Columnas

### **Paso 1: Modificar el Schema de Prisma**

Editar el archivo `prisma/schema.prisma` y agregar el nuevo campo en los modelos correspondientes.

---

### **Paso 2: Crear la Migración**

Ejecutar el siguiente comando para crear y aplicar la migración:

```bash
npx prisma migrate dev --name add_release_date_to_expansion_and_set
```

**¿Qué hace este comando?**
1. Lee el `schema.prisma` actualizado
2. Compara con el estado actual de la base de datos
3. Genera un archivo SQL con los cambios necesarios
4. Aplica la migración a la base de datos
5. Regenera el Prisma Client con los nuevos tipos

**Ubicación del archivo de migración:**
```
prisma/migrations/[TIMESTAMP]_add_release_date_to_expansion_and_set/migration.sql
```

---

### **Paso 3: Verificar la Migración**

El comando anterior habrá generado un archivo SQL similar a:

```sql
-- AlterTable
ALTER TABLE "Expansion" ADD COLUMN "releaseDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Set" ADD COLUMN "releaseDate" TIMESTAMP(3);
```

---

### **Paso 4: Regenerar el Prisma Client (si es necesario)**

Si por alguna razón no se regeneró automáticamente:

```bash
npx prisma generate
```

---

## 📝 Tipos de Datos Comunes en Prisma

Cuando agregues columnas, estos son los tipos más utilizados:

| Tipo Prisma | Tipo SQL | Descripción | Ejemplo |
|-------------|----------|-------------|---------|
| `String` | VARCHAR/TEXT | Texto | `name String` |
| `Int` | INTEGER | Número entero | `quantity Int` |
| `Float` | DOUBLE PRECISION | Número decimal | `price Float` |
| `Boolean` | BOOLEAN | Verdadero/Falso | `isActive Boolean` |
| `DateTime` | TIMESTAMP | Fecha y hora | `releaseDate DateTime` |
| `Json` | JSONB | Datos JSON | `metadata Json` |

### Modificadores de Campos

- `?` = Campo nullable (opcional): `releaseDate DateTime?`
- `@default(value)` = Valor por defecto: `isActive Boolean @default(true)`
- `@unique` = Valor único: `email String @unique`
- `@id` = Llave primaria: `id String @id`
- `@db.Text` = Especificar tipo de base de datos: `description String? @db.Text`

---

## 🚀 Comandos Útiles de Prisma

### Desarrollo
```bash
# Crear y aplicar migración
npx prisma migrate dev --name nombre_de_la_migracion

# Crear migración sin aplicarla (solo genera el SQL)
npx prisma migrate dev --create-only --name nombre_de_la_migracion

# Aplicar migraciones pendientes
npx prisma migrate deploy

# Regenerar Prisma Client
npx prisma generate

# Ver estado de las migraciones
npx prisma migrate status
```

### Base de Datos
```bash
# Abrir Prisma Studio (interfaz visual)
npx prisma studio

# Resetear base de datos (⚠️ ELIMINA TODOS LOS DATOS)
npx prisma migrate reset

# Validar schema sin crear migración
npx prisma validate

# Formatear schema.prisma
npx prisma format
```

---

## ⚠️ Consideraciones Importantes

### 1. **Columnas Nullable vs No Nullable**
- **Nullable (`DateTime?`)**: Puede ser `null`, ideal para tablas con datos existentes
- **No Nullable (`DateTime`)**: Requiere valor, Prisma pedirá valor por defecto o fallará

### 2. **Migraciones en Producción**
```bash
# Para producción usar deploy en lugar de dev
npx prisma migrate deploy
```

### 3. **Backup Antes de Migrar**
Siempre haz backup de producción antes de aplicar migraciones:
```bash
# Ejemplo con PostgreSQL
pg_dump nombre_db > backup_$(date +%Y%m%d).sql
```

### 4. **Revertir Migraciones**
Prisma no tiene comando automático para revertir. Para hacerlo:
1. Eliminar el archivo de migración en `prisma/migrations/`
2. Revertir cambios en `schema.prisma`
3. Ejecutar: `npx prisma migrate dev`

O escribir manualmente una migración que revierta los cambios.

---

## 🎯 Ejemplo Completo: Agregar Columna con Valor por Defecto

Si quisieras agregar una columna **no nullable** con valor por defecto:

```prisma
model Product {
  // ... otros campos
  priority    Int       @default(0)  // Nueva columna con default
  releaseDate DateTime  @default(now())  // Default = fecha actual
}
```

---

## 📚 Flujo Típico de Trabajo

1. **Modificar** `schema.prisma`
2. **Crear migración**: `npx prisma migrate dev --name descripcion_del_cambio`
3. **Verificar** que la migración se aplicó correctamente
4. **Actualizar** el código TypeScript para usar los nuevos campos
5. **Commit** tanto el schema como los archivos de migración

---

## 🔗 Recursos Adicionales

- [Documentación Oficial de Prisma](https://www.prisma.io/docs)
- [Guía de Migraciones](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Tipos de Datos](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#model-field-scalar-types)

---

## ✅ Checklist para Agregar Columnas

- [ ] Modificar `schema.prisma` con el nuevo campo
- [ ] Ejecutar `npx prisma migrate dev --name nombre_descriptivo`
- [ ] Verificar que la migración se aplicó correctamente
- [ ] Probar en el código que el nuevo campo funciona
- [ ] Actualizar tipos TypeScript si es necesario
- [ ] Commit de `schema.prisma` y archivos de migración
- [ ] Documentar cambios si son significativos

---

**Fecha de creación:** Octubre 2025  
**Última actualización:** Octubre 2025  
**Versión Prisma:** 6.16.3

