# 🔧 Solución de Problemas

Guía completa para resolver problemas comunes en el sistema de Alquiler de Lanchas.

---

## 🚨 Problemas Más Comunes

### 1. Bot No Responde a Mensajes

**Síntomas:**
- Envías "lancha" por WhatsApp
- No recibes respuesta del bot
- Silencio total

**Causas Posibles:**

#### A. Token de WhatsApp Expiró ⚠️ (MÁS COMÚN)

El Access Token temporal expira cada 24 horas.

**Cómo Verificar:**
1. Ve a Railway → Tu proyecto → Logs
2. Busca: `❌ Error sending message: Invalid token` o error `190`

**Solución:**
1. Ve a Meta Developers → Tu App → WhatsApp > API Setup
2. Click "Generate" en "Temporary access token"
3. Copia el nuevo token
4. Ve a Railway → Variables
5. Editar `WHATSAPP_ACCESS_TOKEN` → Pegar nuevo token
6. Railway se redesplegará automáticamente (2-3 min)

**Solución Permanente:**
- Crear System User Token (no expira)
- Ver backend/WHATSAPP_SETUP.md sección "Create Permanent Access Token"

#### B. Webhook No Suscrito a "messages"

**Cómo Verificar:**
1. Meta Developers → WhatsApp → Configuration
2. Sección "Webhook"
3. Verificar que "messages" esté marcado

**Solución:**
1. Marcar checkbox de "messages"
2. Click "Save"

#### C. Variables de Entorno Faltantes

**Cómo Verificar:**
```
https://lanchas-production.up.railway.app/api/debug/env
```

Deberías ver "✅ Set" en todas las variables.

**Solución:**
1. Railway → Variables
2. Agregar las que falten:
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_WABA_ID`
   - `WHATSAPP_VERIFY_TOKEN`
   - `WHATSAPP_APP_SECRET`

#### D. Número No Verificado como Destinatario

Solo los números agregados en Meta pueden recibir mensajes del bot de prueba.

**Cómo Verificar:**
1. Meta Developers → WhatsApp → API Setup
2. Sección "To" → Ver lista de números

**Solución:**
1. Click "Manage phone number list"
2. Agregar tu número: +57XXXXXXXXXX
3. Ingresar código de 6 dígitos que llega por WhatsApp

---

### 2. Bot Envía Texto Pero No Imágenes

**Síntomas:**
- Recibes mensajes de texto
- No recibes fotos de las lanchas

**Causas Posibles:**

#### A. URLs de Cloudinary Incorrectas

**Cómo Verificar:**
1. Abre: `/backend/src/config/messages.js`
2. Verifica que `BOAT_IMAGES.boat1` y `BOAT_IMAGES.boat2` sean URLs válidas
3. Copia la URL y pégala en navegador → Debe mostrar la imagen

**Solución:**
1. Verificar URLs en Cloudinary
2. Actualizar `messages.js` con URLs correctas
3. `git commit` y `git push`

#### B. Permisos de Cloudinary

**Solución:**
1. Ve a Cloudinary → Settings → Security
2. Verifica que las imágenes estén en modo "Public"

---

### 3. Error "Internal Server Error" en Webhook

**Síntomas:**
- Logs de Railway muestran: `❌ Webhook processing error`
- Status 500

**Causas Posibles:**

#### A. Error en Código JavaScript

**Cómo Verificar:**
Railway logs mostrarán el stack trace completo.

**Solución:**
1. Leer el error en logs
2. Identificar el archivo problemático
3. Revisar el código
4. Hacer fix y `git push`

#### B. Base de Datos Desconectada

**Cómo Verificar:**
Logs muestran: `Error: Connection terminated`

**Solución:**
1. Railway → PostgreSQL service → Restart
2. Verificar `DATABASE_URL` en variables

---

### 4. Comprobante de Pago No Se Guarda

**Síntomas:**
- Cliente envía foto
- Bot no confirma recepción
- No aparece en base de datos

**Causas Posibles:**

#### A. Credenciales de Cloudinary Inválidas

**Cómo Verificar:**
Logs muestran: `❌ Error handling payment receipt`

**Solución:**
1. Verificar en Cloudinary → Settings → Access Keys
2. Actualizar variables en Railway:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

#### B. Cliente No Está en Paso Correcto

El bot solo acepta fotos cuando está en `awaiting_payment`.

**Solución:**
Cliente debe seguir el flujo:
1. Enviar "lancha"
2. Enviar fecha y lancha
3. Enviar nombre
4. **Entonces** enviar foto

---

### 5. Railway No Despliega Cambios

**Síntomas:**
- Haces `git push`
- Railway no despliega
- Código viejo sigue en producción

**Causas Posibles:**

#### A. Build Failure

**Cómo Verificar:**
Railway → Deployments → Ver estado

**Solución:**
1. Click en deployment fallido
2. Leer logs de build
3. Corregir error
4. `git push` de nuevo

#### B. GitHub No Conectado

**Solución:**
1. Railway → Settings → GitHub
2. Reconnect repository

---

### 6. Webhook Verification Failed

**Síntomas:**
Al configurar webhook en Meta: "The callback URL or verify token couldn't be validated"

**Causas Posibles:**

#### A. Verify Token No Coincide

**Solución:**
1. Verificar que `WHATSAPP_VERIFY_TOKEN` en Railway sea exactamente:
   ```
   lanchas-webhook-secret-2026
   ```
2. En Meta, usar el **mismo** token

#### B. Railway App No Está Corriendo

**Solución:**
1. Verificar que deployment esté "Active"
2. Test: `https://lanchas-production.up.railway.app/health`
3. Debe retornar: `{"status":"ok"}`

