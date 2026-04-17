# Referencia Rápida

## Comandos Esenciales

### Iniciar el Sistema (Desarrollo)

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### URLs Locales

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Health Check: http://localhost:3000/health
- Prisma Studio: http://localhost:5555 (ejecutar `npx prisma studio`)

### Credenciales por Defecto

- Usuario: `admin`
- Contraseña: `admin123`

## Comandos de Base de Datos

```bash
cd backend

# Ver base de datos visualmente
npx prisma studio

# Crear migration después de cambiar schema
npx prisma migrate dev --name nombre_del_cambio

# Aplicar migrations en producción
npx prisma migrate deploy

# Regenerar Prisma Client (después de cambiar schema)
npx prisma generate

# Reset completo de DB (¡CUIDADO! Borra todo)
npx prisma migrate reset

# Crear admin user
npm run seed
```

## Estructura de Archivos Importantes

```
lanchas/
├── backend/
│   ├── .env                              # Variables de entorno (NO subir a git)
│   ├── src/
│   │   ├── index.js                      # Entry point
│   │   ├── server.js                     # Express server
│   │   ├── config/
│   │   │   ├── database.js               # Prisma client
│   │   │   ├── cloudinary.js             # Config de Cloudinary
│   │   │   └── messages.js               # Mensajes del bot (EDITAR AQUÍ)
│   │   ├── whatsapp/
│   │   │   ├── client.js                 # Cliente WhatsApp
│   │   │   └── handlers.js               # Lógica del bot
│   │   └── api/
│   │       ├── auth.js                   # Login
│   │       └── bookings.js               # CRUD reservas
│   └── prisma/
│       ├── schema.prisma                 # Modelo de datos
│       └── seed.js                       # Crear usuario admin
│
└── frontend/
    ├── .env                              # Variables de entorno
    └── src/
        ├── App.jsx                       # Router principal
        ├── lib/
        │   └── api.js                    # Cliente HTTP
        └── pages/
            ├── Login.jsx                 # Página de login
            └── Dashboard.jsx             # Panel de reservas
```

## Personalización Rápida

### Cambiar Mensajes del Bot

Editar `backend/src/config/messages.js`:

```javascript
const MESSAGES = {
  welcome: 'Tu mensaje de bienvenida aquí',
  boat1: 'Descripción del bote 1',
  boat2: 'Descripción del bote 2',
  payment: 'Información de pago'
};
```

### Cambiar Fotos de Botes

1. Subir fotos a Cloudinary
2. Copiar URLs
3. Editar `backend/src/config/messages.js`:

```javascript
const BOAT_IMAGES = {
  boat1: 'https://res.cloudinary.com/.../tu-foto-1.jpg',
  boat2: 'https://res.cloudinary.com/.../tu-foto-2.jpg'
};
```

4. Reiniciar backend

### Cambiar Contraseña de Admin

```bash
cd backend
node -e "
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const hash = await bcrypt.hash('TU-NUEVA-PASSWORD', 10);
  await prisma.admin.update({
    where: { username: 'admin' },
    data: { passwordHash: hash }
  });
  console.log('✅ Contraseña cambiada');
  await prisma.\$disconnect();
})();
"
```

### Agregar Nuevo Usuario Admin

```bash
cd backend
node -e "
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const hash = await bcrypt.hash('password-del-nuevo-admin', 10);
  await prisma.admin.create({
    data: {
      username: 'nuevo-admin',
      passwordHash: hash
    }
  });
  console.log('✅ Admin creado');
  await prisma.\$disconnect();
})();
"
```

## Estados de Reservas

```javascript
PENDING_PAYMENT    // Cliente pidió info, aún no envió comprobante
PAYMENT_SUBMITTED  // Comprobante recibido, esperando aprobación ⚠️ ACCIÓN REQUERIDA
CONFIRMED          // Aprobado por admin ✅
REJECTED           // Rechazado por admin ❌
```

## Endpoints de API

### Auth

```bash
# Login
POST /api/auth/login
Body: { "username": "admin", "password": "admin123" }
Response: { "token": "...", "username": "admin" }
```

### Bookings

```bash
# Listar todas las reservas
GET /api/bookings
Headers: { "Authorization": "Bearer TOKEN" }

# Listar solo pendientes
GET /api/bookings?status=PAYMENT_SUBMITTED

# Aprobar reserva
POST /api/bookings/:id/approve
Body: {
  "requestedDate": "2025-01-15",
  "boatNumber": 1,
  "customerName": "Juan Pérez"
}

# Rechazar reserva
POST /api/bookings/:id/reject
Body: { "reason": "Comprobante no válido" }
```

## Solución de Problemas Comunes

### Backend no inicia

```bash
# Verificar que PostgreSQL esté corriendo
psql postgres -c "SELECT 1"

# Verificar .env
cat backend/.env

# Verificar node_modules
cd backend && npm install

# Regenerar Prisma Client
npx prisma generate
```

