# 🚀 Quick Start Guide - READY TO RUN!

## ✅ Setup Complete

The following has been configured:
- ✅ Prisma Client generated
- ✅ SQLite database created at `prisma/dev.db`
- ✅ Database tables created
- ✅ Admin user created (username: admin, password: admin123)
- ✅ JWT Secret generated

## 🎯 Start the Backend NOW

```bash
cd /Users/afa/Documents/personal/lanchas/backend
npm run dev
```

**You should see:**
```
🔄 Starting Boat Booking System...
🚀 Server running on port 3000

📱 SCAN QR CODE WITH YOUR WHATSAPP:
[QR code appears here]
```

**Scan the QR code with WhatsApp:**
1. Open WhatsApp on your phone
2. Go to Settings → Linked Devices
3. Link a Device
4. Scan the QR code

**When connected, you'll see:**
```
✅ WhatsApp bot is ready!
```

## 🌐 Start the Frontend

In a NEW terminal:

```bash
cd /Users/afa/Documents/personal/lanchas/frontend
npm run dev
```

Opens at: **http://localhost:5173**

Login with:
- Username: `admin`
- Password: `admin123`

## ⚠️ Cloudinary Configuration (Optional for Testing)

The bot will work for text messages, but **uploading payment receipts requires Cloudinary**.

### Option 1: Test Without Images (Quick)
Just test the text responses - the bot will respond with info when you message it.

### Option 2: Configure Cloudinary (5 minutes)
1. Create free account at https://cloudinary.com
2. Go to Dashboard → Settings → Access Keys
3. Copy: Cloud Name, API Key, API Secret
4. Edit `backend/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME="your-actual-cloud-name"
   CLOUDINARY_API_KEY="your-actual-api-key"
   CLOUDINARY_API_SECRET="your-actual-api-secret"
   ```
5. Restart backend

## 🧪 Test the System

### 1. Test WhatsApp Bot
- Send "Hola" to your WhatsApp bot
- Should respond with boat info

### 2. Test Payment Receipt (if Cloudinary configured)
- Send an image to the bot
- Should confirm receipt

### 3. Test Admin Panel
- Open http://localhost:5173
- Login with admin/admin123
- See pending bookings
- Approve one
- Check WhatsApp for confirmation

## 📝 Next Steps

1. **Customize Messages**: Edit `backend/src/config/messages.js`
2. **Upload Boat Photos**: Add to Cloudinary, update URLs in messages.js
3. **Update Payment Info**: Edit bank account details in messages.js
4. **Change Admin Password**: See QUICK_REFERENCE.md

## 🆘 Troubleshooting

**Backend won't start?**
```bash
# Regenerate Prisma Client
npx prisma generate

# Check database
npx prisma studio
```

**WhatsApp not connecting?**
- Make sure QR code is clearly visible
- Try scanning again
- Restart backend if needed

**Frontend errors?**
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

## 🎉 You're Ready!

The system is running on SQLite (no PostgreSQL needed for testing).

**Current Setup:**
- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- Database: SQLite (prisma/dev.db)
- WhatsApp: Linked to your number

**For Production:**
- Follow DEPLOY.md to use PostgreSQL on Railway
- Configure Cloudinary
- Deploy to Railway + Vercel

---

**Status:** ✅ READY TO USE
**Next:** Start backend with `npm run dev`
