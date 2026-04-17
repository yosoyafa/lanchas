// Hardcoded messages for the WhatsApp bot
const MESSAGES = {
  welcome: '¡Hola! 👋\n\nGracias por contactarnos.\n\nTenemos 2 lanchas disponibles para rentar:',
  boat1: '🚤 Lancha 1: Capacidad 8 personas, motor 40HP\n💰 Ideal para grupos grandes y familias',
  boat2: '🚤 Lancha 2: Capacidad 6 personas, motor 30HP\n💰 Perfecta para grupos pequeños',
  payment: '💳 Para reservar:\n\nBanco: Bancolombia\nCuenta: 1234567890\nTitular: Tu Negocio\n\n📸 Envía tu comprobante de pago por aquí.'
};

// URLs of boat images from Unsplash (free, high-quality)
// Selected by client - white and red inflatable boats on sea
const BOAT_IMAGES = {
  // 2 people riding on white and red inflatable boat on blue sea
  boat1: 'https://images.unsplash.com/photo-1595571026085-b6c7bd20f157?w=800&q=80',
  // Man riding on white and red boat on sea during daytime
  boat2: 'https://images.unsplash.com/photo-1592321138473-09de0b5cc0d6?w=800&q=80'
};

module.exports = { MESSAGES, BOAT_IMAGES };
