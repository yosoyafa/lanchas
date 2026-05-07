const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./api/auth');
const bookingsRoutes = require('./api/bookings');
const whatsappRoutes = require('./api/whatsapp');
const privacyRoutes = require('./api/privacy');

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Public routes (no /api prefix)
app.use('/', privacyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN || `http://localhost:${PORT}`;
  console.log(`📱 WhatsApp webhook: ${domain}/api/whatsapp/webhook`);
});

module.exports = app;
