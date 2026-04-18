const client = require('./client');
const prisma = require('../config/database');
const cloudinary = require('../config/cloudinary');
const { MESSAGES, BOAT_IMAGES } = require('../config/messages');
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

// Store conversation context in memory
// Format: { phoneNumber: { lastMessageTime, infoSent, conversationStarted, step, selectedDate, selectedBoat } }
const conversationContext = new Map();

// Reset context after 1 hour of inactivity
const CONTEXT_TIMEOUT = 60 * 60 * 1000; // 1 hour

// Handler for incoming messages
client.on('message', async (message) => {
  // Debug: Log all incoming messages
  console.log(`📨 Message received - From: ${message.from}, Type: ${message.type}, Body: ${message.body?.substring(0, 50)}`);

  // Ignore group messages, own messages, and status/broadcasts
  if (message.from.includes('@g.us') ||
      message.fromMe ||
      message.from === 'status@broadcast') {
    if (message.from === 'status@broadcast') {
      console.log('📢 Ignored status/broadcast message');
    }
    return;
  }

  try {
    // If it's an image/document, assume it's a payment receipt
    if (message.hasMedia && (message.type === 'image' || message.type === 'document')) {
      await handlePaymentReceipt(message);
      return;
    }

    // If it's text, handle contextually
    if (message.type === 'chat') {
      await handleTextMessage(message);
    }
  } catch (error) {
    console.error('❌ Error handling message:', error);
    await message.reply('Lo siento, ocurrió un error. Intenta de nuevo.');
  }
});

async function handleTextMessage(message) {
  const phoneNumber = message.from;
  const messageText = message.body.toLowerCase().trim();

  // Get or create conversation context
  let context = conversationContext.get(phoneNumber);
  const now = Date.now();

  // Reset context if timeout or first time
  if (!context || (now - context.lastMessageTime) > CONTEXT_TIMEOUT) {
    context = {
      lastMessageTime: now,
      infoSent: false,
      conversationStarted: false,
      step: 'initial', // initial, awaiting_date_and_boat, awaiting_name, awaiting_payment
      selectedDate: null,
      selectedBoat: null,
      customerName: null
    };
    conversationContext.set(phoneNumber, context);
  }

  // Update last message time
  context.lastMessageTime = now;

  // REGLA: Solo iniciar conversación si dice "lancha"
  if (!context.conversationStarted) {
    if (!messageText.includes('lancha')) {
      console.log(`⏭️  Ignored message from ${phoneNumber} (no "lancha" keyword)`);
      return;
    }
    context.conversationStarted = true;
  }

  // Check if customer has any bookings
  const existingBooking = await prisma.booking.findFirst({
    where: {
      customerPhone: phoneNumber,
      status: { in: ['PAYMENT_SUBMITTED', 'CONFIRMED'] }
    },
    orderBy: { createdAt: 'desc' }
  });

  // FLUJO DE CONVERSACIÓN
  console.log(`📍 Current context for ${phoneNumber}:`, {
    step: context.step,
    infoSent: context.infoSent,
    selectedDate: context.selectedDate,
    selectedBoat: context.selectedBoat
  });

  // Permitir resetear en cualquier momento
  const resetCommands = ['cancelar', 'reiniciar', 'inicio', 'empezar', 'reset'];
  if (resetCommands.some(cmd => messageText === cmd)) {
    console.log(`🔄 Resetting conversation for ${phoneNumber}`);
    context.step = 'initial';
    context.infoSent = false;
    context.conversationStarted = false;
    context.selectedDate = null;
    context.selectedBoat = null;
    await message.reply(
      '🔄 Conversación reiniciada.\n\n' +
      'Escribe "lancha" cuando quieras reservar de nuevo.'
    );
    return;
  }

  // Si está esperando fecha y lancha, procesar primero
  if (context.step === 'awaiting_date_and_boat') {
    console.log(`🎯 Processing date and boat selection for ${phoneNumber}`);
    await handleDateAndBoatSelection(message, context);
    return;
  }

  // Si está esperando nombre
  if (context.step === 'awaiting_name') {
    console.log(`👤 Processing name for ${phoneNumber}`);
    await handleNameInput(message, context);
    return;
  }

  // Si está esperando pago, no permitir reinicio con keywords
  if (context.step === 'awaiting_payment') {
    await message.reply(
      'Por favor envía una foto de tu comprobante de pago para confirmar tu reserva.\n\n' +
      'Si quieres cancelar y empezar de nuevo, escribe "cancelar".'
    );
    return;
  }

  // Keywords that trigger info restart (solo cuando no está en medio de proceso)
  const infoKeywords = ['info', 'información', 'lancha', 'precio', 'renta', 'alquiler', 'disponible'];
  const needsInfo = infoKeywords.some(keyword => messageText.includes(keyword));

  // Si es la primera vez o pide info de nuevo (y no está en medio de proceso)
  if (!context.infoSent || needsInfo) {
    await sendBoatInfo(message);
    context.infoSent = true;
    context.step = 'awaiting_date_and_boat';
    return;
  }

  // Si cliente ya tiene reserva pendiente
  if (existingBooking && existingBooking.status === 'PAYMENT_SUBMITTED') {
    await message.reply(
      `Hola! Ya recibimos tu comprobante de pago ✅\n\n` +
      `Referencia: ${existingBooking.id.slice(0, 8)}\n\n` +
      `Estamos revisándolo y te confirmaremos pronto. ` +
      `Si tienes alguna pregunta, escríbeme "info".`
    );
    return;
  }

  // Si cliente tiene reserva confirmada
  if (existingBooking && existingBooking.status === 'CONFIRMED') {
    const bookingDate = new Date(existingBooking.requestedDate).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    await message.reply(
      `¡Hola! Tienes una reserva confirmada:\n\n` +
      `📅 Fecha: ${bookingDate}\n` +
      `🚤 Lancha: ${existingBooking.boatNumber}\n\n` +
      `¿En qué más puedo ayudarte?\n\n` +
      `Escribe "info" para hacer una nueva reserva.`
    );
    return;
  }

  // Respuesta genérica
  await message.reply(
    `Hola! 👋\n\n` +
    `¿En qué puedo ayudarte?\n\n` +
    `Escribe:\n` +
    `• "info" - Ver información de lanchas\n` +
    `• Envía tu comprobante de pago si ya reservaste`
  );
}

