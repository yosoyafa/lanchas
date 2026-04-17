# Guía de Deploy a Producción

Esta guía te llevará paso a paso para publicar tu sistema en la nube **100% gratis**.

## Resumen

- **Backend + DB**: Railway (gratis)
- **Frontend**: Vercel (gratis)
- **Imágenes**: Cloudinary (gratis)
- **WhatsApp**: whatsapp-web.js (gratis)

Total: **$0/mes**

## Parte 1: Deploy Backend en Railway

### Paso 1: Preparar Repositorio

```bash
# Desde la raíz del proyecto
git init
git add .
git commit -m "Initial commit: Boat booking system"

# Crear repo en GitHub
# Ir a https://github.com/new
# Nombre: "lanchas-whatsapp-bot"
# Crear repositorio

# Subir código
git remote add origin https://github.com/TU-USUARIO/lanchas-whatsapp-bot.git
git branch -M main
git push -u origin main
```

### Paso 2: Crear Proyecto en Railway

1. Ir a https://railway.app
2. Click "Start a New Project"
3. "Deploy from GitHub repo"
4. Autorizar Railway a acceder a GitHub
5. Seleccionar repo "lanchas-whatsapp-bot"
6. Railway detectará automáticamente Node.js

### Paso 3: Agregar Base de Datos PostgreSQL

1. En el proyecto Railway, click "New"
2. Seleccionar "Database" → "Add PostgreSQL"
3. Railway creará la DB automáticamente
4. Click en PostgreSQL → pestaña "Variables"
5. Copiar el valor de `DATABASE_URL`

### Paso 4: Configurar Variables de Entorno

1. Click en tu servicio backend (el que dice "lanchas-whatsapp-bot")
2. Ir a pestaña "Variables"
3. Click "New Variable" para cada una:

```
DATABASE_URL=postgresql://postgres:...  (copiar de PostgreSQL service)
JWT_SECRET=genera-uno-nuevo-con-crypto.randomBytes
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
NODE_ENV=production
PORT=3000
```

Para generar JWT_SECRET seguro:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Paso 5: Configurar Build

Railway debería detectar automáticamente, pero si no:

1. Pestaña "Settings"
2. Build Command: `cd backend && npm install && npx prisma generate`
3. Start Command: `cd backend && npx prisma migrate deploy && node src/index.js`
4. Root Directory: `/`

### Paso 6: Deploy

1. Click "Deploy"
2. Ver logs en tiempo real
3. Esperar a que diga "✅ WhatsApp bot is ready!"

### Paso 7: Vincular WhatsApp

**IMPORTANTE:** El bot necesita escanear QR en el servidor.

Railway no muestra QR codes en logs normales, así que hay que usar la consola:

1. En Railway, click tu servicio backend
2. Pestaña "Settings"
3. Scroll down → "Deployments"
4. Click en el deployment actual (verde)
5. Ver logs → Buscar el QR en ASCII art
6. O usar Railway CLI:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link al proyecto
railway link

# Ver logs en tiempo real
railway logs -f
```

Cuando veas el QR en los logs:
1. Abrir WhatsApp en tu teléfono
2. Dispositivos vinculados → Vincular dispositivo
3. Escanear el QR de los logs

**Nota:** Una vez escaneado, la sesión persiste. Railway mantendrá el bot corriendo 24/7.

### Paso 8: Obtener URL del Backend

1. En Railway, tu servicio backend
2. Pestaña "Settings"
3. Section "Environment" → "Generate Domain"
4. Railway generará una URL tipo: `lanchas-production-xxxx.up.railway.app`
5. Copiar esta URL (la necesitarás para el frontend)

## Parte 2: Deploy Frontend en Vercel

### Paso 1: Preparar Frontend

Asegúrate de que tu frontend funcione localmente primero.

### Paso 2: Deploy en Vercel

1. Ir a https://vercel.com
2. Click "Add New" → "Project"
3. Importar tu repo de GitHub
4. Vercel detectará Vite automáticamente
5. Configurar:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Paso 3: Variables de Entorno

En Vercel, antes de deploy:

1. Section "Environment Variables"
2. Agregar:
   ```
   VITE_API_URL=https://tu-backend.up.railway.app/api
   ```
   (Usar la URL que copiaste de Railway)

### Paso 4: Deploy

1. Click "Deploy"
2. Esperar 1-2 minutos
3. Vercel te dará una URL tipo: `lanchas.vercel.app`

### Paso 5: Configurar CORS en Backend

El backend necesita permitir requests desde tu frontend en Vercel.

Editar `backend/src/server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://lanchas.vercel.app', // Tu URL de Vercel
    'https://tu-dominio-custom.com' // Si tienes dominio propio
  ],
  credentials: true
}));
```

Commit y push:
```bash
git add .
git commit -m "Configure CORS for production"
git push
```

Railway re-deployará automáticamente.

## Parte 3: Verificación

### Checklist de Producción

- [ ] Backend deployado en Railway sin errores
- [ ] PostgreSQL corriendo en Railway
- [ ] Migrations ejecutadas correctamente
- [ ] WhatsApp bot conectado (QR escaneado)
- [ ] Frontend deployado en Vercel
- [ ] Frontend puede conectarse al backend
- [ ] Login funciona desde producción
- [ ] Bot responde mensajes en WhatsApp
- [ ] Bot recibe comprobantes
- [ ] Admin puede aprobar reservas desde el panel
- [ ] Clientes reciben confirmaciones

### Prueba End-to-End

1. Envía mensaje al WhatsApp del bot → Debería responder con info
2. Envía una foto → Debería confirmar recepción
3. Abre tu URL de Vercel → Login con admin/admin123
4. Deberías ver la reserva pendiente
5. Aprueba la reserva
6. Revisa WhatsApp → Deberías recibir confirmación

## Mantenimiento

### Ver Logs del Backend

**Opción 1: Railway Dashboard**
- Railway → Tu proyecto → Servicio backend → Logs

**Opción 2: Railway CLI**
```bash
railway logs -f
```

### Ver Logs del Frontend

Vercel → Tu proyecto → Deployments → Click en el deployment → Logs

### Re-escanear QR de WhatsApp

Si el bot se desconecta (cada 2-3 meses):

1. Railway → Backend → Settings → Restart
2. Inmediatamente ir a Logs
3. Buscar el nuevo QR
4. Escanear con WhatsApp

### Actualizar Código

```bash
# Hacer cambios localmente
git add .
git commit -m "Descripción del cambio"
git push

