# Lista de Verificación - Primera Configuración

Use esta lista para configurar el sistema por primera vez.

## ☑️ Pre-requisitos

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] PostgreSQL instalado y corriendo
- [ ] Cuenta de Cloudinary creada
- [ ] Número de WhatsApp disponible para el bot
- [ ] Editor de código (VS Code recomendado)

## ☑️ Configuración de Base de Datos

- [ ] PostgreSQL corriendo localmente
- [ ] Base de datos "lanchas" creada
- [ ] Usuario de DB creado con permisos
- [ ] DATABASE_URL copiado y listo

**Comando:**
```bash
psql postgres
CREATE DATABASE lanchas;
CREATE USER lanchas_user WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE lanchas TO lanchas_user;
\q
```

## ☑️ Configuración de Cloudinary

- [ ] Cuenta creada en cloudinary.com
- [ ] Cloud Name anotado
- [ ] API Key anotado
- [ ] API Secret anotado
- [ ] 2 fotos de botes subidas a Media Library
- [ ] URLs de fotos copiadas

**URL de acceso:** https://cloudinary.com/console

## ☑️ Configuración del Backend

- [ ] Dependencias instaladas (`npm install` en /backend)
- [ ] Archivo `.env` creado (copiar de `.env.example`)
- [ ] DATABASE_URL configurado en `.env`
- [ ] JWT_SECRET generado y configurado
- [ ] Credenciales de Cloudinary configuradas
- [ ] Prisma Client generado (`npx prisma generate`)
- [ ] Migrations ejecutadas (`npx prisma migrate dev`)
- [ ] Usuario admin creado (`npm run seed`)

**Verificar:**
```bash
cd backend
cat .env | grep -v "^#"
npx prisma studio  # Debe abrir en navegador
```

## ☑️ Personalización de Mensajes

- [ ] Archivo `src/config/messages.js` abierto
- [ ] Mensaje de bienvenida personalizado
- [ ] Descripción de Bote 1 actualizada
- [ ] Descripción de Bote 2 actualizada
- [ ] Información de pago actualizada (banco, cuenta, titular)
- [ ] URLs de fotos de botes actualizadas (BOAT_IMAGES)

**Archivo:** `backend/src/config/messages.js`

## ☑️ Prueba del Backend

- [ ] Backend iniciado (`npm run dev`)
- [ ] Sin errores en consola
- [ ] Mensaje "Server running on port 3000" visible
- [ ] Mensaje "WhatsApp bot is ready!" NO aparece aún (normal, QR pendiente)
- [ ] Health check responde: `curl http://localhost:3000/health`
- [ ] Prisma Studio funciona: `npx prisma studio`

## ☑️ Vinculación de WhatsApp

- [ ] Backend corriendo con QR visible en consola
- [ ] WhatsApp abierto en teléfono
- [ ] Ir a: Configuración → Dispositivos vinculados
- [ ] "Vincular un dispositivo" clickeado
- [ ] QR escaneado exitosamente
- [ ] Mensaje "✅ WhatsApp bot is ready!" visible en consola
- [ ] Mantener terminal del backend abierta

## ☑️ Prueba del Bot de WhatsApp

- [ ] Mensaje de texto enviado al número vinculado
- [ ] Bot respondió con mensaje de bienvenida
- [ ] Bot envió foto del Bote 1
- [ ] Bot envió foto del Bote 2
- [ ] Bot envió información de pago
- [ ] Imagen enviada (simular comprobante)
- [ ] Bot confirmó recepción con referencia

**Probar desde tu teléfono o pedir a alguien que te envíe mensaje**

## ☑️ Configuración del Frontend