### Bot no responde

```bash
# Ver logs del backend
# El backend debe mostrar: "✅ WhatsApp bot is ready!"

# Si dice "disconnected":
# 1. Detener backend (Ctrl+C)
# 2. Borrar carpeta de sesión: rm -rf backend/.wwebjs_auth
# 3. Reiniciar backend
# 4. Escanear nuevo QR
```

### Frontend no carga

```bash
# Verificar que backend esté corriendo
curl http://localhost:3000/health

# Verificar .env
cat frontend/.env

# Reinstalar dependencias
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Error de Tailwind CSS con PostCSS

```bash
# Si ves: "[postcss] It looks like you're trying to use `tailwindcss` directly..."
# Esto significa que se instaló Tailwind v4 que requiere un paquete separado

# Solución: Usar Tailwind CSS v3
cd frontend
npm uninstall tailwindcss
npm install -D tailwindcss@^3.4.0
npm run dev
```

### Error de CORS

Editar `backend/src/server.js`:

```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://tu-dominio.com'],
  credentials: true
}));
```

### Error con Cloudinary

```bash
# Verificar credenciales
cd backend
node -e "
require('dotenv').config();
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');
"
```

## Variables de Entorno

### Backend (.env)

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="random-string-32-chars"
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="123456789"
CLOUDINARY_API_SECRET="secret"
NODE_ENV="development"
PORT=3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

## Comandos Git

```bash
# Inicializar repo
git init
git add .
git commit -m "Initial commit"

# Conectar a GitHub
git remote add origin https://github.com/usuario/repo.git
git branch -M main
git push -u origin main

# Commits subsecuentes
git add .
git commit -m "Descripción del cambio"
git push
```

## Testing Rápido

### Probar Bot de WhatsApp

1. Enviar mensaje de texto → Debe responder con fotos
2. Enviar imagen → Debe confirmar recepción
3. Verificar logs del backend → Sin errores

### Probar Panel Admin

1. Abrir http://localhost:5173
2. Login con admin/admin123
3. Verificar que aparezca la reserva
4. Aprobar → Verificar confirmación en WhatsApp

### Health Checks

```bash
# Backend health
curl http://localhost:3000/health

# Database connection
cd backend && npx prisma db execute --stdin <<< "SELECT 1"

# Frontend build
cd frontend && npm run build
```

## Monitoreo

### Ver Logs en Tiempo Real

```bash
# Backend logs
cd backend && npm run dev

# PostgreSQL logs (Mac)
tail -f /opt/homebrew/var/log/postgresql@15.log

# Frontend logs
cd frontend && npm run dev
```

### Queries Útiles en Prisma Studio

```sql
-- Ver todas las reservas pendientes
SELECT * FROM "Booking" WHERE status = 'PAYMENT_SUBMITTED';

-- Contar reservas por estado
SELECT status, COUNT(*) FROM "Booking" GROUP BY status;

-- Ver reservas de hoy
SELECT * FROM "Booking" WHERE DATE(createdAt) = CURRENT_DATE;

-- Ver comprobantes sin revisar
SELECT id, customerPhone, paymentSubmittedAt
FROM "Booking"
WHERE status = 'PAYMENT_SUBMITTED'
ORDER BY paymentSubmittedAt DESC;
```

## Recursos

- Documentación de whatsapp-web.js: https://wwebjs.dev/
- Documentación de Prisma: https://www.prisma.io/docs
- Documentación de Cloudinary: https://cloudinary.com/documentation
- Railway Docs: https://docs.railway.app/
- Vercel Docs: https://vercel.com/docs

## Contactos de Emergencia

Si algo falla crítico en producción:

1. **Railway está caído**: Verificar https://status.railway.app/
2. **Vercel está caído**: Verificar https://www.vercel-status.com/
3. **Cloudinary está caído**: Verificar https://status.cloudinary.com/

## Backup Rápido

```bash
# Backup de base de datos
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restaurar backup
psql $DATABASE_URL < backup-20250115.sql

# Backup del código (ya está en Git)
git push
```

## Performance

### Optimizar Imágenes en Cloudinary

En `backend/src/whatsapp/handlers.js`, la configuración ya incluye:

```javascript
transformation: [
  { width: 1200, crop: 'limit' },
  { quality: 'auto' }
]
```

### Optimizar Polling del Frontend

En `frontend/src/pages/Dashboard.jsx`:

```javascript
refetchInterval: 30000, // 30 segundos (ajustar según necesidad)
```

Reducir si necesitas actualizaciones más rápidas (aumenta carga).
Aumentar si no necesitas actualizaciones tan frecuentes (reduce carga).

## Números de Contacto del Sistema

- Soporte de Railway: support@railway.app
- Soporte de Vercel: support@vercel.com
- Soporte de Cloudinary: support@cloudinary.com

---

**Última actualización:** 2025-01-15

Mantén esta referencia a mano. Cubre el 90% de las operaciones diarias.
