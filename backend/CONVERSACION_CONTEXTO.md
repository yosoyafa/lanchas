# 💬 Sistema de Contexto de Conversación

## 🔑 Palabra Clave para Iniciar: "lancha"

El bot **SOLO** responderá si el primer mensaje incluye la palabra **"lancha"**.

## 📋 Flujo de Conversación

### ✅ Conversación SE INICIA:

**Cliente:** "Hola, quiero rentar una lancha"
→ ✅ Bot envía info completa (contiene "lancha")

**Cliente:** "Información de lanchas"
→ ✅ Bot envía info completa (contiene "lancha")

**Cliente:** "lancha disponible?"
→ ✅ Bot envía info completa (contiene "lancha")

### ❌ Conversación NO SE INICIA:

**Cliente:** "Hola"
→ ❌ Bot NO responde (no contiene "lancha")

**Cliente:** "Buenos días"
→ ❌ Bot NO responde (no contiene "lancha")

**Cliente:** "Información"
→ ❌ Bot NO responde (no contiene "lancha")

## 🔄 Una Vez Iniciada la Conversación

Después de que el cliente dice "lancha" por primera vez:
- ✅ Bot responde a TODOS los mensajes siguientes
- ✅ Mantiene contexto por 1 hora
- ✅ No repite info a menos que cliente pida "info"

**Ejemplo completo:**

```
Cliente: "Hola quiero rentar una lancha"
Bot: [Envía fotos + info completa] ✅

Cliente: "Cuánto cuesta?"
Bot: [Respuesta contextual] ✅

Cliente: "Ok gracias"
Bot: [Respuesta de ayuda] ✅

[1 hora después...]

Cliente: "Hola"
Bot: [NO responde - contexto expiró, necesita decir "lancha" de nuevo] ❌

Cliente: "Quiero la lancha"
Bot: [Envía info de nuevo] ✅
```

## ⚙️ Configuración Técnica

**Archivo:** `backend/src/whatsapp/handlers.js`

**Lógica:**
```javascript
// Verifica si conversación está iniciada
if (!context.conversationStarted) {
  if (!messageText.includes('lancha')) {
    return; // No responder
  }
  context.conversationStarted = true;
}
```

**Timeout de contexto:** 1 hora
- Después de 1 hora sin mensajes, se reinicia el contexto
- Cliente debe decir "lancha" de nuevo para reactivar

## 🎯 Beneficios

1. **Reduce spam**: Solo responde a interesados reales
2. **Filtra mensajes accidentales**: Ignora "Hola" aleatorios
3. **Mantiene conversaciones activas**: Una vez iniciado, responde normalmente
4. **Reinicio automático**: Se reinicia después de inactividad

## 🔧 Cambiar la Palabra Clave

Si quieres cambiar "lancha" por otra palabra:

**Editar:** `backend/src/whatsapp/handlers.js`

```javascript
// Línea ~56
if (!messageText.includes('lancha')) {
  // Cambiar 'lancha' por tu palabra preferida
  // Ejemplo: 'bote', 'reserva', 'alquiler', etc.
}
```

## 📊 Logs

En la consola del backend verás:

```
⏭️  Ignored message from 573001234567@c.us (no "lancha" keyword)
```

Cuando alguien escribe sin decir "lancha".

---

**Versión:** 1.1.0
**Fecha:** 2025-01-15
**Estado:** ✅ Activo
