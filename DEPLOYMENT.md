# 🚀 Guía de Deployment - MVP Lanchas

Esta guía te llevará paso a paso por el deployment del backend (Railway) y frontend (Vercel).

---

## 📋 Pre-requisitos

Antes de empezar, asegúrate de tener:

- [ ] Cuenta en GitHub
- [ ] Cuenta en Railway (https://railway.app)
- [ ] Cuenta en Vercel (https://vercel.com)
- [ ] Cuenta en Cloudinary (https://cloudinary.com)
- [ ] Credenciales de Cloudinary listas

---

## 🗂️ Paso 1: Preparar Repositorio Git

### 1.1 Inicializar Git (si no está hecho)

```bash
cd /Users/afa/Documents/personal/lanchas
git init
git add .
git commit -m "Initial commit - MVP Lanchas"
```

### 1.2 Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `lanchas-mvp` (o el que prefieras)
3. Privado (recomendado)
4. NO inicialices con README (ya lo tienes)
5. Click "Create repository"

### 1.3 Push al Repositorio

```bash
# Reemplaza TU-USUARIO con tu username de GitHub
git remote add origin https://github.com/TU-USUARIO/lanchas-mvp.git
git branch -M main
git push -u origin main
```

---

## 🚂 Paso 2: Deploy Backend en Railway

### 2.1 Crear Proyecto en Railway

1. Ve a https://railway.app
2. Click "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Autoriza Railway a acceder a GitHub
5. Selecciona el repositorio `lanchas-mvp`
6. Railway detectará automáticamente el proyecto Node.js

### 2.2 Configurar Variables de Entorno

En Railway, ve a tu proyecto → Variables:

**Añade estas variables:**

```bash
# Base de datos (Railway la crea automáticamente)
# DATABASE_URL se autocompletará cuando añadas PostgreSQL

# JWT Secret (genera uno nuevo)
JWT_SECRET=genera-un-secret-largo-y-aleatorio-aqui

# Cloudinary (copia de tu cuenta)
CLOUDINARY_CLOUD_NAME=tu-cloud-name-aqui
CLOUDINARY_API_KEY=tu-api-key-aqui
CLOUDINARY_API_SECRET=tu-api-secret-aqui

# Configuración
NODE_ENV=production
PORT=3000
```

**Para generar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.3 Agregar Base de Datos PostgreSQL

1. En Railway, click "+ New"
2. Selecciona "Database" → "PostgreSQL"
3. Railway creará automáticamente la variable `DATABASE_URL`
4. Conectará tu app al DB automáticamente

### 2.4 Configurar Root Directory

Railway debe buscar el backend en la carpeta correcta:

1. Ve a Settings del servicio
2. En "Root Directory", pon: `backend`
3. En "Build Command", pon: `npm install && npx prisma generate && npx prisma migrate deploy`
4. En "Start Command", pon: `npm start`

### 2.5 Ejecutar Migraciones y Seed

Después del primer deploy, abre la terminal de Railway:

```bash
# Ejecutar migraciones
npx prisma migrate deploy

# Crear usuario admin (username: admin, password: admin123)
npm run seed
```

### 2.6 Escanear QR de WhatsApp

**IMPORTANTE:** El bot de WhatsApp necesita que escanees un QR code:

1. En Railway, ve a la pestaña "Deployments"
2. Click en el deployment activo
3. Ve a "Logs"
4. Verás "SCAN QR CODE:" seguido de un QR en ASCII art
5. Abre WhatsApp en tu teléfono
6. Ve a Configuración → Dispositivos vinculados
7. Escanea el QR que aparece en los logs
8. El bot dirá "✅ WhatsApp bot ready!"

**Nota:** Railway mantiene el proceso corriendo 24/7, por lo que el bot estará siempre activo.

### 2.7 Obtener URL del Backend

1. En Railway, ve a Settings
2. En "Domains", verás la URL pública
3. Será algo como: `https://lanchas-mvp-production.up.railway.app`
4. **Guarda esta URL**, la necesitarás para el frontend

---

## ▲ Paso 3: Deploy Frontend en Vercel

### 3.1 Crear Proyecto en Vercel

1. Ve a https://vercel.com
2. Click "Add New..." → "Project"
3. Import el mismo repositorio de GitHub
4. Vercel detectará automáticamente que es Vite

### 3.2 Configurar Root Directory

**IMPORTANTE:**

1. En "Configure Project":
2. Root Directory: `frontend`
3. Framework Preset: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`

### 3.3 Variables de Entorno

Añade esta variable:

```bash
VITE_API_URL=https://TU-URL-DE-RAILWAY.up.railway.app/api
```

**Reemplaza** `TU-URL-DE-RAILWAY` con la URL que obtuviste en el paso 2.7.

Ejemplo:
```bash
VITE_API_URL=https://lanchas-mvp-production.up.railway.app/api
```

### 3.4 Deploy

1. Click "Deploy"
2. Vercel hará el build y deploy automáticamente
3. En 1-2 minutos tendrás tu URL

### 3.5 Obtener URL del Frontend

Vercel te dará una URL como:
```
https://lanchas-mvp.vercel.app
```

Esta es la URL del dashboard admin.

---

## ✅ Paso 4: Verificación

### 4.1 Verificar Backend

Abre en navegador:
```
https://TU-URL-DE-RAILWAY/health
```

Deberías ver:
```json
{"status": "ok"}
```

### 4.2 Verificar Frontend

1. Abre: `https://TU-URL-DE-VERCEL`
2. Deberías ver la pantalla de login
3. Credenciales:
   - Username: `admin`
   - Password: `admin123`

### 4.3 Verificar WhatsApp Bot

1. Envía "lancha" al número de WhatsApp vinculado
2. El bot debería responder con fotos de lanchas

---

## 🔄 Actualizaciones Futuras

### Para actualizar el backend:

```bash
cd /Users/afa/Documents/personal/lanchas
git add .
git commit -m "Descripción de cambios"
git push
```

Railway hará redeploy automáticamente.

**IMPORTANTE:** Si cambias el schema de Prisma:
1. Crea una nueva migración localmente: `npx prisma migrate dev`
2. Commit y push
3. Railway ejecutará `prisma migrate deploy` automáticamente

### Para actualizar el frontend:

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

Vercel hará redeploy automáticamente.

---

## 🔐 Seguridad

### Cambiar Password del Admin

1. Abre terminal en Railway
2. Ejecuta:

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('TU-NUEVA-PASSWORD', 10).then(hash => console.log(hash))"
```

3. Copia el hash
4. Ejecuta en Prisma Studio o con query SQL:

```sql
UPDATE "Admin" SET "passwordHash" = 'EL-HASH-COPIADO' WHERE username = 'admin';
```

### Variables Sensibles

**NUNCA** commitees al repositorio:
- `.env`
- Credenciales de Cloudinary
- JWT_SECRET
- Database URLs

---

## 💰 Costos Mensuales

### Railway (Backend + PostgreSQL)
- **Free tier:** $5 crédito inicial, ~500 horas/mes gratis
- **Después:** ~$5-10/mes dependiendo del uso
- PostgreSQL incluido

### Vercel (Frontend)
- **Free tier:** Ilimitado para proyectos personales
- **Costo:** $0/mes

### Cloudinary (Imágenes)
- **Free tier:** 25 GB storage, 25 GB bandwidth
- **Costo:** $0/mes para MVP

**Total estimado:** $0-10/mes

---

## 🛠️ Troubleshooting

### "WhatsApp bot not ready"

1. Verifica los logs en Railway
2. Busca el QR code
3. Reescanea desde WhatsApp

### "Database connection error"

1. Verifica que PostgreSQL esté running en Railway
2. Verifica que `DATABASE_URL` esté configurada
3. Ejecuta: `npx prisma migrate deploy`

### "Login no funciona"

1. Verifica que `JWT_SECRET` esté configurado
2. Verifica que `VITE_API_URL` apunte al backend correcto
3. Verifica CORS en el backend

### "Imágenes de Cloudinary no cargan"

1. Verifica las credenciales de Cloudinary
2. Verifica que la carpeta `boat-receipts` exista
3. Chequea los logs del backend

---

## 📞 URLs Importantes

Después del deployment, tendrás:

- **Backend API:** `https://TU-PROYECTO.up.railway.app`
- **Frontend Dashboard:** `https://TU-PROYECTO.vercel.app`
- **Cloudinary Dashboard:** `https://cloudinary.com/console`
- **Railway Dashboard:** `https://railway.app/project/TU-PROYECTO`
- **Vercel Dashboard:** `https://vercel.com/TU-USUARIO/TU-PROYECTO`

---

## 🎯 Checklist Final

- [ ] Repositorio en GitHub creado
- [ ] Backend deployed en Railway
- [ ] PostgreSQL creado y conectado
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Usuario admin creado
- [ ] QR de WhatsApp escaneado
- [ ] Frontend deployed en Vercel
- [ ] Variable `VITE_API_URL` configurada
- [ ] Login funciona
- [ ] Bot responde a "lancha"
- [ ] Comprobantes se suben a Cloudinary
- [ ] Dashboard muestra reservas

---

**¡Felicidades! Tu MVP está en producción! 🎉**

Guarda las URLs del backend y frontend para acceder a tu sistema.
