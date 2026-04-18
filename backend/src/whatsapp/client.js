const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');

// Configuración de Puppeteer para Railway
const puppeteerConfig = {
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-gpu'
  ]
};

// Usar Chromium en producción (Railway/Docker)
if (process.env.NODE_ENV === 'production') {
  puppeteerConfig.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium';
}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: puppeteerConfig
});

client.on('qr', async (qr) => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📱 SCAN QR CODE WITH YOUR WHATSAPP');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // QR en terminal (puede verse mal en Railway logs)
  qrcodeTerminal.generate(qr, { small: true });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔗 ALTERNATIVE: Scan this QR from your browser:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Generar URL usando servicio público de QR
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
  console.log(`   ${qrUrl}`);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Instructions:');
  console.log('   1. Copy the URL above');
  console.log('   2. Open it in your browser');
  console.log('   3. Scan the QR with WhatsApp on your phone');
  console.log('   4. WhatsApp → Menu → Linked Devices → Link a Device');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // También generar como Data URL (base64)
  try {
    const qrDataUrl = await QRCode.toDataURL(qr);
    console.log('📊 QR as Data URL (paste in browser):');
    console.log(`   ${qrDataUrl.substring(0, 100)}...`);
    console.log('   (Full URL is too long to display)\n');
  } catch (err) {
    console.error('Error generating Data URL:', err);
  }
});

client.on('ready', () => {
  console.log('✅ WhatsApp bot is ready!');
  console.log('🎯 Bot is now listening for messages...');

  // Test: Send a message to confirm bot is working
  setInterval(() => {
    console.log('💓 Bot heartbeat - Still alive and listening');
  }, 60000); // Every minute
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
