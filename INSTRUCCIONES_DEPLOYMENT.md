# 🚀 Instrucciones de Deployment - Paso a Paso

## ✅ Estado Actual

- ✅ Repositorio Git inicializado
- ✅ Commit inicial creado
- ✅ Schema actualizado a PostgreSQL
- ✅ .gitignore configurados
- ✅ Código listo para producción

---

## 📝 Paso 1: Subir a GitHub (5 minutos)

### 1.1 Crear Repositorio en GitHub

1. Ve a: https://github.com/new
2. Configuración:
   - **Repository name:** `lanchas-mvp` (o el nombre que prefieras)
   - **Visibility:** Private (recomendado)
   - **NO** marques "Initialize with README"
3. Click **"Create repository"**

### 1.2 Conectar y Push

GitHub te mostrará comandos. Usa estos:

```bash
cd /Users/afa/Documents/personal/lanchas

# Conectar con tu repositorio (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/lanchas-mvp.git

# Push
git push -u origin main
```

**Si pide autenticación:**
- Usa un Personal Access Token (no password)
- Ve a: https://github.com/settings/tokens
- Generate new token (classic)
- Select scopes: `repo`
- Copy token y úsalo como password

---

## 🚂 Paso 2: Deploy Backend en Railway (10 minutos)

### 2.1 Crear Cuenta

1. Ve a: https://railway.app
2. Sign up con GitHub
3. Autoriza Railway

### 2.2 Crear Proyecto

1. Click **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca y selecciona **`lanchas-mvp`**
4. Railway detectará automáticamente Node.js

### 2.3 Configurar Servicio

1. Railway creará el servicio
2. Ve a **Settings** del servicio
3. Configurar:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command:** `npm start`

### 2.4 Agregar PostgreSQL

1. En el dashboard del proyecto, click **"+ New"**
2. Selecciona **"Database"** → **"PostgreSQL"**
3. Railway automáticamente:
   - Crea la base de datos
   - Añade `DATABASE_URL` a tu servicio
   - Conecta todo

### 2.5 Variables de Entorno

En tu servicio → **Variables**:

```bash
# DATABASE_URL ya está (creada automáticamente)

# JWT Secret - genera uno nuevo:
JWT_SECRET=PEGA-AQUI-EL-SECRET-GENERADO

# Cloudinary (copia de tu cuenta)
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret

# Config
NODE_ENV=production
PORT=3000
```

**Generar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.6 Deploy

1. Guarda las variables
2. Railway hará deploy automáticamente
3. Espera ~2 minutos
4. Ve a **Deployments** para ver el progreso

### 2.7 Crear Usuario Admin

Cuando el deploy termine:

1. En Railway, abre **Shell** (consola)
2. Ejecuta:

```bash
npm run seed
```

Verás: "✅ Admin user created"

### 2.8 Vincular WhatsApp

**IMPORTANTE:**

1. En Railway, ve a **Deployments**
2. Click en el deployment activo
3. Ve a **View Logs**
4. Busca "SCAN QR CODE:"
5. Verás un QR en ASCII art

**En tu teléfono:**
1. Abre WhatsApp
2. Menú (⋮) → **Dispositivos vinculados**
3. **Vincular dispositivo**
4. Escanea el QR de los logs

**Verás en logs:**
```
✅ WhatsApp bot ready!
```

### 2.9 Obtener URL del Backend

1. Ve a **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copia la URL (ej: `https://lanchas-production.up.railway.app`)
4. **GUÁRDALA** - la necesitas para el frontend

---

## ▲ Paso 3: Deploy Frontend en Vercel (5 minutos)

### 3.1 Crear Cuenta

1. Ve a: https://vercel.com
2. Sign up con GitHub
3. Autoriza Vercel

### 3.2 Import Proyecto

1. Click **"Add New..."** → **"Project"**
2. Selecciona **`lanchas-mvp`**
3. Click **"Import"**

### 3.3 Configurar Proyecto

**IMPORTANTE - Configuración correcta:**

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3.4 Variable de Entorno

En **Environment Variables**, añade:

