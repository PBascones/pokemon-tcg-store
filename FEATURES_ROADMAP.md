# 🗺️ Roadmap de Features - Poke Addiction

## ✅ CORE MVP (Ya Implementado)

### E-commerce Base
- [x] Landing page con hero section, productos destacados y categorías
- [x] Catálogo de productos con imágenes y filtros
- [x] Página de detalle de producto
- [x] Carrito de compras (agregar, quitar, modificar cantidad)
- [x] Sistema de checkout
- [x] Control de stock básico (valida disponibilidad al comprar)

### Usuarios & Autenticación
- [x] Registro de usuarios
- [x] Login/Logout
- [x] Sesiones persistentes
- [x] Perfiles de usuario básicos

### Administración
- [x] Panel admin protegido
- [x] Gestión de productos (CRUD completo)
- [x] Gestión de categorías
- [x] Gestión de órdenes (ver, actualizar estado)
- [x] Gestión de usuarios

### Pagos
- [x] Integración con MercadoPago
- [x] Generación de preferencias de pago
- [x] Webhook para confirmación de pagos
- [x] Creación automática de órdenes

### UX/UI
- [x] Diseño responsive (mobile-first)
- [x] Notificaciones toast (Sonner)
- [x] Estados de carga
- [x] Manejo de errores

---

## 🚀 ETAPA 1 - Mejoras Prioritarias (2-4 semanas)

### Features Pendientes del MVP
- [ ] **Integración Pokemon API**
  - Autocompletar datos de cartas
  - Imágenes oficiales de Pokémon
  - Información de sets/expansiones
  - Validación de nombres/números de carta
  - **Complejidad:** Media (2-3 días)

- [ ] **Estadísticas y Dashboard Mejorado**
  - Gráficos de ventas por período
  - Productos más vendidos
  - Revenue por categoría
  - Clientes top
  - Stock crítico (alertas)
  - **Complejidad:** Media (2-3 días)

- [ ] **Control de Stock Avanzado**
  - Alertas de stock bajo
  - Historial de movimientos de stock
  - Reposición sugerida
  - Export/import de inventario
  - **Complejidad:** Media (2-3 días)

### UX Improvements
- [ ] **Sistema de Búsqueda Avanzada**
  - Búsqueda por nombre, tipo, set
  - Filtros múltiples (rareza, precio, tipo)
  - Autocompletado
  - **Complejidad:** Baja-Media (1-2 días)

- [ ] **Paginación y Load More**
  - Paginación en catálogo
  - Infinite scroll opcional
  - Cantidad de resultados por página
  - **Complejidad:** Baja (1 día)

- [X] **Galería de Imágenes Mejorada**
  - Zoom en producto
  - Vista 360° (si aplica)
  - Múltiples imágenes por producto
  - **Complejidad:** Baja-Media (1-2 días)

---

## 🎯 ETAPA 2 - Features Intermedias (1-2 meses)

### Engagement del Usuario
- [ ] **Sistema de Wishlist/Favoritos**
  - Guardar productos favoritos
  - Notificaciones de precio
  - Compartir wishlist
  - **Complejidad:** Media (2-3 días)

- [ ] **Sistema de Reviews/Reseñas**
  - Calificación con estrellas
  - Comentarios de clientes
  - Fotos en reviews
  - Moderación de reviews
  - **Complejidad:** Media-Alta (3-4 días)

- [ ] **Seguimiento de Órdenes**
  - Tracking de envío
  - Estados detallados (empaquetado, enviado, en tránsito)
  - Notificaciones por email/SMS
  - Integración con Correo Argentino/Andreani
  - **Complejidad:** Alta (5-7 días)

### Ventas & Marketing
- [ ] **Sistema de Cupones/Descuentos**
  - Códigos de descuento
  - Descuentos por categoría
  - Descuentos por primera compra
  - Expiración automática
  - **Complejidad:** Media (2-3 días)

- [ ] **Newsletter y Email Marketing**
  - Suscripción a newsletter
  - Emails de carritos abandonados
  - Notificaciones de nuevos productos
  - Ofertas exclusivas
  - **Complejidad:** Media-Alta (3-5 días)

- [ ] **Programa de Referidos**
  - Link único por usuario
  - Descuentos por referir amigos
  - Dashboard de referidos
  - **Complejidad:** Media-Alta (4-5 días)

---

## 🌟 ETAPA 3 - Features Avanzadas (2-4 meses)

### Monetización Avanzada
- [ ] **Programa de Puntos/Loyalty**
  - Puntos por compra
  - Canje de puntos por descuentos
  - Niveles de membresía (Bronze, Silver, Gold)
  - Beneficios exclusivos por nivel
  - **Complejidad:** Alta (7-10 días)

- [ ] **Integración Tarjeta de Crédito Directa**
  - Payment gateway adicional (Stripe, etc.)
  - Cuotas sin interés
  - Tarjetas guardadas
  - **Complejidad:** Alta (5-7 días)
  - **Nota:** MercadoPago ya maneja tarjetas, esto es redundante a menos que necesites otro procesador

