# 🚤 Alquiler de Lanchas - WhatsApp Bot

Sistema automatizado de reservas de lanchas completamente por WhatsApp, desplegado en Railway con WhatsApp Cloud API de Meta.

[![Estado](https://img.shields.io/badge/Estado-Producción-success)](https://lanchas-production.up.railway.app)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Cloud%20API-25D366)](https://developers.facebook.com/docs/whatsapp)
[![Railway](https://img.shields.io/badge/Deploy-Railway-blueviolet)](https://railway.app)

---

## 🎯 ¿Qué hace este proyecto?

Un bot de WhatsApp que automatiza completamente el proceso de reserva de lanchas:

1. **Cliente** envía "lancha" por WhatsApp
2. **Bot** responde con fotos, información y precios
3. **Cliente** elige fecha y lancha
4. **Bot** valida disponibilidad en tiempo real
5. **Cliente** envía nombre y comprobante de pago
6. **Bot** guarda todo en la base de datos
7. **Admin** aprueba desde el dashboard
8. **Bot** confirma automáticamente al cliente

**Todo sin intervención manual hasta la aprobación final.**

---

## ✨ Características

### Para Clientes

- ✅ Reserva **100% por WhatsApp**, sin apps ni formularios
- ✅ Respuesta **inmediata 24/7** (bot automático)
- ✅ Ver **fotos reales** de las lanchas
- ✅ Validación de **disponibilidad en tiempo real**
- ✅ Envío de **comprobante por foto**
- ✅ **Confirmación automática** después de aprobación

### Para Administradores

- ✅ **Dashboard web** para gestión (pendiente frontend)
- ✅ **Base de datos** con todas las reservas
- ✅ **Comprobantes almacenados** en la nube (Cloudinary)
- ✅ **Validación de fechas** automática
- ✅ **Notificaciones** automáticas a clientes
- ✅ **API REST** para integración

### Técnicas

- ✅ **WhatsApp Cloud API** oficial de Meta (estable, no requiere QR)
- ✅ **Webhooks** para mensajes en tiempo real
- ✅ **PostgreSQL** para persistencia de datos
- ✅ **Cloudinary** para almacenamiento de imágenes
- ✅ **Railway** para hosting (CI/CD automático)
- ✅ **Docker** containerizado
- ✅ **Prisma ORM** para gestión de BD

---

## 🚀 Demo en Vivo

**Landing Page:** https://lanchas-production.up.railway.app

**WhatsApp:** Configurado con número de prueba de Meta

---

## 🏗️ Arquitectura

```
┌──────────────────┐
│  Cliente         │
│  WhatsApp        │
└────────┬─────────┘
         │
         │ "lancha"
         │
         ▼
┌──────────────────────────────────┐
│  Meta WhatsApp Cloud API         │
│  (Official Business API)         │
└────────┬─────────────────────────┘
         │
         │ POST /api/whatsapp/webhook
         │
         ▼
┌──────────────────────────────────────────────┐
│  Railway                                     │
│  ┌────────────────────────────────────────┐  │
│  │  Node.js Backend (Express)             │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │  WhatsApp Handler                │  │  │
│  │  │  - Procesa mensajes              │  │  │
│  │  │  - Valida disponibilidad         │  │  │
│  │  │  - Guarda en BD                  │  │  │
│  │  │  - Envía respuestas              │  │  │
│  │  └──────────────────────────────────┘  │  │
│  │                                         │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │  PostgreSQL Database             │  │  │
│  │  │  - Bookings                      │  │  │
│  │  │  - Admins                        │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
         │
         │ Upload images
         │
         ▼
┌──────────────────────────────────┐
│  Cloudinary                      │
│  (Image Storage)                 │
└──────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
lanchas/
├── backend/                    # Node.js + Express
│   ├── src/
│   │   ├── api/               # API REST
│   │   │   ├── auth.js        # ✅ Autenticación
│   │   │   ├── bookings.js    # ✅ Gestión de reservas
│   │   │   ├── whatsapp.js    # ✅ Webhook WhatsApp
│   │   │   ├── landing.js     # ✅ Página principal
│   │   │   └── privacy.js     # ✅ Políticas
│   │   │
│   │   ├── whatsapp/          # Lógica del bot
│   │   │   ├── api.js         # ✅ Enviar mensajes
│   │   │   └── handlers.js    # ✅ Procesar mensajes
│   │   │
│   │   ├── config/            # Configuración
│   │   │   ├── database.js    # PostgreSQL
│   │   │   ├── cloudinary.js  # Imágenes
│   │   │   └── messages.js    # ⭐ Textos del bot
│   │   │
│   │   ├── server.js          # Express server
│   │   └── index.js           # Punto de entrada
│   │
│   ├── prisma/                # Base de datos
│   │   └── schema.prisma      # Esquema
│   │
│   └── Documentación/
│       ├── MIGRATION_GUIDE.md
│       ├── DEPLOY_CHECKLIST.md
│       └── WHATSAPP_SETUP.md
│
├── frontend/                  # React (pendiente)
│
├── CLAUDE.md                  # ⭐ Guía para Claude
├── PROJECT_STATUS.md          # ⭐ Estado completo
└── README.md                  # Este archivo
```

---

## 🛠️ Tecnologías

### Backend

- **Node.js 20** - Runtime
- **Express 5.2.1** - Web framework
- **Prisma 6.19.3** - ORM
- **PostgreSQL** - Database
- **Axios 1.7.2** - HTTP client (WhatsApp API)
- **Cloudinary 2.9.0** - Image storage
- **JWT 9.0.3** - Authentication
- **Bcrypt 6.0.0** - Password hashing

### DevOps

- **Railway** - Hosting & deployment
- **GitHub** - Version control
- **Docker** - Containerization

### APIs Externas

- **WhatsApp Cloud API (Meta)** - Messaging
- **Cloudinary API** - Image storage

---

## 📦 Instalación Local

### Prerrequisitos

- Node.js 20+
- PostgreSQL (o usar Railway)
- Cuenta Meta Developers
- Cuenta Cloudinary
- Cuenta Railway (para deploy)

### 1. Clonar Repositorio

```bash
git clone https://github.com/yosoyafa/lanchas.git
cd lanchas/backend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crear archivo `.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/lanchas

# Auth
JWT_SECRET=your-super-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-access-token
WHATSAPP_WABA_ID=your-waba-id
WHATSAPP_VERIFY_TOKEN=your-verify-token
WHATSAPP_APP_SECRET=your-app-secret

# Server
NODE_ENV=development
PORT=3000
```

Ver **backend/WHATSAPP_SETUP.md** para obtener credenciales de Meta.

### 4. Setup Base de Datos

```bash
# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Seed con datos de prueba
npx prisma db seed
```

### 5. Iniciar Servidor

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

Servidor corriendo en: http://localhost:3000

### 6. Configurar Webhook en Meta

Ver guía completa en **backend/WHATSAPP_SETUP.md**

---

## 🚀 Deployment a Producción

### Railway (Configurado)

El proyecto ya está desplegado en Railway con CI/CD automático.

**Para desplegar cambios:**

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

Railway detecta el push y despliega automáticamente en 2-3 minutos.

**URL Producción:** https://lanchas-production.up.railway.app

Ver **backend/DEPLOY_CHECKLIST.md** para guía completa.

---

## 📖 Documentación Completa

| Documento | Descripción | Audiencia |
|-----------|-------------|-----------|
| **[CLAUDE.md](./CLAUDE.md)** | 🤖 Cómo usar Claude sin conocimientos técnicos | No técnicos |
| **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** | 📊 Estado completo y detallado | Todos |
| **[backend/MIGRATION_GUIDE.md](./backend/MIGRATION_GUIDE.md)** | 📜 Historia de migración a Cloud API | Técnicos |
| **[backend/DEPLOY_CHECKLIST.md](./backend/DEPLOY_CHECKLIST.md)** | ✅ Guía de deployment | Técnicos |
| **[backend/WHATSAPP_SETUP.md](./backend/WHATSAPP_SETUP.md)** | 📱 Setup de WhatsApp Cloud API | Técnicos |
| **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | 🔧 Solución de problemas | Todos |

---

## 🧪 Testing

### Test Manual del Bot

1. Agregar tu número en Meta como destinatario de prueba
2. Enviar "lancha" al número de WhatsApp
3. Seguir el flujo de conversación
4. Verificar respuestas automáticas

### Verificar Logs

Railway → Deployments → Latest → Logs

```
📥 Webhook received:
📨 Message from 57XXXXXXXXX, Type: text
✅ Message sent to 57XXXXXXXXX
📨 Sent boat info to 57XXXXXXXXX
```

---

## 📝 Editar Mensajes del Bot

Los mensajes están en `/backend/src/config/messages.js`:

```javascript
const MESSAGES = {
  welcome: '¡Hola! 👋\n\nGracias por contactarnos...',
  boat1: '🚤 Lancha 1: Capacidad 8 personas, motor 40HP',
  boat2: '🚤 Lancha 2: Capacidad 6 personas, motor 30HP',
  payment: '💳 Para reservar:\n\nBanco: Bancolombia...'
};

const BOAT_IMAGES = {
  boat1: 'https://res.cloudinary.com/...',
  boat2: 'https://res.cloudinary.com/...'
};
```

**Para cambiar:**
1. Editar el archivo
2. `git commit -m "Update messages"`
3. `git push`
4. Railway despliega automáticamente

Ver **CLAUDE.md** para guía paso a paso sin conocimientos técnicos.

---

## 🔐 Configuración de Seguridad

### Variables de Entorno Sensibles

Configuradas en Railway (Variables tab):

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
CLOUDINARY_API_SECRET=...
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_APP_SECRET=...
```

⚠️ **NUNCA subir a GitHub:**
- `.env`
- `.env.production`
- Tokens o API keys

✅ **Ya configurado en `.gitignore`**

---

## 📊 Estado del Proyecto

### ✅ Completado (100%)

- [x] Bot de WhatsApp funcional
- [x] Webhook implementado
- [x] Base de datos con Prisma
- [x] Almacenamiento de imágenes (Cloudinary)
- [x] Validación de disponibilidad
- [x] Notificaciones automáticas
- [x] Landing page
- [x] Políticas de privacidad
- [x] Desplegado en Railway
- [x] Documentación completa

### ⚠️ Pendiente

- [ ] Dashboard de administración (frontend)
- [ ] Token permanente de WhatsApp (actualmente temporal 24h)
- [ ] WhatsApp Flows (opcional)
- [ ] Notificaciones por email (opcional)

Ver **PROJECT_STATUS.md** para detalles completos.

---

## 💰 Costos Mensuales

### Servicios Utilizados

- **Railway:** $5/mes (con $5 créditos gratis = $0 primer mes)
- **WhatsApp Cloud API:** $0 (1000 conversaciones gratis/mes)
- **Cloudinary:** $0 (plan gratuito suficiente)
- **GitHub:** $0 (repositorio)

**Total: ~$0-5/mes**

Para el MVP con bajo volumen: **$0/mes**

---

## 🐛 Solución de Problemas

### Bot no responde

1. Verificar logs en Railway
2. Verificar token no expiró (temporal = 24h)
3. Verificar webhook está suscrito a "messages"

### Ver guía completa

Consulta **TROUBLESHOOTING.md** para problemas comunes y soluciones.

---

## 🤝 Contribuir

Si quieres mejorar el proyecto:

1. Fork el repositorio
2. Crear rama: `git checkout -b feature/mejora`
3. Commit: `git commit -m "Add: nueva mejora"`
4. Push: `git push origin feature/mejora`
5. Crear Pull Request

---

## 📞 Soporte

**Documentación:** Lee primero CLAUDE.md y PROJECT_STATUS.md

**Issues:** [GitHub Issues](https://github.com/yosoyafa/lanchas/issues)

**Logs:** Railway → Deployments → Latest → Logs

---

## 🙏 Agradecimientos

- **Meta** - WhatsApp Cloud API
- **Railway** - Hosting confiable
- **Cloudinary** - Almacenamiento de imágenes
- **Prisma** - ORM excepcional
- **Claude (Anthropic)** - Asistencia en desarrollo

---

## 📝 Licencia

Proyecto privado. Todos los derechos reservados.

---

## 🎯 Próximos Pasos

1. **Urgente:** Crear token permanente de WhatsApp (ver WHATSAPP_SETUP.md)
2. **Importante:** Terminar dashboard de admin (frontend)
3. **Opcional:** Implementar WhatsApp Flows
4. **Opcional:** Agregar notificaciones por email

Ver roadmap completo en **PROJECT_STATUS.md**

---

**Versión:** 1.0
**Estado:** ✅ Producción
**Última actualización:** Mayo 2026
**URL:** https://lanchas-production.up.railway.app

⭐ **El bot está funcionando al 100%** - Listo para recibir clientes reales.
