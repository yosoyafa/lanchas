# ❌ Sistema de Reservas Rechazadas

## ✅ Implementado

El sistema ahora guarda y muestra todas las reservas rechazadas en una pestaña dedicada del dashboard.

---

## 📊 Vista del Dashboard

### Pestañas Disponibles

1. **Pendientes** (azul) - Reservas con comprobante enviado, esperando aprobación
2. **Confirmadas** (verde) - Reservas aprobadas por el admin
3. **Rechazadas** (rojo) - Reservas rechazadas por el admin 👈 NUEVO
4. **Calendario** (morado) - Vista de calendario con todas las reservas

---

## 🔴 Pestaña "Rechazadas"

### Características:

- **Borde rojo** en cada tarjeta
- **Badge rojo** con texto "RECHAZADA"
- **Motivo del rechazo** destacado en recuadro rojo
- **Fecha de rechazo** con timestamp
- **Contador** en la pestaña mostrando cuántas hay

### Vista de Tarjeta

```
┌────────────────────────────────────────────────┐
│ ┃ [Comprobante]     [RECHAZADA]               │
│ ┃                   Juan Pérez                │
│ ┃                   +57 300 123 4567          │
│ ┃                                             │
│ ┃                   📅 miércoles, 30 de abril│
│ ┃                   🚤 Lancha 1               │
│ ┃                   ❌ Rechazada: 17/04 10:30│
│ ┃                                             │
│ ┃                   ┌─────────────────────┐  │
│ ┃                   │ Motivo del rechazo: │  │
│ ┃                   │ Pago no verificado  │  │
│ ┃                   └─────────────────────┘  │
│ ┃                                             │
│ ┃                   ID: clxy1234             │
└────────────────────────────────────────────────┘
  ↑ Borde rojo (border-l-4 border-red-500)
```

---

## 🔄 Flujo de Rechazo

### Proceso Completo:

```
1. Cliente envía comprobante
   ↓ (Status: PAYMENT_SUBMITTED)

2. Admin ve en "Pendientes"
   ↓

3. Admin revisa comprobante
   ↓

4. Admin decide rechazar
   ↓

5. Admin ingresa motivo del rechazo
   ↓

6. Sistema actualiza reserva:
   - Status: REJECTED
   - rejectionReason: "motivo ingresado"
   - reviewedAt: timestamp actual
   ↓

7. Cliente recibe mensaje automático por WhatsApp
   ↓

8. Reserva aparece en pestaña "Rechazadas"
```

---

## 💬 Notificación al Cliente

Cuando el admin rechaza una reserva, el cliente recibe:

```
❌ Tu reserva no pudo ser confirmada.

Motivo: Pago no verificado

Contáctanos para más información.
```

---

## 📱 Interfaz Responsive

### Desktop:
- Imagen del comprobante a la izquierda (192px × 256px)
- Información a la derecha
- Motivo del rechazo en recuadro destacado

### Móvil:
- Imagen arriba (ancho completo, altura 192px)
- Información abajo
- Motivo del rechazo en recuadro destacado
- Todo apilado verticalmente

---

## 🎨 Colores y Estilo