---

### 7. Cliente Recibe Mensaje Duplicado

**Síntomas:**
- Bot envía mismo mensaje 2 veces
- Spam al cliente

**Causas Posibles:**

Webhook recibido múltiples veces por Meta (retry).

**Solución:**
Esto es normal si hubo timeout. Meta reintenta.
- Si es frecuente, optimizar código para responder más rápido
- Implementar idempotencia (guardar message IDs procesados)

---

### 8. Error "Recipient not allowed"

**Síntomas:**
Logs muestran: `Error sending message: Recipient phone number not in allowed list`

**Causa:**
Número no está verificado como destinatario de prueba.

**Solución:**
1. Meta Developers → WhatsApp → API Setup
2. Agregar número a lista de destinatarios
3. Verificar con código de WhatsApp

---

### 9. Base de Datos Muestra Datos Viejos

**Síntomas:**
- Reservas antiguas siguen apareciendo
- No se actualiza

**Solución:**

#### Opción A: Prisma Studio
```bash
cd backend
npx prisma studio
```
Abre http://localhost:5555 → Ver/editar datos

#### Opción B: Reset Completo
```bash
cd backend
npx prisma migrate reset
npx prisma db seed
```
⚠️ **Esto borra TODOS los datos**

---

### 10. Landing Page Muestra Error 404

**Síntomas:**
`https://lanchas-production.up.railway.app` da 404

**Solución:**
1. Verificar que `landing.js` existe en `/backend/src/api/`
2. Verificar que está registrado en `/backend/src/server.js`
3. Railway logs → Buscar errores al iniciar
4. Redeploy si es necesario

---

## 🔍 Cómo Diagnosticar Problemas

### Paso 1: Verificar Logs

**Railway:**
1. Ve a https://railway.app/dashboard
2. Tu proyecto → Deployments
3. Click en último deployment
4. Lee logs de abajo hacia arriba

**Buscar:**
- ❌ (errores)
- `Error:` (mensajes de error)
- Stack traces

### Paso 2: Verificar Variables de Entorno

```
https://lanchas-production.up.railway.app/api/debug/env
```

Todas deben mostrar "✅ Set"

### Paso 3: Probar Endpoint de Health

```
https://lanchas-production.up.railway.app/health
```

Debe retornar:
```json
{"status":"ok"}
```

### Paso 4: Probar Webhook Manualmente

```bash
curl "https://lanchas-production.up.railway.app/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=lanchas-webhook-secret-2026&hub.challenge=test"
```

Debe retornar: `test`

---

## 📞 Contactos de Ayuda

### Documentación

1. **CLAUDE.md** - Usar Claude para resolver problemas
2. **PROJECT_STATUS.md** - Estado actual del sistema
3. **backend/WHATSAPP_SETUP.md** - Setup de WhatsApp
4. **backend/DEPLOY_CHECKLIST.md** - Deployment

