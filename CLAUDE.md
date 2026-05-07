# Guía para Trabajar con Claude en este Proyecto

## 👋 Bienvenido

Este documento te ayudará a continuar desarrollando el proyecto de **Alquiler de Lanchas por WhatsApp** usando Claude, **sin necesidad de conocimientos técnicos previos**.

---

## 📋 ¿Qué es este Proyecto?

Un sistema automatizado de reservas de lanchas que funciona completamente por WhatsApp:

- **Cliente:** Envía "lancha" por WhatsApp
- **Bot:** Responde automáticamente con fotos, precios y disponibilidad
- **Cliente:** Elige fecha, lancha, envía nombre y comprobante de pago
- **Admin:** Revisa y aprueba la reserva desde un dashboard web
- **Bot:** Confirma automáticamente al cliente

**Todo es 100% automático y está en la nube (Railway).**

---

## 🚀 Estado Actual del Proyecto

### ✅ Lo que YA Funciona

1. **Bot de WhatsApp (WhatsApp Cloud API)**
   - ✅ Recibe mensajes de clientes
   - ✅ Envía información de lanchas con fotos
   - ✅ Valida disponibilidad por fecha
   - ✅ Recibe comprobantes de pago
   - ✅ Guarda reservas en base de datos
   - ✅ Envía confirmaciones automáticas

2. **Backend (Node.js + Express)**
   - ✅ API REST para autenticación
   - ✅ API REST para gestión de reservas
   - ✅ Webhook de WhatsApp funcionando
   - ✅ Base de datos PostgreSQL (Prisma)
   - ✅ Almacenamiento de imágenes (Cloudinary)

3. **Landing Page**
   - ✅ Página web con información de lanchas
   - ✅ Botón directo para reservar por WhatsApp
   - ✅ Política de privacidad
   - ✅ Términos de servicio

4. **Infraestructura**
   - ✅ Desplegado en Railway (producción)
   - ✅ GitHub para control de versiones
   - ✅ Variables de entorno configuradas
   - ✅ Dominio: `https://lanchas-production.up.railway.app`

### 🔧 Lo que Falta (Próximos Pasos)

1. **Dashboard de Admin (Frontend)**
   - ⚠️ Existe código en `/frontend` pero necesita revisión
   - Necesita: Login, lista de reservas, aprobar/rechazar

2. **Mejoras Opcionales**
   - WhatsApp Flows (interfaz más visual)
   - Notificaciones por email
   - Calendario de disponibilidad
   - Reportes de reservas

---

## 💬 Cómo Usar Claude para Este Proyecto

### Regla de Oro

**Siempre empieza tu conversación con:**

```
"Estoy trabajando en el proyecto de Alquiler de Lanchas.
El código está en: /Users/afa/Documents/personal/lanchas
Por favor, lee el archivo CLAUDE.md y PROJECT_STATUS.md primero."
```

Esto le da contexto a Claude sobre dónde está todo.

---

## 📝 Comandos Útiles para Claude

### Ver el Estado del Proyecto

```
"Claude, muéstrame un resumen del estado actual del proyecto.
Lee PROJECT_STATUS.md"
```

### Hacer Cambios en el Código

**Ejemplo 1: Cambiar Mensajes del Bot**

```
"Claude, quiero cambiar el mensaje de bienvenida del bot.
Actualmente dice 'Hola! 👋' y quiero que diga 'Bienvenido a Lanchas Rental! 🚤'
El archivo de mensajes está en /backend/src/config/messages.js"
```

**Ejemplo 2: Agregar Nueva Funcionalidad**

```
"Claude, quiero que el bot también pregunte cuántas personas van a viajar.
Esto debe ser después de que el cliente elija la fecha y antes de pedir el nombre.
¿Puedes ayudarme a implementarlo?"
```

**Ejemplo 3: Cambiar Precios o Capacidades**

```
"Claude, necesito actualizar la capacidad de la Lancha 1 de 10 a 12 personas.
También cambiar el precio. ¿Dónde hago esos cambios?"
```

### Desplegar Cambios a Producción

```
"Claude, he hecho cambios en el código y quiero desplegarlos a producción.
¿Puedes ayudarme con los comandos de git?"
```

Claude te guiará:
```bash
git add .
git commit -m "Descripción del cambio"
git push
```

Railway detecta automáticamente y despliega en 2-3 minutos.

### Resolver Problemas

```
"Claude, el bot dejó de responder. ¿Cómo puedo diagnosticar el problema?"
```

Claude te ayudará a:
- Revisar logs de Railway
- Verificar variables de entorno
- Probar el webhook

