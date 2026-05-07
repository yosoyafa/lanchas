// Entry point - starts Express server with WhatsApp webhook
require('dotenv').config();

console.log('🔄 Starting Boat Booking System...\n');

// Start Express server
require('./server');

console.log('\n✨ System initialized');
console.log('📱 Waiting for WhatsApp webhooks...');