```bash
# Variable Name:
VITE_API_URL

# Value (reemplaza con TU URL de Railway):
https://TU-URL-RAILWAY.up.railway.app/api
```

**Ejemplo:**
```bash
VITE_API_URL=https://lanchas-production.up.railway.app/api
```

### 3.5 Deploy

1. Click **"Deploy"**
2. Vercel hará build (~1-2 min)
3. Verás "Congratulations! 🎉"

### 3.6 Obtener URL

Vercel te da una URL como:
```
https://lanchas-mvp.vercel.app
```

**Esta es tu URL del dashboard admin.**

---

## ✅ Paso 4: Verificación (5 minutos)

### 4.1 Verificar Backend

**URL de salud:**
```
https://TU-URL-RAILWAY.up.railway.app/health
```

**Debe mostrar:**
```json
{"status":"ok"}
```

### 4.2 Verificar Frontend

1. Abre: `https://TU-URL-VERCEL.vercel.app`
2. Deberías ver login
3. Credenciales:
   - **Username:** `admin`
   - **Password:** `admin123`
4. Login exitoso → ves dashboard

### 4.3 Verificar WhatsApp

**Prueba completa:**

1. Envía al WhatsApp vinculado: `lancha`
2. Bot responde con fotos ✅
3. Escribe: `30 de abril, lancha 1`
4. Bot verifica disponibilidad ✅
5. Bot pide nombre ✅
6. Escribe: `Test Usuario`
7. Bot muestra resumen ✅
8. Envía una foto
9. Bot confirma recepción ✅
10. Abre dashboard → ves la reserva ✅

---

## 🎉 ¡Listo! Tu MVP está en producción

### URLs Importantes

**Guarda estas URLs:**

```
Backend API:     https://TU-URL.up.railway.app
Frontend:        https://TU-URL.vercel.app
Railway Panel:   https://railway.app/project/TU-PROYECTO
Vercel Panel:    https://vercel.com
Cloudinary:      https://cloudinary.com/console
```

---

## 🔄 Actualizar en el Futuro

### Para actualizar código:

```bash
cd /Users/afa/Documents/personal/lanchas

# Hacer cambios en el código...

git add .
git commit -m "Descripción de cambios"
git push
```

**Automáticamente:**
- Railway redeployea el backend
- Vercel redeployea el frontend

### Si cambias el schema de Prisma:

```bash
cd backend

# Crear migración
npx prisma migrate dev --name nombre_cambio

# Commit y push
git add .
git commit -m "Database migration: nombre_cambio"
git push
```

Railway ejecutará `prisma migrate deploy` automáticamente.

---

## 💰 Costos

- **Railway:** $0-5/mes (500hrs gratis)
- **Vercel:** $0/mes (ilimitado)
- **Cloudinary:** $0/mes (25GB)

**Total:** ~$0-5/mes

---

## 🛠️ Troubleshooting

### Bot no responde

1. Railway → Logs → Buscar errores
2. Verificar QR escaneado
3. Re-vincular WhatsApp si es necesario

### Login no funciona

1. Verificar `VITE_API_URL` en Vercel
2. Verificar backend está running
3. Verificar `JWT_SECRET` en Railway
4. Verificar que seed se ejecutó

### Error al subir imágenes

1. Verificar credenciales Cloudinary
2. Verificar variables en Railway
3. Ver logs de backend

---

## 🔐 Seguridad

### Cambiar password admin

Abre Railway Shell y ejecuta:

```bash
# Generar nuevo hash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('NUEVA-PASSWORD', 10).then(h => console.log(h))"

# Abrir Prisma Studio
npx prisma studio

# Actualizar password en tabla Admin
```

---

## 📞 Soporte

Si tienes problemas:

1. **Logs de Railway:** Railway → Deployments → View Logs
2. **Logs de Vercel:** Vercel → Deployment → Function Logs
3. **Estado de servicios:** Verifica Railway y Vercel estén operando

---

**Documentación completa:** Ver `DEPLOYMENT.md` en el repositorio

**¡Felicidades! 🎉 Tu sistema está en producción.**
