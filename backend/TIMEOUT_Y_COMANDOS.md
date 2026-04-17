# ⏱️ Sistema de Timeout y Comandos

## Timeout Automático

**Duración:** 1 hora (3,600,000 ms)

El bot resetea automáticamente la conversación si el cliente no envía mensajes durante 1 hora.

### Configuración

```javascript
// backend/src/whatsapp/handlers.js
const CONTEXT_TIMEOUT = 60 * 60 * 1000; // 1 hour
```

### Comportamiento

```
Cliente envía mensaje a las 10:00 AM
↓
Conversación activa
↓
Cliente no responde...
↓
11:00 AM - TIMEOUT
↓
Próximo mensaje del cliente resetea el contexto
(Debe escribir "lancha" de nuevo para empezar)
```

## Comandos de Reset Manual

El cliente puede resetear la conversación en cualquier momento escribiendo:

- `cancelar`
- `reiniciar`
- `inicio`
- `empezar`
- `reset`

### Ejemplo de Uso

```
Cliente: lancha
Bot: [Fotos + pide fecha]

Cliente: cancelar
Bot: 🔄 Conversación reiniciada.
     Escribe "lancha" cuando quieras reservar de nuevo.

Cliente: lancha
Bot: [Fotos + pide fecha] (proceso reiniciado)
```

## Estados del Contexto

Cada cliente tiene un contexto que incluye:

```javascript
{
  lastMessageTime: 1234567890,        // Timestamp del último mensaje
  infoSent: true/false,               // Ya se envió la info de lanchas?
  conversationStarted: true/false,    // Ya inició conversación con "lancha"?
  step: 'initial' | 'awaiting_date_and_boat' | 'awaiting_payment',
  selectedDate: Date,                 // Fecha seleccionada
  selectedBoat: 1 | 2                 // Lancha seleccionada
}
```

### Estados (steps)

1. **initial**: Sin interacción aún
2. **awaiting_date_and_boat**: Ya vio fotos, esperando que diga fecha + lancha
3. **awaiting_payment**: Disponibilidad confirmada, esperando comprobante

## Reset Automático vs Manual

### Reset Automático (Timeout)

**Condición:**
```javascript
(now - context.lastMessageTime) > CONTEXT_TIMEOUT
```

**Qué resetea:**
- Toda la conversación
- Debe escribir "lancha" de nuevo

### Reset Manual (Comandos)

**Trigger:** Cliente escribe "cancelar", "reiniciar", etc.

**Qué resetea:**
```javascript
context.step = 'initial';
context.infoSent = false;
context.conversationStarted = false;
context.selectedDate = null;
context.selectedBoat = null;
```

**Resultado:** Conversación completamente reiniciada

## Mensajes Informativos

El bot informa sobre el comando "cancelar" en momentos clave:

### Al pedir fecha y lancha:
```
📅 Para verificar disponibilidad, por favor indícame:
...
💡 Escribe "cancelar" si quieres empezar de nuevo.
```

### Al pedir comprobante de pago:
```
✅ ¡Excelente! La Lancha 1 está disponible...
💳 Para reservar:
...
💡 Escribe "cancelar" si quieres empezar de nuevo.
```

### Si envía texto cuando debe enviar comprobante:
```
Por favor envía una foto de tu comprobante de pago...
Si quieres cancelar y empezar de nuevo, escribe "cancelar".
```

## Almacenamiento del Contexto

El contexto se almacena **en memoria** usando un `Map`:

```javascript
const conversationContext = new Map();
// Key: phoneNumber (ej: "573001234567@c.us")
// Value: context object
```

### Implicaciones:

- ✅ Rápido y eficiente
- ❌ Se pierde si el backend se reinicia
- ❌ No persiste entre deployments

### Para producción (futuro):

Considerar almacenar contexto en:
- Redis (recomendado para scale)
- PostgreSQL (tabla `conversation_context`)
- Session storage del framework

## Logs de Debug

El sistema imprime logs útiles:

```javascript
📍 Current context for 573001234567: { step: 'awaiting_date_and_boat', ... }
🎯 Processing date and boat selection for 573001234567
🔄 Resetting conversation for 573001234567
⏭️  Ignored message from 573001234567 (no "lancha" keyword)
```

## Escenarios Comunes

### Escenario 1: Cliente se confunde a mitad de proceso

```
Cliente: lancha
Bot: [Fotos]

Cliente: no, quiero la info otra vez
Bot: [Procesa como si fuera fecha/lancha, falla]

Cliente: cancelar
Bot: 🔄 Conversación reiniciada

Cliente: lancha
Bot: [Fotos de nuevo]
```

### Escenario 2: Cliente deja el chat abierto 2 horas

```
10:00 AM - Cliente: lancha
10:01 AM - Bot: [Fotos]

... (pasan 2 horas) ...

12:05 PM - Cliente: 25 de enero, lancha 1
12:05 PM - Bot: (timeout pasó, contexto reseteado)
           ⏭️ Ignored (no dice "lancha")

Cliente: lancha
Bot: [Fotos de nuevo]
```

### Escenario 3: Cliente cambia de opinión

```
Cliente: lancha
Bot: [Fotos + pide fecha]

Cliente: 30 de abril, lancha 1
Bot: ✅ Disponible! [Info de pago]

Cliente: espera, mejor cancelar
Bot: 🔄 Conversación reiniciada

Cliente: lancha
Bot: [Fotos]

Cliente: 5 de mayo, lancha 2
Bot: ✅ Disponible! [Info de pago]
```

## Configuración Recomendada

### Para MVP (actual):
- **Timeout:** 1 hora ✅
- **Storage:** In-memory Map ✅
- **Comandos:** cancelar, reiniciar, etc. ✅

### Para Producción:
- **Timeout:** 30-60 minutos
- **Storage:** Redis con TTL automático
- **Comandos:** Mismo set
- **Persistencia:** Backup en DB cada 5 minutos

## Testing

### Probar timeout:

```javascript
// Cambiar temporalmente para testing
const CONTEXT_TIMEOUT = 2 * 60 * 1000; // 2 minutos

// 1. Cliente envía "lancha"
// 2. Esperar 3 minutos
// 3. Cliente envía "30 de enero, lancha 1"
// 4. Verificar que se ignore (timeout)
```

### Probar comandos reset:

```bash
# Enviar desde WhatsApp:
lancha
→ [Recibe fotos]

cancelar
→ 🔄 Conversación reiniciada

reiniciar
→ 🔄 Conversación reiniciada

reset
→ 🔄 Conversación reiniciada
```

---

**Versión:** 1.0.0
**Fecha:** 2026-04-17
**Estado:** ✅ Implementado
