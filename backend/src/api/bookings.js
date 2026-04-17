const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const whatsappClient = require('../whatsapp/client');

const router = express.Router();

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.adminId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.use(authMiddleware);

// List bookings
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    const bookings = await prisma.booking.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// Approve booking
router.post('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { requestedDate, boatNumber, customerName } = req.body;

    if (!requestedDate || !boatNumber) {
      return res.status(400).json({ error: 'Fecha y bote requeridos' });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        requestedDate: new Date(requestedDate),
        boatNumber: parseInt(boatNumber),
        customerName: customerName || null,
        reviewedAt: new Date()
      }
    });

    // Send confirmation to customer
    const date = new Date(requestedDate).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const greeting = customerName ? `¡Hola ${customerName}! ` : '';
    await whatsappClient.sendMessage(
      booking.customerPhone,
      `🎉 ${greeting}¡Reserva confirmada!\n\n` +
      `👤 Nombre: ${customerName || 'No especificado'}\n` +
      `📅 Fecha: ${date}\n` +
      `🚤 Lancha: ${boatNumber}\n` +
      `📝 Referencia: ${id.slice(0, 8)}\n\n` +
      `¡Nos vemos!`
    );

    console.log(`✅ Booking approved: ${id}`);
    res.json(booking);
  } catch (error) {
    console.error('Error approving booking:', error);
    res.status(500).json({ error: 'Error al aprobar reserva' });
  }
});

// Reject booking
router.post('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Motivo requerido' });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
        reviewedAt: new Date()
      }
    });

    // Notify customer
    await whatsappClient.sendMessage(
      booking.customerPhone,
      `❌ Tu reserva no pudo ser confirmada.\n\n` +
      `Motivo: ${reason}\n\n` +
      `Contáctanos para más información.`
    );

    console.log(`❌ Booking rejected: ${id}`);
    res.json(booking);
  } catch (error) {
    console.error('Error rejecting booking:', error);
    res.status(500).json({ error: 'Error al rechazar reserva' });
  }
});

module.exports = router;