---

## 🗂️ Estructura del Proyecto

```
/Users/afa/Documents/personal/lanchas/
│
├── backend/                    # Servidor Node.js (lo principal)
│   ├── src/
│   │   ├── api/               # Endpoints REST
│   │   │   ├── auth.js        # Login de admins
│   │   │   ├── bookings.js    # Gestión de reservas
│   │   │   ├── whatsapp.js    # Webhook de WhatsApp
│   │   │   ├── landing.js     # Página principal
│   │   │   └── privacy.js     # Políticas
│   │   │
│   │   ├── whatsapp/          # Lógica del bot
│   │   │   ├── api.js         # Funciones para enviar mensajes
│   │   │   └── handlers.js    # Procesar mensajes entrantes
│   │   │
│   │   ├── config/            # Configuración
│   │   │   ├── database.js    # Conexión a PostgreSQL
│   │   │   ├── cloudinary.js  # Almacenamiento de imágenes
│   │   │   └── messages.js    # ⭐ MENSAJES DEL BOT (edita aquí)
│   │   │
│   │   ├── server.js          # Servidor Express
│   │   └── index.js           # Punto de entrada
│   │
│   ├── prisma/                # Base de datos
│   │   └── schema.prisma      # Estructura de la BD
│   │
│   ├── package.json           # Dependencias
│   ├── Dockerfile             # Configuración Docker
│   └── .env.production        # Variables de entorno (NO SUBIR A GIT)
│
├── frontend/                  # Dashboard Admin (pendiente)
│   └── (código React)
│
└── Documentación/
    ├── CLAUDE.md              # ⭐ ESTE ARCHIVO
    ├── PROJECT_STATUS.md      # Estado actual completo
    ├── README.md              # Descripción del proyecto
    ├── MIGRATION_GUIDE.md     # Historia de la migración
    ├── DEPLOY_CHECKLIST.md    # Cómo desplegar
    ├── TROUBLESHOOTING.md     # Solución de problemas
    └── WHATSAPP_SETUP.md      # Configuración de WhatsApp
```

---

## 📍 Archivos Importantes para Editar

### 1. Mensajes del Bot
**Archivo:** `/backend/src/config/messages.js`

```javascript
const MESSAGES = {
  welcome: '¡Hola! 👋\n\nGracias por contactarnos...',
  boat1: '🚤 Lancha 1: Capacidad 8 personas...',
  boat2: '🚤 Lancha 2: Capacidad 6 personas...',
  payment: '💳 Para reservar:\n\nBanco: Bancolombia...'
};
```

**Qué puedes cambiar:**
- Textos de bienvenida
- Descripciones de lanchas
- Instrucciones de pago
- Información bancaria

### 2. Imágenes de las Lanchas
**Archivo:** `/backend/src/config/messages.js`

```javascript
const BOAT_IMAGES = {
  boat1: 'https://res.cloudinary.com/...',
  boat2: 'https://res.cloudinary.com/...'
};
```

**Cómo cambiar:**
1. Sube nueva imagen a Cloudinary
2. Copia la URL
3. Reemplaza en este archivo

### 3. Lógica de Conversación
**Archivo:** `/backend/src/whatsapp/handlers.js`

Este archivo controla TODO el flujo de conversación:
- Qué responde cuando alguien dice "lancha"
- Cómo valida fechas
- Qué pregunta en cada paso
- Cómo procesa comprobantes

**Solo edita si sabes lo que haces, o pídele a Claude.**

### 4. Landing Page
**Archivo:** `/backend/src/api/landing.js`

Controla el contenido de `https://lanchas-production.up.railway.app`

### 5. Base de Datos
**Archivo:** `/backend/prisma/schema.prisma`

Define la estructura de datos:
- Booking (reservas)
- Admin (usuarios admin)

**Solo modifica con ayuda de Claude.**

---

## 🔧 Tareas Comunes

### Cambiar un Mensaje del Bot

1. Di a Claude:
```
"Claude, quiero cambiar el mensaje de bienvenida.
Abre /backend/src/config/messages.js"
```

2. Claude te mostrará el archivo

3. Dile qué cambiar:
```
"Cambia 'Hola!' por 'Bienvenido a Lanchas Paradise!'"
```

4. Claude hará el cambio y te preguntará si quieres desplegarlo

5. Di: "Sí, despliega a producción"

6. Claude ejecutará:
```bash
git add .
git commit -m "Update welcome message"
git push
```

### Cambiar Información Bancaria

```
"Claude, necesito actualizar los datos bancarios para el pago.
Banco: Davivienda
Cuenta: 9876543210
Titular: Mi Empresa SAS"
```