async function sendBoatInfo(message) {
  try {
    // 1. Welcome message
    await message.reply(MESSAGES.welcome);

    // 2. Boat 1 photo
    const media1 = await MessageMedia.fromUrl(BOAT_IMAGES.boat1, { unsafeMime: true });
    await client.sendMessage(message.from, media1, {
      caption: MESSAGES.boat1
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. Boat 2 photo
    const media2 = await MessageMedia.fromUrl(BOAT_IMAGES.boat2, { unsafeMime: true });
    await client.sendMessage(message.from, media2, {
      caption: MESSAGES.boat2
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // 4. Ask for date and boat selection
    await message.reply(
      '📅 Para verificar disponibilidad, por favor indícame:\n\n' +
      '1️⃣ ¿Qué fecha necesitas? (Ejemplo: 25 de enero)\n' +
      '2️⃣ ¿Qué lancha prefieres? (1 o 2)\n\n' +
      'Ejemplo: "25 de enero, lancha 1"\n\n' +
      '💡 Escribe "cancelar" si quieres empezar de nuevo.'
    );

    console.log(`📨 Sent boat info to ${message.from}`);
  } catch (error) {
    console.error('❌ Error sending boat info:', error);
    await message.reply('Disculpa, hubo un problema enviando la información. Intenta de nuevo.');
  }
}

async function handleDateAndBoatSelection(message, context) {
  const messageText = message.body.toLowerCase();

  // Parsear fecha y lancha del mensaje
  const parsed = parseReservationRequest(messageText);

  if (!parsed.date || !parsed.boat) {
    await message.reply(
      'No pude entender tu solicitud. 🤔\n\n' +
      'Por favor indica la fecha y la lancha en tu mensaje.\n\n' +
      'Ejemplo: "25 de enero, lancha 1"\n' +
      'O: "15/02/2026, lancha 2"'
    );
    return;
  }

  // Verificar que la fecha sea futura
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (parsed.date < today) {
    await message.reply(
      '❌ La fecha que elegiste ya pasó.\n\n' +
      'Por favor indica una fecha futura.\n\n' +
      'Ejemplo: "25 de enero, lancha 1"'
    );
    return;
  }

  // Verificar disponibilidad
  const availability = await checkAvailability(parsed.date, parsed.boat);

  if (availability.available) {
    // ✅ DISPONIBLE - Pedir nombre
    context.selectedDate = parsed.date;
    context.selectedBoat = parsed.boat;
    context.step = 'awaiting_name';

    const dateStr = parsed.date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    await message.reply(
      `✅ ¡Excelente! La Lancha ${parsed.boat} está disponible para el ${dateStr}.\n\n` +
      `👤 Para continuar, por favor indícame tu nombre completo.\n\n` +
      `Ejemplo: "Juan Pérez"`
    );

    console.log(`✅ Availability confirmed for ${message.from}: Boat ${parsed.boat} on ${dateStr}`);
  } else {
    // ❌ NO DISPONIBLE - Ofrecer alternativas
    await offerAlternatives(message, parsed.date, parsed.boat, availability);
  }
}

async function handleNameInput(message, context) {
  const name = message.body.trim();

  // Validar que el nombre tenga al menos 2 caracteres
  if (name.length < 2) {
    await message.reply(
      'Por favor ingresa un nombre válido.\n\n' +
      'Ejemplo: "Juan Pérez"'
    );
    return;
  }

  // Guardar nombre y cambiar a esperar pago
  context.customerName = name;
  context.step = 'awaiting_payment';

  const dateStr = context.selectedDate.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  await message.reply(
    `Perfecto, ${name}! 👍\n\n` +
    `📋 Resumen de tu reserva:\n` +
    `📅 Fecha: ${dateStr}\n` +
    `🚤 Lancha: ${context.selectedBoat}\n` +
    `👤 Nombre: ${name}\n\n` +
    MESSAGES.payment + '\n\n' +
    '💡 Escribe "cancelar" si quieres empezar de nuevo.'
  );

  console.log(`👤 Name saved for ${message.from}: ${name}`);
}

function parseReservationRequest(text) {
  let date = null;
  let boat = null;

  // Detectar número de lancha (1 o 2)
  if (text.includes('lancha 1') || text.includes('lancha1') || text.match(/\b1\b/)) {
    boat = 1;
  } else if (text.includes('lancha 2') || text.includes('lancha2') || text.match(/\b2\b/)) {
    boat = 2;
  }

  // Detectar fecha en varios formatos
  const currentYear = new Date().getFullYear();

  // Formato: DD/MM/YYYY o DD-MM-YYYY
  const datePattern1 = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/;
  const match1 = text.match(datePattern1);
  if (match1) {
    const day = parseInt(match1[1]);
    const month = parseInt(match1[2]) - 1; // 0-indexed
    const year = parseInt(match1[3]);
    date = new Date(year, month, day);
  }

  // Formato: "25 de enero" o "25 enero"
  const monthNames = {
    'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
    'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
    'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
  };

  if (!date) {
    for (const [monthName, monthNum] of Object.entries(monthNames)) {
      const pattern = new RegExp(`(\\d{1,2})\\s+(?:de\\s+)?${monthName}`, 'i');
      const match = text.match(pattern);
      if (match) {
        const day = parseInt(match[1]);
        date = new Date(currentYear, monthNum, day);

        // Si la fecha ya pasó este año, usar el próximo año
        const today = new Date();
        if (date < today) {
          date = new Date(currentYear + 1, monthNum, day);
        }
        break;
      }
    }
  }

  return { date, boat };
}

async function checkAvailability(requestedDate, boatNumber) {
  // Buscar reservas confirmadas para esa fecha y lancha
  const startOfDay = new Date(requestedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(requestedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      boatNumber: boatNumber,
      requestedDate: {
        gte: startOfDay,
        lte: endOfDay
      },
      status: {
        in: ['CONFIRMED', 'PAYMENT_SUBMITTED']
      }
    }
  });

  return {
    available: !conflictingBooking,
    conflictingBooking
  };
}

async function offerAlternatives(message, requestedDate, requestedBoat, availability) {
  const dateStr = requestedDate.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let response = `❌ Lo siento, la Lancha ${requestedBoat} no está disponible para el ${dateStr}.\n\n`;

  // Verificar si la otra lancha está disponible ese día
  const otherBoat = requestedBoat === 1 ? 2 : 1;
  const otherBoatAvailability = await checkAvailability(requestedDate, otherBoat);

  if (otherBoatAvailability.available) {
    response += `✅ Pero la Lancha ${otherBoat} SÍ está disponible para esa fecha!\n\n`;
    response += `¿Te gustaría reservar la Lancha ${otherBoat}?\n\n`;
    response += `Responde: "sí, lancha ${otherBoat}" para continuar.`;
  } else {
    response += `La Lancha ${otherBoat} tampoco está disponible ese día.\n\n`;
  }

  // Buscar las próximas 3 fechas disponibles para la lancha solicitada
  const nextAvailableDates = await findNextAvailableDates(requestedDate, requestedBoat, 3);

  if (nextAvailableDates.length > 0) {
    response += `\n\n📅 Próximas fechas disponibles para Lancha ${requestedBoat}:\n\n`;
    nextAvailableDates.forEach((date, index) => {
      const dateString = date.toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      response += `${index + 1}. ${dateString}\n`;
    });
    response += `\nResponde con una de estas fechas para reservar.`;
  }

  await message.reply(response);
}

async function findNextAvailableDates(startDate, boatNumber, count) {
  const availableDates = [];
  let currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() + 1); // Empezar desde el día siguiente

  let daysChecked = 0;
  const maxDaysToCheck = 60; // Buscar hasta 2 meses adelante

  while (availableDates.length < count && daysChecked < maxDaysToCheck) {
    const availability = await checkAvailability(currentDate, boatNumber);

    if (availability.available) {
      availableDates.push(new Date(currentDate));
    }

    currentDate.setDate(currentDate.getDate() + 1);
    daysChecked++;
  }

  return availableDates;
}

async function handlePaymentReceipt(message) {
  const context = conversationContext.get(message.from);

  // Verificar que el cliente esté en el paso correcto
  if (!context || context.step !== 'awaiting_payment') {
    await message.reply(
      'Para hacer una reserva, primero debes elegir una fecha y lancha.\n\n' +
      'Escribe "info" para comenzar.'
    );
    return;
  }

  try {
    // 1. Download the media
    const media = await message.downloadMedia();
    if (!media) {
      await message.reply('No pude descargar la imagen. Intenta de nuevo.');
      return;
    }

    // 2. Save temporarily
    const tempDir = '/tmp';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempPath = `${tempDir}/${Date.now()}_receipt.jpg`;
    fs.writeFileSync(tempPath, media.data, 'base64');

    // 3. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: 'boat-receipts',
      transformation: [
        { width: 1200, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    // 4. Create booking in DB with pre-selected date, boat and name
    const booking = await prisma.booking.create({
      data: {
        customerPhone: message.from,
        status: 'PAYMENT_SUBMITTED',
        paymentReceiptUrl: result.secure_url,
        boatNumber: context.selectedBoat,
        requestedDate: context.selectedDate,
        customerName: context.customerName,
        paymentSubmittedAt: new Date()
      }
    });

    // 5. Reset context
    context.step = 'initial';
    context.selectedDate = null;
    context.selectedBoat = null;
    context.customerName = null;

    // 6. Confirm to customer
    const dateStr = new Date(booking.requestedDate).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    await message.reply(
      `✅ Comprobante recibido!\n\n` +
      `👤 Nombre: ${booking.customerName}\n` +
      `📅 Fecha: ${dateStr}\n` +
      `🚤 Lancha: ${booking.boatNumber}\n\n` +
      `Estamos revisando tu pago y te confirmaremos pronto.\n\n` +
      `Referencia: ${booking.id.slice(0, 8)}`
    );

    // 7. Clean up temp file
    fs.unlinkSync(tempPath);

    console.log(`💰 New payment receipt: ${booking.id} - Boat ${booking.boatNumber} on ${dateStr}`);
  } catch (error) {
    console.error('❌ Error handling payment receipt:', error);
    await message.reply('Hubo un error procesando tu comprobante. Intenta de nuevo.');
  }
}

// Clean up old contexts periodically (every 2 hours)
setInterval(() => {
  const now = Date.now();
  for (const [phoneNumber, context] of conversationContext.entries()) {
    if (now - context.lastMessageTime > CONTEXT_TIMEOUT * 2) {
      conversationContext.delete(phoneNumber);
      console.log(`🧹 Cleaned up context for ${phoneNumber}`);
    }
  }
}, 2 * 60 * 60 * 1000);

module.exports = { client };
