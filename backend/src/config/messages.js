// Hardcoded messages for the WhatsApp bot
const MESSAGES = {
  welcome: '¡Hola! 👋\n\nGracias por contactarnos.\n\nTenemos 2 lanchas disponibles para rentar:',
  boat1: '🚤 Lancha 1: Capacidad 8 personas, motor 40HP\n💰 Ideal para grupos grandes y familias',
  boat2: '🚤 Lancha 2: Capacidad 6 personas, motor 30HP\n💰 Perfecta para grupos pequeños',
  payment: '💳 Para reservar:\n\nBanco: Bancolombia\nCuenta: 1234567890\nTitular: Tu Negocio\n\n📸 Envía tu comprobante de pago por aquí.'
};

// URLs of boat images from Cloudinary
const BOAT_IMAGES = {
  // Lancha 1: Principal Charlie 41 Alamar Beach
  boat1: 'https://res.cloudinary.com/dl9gjjvm5/image/upload/v1776485636/Principal-Lancha-Rapida-Charlie-41-Alamar-Beach_od7ydc.jpg',
  // Lancha 2: Charlie 41 Alamar Beach
  boat2: 'https://res.cloudinary.com/dl9gjjvm5/image/upload/v1776485636/Lancha-Rapida-Charlie-41-Alamar-Beach-00003_sniu2t.jpg'
};

module.exports = { MESSAGES, BOAT_IMAGES };