# Railway y Vercel auto-deployan
```

### Agregar Dominio Personalizado

**Frontend (Vercel):**
1. Vercel → Tu proyecto → Settings → Domains
2. Agregar dominio (ej: reservas.tuempresa.com)
3. Seguir instrucciones para configurar DNS

**Backend (Railway):**
1. Railway → Backend → Settings → Custom Domain
2. Agregar dominio (ej: api.tuempresa.com)
3. Configurar DNS según indicaciones
4. Actualizar VITE_API_URL en Vercel a tu nuevo dominio

## Monitoreo y Alertas

### Railway

Railway incluye:
- Uso de CPU/RAM
- Requests por segundo
- Uptime del servicio

Ir a: Railway → Tu proyecto → Metrics

### Vercel

Vercel incluye:
- Analytics de visitantes
- Performance metrics
- Tiempo de respuesta

Ir a: Vercel → Tu proyecto → Analytics

### Configurar Alertas

**Railway:**
- Settings → Notifications
- Configurar Slack/Discord/Email

**Uptime Monitor (gratis):**
- Usar UptimeRobot: https://uptimerobot.com
- Monitor tu URL de Vercel
- Monitor tu API de Railway (endpoint `/health`)
- Alertas por email si cae

## Límites del Plan Gratis

### Railway
- 500 horas/mes de ejecución
- $5 de crédito inicial
- 100 GB de ancho de banda

**Suficiente para:** ~10-50 reservas/día

### Vercel
- Deployments ilimitados
- 100 GB ancho de banda/mes
- Dominio gratis .vercel.app

**Suficiente para:** ~100+ visitantes/día

### Cloudinary
- 25 GB almacenamiento
- 25 GB ancho de banda/mes
- 25,000 transformaciones/mes

**Suficiente para:** ~1000 comprobantes/mes

## Escalabilidad

Si creces y necesitas más:

1. **Railway Pro**: $20/mes
   - 500hrs → Ilimitado
   - Más CPU/RAM

2. **WhatsApp Business API**: $50-100/mes
   - No se desconecta
   - Multi-agente
   - Más confiable

3. **Vercel Pro**: $20/mes
   - Analytics avanzados
   - Más ancho de banda

4. **Base de datos dedicada**: $10-30/mes
   - Railway → Upgrade PostgreSQL
   - O migrar a Supabase/PlanetScale

## Backup

### Backup Automático de DB

Railway hace backups automáticos, pero puedes hacer manual:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login y link
railway login
railway link

# Obtener DATABASE_URL
railway variables

# Hacer backup
pg_dump "postgresql://..." > backup.sql

# Restaurar
psql "postgresql://..." < backup.sql
```

### Programar Backups

Usar servicio como:
- SimpleBackups: https://simplebackups.com (gratis 1 DB)
- Crear GitHub Action que haga backup diario

## Troubleshooting Producción

### "WhatsApp disconnected"
- Reiniciar servicio en Railway
- Re-escanear QR

### "Database connection failed"
- Verificar DATABASE_URL en Railway
- Verificar que PostgreSQL esté running

### "502 Bad Gateway" en API
- Backend se cayó
- Ver logs en Railway
- Verificar memoria (puede estar quedando sin RAM)

### Frontend no carga datos
- Verificar VITE_API_URL
- Verificar CORS en backend
- Ver Network tab en DevTools

### Bot lento para responder
- Railway free tier tiene CPU limitado
- Considerar upgrade a Pro si es crítico

## Seguridad en Producción

1. **Cambiar contraseña de admin**
2. **Usar JWT_SECRET largo y aleatorio**
3. **No compartir el .env**
4. **Activar HTTPS (automático en Railway/Vercel)**
5. **Limitar intentos de login** (agregar rate limiting)

## Costos Estimados

### Gratis (hasta 50 reservas/mes)
- Railway: Free tier
- Vercel: Free tier
- Cloudinary: Free tier
- **Total: $0/mes**

### Crecimiento (100-500 reservas/mes)
- Railway Pro: $20
- Vercel: $0 (aún dentro de límites)
- Cloudinary: $0 (aún dentro de límites)
- **Total: ~$20/mes**

### Escalado (1000+ reservas/mes)
- Railway Pro: $20
- WhatsApp Business API: $50-100
- Cloudinary Pro: $20
- Vercel Pro (opcional): $20
- **Total: ~$90-160/mes**

## Listo para Producción

Tu sistema está live y funcionando 24/7.

Próximos pasos:
1. Prueba exhaustivamente
2. Agrega tu dominio personalizado
3. Configura monitoreo
4. Promociona con tus clientes
5. Recopila feedback
6. Itera y mejora

¡Éxito con tu negocio de botes! 🚤
