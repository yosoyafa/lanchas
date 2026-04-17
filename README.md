# Sistema de Reservas de Botes por WhatsApp - MVP

Sistema automatizado para gestionar reservas de botes a través de WhatsApp con panel de administración web.

## Características

- 🤖 Bot de WhatsApp que responde automáticamente con información de botes
- 📸 Recepción automática de comprobantes de pago
- 🖥️ Panel web para aprobar/rechazar reservas
- 📱 Notificaciones automáticas a clientes por WhatsApp
- 💾 Base de datos PostgreSQL

## Estructura del Proyecto

```
lanchas/
├── backend/          # Node.js + Express + WhatsApp Bot
│   ├── src/
│   │   ├── config/   # Configuración (DB, Cloudinary, mensajes)
│   │   ├── whatsapp/ # Cliente y handlers de WhatsApp
│   │   ├── api/      # Endpoints REST
│   │   └── index.js  # Entry point
│   └── prisma/       # Schema y migrations
│
├── frontend/         # React + Vite
│   └── src/
│       ├── pages/    # Login y Dashboard
│       ├── lib/      # API client
│       └── App.jsx
│
└── README.md
```

## Requisitos Previos

- Node.js 18+
- PostgreSQL (local o Railway)
- Cuenta de Cloudinary (gratis)
- Número de WhatsApp para el bot

## Instalación

### 1. Clonar y configurar backend

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

Edita `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lanchas"
JWT_SECRET="tu-secret-super-seguro-aqui"
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"
NODE_ENV="development"
PORT=3000
```

**Obtener credenciales de Cloudinary:**
1. Crear cuenta en https://cloudinary.com (gratis)
2. Dashboard → Settings → Access Keys
3. Copiar Cloud Name, API Key, API Secret

### 3. Inicializar base de datos

```bash
cd backend
npx prisma migrate dev --name init
npm run seed
```

Esto creará:
- Usuario admin por defecto: `admin` / `admin123`

### 4. Subir fotos de botes a Cloudinary

1. Ir a Cloudinary Dashboard
2. Media Library → Upload
3. Subir 2 fotos de los botes
4. Copiar las URLs públicas
5. Editar `backend/src/config/messages.js` y actualizar `BOAT_IMAGES`

### 5. Configurar frontend

```bash
cd frontend
npm install
```

Edita `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

## Uso

### Iniciar el sistema en desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

En la primera ejecución, aparecerá un código QR. Escanéalo con WhatsApp:
1. Abrir WhatsApp en tu teléfono
2. Menú (⋮) → Dispositivos vinculados
3. Vincular dispositivo
4. Escanear el QR que aparece en la terminal

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Abre http://localhost:5173 en tu navegador.

### Flujo Completo

1. **Cliente envía mensaje a WhatsApp** → Bot responde con fotos de botes e info de pago
2. **Cliente envía foto de comprobante** → Bot confirma recepción
3. **Admin abre panel web** → Ve reserva pendiente con comprobante
4. **Admin selecciona fecha y bote** → Click "Aprobar"
5. **Cliente recibe confirmación automática** por WhatsApp

### Acceso al Panel Admin

- URL: http://localhost:5173
- Usuario: `admin`
- Contraseña: `admin123`

## Configuración de Mensajes

Los mensajes del bot están en `backend/src/config/messages.js`:

```javascript
const MESSAGES = {
  welcome: '¡Hola! 👋\n\nGracias por contactarnos...',
  boat1: '🚤 Bote 1: Capacidad 8 personas, motor 40HP',
  boat2: '🚤 Bote 2: Capacidad 6 personas, motor 30HP',
  payment: '💳 Para reservar:\n\nBanco: Bancolombia...'
};

const BOAT_IMAGES = {
  boat1: 'https://res.cloudinary.com/tu-cloud/image/upload/boat1.jpg',
  boat2: 'https://res.cloudinary.com/tu-cloud/image/upload/boat2.jpg'
};
```

Edita estos valores para personalizar.

## Base de Datos

### Ver registros

```bash
cd backend
npx prisma studio
```

Abre un navegador visual en http://localhost:5555

### Crear nuevo admin

```bash
cd backend
node -e "
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const hash = await bcrypt.hash('nueva-password', 10);
  await prisma.admin.create({
    data: { username: 'nuevo-admin', passwordHash: hash }
  });
  console.log('Admin creado');
  await prisma.\$disconnect();
})();
"
```

## Deploy a Producción

### Backend en Railway

1. Crear cuenta en https://railway.app
2. New Project → Deploy from GitHub
3. Agregar PostgreSQL Database
4. Variables de entorno (todas las de `.env`)
5. Deploy
6. Abrir Railway Console → Escanear QR del bot
7. El bot quedará corriendo 24/7

### Frontend en Vercel

1. Subir código a GitHub
2. Importar en https://vercel.com
3. Variable de entorno:
   ```
   VITE_API_URL=https://tu-backend.railway.app/api
   ```
4. Deploy

### Costos

- Railway: $0 (500 horas gratis/mes)
- Vercel: $0 (ilimitado)
- Cloudinary: $0 (25GB gratis)
- PostgreSQL: $0 (incluido en Railway)
- **Total: $0/mes**

## Troubleshooting

### Bot no responde

1. Verificar que el proceso backend esté corriendo
2. Revisar logs: pueden haber errores de autenticación
3. Re-escanear QR si dice "disconnected"

### Error de conexión a base de datos

1. Verificar que PostgreSQL esté corriendo
2. Revisar `DATABASE_URL` en `.env`
3. Ejecutar migrations: `npx prisma migrate dev`

### Error al subir comprobantes

1. Verificar credenciales de Cloudinary en `.env`
2. Verificar que las credenciales estén activas en Cloudinary Dashboard

### Frontend no se conecta al backend

1. Verificar que backend esté corriendo en puerto 3000
2. Verificar `VITE_API_URL` en `frontend/.env`
3. Revisar CORS: backend debe permitir origen del frontend

## Limitaciones del MVP

1. **Un solo admin**: Solo un usuario puede acceder al panel
2. **Sin calendario visual**: Solo lista de reservas
3. **Sin notificaciones push**: Polling cada 30 segundos
4. **Mensajes hardcodeados**: Cambios requieren editar código
5. **WhatsApp Web**: Puede desconectarse (requiere re-escanear QR)

## Próximas Mejoras

- [ ] Calendario visual para ver disponibilidad
- [ ] Múltiples usuarios admin con roles
- [ ] Editar mensajes del bot desde el panel
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Migrar a WhatsApp Business API
- [ ] Estadísticas y reportes
- [ ] Integración con Google Calendar

## Scripts Útiles

**Backend:**
```bash
npm run dev          # Desarrollo con nodemon
npm start            # Producción
npm run seed         # Crear usuario admin
npx prisma studio    # Ver base de datos
```

**Frontend:**
```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
```

## Soporte

Para problemas o preguntas, revisa:
1. Logs del backend y frontend
2. Estado de servicios (Railway, Cloudinary)
3. Conexión de WhatsApp

## Licencia

MIT