Claude actualizará `/backend/src/config/messages.js` en la sección `payment`.

### Agregar una Tercera Lancha

```
"Claude, quiero agregar una tercera lancha al sistema.

Lancha 3:
- Capacidad: 15 personas
- Motor: 50HP
- Precio: $XXX
- Imagen: [URL de Cloudinary]

¿Qué archivos necesito modificar?"
```

Claude te guiará paso a paso.

### Ver Logs de Errores

```
"Claude, el bot no está respondiendo.
¿Puedes ayudarme a revisar los logs de Railway?"
```

Claude te dirá:
1. Ve a https://railway.app/dashboard
2. Abre tu proyecto
3. Click en "Deployments"
4. Busca errores marcados con ❌

### Actualizar Token de WhatsApp

Los tokens temporales de WhatsApp expiran cada 24 horas.

```
"Claude, mi token de WhatsApp expiró.
Tengo un nuevo token: EAA...
¿Cómo lo actualizo?"
```

Claude te guiará a:
1. Railway → Variables
2. Editar `WHATSAPP_ACCESS_TOKEN`
3. Guardar (redeploy automático)

---

## 🆘 Solución de Problemas

### "El bot no responde"

Di a Claude:
```
"El bot no está respondiendo a los mensajes.
¿Puedes ayudarme a diagnosticar?"
```

Claude revisará:
- ✅ Webhook está activo
- ✅ Variables de entorno
- ✅ Logs de Railway
- ✅ Token no expiró

### "El cliente no recibe las fotos"

```
"El bot envía mensajes de texto pero no las fotos de las lanchas.
¿Qué puede estar mal?"
```

Claude verificará:
- URLs de Cloudinary
- Permisos de Cloudinary
- Logs de error en Railway

### "No puedo acceder al dashboard de admin"

```
"No puedo entrar al dashboard de administración.
¿Cómo lo arreglo?"
```

Claude te ayudará con:
- Verificar que el frontend está corriendo
- Crear/resetear usuario admin
- Verificar credenciales

---

## 📚 Recursos Adicionales

### Documentos Clave

1. **PROJECT_STATUS.md** - Estado completo y detallado del proyecto
2. **TROUBLESHOOTING.md** - Problemas comunes y soluciones
3. **DEPLOY_CHECKLIST.md** - Cómo desplegar cambios
4. **WHATSAPP_SETUP.md** - Configuración de WhatsApp Cloud API

### URLs Importantes

- **Producción:** https://lanchas-production.up.railway.app
- **Railway:** https://railway.app/dashboard
- **GitHub:** https://github.com/yosoyafa/lanchas
- **Meta Developers:** https://developers.facebook.com/apps
- **Cloudinary:** https://cloudinary.com/console

### Credenciales

**Ubicación:** `/backend/.env.production` (NO COMPARTIR)

```env
DATABASE_URL=postgresql://...
WHATSAPP_PHONE_NUMBER_ID=1128610730326714
WHATSAPP_ACCESS_TOKEN=EAA...
CLOUDINARY_CLOUD_NAME=...
```

**⚠️ NUNCA compartas estas credenciales públicamente.**

---

## 💡 Mejores Prácticas

### 1. Siempre Prueba Localmente Primero

Antes de desplegar a producción:

```
"Claude, quiero probar este cambio localmente antes de subirlo.
¿Cómo inicio el servidor en mi máquina?"
```

### 2. Usa Mensajes de Commit Descriptivos

```
"Claude, estoy listo para desplegar.
El commit debe decir: 'Actualizar capacidad de Lancha 1 a 12 personas'"
```

### 3. Haz Backups de la Base de Datos

```
"Claude, ¿cómo hago un backup de la base de datos antes de hacer cambios grandes?"
```

### 4. Mantén Documentación Actualizada

Después de cambios importantes:

```
"Claude, actualiza el archivo PROJECT_STATUS.md con los cambios que hicimos hoy."
```

---

## 🎓 Aprendiendo Más

### Si quieres entender mejor el código

```
"Claude, explícame cómo funciona el archivo handlers.js paso a paso,
como si no supiera programar."
```

### Si quieres agregar funcionalidades nuevas

```
"Claude, quiero que el bot también envíe un recordatorio
24 horas antes de la fecha de reserva.
¿Es posible? ¿Cómo se haría?"
```

### Si algo no funciona

```
"Claude, intenté hacer [X] pero obtuve este error: [pegar error].
¿Qué significa y cómo lo soluciono?"
```

---

## ✅ Checklist para Nuevos Cambios

