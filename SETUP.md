# Guía Rápida de Configuración

## Pre-requisitos

Antes de empezar, necesitas:

1. **PostgreSQL instalado y corriendo**
   - Mac: `brew install postgresql@15 && brew services start postgresql@15`
   - Linux: `sudo apt install postgresql && sudo systemctl start postgresql`
   - Windows: Descargar de https://www.postgresql.org/download/

2. **Cuenta de Cloudinary (gratis)**
   - Registrarse en https://cloudinary.com
   - Ir a Dashboard → Settings → Access Keys
   - Anotar: Cloud Name, API Key, API Secret

3. **Número de WhatsApp**
   - Necesitas un número para el bot (puede ser tu número personal para pruebas)
   - Asegúrate de tener WhatsApp instalado en tu teléfono

## Paso 1: Crear Base de Datos

```bash
# Entrar a PostgreSQL
psql postgres

# Crear base de datos
CREATE DATABASE lanchas;

# Crear usuario
CREATE USER lanchas_user WITH PASSWORD 'tu_password_aqui';

# Dar permisos
GRANT ALL PRIVILEGES ON DATABASE lanchas TO lanchas_user;

# Salir
\q
```

## Paso 2: Configurar Backend

```bash
cd backend

# Ya instalado en implementación, pero si necesitas reinstalar:
# npm install

# Editar .env con tus credenciales
nano .env
```

Contenido de `.env`:
```env
DATABASE_URL="postgresql://lanchas_user:tu_password_aqui@localhost:5432/lanchas?schema=public"
JWT_SECRET="genera-un-secret-aleatorio-largo-aqui"
CLOUDINARY_CLOUD_NAME="tu-cloud-name-de-cloudinary"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"
NODE_ENV="development"
PORT=3000
```

**Generar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
# Generar Prisma client
npx prisma generate

# Correr migrations
npx prisma migrate dev --name init

# Crear usuario admin
npm run seed
```

## Paso 3: Subir Fotos de Botes a Cloudinary

1. Ir a https://cloudinary.com/console
2. Click en "Media Library"
3. Upload → Subir 2 fotos de tus botes
4. Click en cada imagen → Copiar "Secure URL"
5. Editar `backend/src/config/messages.js`:

```javascript
const BOAT_IMAGES = {
  boat1: 'https://res.cloudinary.com/TU-CLOUD/image/upload/v1234/boat1.jpg',
  boat2: 'https://res.cloudinary.com/TU-CLOUD/image/upload/v1234/boat2.jpg'
};
```

6. También actualizar info de los botes y cuenta bancaria en el mismo archivo

## Paso 4: Iniciar Backend

```bash
cd backend
npm run dev
```

**IMPORTANTE:** Al iniciar por primera vez, aparecerá un QR code.

1. Abrir WhatsApp en tu teléfono
2. Ir a Configuración → Dispositivos vinculados
3. "Vincular un dispositivo"
4. Escanear el QR que aparece en la terminal

Deberías ver:
```
✅ WhatsApp bot is ready!
🚀 Server running on port 3000
```

**Dejar esta terminal abierta corriendo.**

## Paso 5: Iniciar Frontend

Abrir una **nueva terminal**:

```bash
cd frontend

# Ya instalado, pero si necesitas reinstalar:
# npm install

# Iniciar servidor de desarrollo
npm run dev
```

Deberías ver:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Paso 6: Probar el Sistema

### Probar el Bot de WhatsApp

1. Desde tu teléfono (u otro), envía un mensaje al número vinculado
2. El bot debería responder con:
   - Mensaje de bienvenida
   - Foto del Bote 1
   - Foto del Bote 2
   - Información de pago

3. Envía una foto cualquiera (simulando comprobante)
4. El bot debería responder: "✅ Comprobante recibido!"

### Probar el Panel Admin

1. Abrir http://localhost:5173
2. Login con:
   - Usuario: `admin`
   - Contraseña: `admin123`

3. Deberías ver la reserva pendiente con el comprobante
4. Llenar:
   - Nombre del cliente (opcional)
   - Fecha de reserva
   - Seleccionar bote (1 o 2)
5. Click "Aprobar Reserva"
6. Revisa tu WhatsApp → Deberías recibir confirmación

## Verificación Completa

Lista de verificación:

- [ ] Backend corriendo sin errores
- [ ] WhatsApp bot conectado y respondiendo
- [ ] Frontend accesible en localhost:5173
- [ ] Login funcionando
- [ ] Bot envía fotos de botes
- [ ] Bot recibe comprobantes
- [ ] Comprobantes aparecen en panel
- [ ] Aprobación envía confirmación a WhatsApp

## Problemas Comunes

### "Error: P1001: Can't reach database server"
- PostgreSQL no está corriendo
- Solución: `brew services start postgresql@15` (Mac)

### "Invalid Cloudinary credentials"
- Verificar CLOUDINARY_* en `.env`
- Verificar que están activas en Cloudinary Dashboard

### "WhatsApp disconnected"
- Sesión expiró
- Solución: Detener backend, borrar `.wwebjs_auth/`, reiniciar, re-escanear QR

### Frontend no carga reservas
- Verificar que backend esté corriendo
- Abrir DevTools → Console, buscar errores
- Verificar VITE_API_URL en `frontend/.env`

### Bot no responde
- Verificar logs del backend
- Asegurarse que el mensaje no viene de un grupo
- WhatsApp debe estar conectado (verde en terminal)

## Cambiar Contraseña del Admin

```bash
cd backend
node -e "
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const hash = await bcrypt.hash('nueva-password-segura', 10);
  await prisma.admin.update({
    where: { username: 'admin' },
    data: { passwordHash: hash }
  });
  console.log('✅ Contraseña actualizada');
  await prisma.\$disconnect();
})();
"
```

## Listo!

Tu sistema está funcionando. Algunos tips:

1. **Mantén ambas terminales abiertas** mientras uses el sistema
2. **El bot responde a cualquier mensaje** con info de botes
3. **Cualquier imagen que envíes** se toma como comprobante
4. **El panel se actualiza cada 30 segundos** automáticamente
5. **Las sesiones de WhatsApp duran ~2-3 meses**, luego hay que re-escanear QR

Para deploy a producción, ve a la sección "Deploy a Producción" en README.md

## Siguiente Paso: Personalizar

1. Edita info de botes en `backend/src/config/messages.js`
2. Edita info bancaria en el mismo archivo
3. Sube tus fotos reales de botes a Cloudinary
4. Actualiza las URLs en `BOAT_IMAGES`
5. Reinicia el backend

¡Disfruta tu sistema de reservas automatizado! 🚤