### Trading & Comunidad
- [ ] **Marketplace de Compra/Venta entre Usuarios**
  - Users pueden vender sus cartas
  - Sistema de comisiones
  - Verificación de vendedores
  - Rating de vendedores
  - **Complejidad:** Muy Alta (15-20 días)
  - **Consideración:** Requiere moderación activa y compliance legal

- [ ] **Servicio de Grading/Autenticación**
  - Solicitud de servicio de grading
  - Tracking de cartas en proceso
  - Certificados digitales
  - Integración con servicios externos (PSA, CGC, etc.)
  - **Complejidad:** Muy Alta (10-15 días)
  - **Consideración:** Requiere partnerships con servicios de grading

- [ ] **Trading/Intercambio de Cartas**
  - Sistema de "quiero/tengo"
  - Matching automático
  - Chat entre usuarios
  - Sistema de reputación
  - **Complejidad:** Muy Alta (15-20 días)

### Experiencia Premium
- [ ] **Realidad Aumentada (AR)**
  - Ver cartas en 3D
  - Preview de cartas en tu mesa
  - Escaneo de cartas físicas
  - **Complejidad:** Muy Alta (20+ días)
  - **Consideración:** Requiere expertise en AR/3D

- [ ] **Subastas en Vivo**
  - Cartas raras a subasta
  - Bidding en tiempo real
  - Timer countdown
  - Historial de pujas
  - **Complejidad:** Muy Alta (15-20 días)

- [ ] **Suscripciones/Cajas Mensuales**
  - Box mensual sorpresa
  - Planes de suscripción
  - Billing recurrente
  - Gestión de suscripciones
  - **Complejidad:** Alta (7-10 días)

---

## 📊 EXTRAS ADMINISTRATIVOS

### Analytics & Reporting
- [ ] **Google Analytics 4**
  - Tracking de eventos
  - Conversiones
  - Embudos de venta
  - **Complejidad:** Baja (1 día)

- [ ] **Dashboard de Métricas Avanzado**
  - KPIs personalizados
  - Reportes exportables (PDF, Excel)
  - Comparación de períodos
  - **Complejidad:** Media-Alta (4-5 días)

### Operaciones
- [ ] **Gestión de Proveedores**
  - Órdenes de compra
  - Tracking de proveedores
  - Costos y márgenes
  - **Complejidad:** Alta (7-10 días)

- [ ] **Sistema de Devoluciones**
  - Solicitud de devolución
  - RMA (Return Merchandise Authorization)
  - Reintegro automático
  - **Complejidad:** Media-Alta (4-5 días)

- [ ] **Multi-almacén**
  - Stock por ubicación
  - Transfer entre almacenes
  - Picking y packing
  - **Complejidad:** Muy Alta (10-15 días)

---

## 🎨 EXTRAS UX/UI

- [ ] **Modo Oscuro/Claro**
- [ ] **Comparador de Productos**
- [ ] **Visto Recientemente**
- [ ] **Productos Relacionados (ML-based)**
- [ ] **Chat de Soporte (Chatbot/Live)**
- [ ] **PWA (Instalable como app)**
- [ ] **Multi-idioma (i18n)**

---

## 💡 RECOMENDACIONES DE PRIORIZACIÓN

### Para los primeros 3 meses (después de MVP):
1. **Integración Pokemon API** ← Diferenciador clave
2. **Estadísticas de ventas** ← Necesario para el negocio
3. **Búsqueda avanzada** ← Mejora UX significativamente
4. **Wishlist** ← Fidelización
5. **Sistema de cupones** ← Impulsa ventas

### Para cobrar extra (justificado):
- ✅ Integración Pokemon API (+150-200 USD)
- ✅ Control de stock avanzado (+100-150 USD)
- ✅ Sistema de reviews (+100 USD)
- ✅ Seguimiento de órdenes (+200-250 USD)
- ✅ Programa de puntos (+300-400 USD)
- ✅ Marketplace usuarios (+500-700 USD) ← Muy complejo
- ✅ Servicio de grading (+400-500 USD)

### NO prioritarios (nice-to-have):
- Integración tarjeta de crédito directa (MP ya lo hace)
- AR/3D (muy costoso, bajo ROI)
- Multi-almacén (innecesario si es un solo local)

---

## 📝 Notas Finales

**Para el miércoles, presentá:**
1. Lo que YA está (MVP completo)
2. Las 5 features de "primeros 3 meses"
3. Los "extras avanzados" como roadmap a 6-12 meses

**Evitá:**
- Prometer features muy complejas de entrada
- Comprometerte a plazos sin tener claro el scope
- Regalar features que justifican cobro extra

**Preguntá a tu amigo:**
- ¿Qué features considera indispensables?
- ¿Qué presupuesto tiene en mente?
- ¿Qué tan rápido necesita lanzar?