Antes de pedirle algo a Claude, verifica:

- [ ] ¿Tengo acceso a Railway?
- [ ] ¿Tengo acceso al repositorio de GitHub?
- [ ] ¿Sé qué quiero cambiar exactamente?
- [ ] ¿Es un cambio pequeño o grande?
- [ ] ¿Necesito probar primero?

Luego di a Claude:

```
"Claude, quiero hacer el siguiente cambio: [descripción].
Es un cambio [pequeño/grande].
[Quiero probarlo primero / Puedo desplegarlo directo].
¿Me ayudas?"
```

---

## 🚨 Reglas de Seguridad

### NUNCA Compartas

- ❌ Tokens de WhatsApp
- ❌ Credenciales de base de datos
- ❌ API keys de Cloudinary
- ❌ Contraseñas de admin
- ❌ Archivo `.env` o `.env.production`

### SIEMPRE Verifica

- ✅ Que el cambio no rompe funcionalidad existente
- ✅ Que los mensajes del bot tengan sentido
- ✅ Que los datos de pago son correctos
- ✅ Que las imágenes se ven bien

---

## 📞 Soporte

Si Claude no puede ayudarte con algo:

1. Lee el archivo **TROUBLESHOOTING.md**
2. Revisa los logs de Railway
3. Busca el error en Google
4. Consulta la documentación oficial:
   - WhatsApp API: https://developers.facebook.com/docs/whatsapp
   - Railway: https://docs.railway.app
   - Prisma: https://www.prisma.io/docs

---

## 🎯 Próximos Pasos Sugeridos

### Corto Plazo (1-2 semanas)

1. **Terminar Dashboard de Admin**
   - Login funcional
   - Ver lista de reservas
   - Aprobar/rechazar fácilmente

2. **Mejorar Mensajes del Bot**
   - Personalizar según tu marca
   - Agregar más emojis o ser más formal
   - Incluir horarios de atención

3. **Crear Token Permanente de WhatsApp**
   - Los temporales expiran cada 24h
   - Ver WHATSAPP_SETUP.md sección "Permanent Token"

### Mediano Plazo (1 mes)

1. **Implementar WhatsApp Flows**
   - Interfaz más visual
   - Selector de calendario
   - Menos errores de usuario

2. **Notificaciones por Email**
   - Confirmar reservas por correo
   - Recordatorios automáticos

3. **Reportes y Analytics**
   - Cuántas reservas por mes
   - Lancha más popular
   - Ingresos totales

### Largo Plazo (3+ meses)

1. **App Móvil para Admins**
2. **Sistema de Pagos Online**
3. **Múltiples Idiomas**
4. **Integración con Calendar**

---

## 🙏 Consejos Finales

1. **Claude es tu asistente técnico, no un mago**
   - Sé específico en lo que pides
   - Dale contexto
   - Si no entiende, reformula

2. **Guarda las conversaciones importantes**
   - Claude no recuerda sesiones anteriores
   - Siempre empieza dándole contexto

3. **Pregunta "¿Por qué?" si no entiendes**
   - Claude puede explicar conceptos técnicos en español simple

4. **No tengas miedo de romper cosas**
   - Todo está en Git, se puede revertir
   - Railway hace backups automáticos
   - Siempre puedes volver atrás

5. **Itera en pequeños pasos**
   - No intentes cambiar todo a la vez
   - Haz un cambio, prueba, despliega
   - Repite

---

## 📝 Plantilla de Conversación con Claude

Copia y pega esto para empezar cada sesión:

```
Hola Claude!

Estoy trabajando en el proyecto "Alquiler de Lanchas por WhatsApp".

Información del proyecto:
- Código: /Users/afa/Documents/personal/lanchas
- Backend: Node.js + Express + WhatsApp Cloud API
- Desplegado en: Railway
- Estado: Producción, bot funcionando

Por favor lee estos archivos primero:
1. CLAUDE.md (contexto general)
2. PROJECT_STATUS.md (estado actual)

Hoy quiero: [DESCRIBE QUÉ QUIERES HACER]

¿Puedes ayudarme?
```

---

## ✨ ¡Éxito!

Ahora tienes todo lo necesario para continuar desarrollando el proyecto con ayuda de Claude.

**Recuerda:** Claude está aquí para ayudarte. No necesitas saber programar. Solo necesitas saber qué quieres lograr y comunicarlo claramente.

**¡Buena suerte! 🚀**

---

**Última actualización:** Mayo 2026
**Versión:** 1.0
**Proyecto:** Alquiler de Lanchas - WhatsApp Bot