### Colores Usados:
- **Borde:** `border-red-500` (#ef4444)
- **Badge:** `bg-red-100 text-red-800`
- **Recuadro motivo:** `bg-red-50 border-red-200`
- **Texto motivo:** `text-red-700`
- **Tab activa:** `text-red-600 border-red-600`
- **Contador:** `bg-red-600 text-white`

### Consistencia Visual:
- Verde = Aprobadas/Confirmadas
- Amarillo = Pendientes
- Rojo = Rechazadas
- Azul = Pendientes (tab)
- Morado = Calendario

---

## 🗄️ Datos en la Base de Datos

### Campos de una Reserva Rechazada:

```javascript
{
  id: "clxy1234...",
  customerPhone: "573001234567@c.us",
  customerName: "Juan Pérez",
  boatNumber: 1,
  requestedDate: "2026-04-30T00:00:00Z",
  status: "REJECTED",                    // 👈 Estado
  paymentReceiptUrl: "https://...",
  rejectionReason: "Pago no verificado", // 👈 Motivo
  reviewedAt: "2026-04-17T14:30:00Z",   // 👈 Cuándo se rechazó
  paymentSubmittedAt: "2026-04-17T12:00:00Z",
  createdAt: "2026-04-17T12:00:00Z"
}
```

### Estados Posibles:

1. **PAYMENT_SUBMITTED** - Comprobante enviado, esperando revisión
2. **CONFIRMED** - Aprobada por admin
3. **REJECTED** - Rechazada por admin 👈

---

## 📊 Estadísticas del Dashboard

Con las pestañas, el admin puede ver rápidamente:

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Pendientes  │ Confirmadas │ Rechazadas  │ Calendario  │
│     3       │      12     │      2      │             │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

Los contadores muestran cuántas reservas hay en cada categoría.

---

## 🔍 Información Mostrada

### En Tarjeta de Rechazada:

- ✅ Comprobante de pago (imagen)
- ✅ Nombre del cliente (si existe)
- ✅ Teléfono del cliente
- ✅ Fecha solicitada (si existe)
- ✅ Lancha solicitada (si existe)
- ✅ Fecha y hora del rechazo
- ✅ **Motivo del rechazo** (destacado) 👈
- ✅ ID de referencia

### Campos Opcionales:

Si el cliente fue rechazado antes de proporcionar todos los datos:
- Fecha: Muestra "No especificada" si `requestedDate` es null
- Lancha: No muestra el campo si `boatNumber` es null
- Nombre: Muestra teléfono si `customerName` es null

---

## 💡 Casos de Uso

### Caso 1: Pago No Verificado

```
Admin:
- Ve comprobante borroso o editado
- Click "Rechazar"
- Motivo: "Comprobante no legible"
→ Cliente recibe notificación
→ Puede enviar nuevo comprobante válido
```

### Caso 2: Fecha No Disponible

```
Admin:
- Cliente envió comprobante sin seguir flujo
- Fecha ya ocupada
- Click "Rechazar"
- Motivo: "Fecha no disponible, contacta para elegir otra"
→ Cliente recibe notificación
```

### Caso 3: Monto Incorrecto

```
Admin:
- Comprobante muestra pago insuficiente
- Click "Rechazar"
- Motivo: "Monto incorrecto, el total es $XXX"
→ Cliente recibe notificación
```

---

## 🧪 Testing

### Probar Flujo de Rechazo:

1. **Crear reserva de prueba:**
   ```
   WhatsApp: lancha
   WhatsApp: 30 de abril, lancha 1
   WhatsApp: Juan Test
   WhatsApp: [Enviar imagen]
   ```

2. **Rechazar desde dashboard:**
   - Abrir pestaña "Pendientes"
   - Click "❌ Rechazar"
   - Ingresar motivo: "Prueba de rechazo"
   - Confirmar

3. **Verificar:**
   - Cliente recibe mensaje en WhatsApp
   - Pestaña "Rechazadas" muestra contador (1)
   - Click en "Rechazadas"
   - Tarjeta aparece con borde rojo
   - Motivo visible: "Prueba de rechazo"

---

## 📈 Mejoras Futuras

### Versión 1.1:
- [ ] Permitir re-aprobar una reserva rechazada
- [ ] Exportar lista de rechazadas a CSV
- [ ] Gráficas de motivos de rechazo más comunes
- [ ] Filtros por fecha de rechazo

### Versión 1.2:
- [ ] Notas adicionales del admin
- [ ] Historial de cambios de estado
- [ ] Permitir al cliente responder al rechazo
- [ ] Templates de motivos comunes de rechazo

---

## 🚨 Consideraciones Importantes

### Privacidad:
- Las reservas rechazadas **SE GUARDAN** en la base de datos
- Incluyen comprobante de pago (foto)
- Considerar política de retención de datos
- Recomendación: Eliminar rechazadas después de 30 días

### Storage:
- Las imágenes de comprobantes rechazadas **permanecen en Cloudinary**
- Considerar limpieza periódica de imágenes de rechazadas antiguas
- Script de limpieza automática (futuro)

### GDPR/Protección de Datos:
- Cliente tiene derecho a solicitar eliminación de sus datos
- Implementar endpoint de eliminación (futuro)

---

## 🔧 API Endpoint

El endpoint existente ya soporta filtrado por estado:

```javascript
// Obtener solo rechazadas
GET /api/bookings?status=REJECTED

// Respuesta:
[
  {
    id: "clxy1234...",
    customerPhone: "573001234567@c.us",
    customerName: "Juan Pérez",
    status: "REJECTED",
    rejectionReason: "Pago no verificado",
    reviewedAt: "2026-04-17T14:30:00Z",
    // ... otros campos
  }
]
```

---

## 📂 Archivos Modificados

### Frontend:
- `src/pages/Dashboard.jsx`
  - Agregado query para `rejectedBookings`
  - Agregada pestaña "Rechazadas"
  - Creado componente `RejectedBookingCard`
  - Actualizada lógica de `currentBookings`
  - Contador en pestaña

### Backend:
- ✅ Sin cambios (ya soporta filtrado por status)
- `src/api/bookings.js` - endpoint `POST /:id/reject` ya existía

---

## 🎯 Resumen

El sistema ahora mantiene un registro completo de:
- ✅ Reservas pendientes (esperando aprobación)
- ✅ Reservas confirmadas (aprobadas)
- ✅ Reservas rechazadas (con motivo) 👈 NUEVO
- ✅ Vista de calendario integrada

**Beneficios:**
1. Transparencia total del proceso
2. Trazabilidad completa de decisiones
3. Posibilidad de análisis de rechazos
4. Cliente recibe feedback claro
5. Admin puede revisar decisiones pasadas

---

**Versión:** 2.2.0
**Fecha:** 2026-04-17
**Estado:** ✅ Implementado y Funcionando
