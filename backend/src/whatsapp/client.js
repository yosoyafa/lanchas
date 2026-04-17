const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  }
});

client.on('qr', (qr) => {
  console.log('\n📱 SCAN QR CODE WITH YOUR WHATSAPP:\n');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ WhatsApp bot is ready!');
});

client.on('authenticated', () => {
  console.log('🔐 WhatsApp authenticated');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
  console.log('⚠️  WhatsApp disconnected:', reason);
});

// Initialize the client
client.initialize();

module.exports = client;
