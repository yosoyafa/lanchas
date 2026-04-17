// Entry point - starts both WhatsApp bot and Express server
require('dotenv').config();

console.log('🔄 Starting Boat Booking System...\n');

// Initialize WhatsApp bot and handlers
require('./whatsapp/handlers');

// Start Express server
require('./server');

console.log('\n✨ System initialized');
