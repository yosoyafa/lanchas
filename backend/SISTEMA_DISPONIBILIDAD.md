# 🗓️ Sistema de Verificación de Disponibilidad

## ✅ Implementado - Prevención de Conflictos

El bot ahora **verifica disponibilidad ANTES de pedir el pago**, evitando reservas duplicadas y conflictos.

---

## 🔄 Nuevo Flujo de Conversación

### Antes (Sin verificación):
```
Cliente: lancha
Bot: [Fotos + info de pago]
Cliente: [Envía comprobante]
Bot: Comprobante recibido
Admin: Asigna fecha manualmente (puede haber conflicto ❌)
```

### Ahora (Con verificación):
```
Cliente: lancha
Bot: [Fotos]
Bot: ¿Qué fecha y lancha quieres?

Cliente: 25 de enero, lancha 1
Bot: Verifica disponibilidad en DB...

SI ESTÁ DISPONIBLE ✅:
Bot: ¡Disponible! Envía tu comprobante
Cliente: [Envía comprobante]
Bot: Reserva confirmada para 25 de enero, Lancha 1

SI NO ESTÁ DISPONIBLE ❌:
Bot: No disponible ese día
Bot: ¿Quieres la Lancha 2? (si está libre)
Bot: Próximas 3 fechas disponibles para Lancha 1:
     1. Sábado, 26 de enero
     2. Domingo, 27 de enero  
     3. Lunes, 28 de enero
```

---

## 📋 Ejemplos de Conversación

### Ejemplo 1: Disponible ✅

```
Cliente: Hola, quiero rentar una lancha
Bot: ¡Hola! 👋
     Tenemos 2 lanchas disponibles para rentar:
     [Foto Lancha 1] 🚤 Lancha 1: Capacidad 8 personas...
     [Foto Lancha 2] 🚤 Lancha 2: Capacidad 6 personas...
     
     📅 Para verificar disponibilidad, por favor indícame:
     1️⃣ ¿Qué fecha necesitas? (Ejemplo: 25 de enero)
     2️⃣ ¿Qué lancha prefieres? (1 o 2)
     
     Ejemplo: "25 de enero, lancha 1"

Cliente: 25 de enero, lancha 1

Bot: ✅ ¡Excelente! La Lancha 1 está disponible para 
     el sábado, 25 de enero de 2026.
     
     💳 Para reservar:
     Banco: Bancolombia
     Cuenta: 1234567890
     ...
     📸 Envía tu comprobante de pago por aquí.

Cliente: [Envía foto del comprobante]

Bot: ✅ Comprobante recibido!
     📅 Fecha: sábado, 25 de enero de 2026
     🚤 Lancha: 1
     
     Estamos revisando tu pago y te confirmaremos pronto.
     Referencia: abc12345
```

### Ejemplo 2: No Disponible, Ofrece Alternativas ❌

```
Cliente: 25 de enero, lancha 1

Bot: ❌ Lo siento, la Lancha 1 no está disponible 
     para el sábado, 25 de enero de 2026.
     
     ✅ Pero la Lancha 2 SÍ está disponible para esa fecha!
     
     ¿Te gustaría reservar la Lancha 2?
     Responde: "sí, lancha 2" para continuar.
     
     📅 Próximas fechas disponibles para Lancha 1:
     1. Domingo, 26 de enero de 2026
     2. Lunes, 27 de enero de 2026
     3. Martes, 28 de enero de 2026
     
     Responde con una de estas fechas para reservar.

Cliente: 26 de enero, lancha 1

Bot: ✅ ¡Excelente! La Lancha 1 está disponible...
```

### Ejemplo 3: Ambas Lanchas Ocupadas ❌❌

```
Cliente: 25 de enero, lancha 1

Bot: ❌ Lo siento, la Lancha 1 no está disponible 
     para el sábado, 25 de enero de 2026.
     
     La Lancha 2 tampoco está disponible ese día.
     
     📅 Próximas fechas disponibles para Lancha 1:
     1. Domingo, 26 de enero de 2026
     2. Lunes, 27 de enero de 2026
     3. Martes, 28 de enero de 2026
     
     Responde con una de estas fechas para reservar.
```

---

## 🧠 Formatos de Fecha Aceptados

El bot entiende varios formatos:

### Formato Natural:
- "25 de enero"
- "15 febrero" (sin "de")
- "3 de marzo"

### Formato Numérico:
- "25/01/2026"
- "25-01-2026"
- "15/02/2026"

### Detección de Lancha:
- "lancha 1"
- "lancha1"
- Solo "1"
- "lancha 2"
- "lancha2"
- Solo "2"

### Ejemplos Válidos:
```
✅ "25 de enero, lancha 1"
✅ "lancha 1, 25 de enero"
✅ "25/01/2026 lancha 2"
✅ "quiero la 1 para el 15 febrero"
✅ "15-02-2026, 2"
```