- [ ] Dependencias instaladas (`npm install` en /frontend)
- [ ] Archivo `.env` creado (copiar de `.env.example`)
- [ ] VITE_API_URL configurado (http://localhost:3000/api)
- [ ] Frontend iniciado (`npm run dev`)
- [ ] Sin errores en consola
- [ ] URL local visible (http://localhost:5173)

## ☑️ Prueba del Panel Admin

- [ ] Navegador abierto en http://localhost:5173
- [ ] Página de login carga correctamente
- [ ] Login con admin/admin123 exitoso
- [ ] Redirección a /dashboard exitosa
- [ ] Reserva de prueba (comprobante enviado) visible
- [ ] Imagen del comprobante se ve correctamente
- [ ] Click en imagen abre en nueva pestaña

## ☑️ Prueba de Aprobación

- [ ] Fecha de reserva seleccionada
- [ ] Bote seleccionado (1 o 2)
- [ ] Nombre del cliente ingresado (opcional)
- [ ] Click en "Aprobar Reserva"
- [ ] Mensaje de éxito visible
- [ ] WhatsApp recibió confirmación con fecha/bote
- [ ] Reserva desaparece de la lista de pendientes

## ☑️ Prueba de Rechazo

- [ ] Enviar otro comprobante de prueba al bot
- [ ] Esperar hasta 30s o refrescar panel
- [ ] Nueva reserva aparece
- [ ] Click en "Rechazar"
- [ ] Motivo de rechazo ingresado
- [ ] WhatsApp recibió notificación de rechazo
- [ ] Reserva desaparece de la lista

## ☑️ Verificación de Datos

- [ ] Prisma Studio abierto (`npx prisma studio`)
- [ ] Modelo "Booking" tiene registros
- [ ] Estados correctos (CONFIRMED, REJECTED)
- [ ] Fechas y teléfonos correctos
- [ ] URLs de Cloudinary funcionan
- [ ] Modelo "Admin" tiene usuario

## ☑️ Seguridad Básica

- [ ] Contraseña de admin cambiada (no usar admin123 en producción)
- [ ] Archivo `.env` en `.gitignore`
- [ ] JWT_SECRET es aleatorio y largo
- [ ] DATABASE_URL no expuesta

**Cambiar password:**
```bash
cd backend
# Ver QUICK_REFERENCE.md sección "Cambiar Contraseña"
```

## ☑️ Documentación Leída

- [ ] README.md revisado
- [ ] SETUP.md completado
- [ ] QUICK_REFERENCE.md guardado como referencia
- [ ] PROJECT_SUMMARY.md entendido

## ☑️ Preparación para Producción (Opcional)

Si vas a deployar ahora:

- [ ] Código subido a GitHub
- [ ] DEPLOY.md leído completamente
- [ ] Cuenta de Railway creada
- [ ] Cuenta de Vercel creada
- [ ] Variables de entorno preparadas
- [ ] Plan de re-escaneo de QR documentado

**Ver:** `DEPLOY.md` para instrucciones completas

## ☑️ Testing Completo End-to-End

Simular un cliente real:

1. - [ ] Cliente envía "Hola" al bot
2. - [ ] Cliente recibe info de botes
3. - [ ] Cliente envía foto de comprobante
4. - [ ] Cliente recibe confirmación de recepción
5. - [ ] Admin ve la reserva en panel
6. - [ ] Admin aprueba con fecha y bote
7. - [ ] Cliente recibe confirmación final
8. - [ ] Todo el proceso toma < 2 minutos

## ☑️ Backup Inicial

- [ ] Repositorio Git inicializado
- [ ] Primer commit realizado
- [ ] Repositorio remoto configurado (GitHub)
- [ ] Código pusheado
- [ ] Backup de `.env` guardado de forma segura (NO en Git)

```bash
git init
git add .
git commit -m "Initial commit: Boat booking system MVP"
git remote add origin https://github.com/usuario/repo.git
git push -u origin main
```

## ☑️ Problemas Comunes Resueltos

Si encontraste problemas, marca los que resolviste:

- [ ] PostgreSQL no estaba corriendo → Solucionado
- [ ] Error de Prisma → Regeneré client con `npx prisma generate`
- [ ] WhatsApp no conectaba → Re-escaneé QR
- [ ] Cloudinary error → Verifiqué credenciales en .env
- [ ] CORS error → Configuré origin en backend
- [ ] Frontend 404 → Verifiqué VITE_API_URL
- [ ] Login no funciona → Verifiqué que seed corrió

## 🎉 Sistema Listo

Si todos los items están marcados:

✅ **Tu sistema está completamente funcional**
✅ **Puedes empezar a recibir reservas reales**
✅ **El bot responde 24/7 automáticamente**

## Próximos Pasos

1. **Testear con clientes reales**: Pide a amigos/familia que prueben
2. **Monitorear logs**: Observa el backend por 24-48 horas
3. **Ajustar mensajes**: Mejora los textos según feedback
4. **Deploy a producción**: Cuando estés listo, usa DEPLOY.md
5. **Iterar y mejorar**: Agrega features según necesidad

## Soporte

Si algo no funciona:

1. Revisar logs del backend y frontend
2. Consultar QUICK_REFERENCE.md
3. Buscar el error en Google
4. Revisar GitHub issues de whatsapp-web.js
5. Preguntar en comunidad de Prisma/Railway

## Notas Adicionales

- Mantén ambas terminales (backend y frontend) abiertas mientras trabajas
- El bot puede tardar 30-60s en inicializar en el primer arranque
- Las sesiones de WhatsApp duran ~2-3 meses antes de requerir re-escaneo
- El panel se actualiza automáticamente cada 30 segundos
- Cloudinary comprime las imágenes automáticamente

---

**Última actualización:** 2025-01-15

¡Felicitaciones por completar la configuración! 🚤🎉