### Servicios

- **Railway:** https://docs.railway.app
- **WhatsApp Cloud API:** https://developers.facebook.com/docs/whatsapp
- **Prisma:** https://www.prisma.io/docs
- **Cloudinary:** https://cloudinary.com/documentation

---

## 🛠️ Comandos Útiles

### Ver Logs en Tiempo Real

Railway Dashboard → Deployments → Latest → Ver logs

### Restart Servicio

Railway → Service → Settings → Restart

### Verificar Variables

Railway → Service → Variables → Ver lista

### Redeploy Manual

Railway → Service → Redeploy

O:
```bash
git commit --allow-empty -m "Force redeploy"
git push
```

### Ver Base de Datos

```bash
cd backend
npx prisma studio
```

### Generar Nuevo Token

Meta Developers → WhatsApp → API Setup → Generate token

---

## ⚡ Soluciones Rápidas

| Problema | Solución Rápida |
|----------|----------------|
| Bot no responde | Regenerar token en Meta → Actualizar en Railway |
| Token expiró | Meta → Generate token → Railway Variables |
| Webhook no funciona | Verificar suscripción a "messages" en Meta |
| Imágenes no llegan | Verificar URLs en `messages.js` |
| Error 500 | Ver logs en Railway → Identificar error |
| Número bloqueado | Agregar como destinatario en Meta |
| Deploy falla | Ver logs de build → Corregir error → Push |

---

## 🚨 Preguntas Frecuentes (FAQ)

### ¿Cada cuánto expira el token?

Los tokens **temporales** expiran cada **24 horas**.

**Solución:** Crear System User token (no expira).

### ¿Cuántos números puedo agregar para pruebas?

**5 números máximo** con el número de prueba de Meta.

Para más, usar número de producción verificado.

### ¿Puedo usar mi número personal de WhatsApp?

No directamente. Debes:
1. Verificar tu negocio en Meta
2. Agregar número de producción
3. Actualizar `WHATSAPP_PHONE_NUMBER_ID`

### ¿Los mensajes tienen costo?

- Mensajes **dentro de 24h window**: GRATIS
- 1000 conversaciones/mes: GRATIS
- Templates fuera de 24h: Tienen costo

Tu caso de uso (cliente inicia) = **GRATIS**

### ¿Cómo sé si el webhook está funcionando?

```
https://lanchas-production.up.railway.app/api/debug/env
```

Y envía "lancha" → Revisa logs en Railway.

### ¿Puedo cambiar mensajes sin programar?

Actualmente no. Debes editar `/backend/src/config/messages.js` y hacer commit.

**Futuro:** Agregar panel de admin para editar mensajes.

### ¿Cómo agrego una tercera lancha?

1. Editar `/backend/src/config/messages.js`
2. Agregar `MESSAGES.boat3` y `BOAT_IMAGES.boat3`
3. Modificar `/backend/src/whatsapp/handlers.js` para soportar opción "3"
4. Commit y push

**Mejor:** Usa Claude y di: "Quiero agregar una tercera lancha"

---

## 🆘 Si Nada Funciona

### Opción 1: Usar Claude

```
Hola Claude,

El bot de lanchas no funciona. Aquí está el error:

[Pegar error de logs]

¿Puedes ayudarme a solucionarlo?

Contexto:
- Código: /Users/afa/Documents/personal/lanchas
- Lee CLAUDE.md y PROJECT_STATUS.md primero
```

### Opción 2: Rollback

Si un deploy rompió todo:

```bash
git revert HEAD
git push
```

Railway desplegará la versión anterior.

### Opción 3: Redeploy Completo

1. Railway → Service → Settings → Delete Service
2. Crear nuevo servicio desde GitHub
3. Agregar variables de entorno
4. Configurar webhook de nuevo

⚠️ Solo como último recurso.

---

**Última actualización:** Mayo 2026
**Versión:** 1.0

**Recuerda:** La mayoría de problemas se resuelven con:
1. Ver logs de Railway
2. Verificar variables de entorno
3. Regenerar token de WhatsApp
4. Leer este documento

**¡No te rindas! Todo tiene solución.** 🚀