---

## 🔍 Verificación de Disponibilidad

### Criterios:
- Busca en DB reservas con estado `CONFIRMED` o `PAYMENT_SUBMITTED`
- Para la fecha solicitada (mismo día, de 00:00 a 23:59)
- Y la lancha solicitada (1 o 2)

### Lógica:
```javascript
// Disponible SI:
- NO hay reserva confirmada para esa fecha + lancha
- NO hay reserva pendiente de pago para esa fecha + lancha

// NO disponible SI:
- HAY una reserva confirmada para esa fecha + lancha
- O HAY una reserva pendiente para esa fecha + lancha
```

### Prevención de Dobles Reservas:
- Las reservas `PAYMENT_SUBMITTED` cuentan como ocupadas
- Esto previene que 2 clientes reserven mientras admin revisa

---

## 📅 Búsqueda de Fechas Alternativas

Si la fecha solicitada no está disponible:

1. **Verifica la otra lancha** para la misma fecha
2. **Busca las próximas 3 fechas disponibles** para la lancha solicitada
3. Busca hasta **60 días** en el futuro

### Algoritmo:
```
Fecha solicitada: 25 enero
Lancha solicitada: 1

1. Revisa 26 enero → Ocupada
2. Revisa 27 enero → Disponible ✅ (1era alternativa)
3. Revisa 28 enero → Disponible ✅ (2da alternativa)
4. Revisa 29 enero → Ocupada
5. Revisa 30 enero → Disponible ✅ (3era alternativa)

Devuelve: [27 enero, 28 enero, 30 enero]
```

---

## 💾 Estado de Conversación

Cada cliente tiene un contexto que incluye:

```javascript
{
  conversationStarted: true/false,
  step: 'initial' | 'awaiting_date_and_boat' | 'awaiting_payment',
  selectedDate: Date,
  selectedBoat: 1 | 2,
  lastMessageTime: timestamp
}
```

### Pasos:
1. **initial**: Primera vez, aún no ha pedido info
2. **awaiting_date_and_boat**: Ya vio fotos, esperando que diga fecha + lancha
3. **awaiting_payment**: Disponibilidad confirmada, esperando comprobante

---

## 🎯 Ventajas del Nuevo Sistema

### Para el Cliente:
- ✅ Sabe inmediatamente si hay disponibilidad
- ✅ Ve alternativas automáticamente
- ✅ No pierde tiempo enviando pago para fechas ocupadas
- ✅ Mejor experiencia de usuario

### Para el Admin:
- ✅ Evita conflictos de reservas
- ✅ Fecha y lancha ya pre-asignadas en la reserva
- ✅ Solo debe aprobar/rechazar el pago
- ✅ No necesita verificar disponibilidad manualmente
- ✅ Menos errores y confusiones

### Para el Negocio:
- ✅ Proceso más profesional
- ✅ Reduce trabajo manual
- ✅ Evita dobles reservas
- ✅ Clientes más satisfechos

---

## 🔧 Configuración

### Timeout de Contexto:
```javascript
const CONTEXT_TIMEOUT = 60 * 60 * 1000; // 1 hora
```

Después de 1 hora sin mensajes, el cliente debe empezar de nuevo.

### Días de Búsqueda:
```javascript
const maxDaysToCheck = 60; // 2 meses
```

Busca alternativas hasta 60 días en el futuro.

---

## 📊 Dashboard - Vista Mejorada

En el admin dashboard ahora verás:

**Reservas Pendientes:**
- Ya tienen fecha y lancha asignadas
- Admin solo aprueba el pago
- No necesita editar fecha/lancha (ya están correctas)

**Opcional:** Admin puede cambiar si es necesario, pero normalmente ya está bien.

---

## 🧪 Testing

### Caso 1: Reserva Normal
1. Cliente: "lancha"
2. Bot: [Fotos] + "¿Qué fecha y lancha?"
3. Cliente: "25 de enero, lancha 1"
4. Bot: "✅ Disponible" + info de pago
5. Cliente: [Comprobante]
6. Bot: "✅ Recibido - Ref: abc123"

### Caso 2: Conflicto
1. Cliente A reserva: 25 enero, Lancha 1
2. Cliente B intenta: 25 enero, Lancha 1
3. Bot a B: "❌ No disponible" + alternativas

### Caso 3: Fecha Pasada
1. Cliente: "15 de diciembre, lancha 1" (ya pasó)
2. Bot: "❌ Esa fecha ya pasó"

---

## 🚀 Reiniciar Backend

Para aplicar los cambios:

```bash
cd backend
# Ctrl+C para detener
npm run dev
```

---

**Versión:** 2.0.0
**Fecha:** 2026-04-17
**Estado:** ✅ Activo
